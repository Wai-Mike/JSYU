<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Members\MemberProfileService;
use App\Support\HomeUrl;
use App\Support\SessionHandoff;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use Laravel\Socialite\Facades\Socialite;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class GoogleAuthController extends Controller
{
    /**
     * Send the user to Google's consent screen.
     */
    public function redirect(Request $request): Response
    {
        if (! config('services.google.client_id') || ! config('services.google.client_secret')) {
            return redirect()->route('login')->with('error', 'Google sign-in is not configured yet.');
        }

        $request->session()->put('google_remember', $request->boolean('remember'));

        return Socialite::driver('google')
            ->with(['prompt' => 'select_account'])
            ->redirect();
    }

    /**
     * Handle Google's callback: find or create the user and start a session.
     */
    public function callback(Request $request): RedirectResponse
    {
        if ($request->has('error')) {
            return redirect()->route('login')->with('error', 'Google sign-in was cancelled.');
        }

        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (Throwable $e) {
            Log::warning('Google OAuth callback failed', ['message' => $e->getMessage()]);

            return redirect()->route('login')->with('error', 'Google authentication failed. Please try again.');
        }

        if (! $googleUser->getEmail()) {
            return redirect()->route('login')->with('error', 'Your Google account did not provide an email address.');
        }

        try {
            $user = $this->resolveUser($googleUser);
        } catch (RuntimeException $e) {
            return redirect()->route('login')->with('error', $e->getMessage());
        }

        Auth::login($user, (bool) $request->session()->pull('google_remember', false));
        $request->session()->regenerate();

        Log::info('Google login succeeded', ['user_id' => $user->id]);

        // Google has normally verified the address already, so this only sends mail when it hasn't
        if ($user->wasRecentlyCreated) {
            event(new Registered($user));
        }

        if (! $user->hasVerifiedEmail()) {
            return redirect()->route('verification.notice');
        }

        return redirect()->away(SessionHandoff::url($user, redirect()->intended(HomeUrl::for($user))->getTargetUrl()));
    }

    private function resolveUser(SocialiteUser $googleUser): User
    {
        $email = strtolower($googleUser->getEmail());
        $emailVerified = (bool) ($googleUser->user['email_verified'] ?? false);

        return DB::transaction(function () use ($googleUser, $email, $emailVerified) {
            $user = User::query()->where('google_id', $googleUser->getId())->lockForUpdate()->first();

            if ($user) {
                if (! $user->avatar && $googleUser->getAvatar()) {
                    $user->forceFill(['avatar' => $googleUser->getAvatar()]);
                }

                // Google members created before verification was trusted are verified now
                if ($emailVerified && ! $user->hasVerifiedEmail()) {
                    $user->forceFill(['email_verified_at' => now()]);
                }

                $user->save();

                return $user;
            }

            $user = User::query()->where('email', $email)->lockForUpdate()->first();

            if ($user) {
                // Only link when both sides have proven ownership of the address; otherwise an
                // unverified local account could be hijacked (or could hijack the Google user).
                if (! $emailVerified || ! $user->hasVerifiedEmail()) {
                    throw new RuntimeException('An account with this email already exists. Sign in with your password instead.');
                }

                $user->forceFill([
                    'google_id' => $googleUser->getId(),
                    'avatar' => $user->avatar ?: $googleUser->getAvatar(),
                ])->save();

                return $user;
            }

            $user = new User([
                'name' => $googleUser->getName() ?: 'Google User',
                'email' => $email,
                'avatar' => $googleUser->getAvatar(),
                'password' => null,
                'role' => 'student',
            ]);

            // Google has proven ownership of the address, so no verification email is needed
            $user->forceFill([
                'google_id' => $googleUser->getId(),
                'email_verified_at' => $emailVerified ? now() : null,
            ])->save();

            // Start the member profile with Google's names so the membership form is pre-filled
            app(MemberProfileService::class)->forUser($user)->update([
                'first_name' => $googleUser->user['given_name'] ?? null,
                'last_name' => $googleUser->user['family_name'] ?? null,
            ]);

            Log::info('Google user registered', ['user_id' => $user->id]);

            return $user;
        });
    }
}
