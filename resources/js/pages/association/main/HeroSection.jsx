import { Link } from '@inertiajs/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { sectionImages } from '../../../constants/sectionImages';

const SLIDE_DURATION = 7000;

const slides = [
    {
        image: sectionImages.heroSlides[0],
        position: 'center 35%',
        eyebrow: 'Jonglei State Youth Union',
        title: ['Empowering Youth', 'Takes Many Forms'],
        text: 'A unified platform for young people across Jonglei to organise, advocate, and build peaceful communities.',
    },
    {
        image: sectionImages.heroSlides[1],
        position: 'center 30%',
        eyebrow: 'Leadership',
        title: ['Led by Youth,', 'For the Youth'],
        text: 'Committed leaders representing every county, working to give young people a voice in decisions that shape their future.',
    },
    {
        image: sectionImages.heroSlides[2],
        position: 'center 20%',
        eyebrow: 'Partnerships',
        title: ['Building Bridges', 'Across Jonglei'],
        text: 'Working hand in hand with government, partners, and communities to open doors for young people.',
    },
    {
        image: sectionImages.heroSlides[3],
        position: 'center 40%',
        eyebrow: 'Community',
        title: ['Together for', 'Lasting Peace'],
        text: 'Uniting young people across communities through dialogue, service, and shared opportunity.',
    },
];

export default function HeroSection() {
    const [active, setActive] = useState(0);
    const [previous, setPrevious] = useState(null);
    const [paused, setPaused] = useState(false);
    const touchStartX = useRef(null);

    const goTo = useCallback(
        (index) => {
            const next = (index + slides.length) % slides.length;
            if (next === active) return;
            setPrevious(active);
            setActive(next);
        },
        [active],
    );

    const nextSlide = () => goTo(active + 1);
    const prevSlide = () => goTo(active - 1);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    };

    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 50) (delta < 0 ? nextSlide : prevSlide)();
        touchStartX.current = null;
    };

    const slide = slides[active];

    return (
        <section
            className="group bg-jsyu-green-deep relative flex min-h-[72vh] items-center overflow-hidden lg:min-h-[85vh]"
            aria-roledescription="carousel"
            aria-label="Highlights"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
            onTouchEnd={handleTouchEnd}
        >
            {/* Slides: active fades in on top; previous keeps its zoom while fading out */}
            {slides.map((s, i) => {
                const isActive = i === active;
                const isPrevious = i === previous;
                return (
                    <div
                        key={s.image}
                        aria-hidden={!isActive}
                        className={`absolute inset-0 overflow-hidden transition-opacity duration-[1400ms] ease-in-out ${
                            isActive ? 'z-[2] opacity-100' : isPrevious ? 'z-[1] opacity-0' : 'z-0 opacity-0'
                        }`}
                    >
                        <div
                            className={`absolute inset-0 bg-cover bg-no-repeat will-change-transform ${
                                isActive || isPrevious ? 'animate-ken-burns' : ''
                            }`}
                            style={{ backgroundImage: `url("${encodeURI(s.image)}")`, backgroundPosition: s.position }}
                        />
                    </div>
                );
            })}

            {/* Overlays */}
            <div className="from-jsyu-green-deep/70 via-jsyu-green-deep/45 to-jsyu-green-deep/90 absolute inset-0 z-[3] bg-gradient-to-b" />
            <div className="absolute inset-0 z-[3] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.35)_0%,transparent_70%)]" />

            {/* Content — keyed so the entrance animation replays on every slide */}
            <div key={active} className="relative z-[4] mx-auto w-full max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-32">
                <p className="animate-fade-up font-display text-jsyu-accent text-sm font-bold tracking-[0.28em] uppercase">{slide.eyebrow}</p>
                <h1 className="animate-fade-up-delay font-display mt-4 text-5xl leading-[1.05] font-extrabold tracking-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl">
                    {slide.title[0]}
                    <br />
                    {slide.title[1]}
                </h1>
                <p className="animate-fade-up-delay-2 mx-auto mt-5 max-w-xl text-base font-medium text-white/90 drop-shadow sm:text-lg">
                    {slide.text}
                </p>
                <div className="animate-fade-up-delay-2 mt-8">
                    <Link
                        href={route('programs')}
                        className="bg-jsyu-accent text-jsyu-green-deep hover:bg-jsyu-accent-hover inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold tracking-[0.14em] uppercase"
                    >
                        View Programs
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>

            {/* Arrows */}
            <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous slide"
                className="hover:text-jsyu-green-deep absolute top-1/2 left-3 z-[5] hidden -translate-y-1/2 border border-white/30 bg-white/10 p-3 text-white opacity-0 backdrop-blur-sm group-hover:opacity-100 hover:bg-white focus-visible:opacity-100 sm:block lg:left-6"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>
            <button
                type="button"
                onClick={nextSlide}
                aria-label="Next slide"
                className="hover:text-jsyu-green-deep absolute top-1/2 right-3 z-[5] hidden -translate-y-1/2 border border-white/30 bg-white/10 p-3 text-white opacity-0 backdrop-blur-sm group-hover:opacity-100 hover:bg-white focus-visible:opacity-100 sm:block lg:right-6"
            >
                <ChevronRight className="h-5 w-5" />
            </button>

            {/* Progress indicators — the active bar's animation end advances the slider */}
            <div className="absolute bottom-6 left-1/2 z-[5] flex -translate-x-1/2 gap-2 sm:bottom-8">
                {slides.map((s, i) => (
                    <button
                        key={s.image}
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        aria-current={i === active}
                        className="relative h-1 w-10 overflow-hidden bg-white/30 hover:bg-white/50 sm:w-14"
                    >
                        {i === active && (
                            <span
                                key={active}
                                className="animate-slide-progress bg-jsyu-accent absolute inset-0"
                                style={{
                                    '--slide-duration': `${SLIDE_DURATION}ms`,
                                    animationPlayState: paused ? 'paused' : 'running',
                                }}
                                onAnimationEnd={nextSlide}
                            />
                        )}
                    </button>
                ))}
            </div>
        </section>
    );
}
