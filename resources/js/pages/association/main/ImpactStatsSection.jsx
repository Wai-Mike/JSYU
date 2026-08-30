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

function StatCard({ value, suffix, label, start, animate = true }) {
    const numericValue = typeof value === 'number' ? value : null;
    const count = useCountUp(numericValue ?? 0, 2000, start && animate && numericValue !== null);

    const displayValue =
        numericValue !== null ? `${count.toLocaleString()}${suffix}` : `${value}${suffix ?? ''}`;

    return (
        <div className="text-center">
            <div className="text-4xl font-extrabold text-jsyu-green lg:text-5xl">{displayValue}</div>
            <div className="mt-1 text-sm font-semibold text-jsyu-text-muted">{label}</div>
        </div>
    );
}

const stats = [
    { value: 9, suffix: '', label: 'Counties represented', animate: true },
    { value: '7+1', suffix: '', label: 'Core & cross-cutting programs', animate: false },
    { value: '1.2k', suffix: '+', label: 'Youth engaged & organising', animate: false },
];

export default function ImpactStatsSection() {
    const statsRef = useRef(null);
    const [statsVisible, setStatsVisible] = useState(false);

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
        <section ref={statsRef} className="border-b border-jsyu-green-soft bg-white py-16">
            <div className="mx-auto max-w-5xl px-4 sm:px-6">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:gap-12">
                    {stats.map((stat) => (
                        <StatCard
                            key={stat.label}
                            value={stat.value}
                            suffix={stat.suffix}
                            label={stat.label}
                            start={statsVisible}
                            animate={stat.animate}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
