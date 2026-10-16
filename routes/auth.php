<?php

use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\FirebaseAuthController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
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

    // Firebase Google Sign-In → Laravel session exchange
    Route::post('auth/firebase/google', [FirebaseAuthController::class, 'login'])
        ->middleware('throttle:10,1')
        ->name('auth.firebase.google');

    // Admin login lives on the admin subdomain (routes/admin.php)
});

// Email verification routes (accessible without auth for initial verification)
Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
    ->middleware(['signed', 'throttle:6,1'])
    ->name('verification.verify');

Route::middleware('auth')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('auth.verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('auth.password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    // Link / unlink Firebase Google identity (authenticated)
    Route::post('auth/firebase/link', [FirebaseAuthController::class, 'link'])
        ->middleware('throttle:10,1')
        ->name('auth.firebase.link');
    Route::post('auth/firebase/unlink', [FirebaseAuthController::class, 'unlink'])
        ->middleware('throttle:10,1')
        ->name('auth.firebase.unlink');
});

// Logout route (accessible without auth middleware)
Route::post('logout', [RegisterController::class, 'logout'])
    ->name('logout');
