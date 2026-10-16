import { Link } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';

const variants = {
    primary: 'bg-jsyu-green text-white  hover:bg-jsyu-green-hover',
    secondary: 'border border-slate-200 bg-white text-slate-700  hover:bg-slate-50',
    danger: 'bg-red-600 text-white  hover:bg-red-700',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
};

/**
 * @param {{ variant?: keyof typeof variants, size?: 'sm' | 'md', href?: string, loading?: boolean }} props
 */
export default function Button({ variant = 'primary', size = 'md', href, loading = false, className = '', children, ...props }) {
    const classes = `inline-flex items-center justify-center gap-1.5  font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-jsyu-green/40 disabled:cursor-not-allowed disabled:opacity-50 ${
        size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
    } ${variants[variant] ?? variants.primary} ${className}`;

    if (href) {
        return (
            <Link href={href} className={classes} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button type="button" {...props} disabled={loading || props.disabled} className={classes}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
}
