const variants = {
    gray: 'bg-slate-100 text-slate-600',
    green: 'bg-emerald-50 text-emerald-700',
    soft: 'bg-jsyu-green-light text-jsyu-green-deep',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700',
};

/**
 * @param {{
 *   children: import('react').ReactNode,
 *   variant?: keyof typeof variants,
 *   dot?: boolean,
 *   className?: string,
 * }} props
 */
export default function StatusBadge({ children, variant = 'gray', dot = false, className = '' }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5  px-2.5 py-0.5 text-xs font-medium ${variants[variant] ?? variants.gray} ${className}`}
        >
            {dot && (
                <span
                    className={`h-1.5 w-1.5 shrink-0  ${
                        variant === 'green'
                            ? 'bg-emerald-500'
                            : variant === 'amber'
                              ? 'bg-amber-500'
                              : variant === 'red'
                                ? 'bg-red-500'
                                : variant === 'soft'
                                  ? 'bg-jsyu-green'
                                  : 'bg-slate-400'
                    }`}
                />
            )}
            {children}
        </span>
    );
}
