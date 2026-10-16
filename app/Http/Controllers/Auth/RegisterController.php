<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use App\Services\Members\MemberProfileService;
use App\Notifications\VerificationWelcomeNotification;
use App\Support\CrossHostRedirect;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;
use App\Support\HomeUrl;

class RegisterController extends Controller
{
    /**
     * Display the registration view (step 1: the account itself).
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
     * Create the account, then send the member to verify their email. The rest
     * of the membership details are collected once the email is confirmed.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function register(Request $request, MemberProfileService $profiles): RedirectResponse
    {
        $request->merge(['email' => strtolower(trim((string) $request->input('email')))]);

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:80'],
            'last_name' => ['required', 'string', 'max:80'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            // Keep password rules simple for this project (admins are managed separately).
            'password' => ['required', 'confirmed', 'min:5'],
            'terms' => ['accepted'],
        ], [
            'terms.accepted' => 'Please agree to the community guidelines to join.',
        ]);

        $user = DB::transaction(function () use ($validated, $profiles) {
            $user = User::create([
                'name' => trim($validated['first_name']).' '.trim($validated['last_name']),
                'role' => 'student', // DB enum is ['student','admin'], so use student for public signups
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            // Start the member profile now so the next steps pick up the names
            $profiles->forUser($user)->update([
                'first_name' => trim($validated['first_name']),
                'last_name' => trim($validated['last_name']),
            ]);

            return $user;
        });

        // Fire the Registered event (this will trigger the welcome email listener)
        event(new Registered($user));

        // Send custom verification email
        $user->notify(new VerificationWelcomeNotification());

        // Auto-login the user after registration
        Auth::login($user);

        return redirect()->route('verification.notice');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function login(LoginRequest $request): SymfonyResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = Auth::user();

        // If email is not verified, redirect to verification page
        if (! $user->hasVerifiedEmail()) {
            return redirect()->route('verification.notice');
        }

        // Portal and member areas live on their own subdomains, which need a full page visit
        return CrossHostRedirect::to($request, redirect()->intended(HomeUrl::for($user))->getTargetUrl());
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

        if (! app(\App\Services\Access\AccessControl::class)->hasAnywhere($user, 'portal.access')) {
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
    public function logout(Request $request): SymfonyResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Portal users go back to the portal login; everyone else to the public site
        if ($request->getHost() === config('app.admin_domain')) {
            return redirect('/');
        }

        return CrossHostRedirect::to($request, route('home'));
    }
}