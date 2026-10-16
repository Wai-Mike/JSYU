<?php

namespace Tests\Feature\Member;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class MemberAreaTest extends TestCase
{
    use RefreshDatabase;

    public function test_member_dashboard_lives_on_the_member_subdomain(): void
    {
        $this->assertSame('http://member.jsyu.test', route('member.dashboard'));
    }

    public function test_guests_are_sent_to_login(): void
    {
        $this->get(route('member.dashboard'))->assertRedirectContains('/login');
    }

    public function test_unverified_members_must_verify_first(): void
    {
        $member = User::factory()->create(['role' => 'student', 'email_verified_at' => null]);

        $this->actingAs($member)->get(route('member.dashboard'))->assertRedirectContains('/verify-email');
    }

    public function test_member_sees_their_dashboard(): void
    {
        $member = User::factory()->create(['role' => 'student', 'name' => 'Achol Deng']);

        $this->actingAs($member)
            ->get(route('member.dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('member/dashboard/index')
                ->where('account.name', 'Achol Deng')
                ->where('account.email', $member->email)
                ->where('profile', null));
    }

    public function test_member_login_lands_on_member_dashboard(): void
    {
        $member = User::factory()->create(['role' => 'student', 'password' => bcrypt('secret-pass')]);

        $this->post(route('login'), ['email' => $member->email, 'password' => 'secret-pass'])
            ->assertRedirect(route('member.dashboard'));
    }

    public function test_signed_in_member_visiting_login_is_sent_to_member_dashboard(): void
    {
        $member = User::factory()->create(['role' => 'student']);

        $this->actingAs($member)->get(route('login'))->assertRedirect(route('member.dashboard'));
    }

    public function test_old_student_urls_redirect_to_member_dashboard(): void
    {
        $this->get('http://jsyu.test/student')->assertRedirect(route('member.dashboard'))->assertStatus(301);
        $this->get('http://jsyu.test/student/learn')->assertRedirect(route('member.dashboard'));
    }

    public function test_logout_from_member_area_returns_to_public_site(): void
    {
        $member = User::factory()->create(['role' => 'student']);

        $this->actingAs($member)->post('http://member.jsyu.test/logout')->assertRedirect(route('home'));
        $this->assertGuest();
    }
}
