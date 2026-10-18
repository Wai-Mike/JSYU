<?php

namespace Tests\Feature\Portal;

use App\Models\Election;
use App\Models\ElectionVote;
use App\Models\GeographicArea;
use App\Models\MemberProfile;
use App\Models\User;
use App\Services\Members\MemberProfileService;

class ElectionTest extends PortalTestCase
{
    private const PORTAL = 'http://portal.jsyu.test/member/elections';

    private function member(?GeographicArea $area, string $status = MemberProfile::STATUS_APPROVED): User
    {
        $user = User::factory()->create(['role' => 'student']);
        $profile = app(MemberProfileService::class)->forUser($user);
        $profile->update(['home_area_id' => $area?->id]);
        $profile->forceFill(['status' => $status])->save();

        return $user;
    }

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'title' => 'County A Youth Election',
            'description' => null,
            'geographic_area_id' => $this->countyA->id,
            'opens_at' => now()->subHour()->format('Y-m-d H:i'),
            'closes_at' => now()->addDay()->format('Y-m-d H:i'),
            'positions' => [
                ['title' => 'Chairperson', 'seats' => 1, 'candidates' => [['name' => 'Deng'], ['name' => 'Achol']]],
                ['title' => 'Committee', 'seats' => 2, 'candidates' => [['name' => 'Gai'], ['name' => 'Nyibol'], ['name' => 'Kuol']]],
            ],
        ], $overrides);
    }

    private function openElection(): Election
    {
        $officer = $this->userWithRole('election_officer');
        $this->actingAs($officer)->post(route('admin.elections.store'), $this->payload())->assertSessionHasNoErrors();
        $election = Election::query()->firstOrFail();
        $this->actingAs($officer)->post(route('admin.elections.open', $election))->assertSessionHasNoErrors();

        return $election->fresh('positions.candidates');
    }

    private function ballot(Election $election, string $chair, array $committee): array
    {
        [$chairPos, $committeePos] = $election->positions;
        $id = fn ($pos, $name) => $pos->candidates->firstWhere('name', $name)->id;

        return ['ballot' => [
            $chairPos->id => [$id($chairPos, $chair)],
            $committeePos->id => array_map(fn ($n) => $id($committeePos, $n), $committee),
        ]];
    }

    public function test_eligible_member_votes_once_and_the_ballot_is_secret(): void
    {
        $election = $this->openElection();
        $voter = $this->member($this->payamA1);

        $this->actingAs($voter)->post(self::PORTAL."/{$election->id}/vote", $this->ballot($election, 'Deng', ['Gai', 'Kuol']))
            ->assertSessionHasNoErrors();
        $this->actingAs($voter)->post(self::PORTAL."/{$election->id}/vote", $this->ballot($election, 'Achol', ['Gai']))
            ->assertSessionHasErrors('ballot');

        $this->assertSame(3, ElectionVote::query()->count());
        $this->assertDatabaseHas('election_voters', ['election_id' => $election->id, 'user_id' => $voter->id]);
        $this->assertFalse(\Schema::hasColumn('election_votes', 'user_id'));
        $this->assertFalse(\Schema::hasColumn('election_votes', 'created_at'));
    }

    public function test_only_approved_members_in_the_area_may_vote(): void
    {
        $election = $this->openElection();

        foreach ([$this->member($this->countyB), $this->member($this->countyA, MemberProfile::STATUS_PENDING)] as $ineligible) {
            $this->actingAs($ineligible)->post(self::PORTAL."/{$election->id}/vote", $this->ballot($election, 'Deng', []))
                ->assertSessionHasErrors('ballot');
            $this->actingAs($ineligible)->get(self::PORTAL."/{$election->id}")->assertNotFound();
        }

        $this->assertSame(0, ElectionVote::query()->count());
    }

    public function test_too_many_choices_are_rejected(): void
    {
        $election = $this->openElection();

        $this->actingAs($this->member($this->countyA))
            ->post(self::PORTAL."/{$election->id}/vote", $this->ballot($election, 'Deng', ['Gai', 'Nyibol', 'Kuol']))
            ->assertSessionHasErrors("ballot.{$election->positions[1]->id}");
    }

    public function test_results_are_sealed_until_closed_and_shown_to_members_once_certified(): void
    {
        $election = $this->openElection();
        foreach ([['Deng', ['Gai', 'Kuol']], ['Deng', ['Gai']], ['Achol', ['Nyibol']]] as [$chair, $committee]) {
            $this->actingAs($this->member($this->countyA))->post(self::PORTAL."/{$election->id}/vote", $this->ballot($election, $chair, $committee));
        }

        $officer = $this->userWithRole('election_officer');
        $this->actingAs($officer)->get(route('admin.elections.show', $election))
            ->assertInertia(fn ($page) => $page->where('results', null)->where('turnout.voted', 3));

        $this->actingAs($officer)->post(route('admin.elections.close', $election))->assertSessionHasNoErrors();
        $this->actingAs($officer)->get(route('admin.elections.show', $election))
            ->assertInertia(fn ($page) => $page
                ->where('results.0.candidates.0.name', 'Deng')
                ->where('results.0.candidates.0.votes', 2)
                ->where('results.0.candidates.0.elected', true)
                ->where('results.1.candidates.0.name', 'Gai'));

        // Running the election does not include certifying it
        $this->actingAs($officer)->post(route('admin.elections.publish', $election))->assertForbidden();

        $member = $this->member($this->countyA);
        $this->actingAs($member)->get(self::PORTAL."/{$election->id}")->assertInertia(fn ($page) => $page->where('results', null));

        $this->actingAs($this->userWithRole('state_executive'))->post(route('admin.elections.publish', $election))->assertSessionHasNoErrors();
        $this->actingAs($member)->get(self::PORTAL."/{$election->id}")
            ->assertInertia(fn ($page) => $page->where('results.0.candidates.0.name', 'Deng'));
    }

    public function test_ballot_is_locked_once_voting_opens(): void
    {
        $election = $this->openElection();

        $this->actingAs($this->userWithRole('election_officer'))
            ->put(route('admin.elections.update', $election), $this->payload(['title' => 'Changed']))
            ->assertSessionHasErrors('status');
    }

    public function test_county_officer_cannot_run_other_county_elections(): void
    {
        $officer = $this->userWithPermissions(['portal.access', 'elections.view', 'elections.manage'], $this->countyB);

        $this->actingAs($officer)->post(route('admin.elections.store'), $this->payload())->assertForbidden();
    }

    public function test_election_pages_render(): void
    {
        $election = $this->openElection();
        $admin = $this->userWithRole('super_admin');
        $member = $this->member($this->countyA);

        $this->actingAs($admin)->post(route('admin.elections.store'), $this->payload(['title' => 'Draft one']));
        $draft = Election::query()->where('title', 'Draft one')->firstOrFail();

        foreach ([
            [route('admin.elections.index'), 'admin/elections/index'],
            [route('admin.elections.create'), 'admin/elections/form'],
            [route('admin.elections.show', $election), 'admin/elections/show'],
            [route('admin.elections.edit', $draft), 'admin/elections/form'],
        ] as [$url, $component]) {
            $this->actingAs($admin)->get($url)->assertOk()->assertInertia(fn ($page) => $page->component($component));
        }

        $this->actingAs($member)->get(self::PORTAL)
            ->assertOk()->assertInertia(fn ($page) => $page->component('member/elections/index')->has('elections', 1));
        $this->actingAs($member)->get(self::PORTAL."/{$election->id}")
            ->assertOk()->assertInertia(fn ($page) => $page->component('member/elections/show')->where('voted', false));
    }
}
