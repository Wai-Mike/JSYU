export default function HeroSection() {
    return (
        <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-slate-900">
            {/* Background image with overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/images/hero-section.jpeg)' }}
            >
                <div className="absolute inset-0 bg-slate-900/70" />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
                <div className="max-w-3xl">
                   
                    <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Representing youth.{' '}
                        <span className="text-sky-400">Building peace.</span>{' '}
                        Empowering communities.
                    </h1>
                    <p className="mt-6 text-lg leading-relaxed text-slate-300">
                        The Jonglei State Youth Union (JSYI) is the primary representative body for young people in Jonglei
                        State, South Sudan. We advocate for youth representation, peacebuilding dialogues, and
                        access to education and economic opportunities.
                    </p>
                    <div className="mt-10 flex flex-wrap gap-4">
                        <a
                            href="/programs"
                            className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-sky-500/25 transition-all hover:bg-sky-400 hover:shadow-sky-500/30"
                        >
                            Explore Programs
                        </a>
                        <a
                            href="#about"
                            className="inline-flex items-center justify-center rounded-lg border border-slate-500 bg-white/5 px-8 py-3.5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/10 hover:border-slate-400"
                        >
                            Learn About Us
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
        </section>
    );
}
