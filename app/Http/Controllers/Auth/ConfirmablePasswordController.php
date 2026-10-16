<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use App\Support\CrossHostRedirect;
use App\Support\HomeUrl;

class ConfirmablePasswordController extends Controller
{
    /**
     * Show the confirm password page.
     */
    public function show(): Response
    {
        return Inertia::render('auth/confirm-password');
    }

    /**
     * Confirm the user's password.
     */
    public function store(Request $request): SymfonyResponse
    {
        if (! Auth::guard('web')->validate([
            'email' => $request->user()->email,
            'password' => $request->password,
        ])) {
            throw ValidationException::withMessages([
                'password' => __('auth.password'),
            ]);
        }

        $request->session()->put('auth.password_confirmed_at', time());

        $user = $request->user();
        
        return CrossHostRedirect::to($request, redirect()->intended(HomeUrl::for($user))->getTargetUrl());
    }
}
