<?php

namespace Tests\Feature\Member;

use App\Models\GeographicArea;
use App\Models\User;
use App\Services\Geography\JongleiGeography;
use App\Services\Members\MemberProfileService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class MembershipTest extends TestCase
{
    use RefreshDatabase;

    private const URL = 'http://portal.jsyu.test/member/membership';

    protected function setUp(): void
    {
        parent::setUp();

        app(JongleiGeography::class)->sync();
    }

    private function member(): User
    {
        $user = User::factory()->create(['role' => 'student', 'name' => 'Gatwech Deng']);
        app(MemberProfileService::class)->forUser($user)->update(['first_name' => 'Gatwech', 'last_name' => 'Deng']);

        return $user;
    }

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'first_name' => 'Gatwech',
            'middle_name' => 'Kuol',
            'last_name' => 'Deng',
            'gender' => 'male',
            'date_of_birth' => '1999-08-20',
            'phone' => '+211 912 345 678',
            'alternative_phone' => '',
            'home_area_id' => GeographicArea::query()->where('code', 'SS-JG-AYO')->value('id'),
            'current_country_code' => 'ke',
            'current_location' => 'Nairobi',
            'bio' => 'Peace caravan volunteer.',
            'visibility' => 'members',
        ], $overrides);
    }

    public function test_unverified_members_cannot_continue_until_they_verify()
    {
        $user = $this->member();
        $user->forceFill(['email_verified_at' => null])->save();

        $this->actingAs($user)->get(self::URL)->assertRedirect(route('verification.notice'));
        $this->actingAs($user)->post(self::URL, $this->payload())->assertRedirect(route('verification.notice'));
        $this->actingAs($user)->get('http://portal.jsyu.test/member')->assertRedirect(route('verification.notice'));
    }

    public function test_membership_form_is_prefilled_from_registration()
    {
        $this->actingAs($this->member())
            ->get(self::URL)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('member/membership')
                ->where('member.first_name', 'Gatwech')
                ->where('member.current_country_code', 'SS')
                ->has('areas', 9)
                ->has('visibilities', 3));
    }

    public function test_member_completes_their_membership()
    {
        $user = $this->member();

        $this->actingAs($user)
            ->post(self::URL, $this->payload())
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('member.dashboard'));

        $user->refresh();
        $this->assertSame('Gatwech Kuol Deng', $user->name);

        $person = $user->person;
        $this->assertSame('+211 912 345 678', $person->phone);
        $this->assertSame('male', $person->gender);

        $profile = $person->memberProfile;
        $this->assertSame('Ayod', $profile->homeArea->name);
        $this->assertSame('KE', $profile->current_country_code);
        $this->assertSame('members', $profile->visibility);
        $this->assertTrue($profile->isMembershipComplete());
    }

    public function test_required_details_are_validated()
    {
        $this->actingAs($this->member())
            ->post(self::URL, $this->payload(['gender' => '', 'phone' => 'call me', 'home_area_id' => '']))
            ->assertSessionHasErrors(['gender', 'phone', 'home_area_id']);
    }

    public function test_home_area_must_be_inside_jonglei()
    {
        $country = GeographicArea::query()->where('code', 'SS')->value('id');

        $this->actingAs($this->member())
            ->post(self::URL, $this->payload(['home_area_id' => $country]))
            ->assertSessionHasErrors('home_area_id');
    }

    public function test_dashboard_prompts_until_membership_is_complete()
    {
        $user = $this->member();

        $this->actingAs($user)->get(route('member.dashboard'))
            ->assertInertia(fn (Assert $page) => $page->where('membershipComplete', false));

        $this->actingAs($user)->post(self::URL, $this->payload());

        // A fresh instance, as a real next request would load
        $this->actingAs($user->fresh())->get(route('member.dashboard'))
            ->assertInertia(fn (Assert $page) => $page->where('membershipComplete', true));
    }
}
