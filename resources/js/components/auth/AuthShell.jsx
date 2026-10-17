import { Link } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { sectionImages } from '../../constants/sectionImages';

const counties = ['Akobo', 'Ayod', 'Bor', 'Duk', 'Fangak', 'Nyirol', 'Canal/Pigi', 'Twic East', 'Uror'];

export const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

function BackgroundSlideshow() {
    const [active, setActive] = useState(0);
    const reduceMotion = useReducedMotion();
    const backgrounds = sectionImages.heroSlides;

    useEffect(() => {
        if (reduceMotion) return undefined;
        const timer = setInterval(() => setActive((i) => (i + 1) % backgrounds.length), 6000);
        return () => clearInterval(timer);
    }, [reduceMotion, backgrounds.length]);

    return backgrounds.map((src, i) => (
        <div key={src} className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${i === active ? 'opacity-100' : 'opacity-0'}`}>
            <div
                className={`absolute inset-0 bg-cover bg-center ${i === active ? 'animate-ken-burns' : ''}`}
                style={{ backgroundImage: `url("${encodeURI(src)}")` }}
            />
        </div>
    ));
}

/**
 * Split-screen frame for the sign-up journey: a photo slideshow with the
 * Union's pitch on the left, the current step's content on the right.
 */
export default function AuthShell({
    eyebrow = 'Become a member',
    title = 'Your voice matters',
    accent = 'in Jonglei State',
    panelRef,
    compact = false,
    children,
}) {
    return (
        <div className="bg-jsyu-green-deep flex min-h-screen lg:h-screen lg:overflow-hidden">
            {/* Brand panel */}
            <div className="relative hidden overflow-hidden lg:flex lg:w-[58.75%]">
                <BackgroundSlideshow />
                <div className="from-jsyu-green-deep/95 via-jsyu-green-deep/80 to-jsyu-green-deep/40 absolute inset-0 bg-gradient-to-tr" />
                <div className="bg-jsyu-accent/20 pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full blur-3xl" />

                <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
                    <div className="max-w-xl">
                        <motion.p {...fadeUp(0.1)} className="text-jsyu-accent text-sm font-bold tracking-[0.24em] uppercase">
                            {eyebrow}
                        </motion.p>
                        <motion.h1
                            {...fadeUp(0.2)}
                            className="font-display mt-3 text-4xl leading-[1.05] font-extrabold tracking-tight text-white drop-shadow-lg xl:text-5xl"
                        >
                            {title}
                            <br />
                            <span className="text-jsyu-accent">{accent}</span>
                        </motion.h1>
                    </div>

                    <motion.div {...fadeUp(0.8)}>
                        <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-white/60 uppercase">
                            <MapPin className="text-jsyu-accent h-3.5 w-3.5" />
                            Open to youth in all nine counties · Term 2026/2030
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {counties.map((county) => (
                                <span
                                    key={county}
                                    className="border border-white/15 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white/80 uppercase"
                                >
                                    {county}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Content panel */}
            <div
                ref={panelRef}
                className={`relative flex w-full flex-col bg-white lg:w-[41.25%] ${compact ? 'lg:overflow-hidden' : 'lg:overflow-y-auto'}`}
            >
                {/* Mobile banner */}
                <div className={`relative shrink-0 overflow-hidden lg:hidden ${compact ? 'h-14' : 'h-40'}`}>
                    <BackgroundSlideshow />
                    <div className="from-jsyu-green-deep/90 to-jsyu-green-deep/50 absolute inset-0 bg-gradient-to-t" />
                    <div className={`relative flex h-full justify-between ${compact ? 'items-center px-5' : 'flex-col p-5'}`}>
                        <Link href={route('home')} className="font-display text-sm font-extrabold text-white">
                            JSYU
                        </Link>
                        <p className={`font-display leading-tight font-extrabold text-white ${compact ? 'text-sm' : 'text-2xl'}`}>
                            {title} <span className="text-jsyu-accent">{accent}</span>
                        </p>
                    </div>
                </div>

                <div
                    className={`flex flex-1 justify-center px-5 sm:px-8 lg:px-10 ${compact ? 'items-center py-4 lg:py-3' : 'py-10 lg:py-12'}`}
                >
                    <motion.div {...fadeUp(0.15)} className={`w-full ${compact ? 'max-w-md' : 'max-w-xl'}`}>
                        <Link
                            href={route('home')}
                            className={`text-jsyu-text-muted hover:text-jsyu-green hidden items-center gap-1.5 text-xs font-bold tracking-[0.14em] uppercase transition-colors lg:inline-flex ${compact ? 'mb-1.5' : 'mb-8'}`}
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Back to home
                        </Link>
                        {children}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
