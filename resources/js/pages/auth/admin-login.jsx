import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminLogin({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <Head title="Admin Login - Jonglei State Youth Union" />

            {/* Left Section - Branding */}
            <div className="relative hidden h-full overflow-hidden lg:flex lg:flex-1">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
                <div className="relative z-10 flex h-full items-center justify-center px-10">
                    <div className="max-w-md text-white">
                        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-red-300">
                            Admin Portal
                        </p>
                        <h1 className="mb-4 text-3xl font-bold sm:text-4xl">
                            Jonglei State Youth Union
                        </h1>
                        <p className="text-sm text-slate-200/80">
                            Secure access for administrators to manage news, programs, and other official communications
                            of the Jonglei State Youth Union.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Section - Admin Login Form */}
            <div className="flex h-full w-full items-center justify-center overflow-y-auto bg-white lg:w-[40%]">
                <div className="w-full max-w-md p-8">
                    {/* Status Message */}
                    {status && (
                        <div className="mb-4 rounded-lg border border-sky-300 bg-sky-500/10 p-3 text-sm text-sky-800">
                            {status}
                        </div>
                    )}

                    {/* Header */}
                    <div className="mb-6">
                        <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-red-500">
                            Admin Access
                        </p>
                        <h2 className="mb-1 text-2xl font-bold text-gray-800">Sign in to admin panel</h2>
                        <p className="text-sm text-gray-500">
                            Only authorized administrators can access this area.
                        </p>
                        <div className="mt-3 h-1 w-12 rounded bg-gradient-to-r from-red-500 to-sky-500" />
                    </div>

                    {/* Form */}
                    <form className="space-y-4" onSubmit={submit}>
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                                Admin email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
                                placeholder="admin@example.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 pr-12 text-sm text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
                                    placeholder="Enter your password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                            />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-xs text-gray-600">
                                <input
                                    id="remember"
                                    name="remember"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 focus:ring-offset-0"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span>Remember this device</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('auth.password.request')}
                                    className="text-xs font-medium text-red-600 hover:text-red-700"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-2 w-full rounded-lg bg-gradient-to-r from-red-600 to-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/30 transition-all hover:from-red-700 hover:to-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    {/* Link back to main site login */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            Need a regular member account?{' '}
                            <Link href={route('login')} className="font-medium text-sky-500 hover:text-sky-600">
                                Go to member login
                            </Link>
                        </p>
                        <div className="mt-2">
                            <Link href={route('home')} className="text-xs text-gray-500 hover:text-sky-500">
                                ← Back to home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

