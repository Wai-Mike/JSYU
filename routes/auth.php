<?php

use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\SessionHandoffController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisterController::class, 'showRegistrationForm'])
        ->name('register');

    Route::post('register', [RegisterController::class, 'register']);

    Route::get('login', [RegisterController::class, 'showLoginForm'])
        ->name('login');

    Route::post('login', [RegisterController::class, 'login']);

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('auth.password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('auth.password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('auth.password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('auth.password.store');

    // Google Sign-In via Socialite
    Route::get('auth/google', [GoogleAuthController::class, 'redirect'])
        ->middleware('throttle:10,1')
        ->name('auth.google');
    Route::get('auth/google/callback', [GoogleAuthController::class, 'callback'])
        ->middleware('throttle:10,1')
        ->name('auth.google.callback');

    // Admin login lives on the admin subdomain (routes/admin.php)
});

// Email verification routes (accessible without auth for initial verification)
Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
    ->middleware(['signed', 'throttle:6,1'])
    ->name('verification.verify');

// Carries a sign-in over to the member/admin subdomain when the session cookie isn't shared (local dev)
Route::get('auth/handoff', SessionHandoffController::class)
    ->middleware(['signed:relative', 'throttle:20,1'])
    ->name('auth.handoff');

Route::middleware('auth')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('auth.verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('auth.password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);
});

// Logout route (accessible without auth middleware)
Route::post('logout', [RegisterController::class, 'logout'])
    ->name('logout');
