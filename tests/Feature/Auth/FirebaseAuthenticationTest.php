<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Services\FirebaseTokenVerifier;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Kreait\Firebase\Exception\Auth\FailedToVerifyToken;
use Mockery;
use RuntimeException;
use Tests\TestCase;

class FirebaseAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_valid_firebase_token_logs_in_existing_linked_user(): void
    {
        $user = User::factory()->withFirebase('uid-existing')->create([
            'email' => 'linked@example.com',
            'name' => 'Linked User',
        ]);

        $this->mockVerifier([
            'uid' => 'uid-existing',
            'email' => 'linked@example.com',
            'name' => 'Linked User',
            'picture' => null,
            'email_verified' => true,
        ]);

        $sessionIdBefore = session()->getId();

        $response = $this->post(route('auth.firebase.google'), [
            'id_token' => 'valid-token',
        ]);

        $response->assertRedirect(route('home'));
        $this->assertAuthenticatedAs($user);
        $this->assertNotSame($sessionIdBefore, session()->getId());
    }

    public function test_valid_firebase_token_registers_new_user_when_email_is_free(): void
    {
        $this->mockVerifier([
            'uid' => 'uid-new',
            'email' => 'new.google@example.com',
            'name' => 'New Google User',
            'picture' => 'https://example.com/photo.jpg',
            'email_verified' => true,
        ]);

        $response = $this->post(route('auth.firebase.google'), [
            'id_token' => 'valid-token',
        ]);

        $response->assertRedirect(route('home'));
        $this->assertAuthenticated();

        $this->assertDatabaseHas('users', [
            'email' => 'new.google@example.com',
            'firebase_uid' => 'uid-new',
            'role' => 'student',
            'name' => 'New Google User',
        ]);

        $this->assertSame(1, User::where('firebase_uid', 'uid-new')->count());
    }

    public function test_invalid_firebase_token_is_rejected(): void
    {
        $verifier = Mockery::mock(FirebaseTokenVerifier::class);
        $verifier->shouldReceive('verify')
            ->once()
            ->andThrow(new FailedToVerifyToken('invalid'));
        $this->app->instance(FirebaseTokenVerifier::class, $verifier);

        $response = $this->from(route('login'))->post(route('auth.firebase.google'), [
            'id_token' => 'invalid-token',
        ]);

        $response->assertSessionHasErrors('id_token');
        $this->assertGuest();
    }

    public function test_token_from_another_project_is_rejected(): void
    {
        $verifier = Mockery::mock(FirebaseTokenVerifier::class);
        $verifier->shouldReceive('verify')
            ->once()
            ->andThrow(new RuntimeException('Firebase token audience does not match this application.'));
        $this->app->instance(FirebaseTokenVerifier::class, $verifier);

        $response = $this->from(route('login'))->post(route('auth.firebase.google'), [
            'id_token' => 'foreign-project-token',
        ]);

        $response->assertSessionHasErrors('id_token');
        $this->assertGuest();
    }

    public function test_existing_email_password_account_cannot_be_taken_over(): void
    {
        User::factory()->create([
            'email' => 'password.user@example.com',
            'firebase_uid' => null,
        ]);

        $this->mockVerifier([
            'uid' => 'uid-attacker',
            'email' => 'password.user@example.com',
            'name' => 'Attacker',
            'picture' => null,
            'email_verified' => true,
        ]);

        $response = $this->from(route('login'))->post(route('auth.firebase.google'), [
            'id_token' => 'valid-token',
        ]);

        $response->assertSessionHasErrors('id_token');
        $this->assertGuest();
        $this->assertDatabaseMissing('users', ['firebase_uid' => 'uid-attacker']);
    }

    public function test_repeated_login_does_not_create_duplicate_users(): void
    {
        $this->mockVerifier([
            'uid' => 'uid-once',
            'email' => 'once@example.com',
            'name' => 'Once User',
            'picture' => null,
            'email_verified' => true,
        ]);

        $this->post(route('auth.firebase.google'), ['id_token' => 'valid-token']);
        Auth::logout();

        $this->post(route('auth.firebase.google'), ['id_token' => 'valid-token']);

        $this->assertSame(1, User::where('email', 'once@example.com')->count());
        $this->assertAuthenticated();
    }

    public function test_password_login_still_works(): void
    {
        $user = User::factory()->create([
            'email' => 'classic@example.com',
            'password' => bcrypt('password'),
        ]);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticatedAs($user);
        $response->assertRedirect();
    }

    public function test_logout_invalidates_session_after_firebase_login(): void
    {
        User::factory()->withFirebase('uid-logout')->create([
            'email' => 'logout@example.com',
        ]);

        $this->mockVerifier([
            'uid' => 'uid-logout',
            'email' => 'logout@example.com',
            'name' => 'Logout User',
            'picture' => null,
            'email_verified' => true,
        ]);

        $this->post(route('auth.firebase.google'), ['id_token' => 'valid-token']);
        $this->assertAuthenticated();

        $response = $this->post(route('logout'));

        $response->assertRedirect('/');
        $this->assertGuest();
    }

    public function test_authenticated_user_can_link_firebase_identity(): void
    {
        $user = User::factory()->create([
            'email' => 'linkme@example.com',
            'firebase_uid' => null,
        ]);

        $this->mockVerifier([
            'uid' => 'uid-link',
            'email' => 'other@example.com',
            'name' => 'Link Me',
            'picture' => null,
            'email_verified' => true,
        ]);

        $response = $this->actingAs($user)->post(route('auth.firebase.link'), [
            'id_token' => 'valid-token',
        ]);

        $response->assertRedirect();
        $this->assertSame('uid-link', $user->fresh()->firebase_uid);
    }

    public function test_firebase_credentials_are_never_returned_in_response(): void
    {
        config([
            'firebase.credentials' => '{"type":"service_account","private_key":"SECRET"}',
            'firebase.project_id' => 'demo-project',
        ]);

        $verifier = Mockery::mock(FirebaseTokenVerifier::class);
        $verifier->shouldReceive('verify')
            ->once()
            ->andThrow(new FailedToVerifyToken('invalid'));
        $this->app->instance(FirebaseTokenVerifier::class, $verifier);

        $response = $this->from(route('login'))->post(route('auth.firebase.google'), [
            'id_token' => 'invalid-token',
        ]);

        $response->assertSessionHasErrors('id_token');
        $content = $response->getContent() ?: '';
        $this->assertStringNotContainsString('SECRET', $content);
        $this->assertStringNotContainsString('service_account', $content);
    }

    /**
     * @param  array{uid: string, email: ?string, name: ?string, picture: ?string, email_verified: bool}  $claims
     */
    private function mockVerifier(array $claims): void
    {
        $verifier = Mockery::mock(FirebaseTokenVerifier::class);
        $verifier->shouldReceive('verify')->andReturn($claims);
        $this->app->instance(FirebaseTokenVerifier::class, $verifier);
    }
}
