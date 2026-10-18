<?php

namespace Tests\Feature\Portal;

use App\Models\GeographicArea;
use App\Models\MemberProfile;
use App\Models\User;
use App\Services\Members\MemberProfileService;

class MemberReviewTest extends PortalTestCase
{
    private function memberIn(?GeographicArea $area, string $visibility = MemberProfile::VISIBILITY_OFFICIALS, bool $complete = true): MemberProfile
    {
        $user = User::factory()->create(['role' => 'student']);
        $profile = app(MemberProfileService::class)->forUser($user);
        $profile->person->update(['phone' => '+211 912 345 678', 'gender' => 'female']);
        $profile->update([
            'first_name' => 'Nyakuoth',
            'last_name' => 'Gai',
            'date_of_birth' => '2000-01-01',
            'current_country_code' => $complete ? 'SS' : null,
            'home_area_id' => $area?->id,
            'visibility' => $visibility,
        ]);

        return $profile->fresh('person');
    }

    public function test_reviewer_approves_a_complete_application_and_it_is_audited(): void
    {
        $profile = $this->memberIn($this->countyA);
        $officer = $this->userWithRole('membership_officer', $this->countyA);

        $this->actingAs($officer)->post(route('admin.members.approve', $profile))->assertSessionHasNoErrors();

        $profile->refresh();
        $this->assertSame(MemberProfile::STATUS_APPROVED, $profile->status);
        $this->assertSame($officer->id, $profile->reviewed_by);
        $this->assertDatabaseHas('audit_logs', ['action' => 'member.approved', 'subject_id' => $profile->id]);
    }

    public function test_incomplete_profiles_cannot_be_approved(): void
    {
        $profile = $this->memberIn($this->countyA, complete: false);

        $this->actingAs($this->userWithRole('membership_officer'))
            ->post(route('admin.members.approve', $profile))
            ->assertSessionHasErrors('note');

        $this->assertSame(MemberProfile::STATUS_PENDING, $profile->fresh()->status);
    }

    public function test_rejection_needs_a_reason_and_resubmitting_returns_it_to_pending(): void
    {
        $profile = $this->memberIn($this->countyA);
        $officer = $this->userWithRole('membership_officer');

        $this->actingAs($officer)->post(route('admin.members.reject', $profile))->assertSessionHasErrors('note');
        $this->actingAs($officer)->post(route('admin.members.reject', $profile), ['note' => 'Please add your payam.'])->assertSessionHasNoErrors();
        $this->assertSame(MemberProfile::STATUS_REJECTED, $profile->fresh()->status);

        $member = $profile->person->user;
        $this->actingAs($member)->get('http://portal.jsyu.test/member')
            ->assertInertia(fn ($page) => $page->where('profile.status', 'rejected')->where('profile.reviewNote', 'Please add your payam.'));

        $this->actingAs($member)->post('http://portal.jsyu.test/member/membership', [
            'first_name' => 'Nyakuoth', 'last_name' => 'Gai', 'gender' => 'female', 'date_of_birth' => '2000-01-01',
            'phone' => '+211 912 345 678', 'current_country_code' => 'SS', 'visibility' => 'officials',
        ])->assertSessionHasNoErrors();

        $this->assertSame(MemberProfile::STATUS_PENDING, $profile->fresh()->status);
    }

    public function test_reviewers_are_limited_to_their_area_and_cannot_review_themselves(): void
    {
        $other = $this->memberIn($this->countyB);
        $officer = $this->userWithRole('membership_officer', $this->countyA);

        $this->actingAs($officer)->post(route('admin.members.approve', $other))->assertForbidden();
        $this->actingAs($officer)->get(route('admin.members.show', $other))->assertForbidden();

        $own = $this->memberIn(null);
        $selfReviewer = $own->person->user;
        \App\Models\RoleAssignment::query()->create([
            'user_id' => $selfReviewer->id,
            'role_id' => \App\Models\Role::query()->where('key', 'membership_officer')->value('id'),
        ]);
        $this->refreshAccess();

        $this->actingAs($selfReviewer)->post(route('admin.members.approve', $own))->assertForbidden();
    }

    public function test_directory_respects_visibility_and_review_scope(): void
    {
        $this->memberIn($this->payamA1, MemberProfile::VISIBILITY_PRIVATE);
        $this->memberIn($this->countyA, MemberProfile::VISIBILITY_OFFICIALS);
        $this->memberIn($this->countyB, MemberProfile::VISIBILITY_OFFICIALS);

        // members.view only: officials-visible profiles in county A, never private ones
        $viewer = $this->userWithPermissions(['portal.access', 'members.view'], $this->countyA);
        $this->actingAs($viewer)->get(route('admin.members.index', ['status' => 'all']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('admin/members/index')->has('members.data', 1));

        // A reviewer for county A also sees the private application they must review
        $reviewer = $this->userWithRole('membership_officer', $this->countyA);
        $this->actingAs($reviewer)->get(route('admin.members.index', ['status' => 'all']))
            ->assertInertia(fn ($page) => $page->has('members.data', 2)->where('counts.pending', 2));
    }

    public function test_profile_page_renders_for_reviewer(): void
    {
        $profile = $this->memberIn($this->countyA);

        $this->actingAs($this->userWithRole('super_admin'))
            ->get(route('admin.members.show', $profile))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/members/show')
                ->where('member.name', $profile->person->full_name)
                ->where('can.review', true));
    }
}
