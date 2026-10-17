import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import AuthShell from '../../components/auth/AuthShell';
import { Divider, Field, GoogleButton, PasswordToggle, SubmitButton, compactInputClass } from '../../components/auth/FormFields';

function passwordStrength(value) {
    if (!value) return { score: 0, label: '' };
    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    const s = Math.max(score, 1);
    return { score: s, label: ['', 'Weak', 'Fair', 'Good', 'Strong'][s] };
}

const strengthColors = ['', 'bg-red-500', 'bg-jsyu-gold', 'bg-jsyu-accent', 'bg-jsyu-green'];

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const strength = passwordStrength(data.password);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), { onFinish: () => reset('password') });
    };

    return (
        <AuthShell compact>
            <Head title="Become a Member - Jonglei State Youth Union" />

            <h2 className="font-display text-jsyu-green-deep text-xl font-extrabold tracking-tight sm:text-2xl">Join the Youth Union</h2>
            <p className="text-jsyu-text-muted mt-0.5 text-sm font-medium">Create your account — we'll email you a link to confirm it.</p>

            <div className="mt-3 space-y-2.5">
                <GoogleButton label="Sign up with Google" className="!py-2.5" />
                <Divider>or with email</Divider>
            </div>

            <form className="mt-3 space-y-2.5" onSubmit={submit}>
                <div className="grid grid-cols-2 gap-2.5">
                    <Field id="first_name" label="First name" icon={User} error={errors.first_name}>
                        <input
                            id="first_name"
                            type="text"
                            autoComplete="given-name"
                            required
                            maxLength={80}
                            className={compactInputClass}
                            placeholder="Nyandeng"
                            value={data.first_name}
                            onChange={(e) => setData('first_name', e.target.value)}
                        />
                    </Field>
                    <Field id="last_name" label="Last name" icon={User} error={errors.last_name}>
                        <input
                            id="last_name"
                            type="text"
                            autoComplete="family-name"
                            required
                            maxLength={80}
                            className={compactInputClass}
                            placeholder="Mabior"
                            value={data.last_name}
                            onChange={(e) => setData('last_name', e.target.value)}
                        />
                    </Field>
                </div>

                <Field id="email" label="Email address" icon={Mail} error={errors.email}>
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        required
                        className={compactInputClass}
                        placeholder="you@example.com"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                </Field>

                <div>
                    <Field id="password" label="Password" icon={Lock} error={errors.password}>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            required
                            minLength={5}
                            className={`${compactInputClass} pr-12`}
                            placeholder="At least 5 characters"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                    </Field>
                    {/* Fixed height so the layout doesn't jump while typing */}
                    <div className="mt-1 flex h-3 items-center gap-3" aria-live="polite">
                        {data.password && (
                            <>
                                <div className="flex flex-1 gap-1">
                                    {[1, 2, 3, 4].map((s) => (
                                        <span
                                            key={s}
                                            className={`h-1 flex-1 transition-colors duration-300 ${s <= strength.score ? strengthColors[strength.score] : 'bg-jsyu-green-soft'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-jsyu-text-muted w-12 text-right text-[11px] font-semibold">{strength.label}</span>
                            </>
                        )}
                    </div>
                </div>

                <SubmitButton processing={processing} busyLabel="Creating account…" className="w-full !py-2.5">
                    Create account
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </SubmitButton>

                <p className="text-jsyu-text-muted text-center text-[11px] leading-snug">
                    By creating an account you agree to take part respectfully and follow the JSYU community guidelines.
                </p>
            </form>

            <p className="text-jsyu-text-muted mt-3 text-center text-sm">
                Already a member?{' '}
                <Link href={route('login')} className="text-jsyu-green hover:text-jsyu-green-hover font-bold underline-offset-4 hover:underline">
                    Sign in
                </Link>
            </p>
        </AuthShell>
    );
}
