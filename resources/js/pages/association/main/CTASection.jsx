import { Link } from '@inertiajs/react';

export default function CTASection() {
    return (
        <section id="contact" className="bg-jsyu-green-deep py-20 lg:py-24">
            <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
                <h2 className="font-display text-4xl font-extrabold text-white sm:text-5xl">
                    Your Voice. Your Future. <span className="text-jsyu-accent">Your Community.</span>
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed font-medium text-white/70">
                    Whether you are a student, community leader, partner organisation, or international actor — there is a place for you in the
                    Jonglei State Youth Union.
                </p>
                <div className="mt-9 flex flex-wrap justify-center gap-3">
                    <Link
                        href={route('register')}
                        className="bg-jsyu-accent text-jsyu-green-deep hover:bg-jsyu-accent-hover inline-flex items-center justify-center px-7 py-3.5 text-sm font-bold tracking-[0.14em] uppercase"
                    >
                        Join JSYU
                    </Link>
                    <a
                        href="mailto:info@jsyu.org"
                        className="inline-flex items-center justify-center border border-white/30 px-7 py-3.5 text-sm font-bold tracking-[0.14em] text-white uppercase hover:bg-white/10"
                    >
                        Contact the Team
                    </a>
                    <Link
                        href={route('programs')}
                        className="inline-flex items-center justify-center border border-white/30 px-7 py-3.5 text-sm font-bold tracking-[0.14em] text-white uppercase hover:bg-white/10"
                    >
                        Discover Programs
                    </Link>
                </div>
            </div>
        </section>
    );
}
