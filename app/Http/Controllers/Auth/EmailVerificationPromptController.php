<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;
use App\Support\CrossHostRedirect;
use App\Support\HomeUrl;

class EmailVerificationPromptController extends Controller
{
    /**
     * Show the email verification prompt page.
     */
    public function __invoke(Request $request): Response|SymfonyResponse
    {
        $user = $request->user();
        
        // If user is already verified, redirect based on their role
        if ($user->hasVerifiedEmail()) {
            return CrossHostRedirect::to($request, HomeUrl::afterVerification($user));
        }
        
        return Inertia::render('auth/verify-email', ['status' => $request->session()->get('status')]);
    }
}
