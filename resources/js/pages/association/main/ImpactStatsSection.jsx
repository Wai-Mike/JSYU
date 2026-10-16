import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

function useCountUp(target, duration = 2000, start = false) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!start) return undefined;

        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [start, target, duration]);

    return count;
}

export default function ImpactStatsSection() {
    const statsRef = useRef(null);
    const [statsVisible, setStatsVisible] = useState(false);
    const counties = useCountUp(9, 1600, statsVisible);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setStatsVisible(true);
            },
            { threshold: 0.3 },
        );

        if (statsRef.current) observer.observe(statsRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={statsRef} className="border-jsyu-green-soft border-b bg-white">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 py-6 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
                <div className="flex items-center gap-4">
                    <span className="font-display text-jsyu-green text-4xl leading-none font-extrabold sm:text-5xl">{counties}</span>
                    <span className="bg-jsyu-accent h-10 w-1" />
                    <p className="text-jsyu-charcoal text-sm font-bold tracking-[0.16em] uppercase sm:text-base">
                        Counties, one union — <span className="text-jsyu-green">membership is open to the youth of Jonglei</span>
                    </p>
                </div>
                <Link
                    href={route('register')}
                    className="bg-jsyu-green hover:bg-jsyu-green-hover shrink-0 px-6 py-3 text-xs font-bold tracking-[0.14em] text-white uppercase"
                >
                    Join Now
                </Link>
            </div>
        </section>
    );
}
