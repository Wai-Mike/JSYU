import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

/**
 * @param {{ items: Array<{ label: string, href?: string }> }} props
 */
export default function Breadcrumbs({ items = [] }) {
    if (!items.length) return null;

    return (
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm text-slate-500">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <span key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1.5">
                        {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />}
                        {item.href && !isLast ? (
                            <Link href={item.href} className="hover:text-jsyu-green truncate">
                                {item.label}
                            </Link>
                        ) : (
                            <span className={`truncate ${isLast ? 'font-medium text-slate-700' : ''}`}>{item.label}</span>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}
