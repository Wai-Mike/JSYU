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
        <section ref={statsRef} className="bg-jsyu-green-deep">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-4 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-white sm:text-base">
                    Membership is open across all {counties} counties —{' '}
                    <span className="text-jsyu-accent">join the youth of Jonglei</span>
                </p>
                <Link
                    href={route('register')}
                    className="shrink-0 bg-jsyu-accent px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-jsyu-green-deep hover:bg-jsyu-accent-hover"
                >
                    Join Now
                </Link>
            </div>
        </section>
    );
}
