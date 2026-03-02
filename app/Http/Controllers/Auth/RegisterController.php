<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use App\Notifications\VerificationWelcomeNotification;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisterController extends Controller
{
    /**
     * Display the registration view.
     */
    public function showRegistrationForm(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Display the login view.
     */
    public function showLoginForm(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function register(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255|not_in:admin',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'role' => $request->role,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Fire the Registered event (this will trigger the welcome email listener)
        event(new Registered($user));

        // Send custom verification email
        $user->notify(new VerificationWelcomeNotification());

        // Auto-login the user after registration
        Auth::login($user);

        // Admins → admin dashboard; normal users → main site (home)
        $redirectRoute = match($user->role) {
            'admin' => 'admin.dashboard',
            'expert' => 'home',
            'user' => 'home',
            'student' => 'home',
            default => 'home',
        };

        return redirect()->intended(route($redirectRoute))->with('success', 'Registration successful! Welcome to our platform.');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function login(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = Auth::user();

        // If email is not verified, redirect to verification page
        if (!$user->hasVerifiedEmail()) {
            return redirect()->route('verification.notice');
        }

        // Admins go to admin dashboard; normal users stay on main site (home/blog)
        $redirectRoute = match($user->role) {
            'admin' => 'admin.dashboard',
            'expert' => 'home',
            'user' => 'home',
            'student' => 'home',
            default => 'home',
        };

        return redirect()->intended(route($redirectRoute));
    }

    /**
     * Display the admin login view.
     */
    public function showAdminLoginForm(Request $request): Response
    {
        return Inertia::render('auth/admin-login', [
            'canResetPassword' => Route::has('auth.password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an admin-only login request.
     */
    public function adminLogin(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255'],
            'password' => ['required'],
        ]);

        if (! Auth::attempt(
            ['email' => $credentials['email'], 'password' => $credentials['password']],
            $request->boolean('remember'),
        )) {
            return back()->withErrors([
                'email' => 'These credentials do not match our records.',
            ])->onlyInput('email');
        }

        $request->session()->regenerate();

        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->role !== 'admin') {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return back()->withErrors([
                'email' => 'You are not authorized to access the admin area.',
            ])->onlyInput('email');
        }

        if (! $user->hasVerifiedEmail()) {
            return redirect()->route('verification.notice');
        }

        return redirect()->intended(route('admin.dashboard'));
    }

    /**
     * Destroy an authenticated session.
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
