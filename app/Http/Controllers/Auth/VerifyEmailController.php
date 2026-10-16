<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use App\Support\HomeUrl;

class VerifyEmailController extends Controller
{
    /**
     * Mark the user's email address as verified.
     */
    public function __invoke(Request $request, $id, $hash): RedirectResponse
    {
        // Get the user from the route parameter
        $user = User::findOrFail($id);

        // Verify the hash matches the user's email
        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            abort(403, 'Invalid verification link.');
        }

        // Check if already verified
        if ($user->hasVerifiedEmail()) {
            return redirect()->intended(route('login', absolute: false).'?verified=1');
        }

        // Mark email as verified
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        // Auto-login the user after verification
        auth()->login($user);

        // New members continue with their membership details (on the member subdomain)
        return redirect()->away(HomeUrl::afterVerification($user));
    }
}
