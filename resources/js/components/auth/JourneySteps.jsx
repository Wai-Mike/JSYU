import { Check } from 'lucide-react';

/** The whole membership sign-up journey, shown on every step of it. */
export const JOURNEY = ['Account', 'Verify email', 'Personal', 'Contact & home', 'About & privacy'];

/**
 * Progress tracker for the sign-up journey. Completed steps listed in
 * `selectable` can be clicked to go back to them.
 */
export default function JourneySteps({ current, selectable = [], onSelect }) {
    return (
        <ol className="flex items-start" aria-label="Membership sign-up progress">
            {JOURNEY.map((title, i) => {
                const done = i < current;
                const active = i === current;
                const canSelect = done && selectable.includes(i);
                return (
                    <li key={title} className="relative flex flex-1 flex-col items-center">
                        {i > 0 && (
                            <span className="bg-jsyu-green-soft absolute top-4 right-1/2 h-0.5 w-full -translate-y-1/2">
                                <span className={`bg-jsyu-green block h-full transition-all duration-500 ${i <= current ? 'w-full' : 'w-0'}`} />
                            </span>
                        )}
                        <button
                            type="button"
                            disabled={!canSelect}
                            onClick={() => onSelect?.(i)}
                            aria-current={active ? 'step' : undefined}
                            aria-label={`${title}${done ? ' (done)' : ''}`}
                            className={`relative z-10 flex h-8 w-8 items-center justify-center text-xs font-bold transition-all duration-300 ${
                                done
                                    ? `bg-jsyu-green text-white ${canSelect ? 'hover:bg-jsyu-green-hover cursor-pointer' : 'cursor-default'}`
                                    : active
                                      ? 'bg-jsyu-accent text-jsyu-green-deep ring-jsyu-accent/30 scale-110 ring-4'
                                      : 'border-jsyu-green-soft text-jsyu-text-muted border bg-white'
                            }`}
                        >
                            {done ? <Check className="h-4 w-4" /> : i + 1}
                        </button>
                        <span
                            className={`mt-2 hidden text-center text-[10px] leading-tight font-bold tracking-wide uppercase sm:block ${
                                active ? 'text-jsyu-green-deep' : 'text-jsyu-text-muted'
                            }`}
                        >
                            {title}
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}
