import { Link } from '@inertiajs/react';

export default function CTASection() {
    return (
        <section id="contact" className="relative overflow-hidden bg-jsyu-green-deep py-24">
            <div className="absolute inset-0 bg-gradient-to-br from-jsyu-green-deep via-jsyu-green-deep to-jsyu-green/80" />
            <div className="pointer-events-none absolute inset-0 opacity-10">
                <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-jsyu-accent blur-3xl" />
                <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-jsyu-green blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
                <h2 className="text-4xl font-extrabold text-white lg:text-5xl">
                    Your Voice. Your Future. <span className="text-jsyu-accent">Your Community.</span>
                </h2>
                <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/75">
                    The strength of Jonglei State Youth Union comes from the young people who give their time, ideas,
                    and energy. Whether you are a student, community leader, partner organization, or international
                    actor — there is a place for you.
                </p>
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                    <Link
                        href={route('register')}
                        className="inline-flex items-center justify-center rounded-full bg-jsyu-accent px-8 py-3.5 text-base font-bold text-jsyu-green-deep shadow-lg transition-colors hover:bg-jsyu-accent-hover"
                    >
                        Join JSYU
                    </Link>
                    <a
                        href="mailto:info@jongleiyouthunion.org"
                        className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-base font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                    >
                        Contact the team
                    </a>
                    <Link
                        href={route('programs')}
                        className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-base font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                    >
                        Discover programs
                    </Link>
                </div>
            </div>
        </section>
    );
}
