import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { sectionImages } from '../../constants/sectionImages';

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

    const fieldClass =
        'w-full  border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-jsyu-green focus:bg-white focus:ring-2 focus:ring-jsyu-green/20 focus:outline-none';

    return (
        <div className="flex h-screen overflow-hidden">
            <Head title="Portal Sign In - Jonglei State Youth Union" />

            <div className="relative hidden h-full overflow-hidden lg:flex lg:flex-1">
                <div className="absolute inset-0 bg-gradient-to-br from-admin-sidebar via-jsyu-green-deep to-jsyu-green" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(125,183,54,0.25),transparent_55%)]" />
                <div className="relative z-10 flex h-full flex-col justify-between px-10 py-12">
                    <div className="flex items-center gap-3">
                        <img src={sectionImages.logo} alt="JSYU" className="h-10 w-10 object-contain" />
                        <div>
                            <p className="text-sm font-bold text-white">JSYU Portal</p>
                            <p className="text-xs text-white/60">Members & officials</p>
                        </div>
                    </div>
                    <div className="max-w-md text-white">
                        <p className="mb-2 text-sm font-semibold tracking-[0.18em] text-jsyu-accent uppercase">
                            Member & Management Portal
                        </p>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Jonglei State Youth Union
                        </h1>
                    </div>
                    <p className="text-xs text-white/40">Members and officials of the Union</p>
                </div>
            </div>

            <div className="flex h-full w-full items-center justify-center overflow-y-auto bg-admin-canvas lg:w-[42%]">
                <div className="w-full max-w-md p-8">
                    <div className="mb-8 flex items-center gap-3 lg:hidden">
                        <img src={sectionImages.logo} alt="JSYU" className="h-9 w-9 object-contain" />
                        <div>
                            <p className="text-sm font-bold text-jsyu-green-deep">JSYU Portal</p>
                            <p className="text-xs text-slate-500">Members & officials</p>
                        </div>
                    </div>

                    {status && (
                        <div className="mb-4 border border-jsyu-green-soft bg-jsyu-green-light p-3 text-sm text-jsyu-green-deep">
                            {status}
                        </div>
                    )}

                    <div className="mb-6">
                        <p className="mb-1 text-xs font-semibold tracking-[0.18em] text-jsyu-green uppercase">
                            Portal access
                        </p>
                        <h2 className="mb-1 text-2xl font-bold text-slate-900">Sign in to the portal</h2>
                        <p className="text-sm text-slate-500">
                            Members reach their membership area; officials also see the management tools.
                        </p>
                        <div className="mt-3 h-1 w-12 bg-jsyu-green" />
                    </div>

                    <form className="space-y-4" onSubmit={submit}>
                        <div>
                            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className={fieldClass}
                                placeholder="you@example.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    className={`${fieldClass} pr-12`}
                                    placeholder="Enter your password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
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
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
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

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-xs text-slate-600">
                                <input
                                    id="remember"
                                    name="remember"
                                    type="checkbox"
                                    className="h-4 w-4 border-slate-300 text-jsyu-green focus:ring-jsyu-green focus:ring-offset-0"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span>Remember this device</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('auth.password.request')}
                                    className="text-xs font-medium text-jsyu-green hover:text-jsyu-green-hover"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-2 w-full bg-jsyu-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-jsyu-green-hover focus:ring-2 focus:ring-jsyu-green focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-slate-500">
                            Need a regular member account?{' '}
                            <a
                                href={new URL('/login', route('home')).href}
                                className="font-medium text-jsyu-green hover:text-jsyu-green-hover"
                            >
                                Go to member login
                            </a>
                        </p>
                        <div className="mt-2">
                            <a href={route('home')} className="text-xs text-slate-500 hover:text-jsyu-green">
                                ← Back to home
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
