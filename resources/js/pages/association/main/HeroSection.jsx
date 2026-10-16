import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { sectionImages } from '../../../constants/sectionImages';

export default function HeroSection() {
    return (
        <section className="relative flex min-h-[72vh] items-center overflow-hidden bg-jsyu-green-light lg:min-h-[78vh]">
            <div
                className="animate-fade-in absolute inset-0 bg-cover bg-[center_20%] bg-no-repeat grayscale"
                style={{ backgroundImage: `url('${sectionImages.hero}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/55 to-white/80" />

            <div className="relative mx-auto w-full max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-32">
                <p className="animate-fade-up font-display text-sm font-bold uppercase tracking-[0.28em] text-jsyu-green">
                    Jonglei State Youth Union
                </p>
                <h1 className="animate-fade-up-delay mt-4 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-jsyu-green-deep sm:text-6xl lg:text-7xl">
                    Empowering Youth
                    <br />
                    Takes Many Forms
                </h1>
                <p className="animate-fade-up-delay-2 mx-auto mt-5 max-w-xl text-base font-medium text-jsyu-text-muted sm:text-lg">
                    A unified platform for young people across Jonglei to organise, advocate, and build peaceful
                    communities.
                </p>
                <div className="animate-fade-up-delay-2 mt-8">
                    <Link
                        href={route('programs')}
                        className="inline-flex items-center gap-2 bg-jsyu-accent px-7 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-jsyu-green-deep hover:bg-jsyu-accent-hover"
                    >
                        View Programs
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
