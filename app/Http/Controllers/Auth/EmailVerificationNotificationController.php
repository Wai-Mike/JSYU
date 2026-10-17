<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;
use Illuminate\Support\Facades\Log;
use App\Support\CrossHostRedirect;
use App\Support\HomeUrl;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): SymfonyResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            $user = $request->user();
            
            return CrossHostRedirect::to($request, HomeUrl::afterVerification($user));
        }

        try {
            $request->user()->sendEmailVerificationNotification();
            Log::info('Verification email sent', ['user_id' => $request->user()->id, 'email' => $request->user()->email]);
        } catch (\Exception $e) {
            Log::error('Failed to send verification email', [
                'user_id' => $request->user()->id,
                'email' => $request->user()->email,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return back()->with('error', 'Failed to send verification email. Please try again or contact support.');
        }

        return back()->with('status', 'verification-link-sent');
    }
}
