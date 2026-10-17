<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as GoogleUser;
use Tests\TestCase;

class GoogleAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_redirect_sends_user_to_google(): void
    {
        config(['services.google.client_id' => 'client-id', 'services.google.client_secret' => 'secret']);

        $response = $this->get(route('auth.google', ['remember' => 1]));

        $response->assertRedirect();
        $this->assertStringStartsWith('https://accounts.google.com/o/oauth2/auth', $response->headers->get('Location'));
        $this->assertTrue(session('google_remember'));
    }

    public function test_redirect_without_credentials_returns_to_login(): void
    {
        config(['services.google.client_id' => null, 'services.google.client_secret' => null]);

        $this->get(route('auth.google'))
            ->assertRedirect(route('login'))
            ->assertSessionHas('error', 'Google sign-in is not configured yet.');
    }

    public function test_new_google_member_must_verify_their_email_first(): void
    {
        Notification::fake();
        $this->mockGoogleUser('g-new', 'New@Example.com');

        $this->get(route('auth.google.callback'))->assertRedirect(route('verification.notice'));

        $user = User::where('email', 'new@example.com')->firstOrFail();
        $this->assertAuthenticatedAs($user);
        $this->assertSame('g-new', $user->google_id);
        $this->assertSame('student', $user->role);
        $this->assertNull($user->email_verified_at);
        Notification::assertSentTo($user, VerifyEmail::class);
    }

    public function test_callback_logs_in_user_by_google_id_without_changing_role(): void
    {
        $admin = User::factory()->create(['email' => 'admin@example.com', 'role' => 'admin']);
        $admin->forceFill(['google_id' => 'g-admin'])->save();

        $this->mockGoogleUser('g-admin', 'admin@example.com');

        $this->get(route('auth.google.callback'));

        $this->assertAuthenticatedAs($admin);
        $this->assertSame('admin', $admin->fresh()->role);
    }

    public function test_callback_links_existing_verified_account(): void
    {
        $user = User::factory()->create(['email' => 'member@example.com', 'email_verified_at' => now()]);

        $this->mockGoogleUser('g-member', 'member@example.com');

        $this->get(route('auth.google.callback'));

        $this->assertAuthenticatedAs($user);
        $this->assertSame('g-member', $user->fresh()->google_id);
    }

    public function test_callback_refuses_to_link_unverified_local_account(): void
    {
        $user = User::factory()->create(['email' => 'pending@example.com', 'email_verified_at' => null]);

        $this->mockGoogleUser('g-pending', 'pending@example.com');

        $this->get(route('auth.google.callback'))
            ->assertRedirect(route('login'))
            ->assertSessionHas('error');

        $this->assertGuest();
        $this->assertNull($user->fresh()->google_id);
    }

    public function test_callback_handles_cancelled_consent(): void
    {
        $this->get(route('auth.google.callback', ['error' => 'access_denied']))
            ->assertRedirect(route('login'))
            ->assertSessionHas('error', 'Google sign-in was cancelled.');

        $this->assertGuest();
    }

    public function test_callback_handles_socialite_failure(): void
    {
        Socialite::shouldReceive('driver->user')->andThrow(new \Laravel\Socialite\Two\InvalidStateException);

        $this->get(route('auth.google.callback'))
            ->assertRedirect(route('login'))
            ->assertSessionHas('error', 'Google authentication failed. Please try again.');

        $this->assertGuest();
    }

    public function test_new_google_member_starts_with_their_names_on_the_membership_form(): void
    {
        $this->mockGoogleUser('g-names', 'names@example.com');

        $this->get(route('auth.google.callback'));

        $profile = User::where('email', 'names@example.com')->firstOrFail()->person->memberProfile;
        $this->assertSame('Google', $profile->first_name);
        $this->assertSame('Person', $profile->last_name);
    }

    private function mockGoogleUser(string $id, string $email, bool $verified = true): void
    {
        $googleUser = (new GoogleUser)->setRaw(['email_verified' => $verified, 'given_name' => 'Google', 'family_name' => 'Person'])->map([
            'id' => $id,
            'name' => 'Google Person',
            'email' => $email,
            'avatar' => 'https://example.com/avatar.png',
        ]);

        Socialite::shouldReceive('driver->user')->andReturn($googleUser);
    }
}
