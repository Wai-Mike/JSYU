<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\FirebaseTokenVerifier;
use App\Support\CrossHostRedirect;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Kreait\Firebase\Exception\Auth\FailedToVerifyToken;
use Kreait\Firebase\Exception\Auth\RevokedIdToken;
use Kreait\Firebase\JWT\Error\IdTokenVerificationFailed;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class FirebaseAuthController extends Controller
{
    public function __construct(
        private readonly FirebaseTokenVerifier $verifier,
    ) {}

    /**
     * Exchange a verified Firebase ID token for a Laravel session.
     */
    public function login(Request $request): Response
    {
        $request->validate([
            'id_token' => ['required', 'string'],
        ]);

        $claims = $this->verifyTokenOrFail($request->string('id_token')->toString());

        if (! $claims['email']) {
            throw ValidationException::withMessages([
                'id_token' => 'Your Google account did not provide an email address.',
            ]);
        }

        $user = $this->resolveUserForLogin($claims);

        Auth::login($user, $request->boolean('remember'));
        $request->session()->regenerate();

        Log::info('Firebase Google login succeeded', [
            'user_id' => $user->id,
            'firebase_uid' => $user->firebase_uid,
        ]);

        return $this->authenticatedRedirect($request, $user);
    }

    /**
     * Link a Firebase Google identity to the currently authenticated user.
     */
    public function link(Request $request): Response
    {
        $request->validate([
            'id_token' => ['required', 'string'],
        ]);

        /** @var User $user */
        $user = $request->user();
        $claims = $this->verifyTokenOrFail($request->string('id_token')->toString());

        $existing = User::query()
            ->where('firebase_uid', $claims['uid'])
            ->where('id', '!=', $user->id)
            ->exists();

        if ($existing) {
            throw ValidationException::withMessages([
                'id_token' => 'This Google account is already linked to another user.',
            ]);
        }

        if ($user->firebase_uid && $user->firebase_uid !== $claims['uid']) {
            throw ValidationException::withMessages([
                'id_token' => 'A different Google account is already linked. Unlink it first.',
            ]);
        }

        $user->forceFill([
            'firebase_uid' => $claims['uid'],
            'avatar' => $user->avatar ?: $claims['picture'],
            'email_verified_at' => $user->email_verified_at ?? ($claims['email_verified'] ? now() : null),
        ])->save();

        return back()->with('success', 'Google account linked successfully.');
    }

    /**
     * Unlink the Firebase Google identity from the authenticated user.
     */
    public function unlink(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        if (! $user->firebase_uid) {
            return back()->with('error', 'No Google account is linked.');
        }

        if (! $user->password) {
            throw ValidationException::withMessages([
                'firebase_uid' => 'Set a password before unlinking Google sign-in.',
            ]);
        }

        $user->forceFill(['firebase_uid' => null])->save();

        return back()->with('success', 'Google account unlinked successfully.');
    }

    /**
     * @return array{uid: string, email: ?string, name: ?string, picture: ?string, email_verified: bool}
     */
    private function verifyTokenOrFail(string $idToken): array
    {
        try {
            return $this->verifier->verify($idToken);
        } catch (FailedToVerifyToken|RevokedIdToken|IdTokenVerificationFailed $e) {
            Log::warning('Firebase ID token verification failed', [
                'message' => $e->getMessage(),
            ]);

            throw ValidationException::withMessages([
                'id_token' => 'Google authentication failed. Please try again.',
            ]);
        } catch (Throwable $e) {
            Log::warning('Firebase authentication error', [
                'message' => $e->getMessage(),
            ]);

            throw ValidationException::withMessages([
                'id_token' => 'Google authentication is temporarily unavailable.',
            ]);
        }
    }

    /**
     * @param  array{uid: string, email: ?string, name: ?string, picture: ?string, email_verified: bool}  $claims
     */
    private function resolveUserForLogin(array $claims): User
    {
        return DB::transaction(function () use ($claims) {
            $byUid = User::query()
                ->where('firebase_uid', $claims['uid'])
                ->lockForUpdate()
                ->first();

            if ($byUid) {
                $this->fillMissingProfileFields($byUid, $claims);

                return $byUid;
            }

            $byEmail = User::query()
                ->where('email', $claims['email'])
                ->lockForUpdate()
                ->first();

            if ($byEmail) {
                // Do not silently attach Google to an existing password account.
                throw ValidationException::withMessages([
                    'id_token' => 'An account with this email already exists. Sign in with your password, then link Google from your account.',
                ]);
            }

            $user = new User([
                'name' => $claims['name'] ?: 'Google User',
                'email' => $claims['email'],
                'firebase_uid' => $claims['uid'],
                'avatar' => $claims['picture'],
                'password' => null,
                'role' => 'student',
            ]);

            $user->forceFill([
                'email_verified_at' => $claims['email_verified'] ? now() : null,
            ])->save();

            // Intentionally skip Registered listeners: Google emails are verified via Firebase,
            // and the legacy welcome-email listener is not required for this path.

            Log::info('Firebase Google user registered', [
                'user_id' => $user->id,
                'firebase_uid' => $user->firebase_uid,
            ]);

            return $user;
        });
    }

    /**
     * @param  array{uid: string, email: ?string, name: ?string, picture: ?string, email_verified: bool}  $claims
     */
    private function fillMissingProfileFields(User $user, array $claims): void
    {
        $updates = [];

        if (! $user->avatar && $claims['picture']) {
            $updates['avatar'] = $claims['picture'];
        }

        if (! $user->email_verified_at && $claims['email_verified']) {
            $updates['email_verified_at'] = now();
        }

        if ($updates !== []) {
            $user->forceFill($updates)->save();
        }
    }

    private function authenticatedRedirect(Request $request, User $user): Response
    {
        if (! $user->hasVerifiedEmail()) {
            return redirect()->route('verification.notice');
        }

        $redirectRoute = match ($user->role) {
            'admin' => 'admin.dashboard',
            default => 'home',
        };

        return CrossHostRedirect::to(
            $request,
            redirect()->intended(route($redirectRoute))->getTargetUrl()
        );
    }
}
