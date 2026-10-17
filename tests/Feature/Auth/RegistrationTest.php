<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Notification::fake();
    }

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'first_name' => 'Nyandeng',
            'last_name' => 'Mabior',
            'email' => 'Nyandeng@Example.com',
            'password' => 'password',
        ], $overrides);
    }

    public function test_registration_screen_can_be_rendered()
    {
        $this->get('/register')->assertStatus(200)->assertInertia(fn ($page) => $page->component('auth/register'));
    }

    public function test_step_one_creates_the_account_and_asks_for_email_verification()
    {
        $this->post('/register', $this->payload())->assertRedirect(route('verification.notice'));

        $this->assertAuthenticated();

        $user = User::query()->where('email', 'nyandeng@example.com')->firstOrFail();
        $this->assertSame('Nyandeng Mabior', $user->name);
        $this->assertNull($user->email_verified_at);
        Notification::assertSentTo($user, VerifyEmail::class);

        // The member profile is started with the names so later steps are pre-filled
        $profile = $user->person->memberProfile;
        $this->assertSame('Nyandeng', $profile->first_name);
        $this->assertSame('Mabior', $profile->last_name);
        $this->assertFalse($profile->isMembershipComplete());
    }

    public function test_account_details_are_required()
    {
        $this->post('/register', $this->payload(['first_name' => '', 'email' => 'not-an-email', 'password' => '123']))
            ->assertSessionHasErrors(['first_name', 'email', 'password']);

        $this->assertGuest();
    }

    public function test_verifying_the_email_continues_to_the_membership_details()
    {
        $this->post('/register', $this->payload());
        $user = User::query()->where('email', 'nyandeng@example.com')->firstOrFail();

        $url = URL::temporarySignedRoute('verification.verify', now()->addHour(), [
            'id' => $user->id,
            'hash' => sha1($user->getEmailForVerification()),
        ]);

        $this->get($url)->assertRedirect(route('member.membership.edit'));
        $this->assertNotNull($user->fresh()->email_verified_at);
    }
}
