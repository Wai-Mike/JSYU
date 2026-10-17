import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { sectionImages } from '../../constants/sectionImages';

const inputClass =
    'w-full border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-jsyu-charcoal transition-colors placeholder:text-slate-400 focus:border-jsyu-green focus:ring-1 focus:ring-jsyu-green focus:outline-none';

export default function Login({ status, canResetPassword }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const alert = flash?.error || status;
    const isError = Boolean(flash?.error);

    return (
        <div className="bg-jsyu-green-deep flex min-h-screen lg:h-screen lg:overflow-hidden">
            <Head title="Login - Jonglei State Youth Union" />

            {/* Brand panel */}
            <div className="relative hidden overflow-hidden lg:block lg:w-[58.75%]">
                <img src={sectionImages.hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="from-jsyu-green-deep via-jsyu-green-deep/70 to-jsyu-green-deep/30 absolute inset-0 bg-gradient-to-t" />

                <div className="relative flex h-full flex-col justify-end p-10 xl:p-14">
                    <div className="max-w-md">
                        <span className="bg-jsyu-gold block h-1 w-12" />
                        <h2 className="font-display mt-5 text-4xl leading-tight font-extrabold text-white xl:text-5xl">Jonglei State Youth Union</h2>
                        <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-white/60 uppercase">Unity · Peace · Opportunity</p>
                    </div>
                </div>
            </div>

            {/* Form panel */}
            <div className="relative flex w-full flex-col bg-white lg:w-[41.25%] lg:overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-3 lg:border-b-0 lg:px-10 lg:pt-4">
                    <Link href={route('home')} className="font-display text-jsyu-green-deep text-sm font-bold lg:invisible">
                        JSYU
                    </Link>
                    <Link href={route('home')} className="hover:text-jsyu-green text-xs font-semibold text-slate-500">
                        ← Back to home
                    </Link>
                </div>

                <div className="flex flex-1 items-center justify-center px-5 py-4 sm:px-8 lg:px-10 lg:py-3">
                    <div className="w-full max-w-sm">
                        <h1 className="font-display text-jsyu-green-deep text-2xl font-extrabold">Sign in</h1>
                        <span className="bg-jsyu-accent mt-2 block h-0.5 w-10" />

                        {alert && (
                            <div
                                className={`mt-4 border-l-4 px-4 py-3 text-sm font-medium ${
                                    isError ? 'border-red-500 bg-red-50 text-red-700' : 'border-jsyu-green bg-jsyu-green-light text-jsyu-green-deep'
                                }`}
                            >
                                {alert}
                            </div>
                        )}

                        <a
                            href={route('auth.google', { remember: data.remember ? 1 : 0 })}
                            className="text-jsyu-charcoal hover:border-jsyu-green hover:bg-jsyu-green-light focus:ring-jsyu-green mt-5 flex w-full items-center justify-center gap-3 border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold transition-colors focus:ring-1 focus:outline-none"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continue with Google
                        </a>

                        <div className="my-4 flex items-center gap-3">
                            <span className="h-px flex-1 bg-slate-200" />
                            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Or with email</span>
                            <span className="h-px flex-1 bg-slate-200" />
                        </div>

                        <form className="space-y-3" onSubmit={submit}>
                            <div>
                                <label htmlFor="email" className="text-jsyu-charcoal mb-1 block text-sm font-semibold">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    autoFocus
                                    className={inputClass}
                                    placeholder="you@example.com"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
                            </div>

                            <div>
                                <div className="mb-1 flex items-center justify-between">
                                    <label htmlFor="password" className="text-jsyu-charcoal block text-sm font-semibold">
                                        Password
                                    </label>
                                    {canResetPassword && (
                                        <Link
                                            href={route('auth.password.request')}
                                            className="text-jsyu-green hover:text-jsyu-green-hover text-xs font-semibold"
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        required
                                        className={`${inputClass} pr-16`}
                                        placeholder="Enter your password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="hover:text-jsyu-green absolute inset-y-0 right-0 px-3.5 text-xs font-semibold text-slate-500 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>}
                            </div>

                            <label htmlFor="remember" className="flex cursor-pointer items-center gap-2">
                                <input
                                    id="remember"
                                    name="remember"
                                    type="checkbox"
                                    className="accent-jsyu-green h-4 w-4 border-slate-300"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span className="text-sm font-medium text-slate-600">Remember me</span>
                            </label>

                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-jsyu-green hover:bg-jsyu-green-hover focus:ring-jsyu-green/30 w-full px-4 py-2.5 text-sm font-bold tracking-wide text-white uppercase transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? 'Signing in...' : 'Sign in'}
                            </button>
                        </form>

                        <p className="mt-4 text-sm text-slate-600">
                            New to the Union?{' '}
                            <Link href={route('register')} className="text-jsyu-green hover:text-jsyu-green-hover font-bold">
                                Create an account →
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
