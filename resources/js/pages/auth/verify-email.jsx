import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Inbox, MailCheck, RefreshCw } from 'lucide-react';
import { useEffect } from 'react';
import AuthShell from '../../components/auth/AuthShell';
import { SubmitButton } from '../../components/auth/FormFields';
import JourneySteps from '../../components/auth/JourneySteps';

const CHECK_EVERY_MS = 8000;

export default function VerifyEmail({ status }) {
    const { auth, flash } = usePage().props;
    const { post, processing } = useForm({});
    const reduceMotion = useReducedMotion();

    // If the link is opened in another tab, reloading this page moves the
    // member straight on to their membership details.
    useEffect(() => {
        const timer = setInterval(() => {
            if (document.visibilityState === 'visible') router.reload({ preserveScroll: true });
        }, CHECK_EVERY_MS);
        return () => clearInterval(timer);
    }, []);

    const resend = (e) => {
        e.preventDefault();
        post(route('auth.verification.send'));
    };

    return (
        <AuthShell eyebrow="Almost there" title="Check your inbox" accent="to continue">
            <Head title="Verify Email - Jonglei State Youth Union" />

            <JourneySteps current={1} />

            <div className="mt-10 text-center">
                <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.2 }}
                    className="bg-jsyu-green-light relative mx-auto flex h-24 w-24 items-center justify-center"
                >
                    {!reduceMotion && <span className="bg-jsyu-accent/30 absolute inset-0 animate-ping" style={{ animationDuration: '2.4s' }} />}
                    <MailCheck className="text-jsyu-green relative h-11 w-11" strokeWidth={1.5} />
                </motion.div>

                <p className="text-jsyu-green mt-8 text-xs font-bold tracking-[0.2em] uppercase">Step 2 · Verify your email</p>
                <h2 className="font-display text-jsyu-green-deep mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                    Confirm your email address
                </h2>
                <span className="bg-jsyu-accent mx-auto mt-3 block h-1 w-14" />
                <p className="text-jsyu-text-muted mx-auto mt-4 max-w-md text-sm font-medium">
                    We sent a confirmation link to{' '}
                    {auth?.user?.email ? <strong className="text-jsyu-charcoal">{auth.user.email}</strong> : 'your email address'}. Open it to
                    continue with your membership details.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-jsyu-green bg-jsyu-green-light text-jsyu-green-deep mt-8 flex items-center gap-3 border-l-4 px-4 py-3 text-sm font-medium"
                >
                    <CheckCircle2 className="text-jsyu-green h-5 w-5 shrink-0" />A new confirmation link has been sent to your email.
                </motion.div>
            )}
            {flash?.error && <div className="mt-8 border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{flash.error}</div>}

            <ol className="border-jsyu-green-soft mt-8 space-y-4 border p-5">
                {[
                    'Open the email from Jonglei State Youth Union.',
                    'Click "Verify email address" in that message.',
                    "You'll come straight back here to finish your membership.",
                ].map((text, i) => (
                    <li key={text} className="flex items-start gap-3 text-sm">
                        <span className="bg-jsyu-accent text-jsyu-green-deep flex h-6 w-6 shrink-0 items-center justify-center text-xs font-bold">
                            {i + 1}
                        </span>
                        <span className="text-jsyu-charcoal pt-0.5">{text}</span>
                    </li>
                ))}
            </ol>

            <div className="text-jsyu-text-muted mt-6 flex items-start gap-3 text-sm">
                <Inbox className="text-jsyu-green-muted mt-0.5 h-5 w-5 shrink-0" />
                <p>
                    <strong className="text-jsyu-charcoal">Can't find it?</strong> Check your spam or promotions folder, or send a new link below.
                </p>
            </div>

            <form onSubmit={resend} className="mt-6">
                <SubmitButton processing={processing} busyLabel="Sending…" className="w-full">
                    <RefreshCw className="h-4 w-4 transition-transform duration-500 group-hover:rotate-180" />
                    Resend confirmation email
                </SubmitButton>
            </form>

            <div className="text-jsyu-text-muted mt-8 flex flex-col items-center gap-3 text-sm sm:flex-row sm:justify-between">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="text-jsyu-green hover:text-jsyu-green-hover font-semibold underline-offset-4 hover:underline"
                >
                    Used the wrong email? Start again
                </Link>
                <a href="mailto:info@jsyu.org" className="text-jsyu-green hover:text-jsyu-green-hover font-semibold underline-offset-4 hover:underline">
                    Contact support
                </a>
            </div>
        </AuthShell>
    );
}
