import { Link } from '@inertiajs/react';
import { sectionImages } from '../../../constants/sectionImages';

const heroStats = [
    { value: '1.2k+', label: 'Youth engaged & organising' },
    { value: '9', label: 'Counties represented' },
    { value: '7+1', label: 'Core & cross-cutting programs' },
];

export default function HeroSection() {
    return (
        <section className="relative flex min-h-screen items-center overflow-hidden bg-jsyu-green-deep">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${sectionImages.hero}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-jsyu-green-deep/94 via-jsyu-green-deep/78 to-jsyu-green-deep/35" />

            <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-24 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pb-24 lg:pt-28">
                <div className="text-center lg:text-left">
                    <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                        Empowering Youth.{' '}
                        <span className="text-jsyu-accent">Building</span> Communities. Shaping the Future.
                    </h1>

                    <p className="mx-auto mt-6 max-w-xl text-lg font-medium leading-relaxed text-white/75 lg:mx-0">
                        A unified platform for young people across Jonglei State to organise, advocate, and build
                        peaceful, prosperous communities — from Bor to every county and payam — including youth with
                        disabilities represented in our leadership.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                        <Link
                            href={route('register')}
                            className="inline-flex items-center justify-center rounded-full bg-jsyu-accent px-7 py-3.5 text-sm font-bold text-jsyu-green-deep shadow-lg transition-colors hover:bg-jsyu-accent-hover"
                        >
                            Join the Youth Union
                        </Link>
                        <Link
                            href={route('programs')}
                            className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                        >
                            Explore Our Programs
                        </Link>
                    </div>
                </div>

                <div className="hidden flex-col items-end gap-4 lg:flex">
                    {heroStats.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-right backdrop-blur-sm"
                        >
                            <div className="text-3xl font-extrabold text-jsyu-accent">{stat.value}</div>
                            <div className="text-sm font-medium text-white/65">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
                <span className="text-xs text-white/40">Scroll</span>
                <div className="h-8 w-px bg-white/20" />
            </div>
        </section>
    );
}
