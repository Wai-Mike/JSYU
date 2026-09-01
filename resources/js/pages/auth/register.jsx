import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { sectionImages } from '../../constants/sectionImages';

const joinBenefits = [
    'Connect with youth from all 9 counties of Jonglei',
    'Access programs, forums, and volunteer opportunities',
    'Share updates and join community conversations',
    'Stand with Nuer, Dinka, and Anyuak youth for unity and peace',
];

function PasswordToggle({ show, onToggle, label }) {
    return (
        <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-jsyu-text-muted transition-colors hover:text-jsyu-green"
            onClick={onToggle}
            aria-label={label}
        >
            {show ? (
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
    );
}

function FieldError({ message }) {
    if (!message) return null;
    return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

const inputClass =
    'w-full rounded-lg border border-jsyu-green-soft bg-white px-4 py-2.5 text-jsyu-charcoal transition-colors placeholder:text-jsyu-text-muted/60 focus:border-jsyu-green focus:ring-2 focus:ring-jsyu-green/20 focus:outline-none';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const handleGoogleLogin = () => {
        setIsGoogleLoading(true);
        window.location.href = route('auth.google');
    };

    return (
        <div className="flex min-h-screen">
            <Head title="Join the Union - Jonglei State Youth Union" />

            {/* Brand panel */}
            <div className="relative hidden overflow-hidden bg-jsyu-green-deep lg:flex lg:w-[52%]">
                <img
                    src={sectionImages.news[0]}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-jsyu-green-deep/95 via-jsyu-green-deep/88 to-jsyu-green/45" />

                <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
                    <Link href={route('home')} className="flex items-center gap-3">
                        <img
                            src={sectionImages.logo}
                            alt="Jonglei State Youth Union"
                            className="h-14 w-14 object-contain"
                        />
                        <div>
                            <p className="text-sm font-bold text-white">JSYU</p>
                            <p className="text-xs text-white/70">Jonglei State Youth Union</p>
                        </div>
                    </Link>

                    <div className="max-w-lg">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-jsyu-accent">
                            Join the Union
                        </p>
                        <h1 className="mt-3 text-3xl font-extrabold leading-tight text-white xl:text-4xl">
                            Your voice matters in Jonglei State
                        </h1>
                        <p className="mt-4 text-base font-medium leading-relaxed text-white/75">
                            Become part of the Jonglei State Youth Union and help shape peace, opportunity,
                            and leadership for young people across our state.
                        </p>

                        <ul className="mt-8 space-y-3">
                            {joinBenefits.map((item) => (
                                <li key={item} className="flex items-start gap-3 text-sm font-medium text-white/85">
                                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-jsyu-accent" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <p className="text-xs font-medium text-white/50">
                        Open to youth across Jonglei · Term 2026/2030
                    </p>
                </div>
            </div>

            {/* Register form */}
            <div className="flex w-full flex-col bg-jsyu-green-light lg:w-[48%]">
                <div className="flex justify-end p-6 lg:hidden">
                    <Link href={route('home')} className="flex items-center gap-2">
                        <img src={sectionImages.logo} alt="JSYU" className="h-10 w-10 object-contain" />
                        <span className="text-sm font-bold text-jsyu-green-deep">JSYU</span>
                    </Link>
                </div>

                <div className="flex flex-1 items-center justify-center px-6 pb-10 lg:overflow-y-auto lg:px-12 lg:py-10">
                    <div className="w-full max-w-md rounded-2xl border border-jsyu-green-soft bg-white p-8 shadow-sm">
                        <div className="mb-6">
                            <h2 className="text-2xl font-extrabold text-jsyu-green-deep">Join the Youth Union</h2>
                            <p className="mt-1 text-sm font-medium text-jsyu-text-muted">
                                Create your account and get involved in JSYU programs and activities
                            </p>
                        </div>

                        <form className="space-y-4" onSubmit={submit}>
                            <div>
                                <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-jsyu-charcoal">
                                    Full name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    className={inputClass}
                                    placeholder="Enter your full name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                <FieldError message={errors.name} />
                            </div>

                            <div>
                                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-jsyu-charcoal">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className={inputClass}
                                    placeholder="you@example.com"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <FieldError message={errors.email} />
                            </div>

                            <div>
                                <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-jsyu-charcoal">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        required
                                        className={`${inputClass} pr-12`}
                                        placeholder="Create a strong password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <PasswordToggle
                                        show={showPassword}
                                        onToggle={() => setShowPassword(!showPassword)}
                                        label={showPassword ? 'Hide password' : 'Show password'}
                                    />
                                </div>
                                <FieldError message={errors.password} />
                            </div>

                            <div>
                                <label
                                    htmlFor="password_confirmation"
                                    className="mb-1.5 block text-sm font-semibold text-jsyu-charcoal"
                                >
                                    Confirm password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        required
                                        className={`${inputClass} pr-12`}
                                        placeholder="Confirm your password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                    />
                                    <PasswordToggle
                                        show={showConfirmPassword}
                                        onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                                        label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                    />
                                </div>
                                <FieldError message={errors.password_confirmation} />
                            </div>

                            <div className="flex items-start gap-2 pt-1">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    required
                                    className="mt-0.5 h-4 w-4 rounded border-jsyu-green-soft text-jsyu-green focus:ring-jsyu-green/30"
                                    checked={data.terms}
                                    onChange={(e) => setData('terms', e.target.checked)}
                                />
                                <label htmlFor="terms" className="text-sm font-medium text-jsyu-text-muted">
                                    I agree to participate respectfully in JSYU activities and community guidelines.
                                </label>
                            </div>
                            <FieldError message={errors.terms} />

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-lg bg-jsyu-green px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-jsyu-green-hover focus:ring-2 focus:ring-jsyu-green/30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? 'Creating account...' : 'Join the Union'}
                            </button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-jsyu-green-soft" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 font-medium text-jsyu-text-muted">Or continue with</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={isGoogleLoading}
                            className="flex w-full items-center justify-center rounded-lg border border-jsyu-green-soft bg-white px-4 py-2.5 text-sm font-semibold text-jsyu-charcoal transition-colors hover:bg-jsyu-green-light focus:ring-2 focus:ring-jsyu-green/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isGoogleLoading ? (
                                <>
                                    <svg className="mr-3 h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    Continue with Google
                                </>
                            )}
                        </button>

                        <p className="mt-6 text-center text-sm text-jsyu-text-muted">
                            Already have an account?{' '}
                            <Link href={route('login')} className="font-bold text-jsyu-green hover:text-jsyu-green-hover">
                                Sign in
                            </Link>
                        </p>

                        <div className="mt-4 text-center">
                            <Link href={route('home')} className="text-xs font-semibold text-jsyu-green hover:text-jsyu-green-hover">
                                ← Back to home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
