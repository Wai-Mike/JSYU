import { Eye, EyeOff } from 'lucide-react';

const inputBase =
    'w-full border border-jsyu-green-soft bg-jsyu-green-light/40 py-3 pr-4 text-jsyu-charcoal transition-all placeholder:text-jsyu-text-muted/60 focus:border-jsyu-green focus:bg-white focus:ring-4 focus:ring-jsyu-green/10 focus:outline-none';

/** Input with room for a leading icon. */
export const inputClass = `${inputBase} pl-11`;
/** Slightly shorter icon input for screens that must fit without scrolling. */
export const compactInputClass = inputClass.replace('py-3', 'py-2');
/** Input without an icon. */
export const plainInputClass = `${inputBase} pl-4`;

export function Label({ htmlFor, children, optional }) {
    return (
        <label
            htmlFor={htmlFor}
            className="text-jsyu-charcoal mb-1 flex items-baseline justify-between text-xs font-bold tracking-[0.12em] uppercase"
        >
            {children}
            {optional && <span className="text-jsyu-text-muted text-[10px] font-semibold tracking-normal normal-case">Optional</span>}
        </label>
    );
}

export function FieldError({ message }) {
    return message ? <p className="mt-1.5 text-xs font-medium text-red-600">{message}</p> : null;
}

export function Field({ id, label, icon: Icon, error, optional, hint, children }) {
    return (
        <div>
            <Label htmlFor={id} optional={optional}>
                {label}
            </Label>
            <div className="relative">
                {Icon && <Icon className="text-jsyu-text-muted/70 pointer-events-none absolute top-1/2 left-4 z-10 h-4 w-4 -translate-y-1/2" />}
                {children}
            </div>
            {hint && !error && <p className="text-jsyu-text-muted mt-1.5 text-xs">{hint}</p>}
            <FieldError message={error} />
        </div>
    );
}

export function PasswordToggle({ show, onToggle }) {
    return (
        <button
            type="button"
            className="text-jsyu-text-muted hover:text-jsyu-green absolute inset-y-0 right-0 flex items-center px-4 transition-colors"
            onClick={onToggle}
            aria-label={show ? 'Hide password' : 'Show password'}
        >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
    );
}

export function SubmitButton({ processing, busyLabel, children, className = '' }) {
    return (
        <button
            type="submit"
            disabled={processing}
            className={`group bg-jsyu-green hover:bg-jsyu-green-hover focus:ring-jsyu-green/30 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-bold tracking-[0.14em] text-white uppercase transition-all hover:shadow-lg focus:ring-4 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        >
            {processing ? (
                <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    {busyLabel}
                </>
            ) : (
                children
            )}
        </button>
    );
}

export function GoogleButton({ label = 'Continue with Google', className = '' }) {
    return (
        <a
            href={route('auth.google')}
            className={`border-jsyu-green-soft text-jsyu-charcoal hover:border-jsyu-green focus:ring-jsyu-green/10 flex w-full items-center justify-center gap-3 border bg-white px-4 py-3 text-sm font-semibold transition-all hover:shadow-md focus:ring-4 focus:outline-none ${className}`}
        >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
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
            {label}
        </a>
    );
}

export function Divider({ children }) {
    return (
        <div className="flex items-center gap-4">
            <span className="bg-jsyu-green-soft h-px flex-1" />
            <span className="text-jsyu-text-muted text-xs font-bold tracking-[0.16em] uppercase">{children}</span>
            <span className="bg-jsyu-green-soft h-px flex-1" />
        </div>
    );
}
