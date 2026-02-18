export default function CTASection() {
    return (
        <section id="contact" className="relative py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-16 sm:px-12 sm:py-20 lg:px-16 lg:py-24">
                    <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style={{ backgroundImage: "url('/images/hero-section.jpeg')" }} />
                    <div className="absolute inset-0 bg-slate-900/90" />
                    <div className="relative z-10 mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Together for a better future
                        </h2>
                        <p className="mt-6 text-lg text-slate-300">
                            The strength of Jonglei State Youth Union comes from the young people who give their time, ideas,
                            and energy. Whether you are a student, community leader, partner organization, or international
                            actor—there is a place for you.
                        </p>
                        <div className="mt-10 flex flex-wrap justify-center gap-4">
                            <a
                                href="mailto:info@jongleiyouthunion.org"
                                className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-sky-400"
                            >
                                Contact the team
                            </a>
                            <a
                                href="/programs"
                                className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/5 px-8 py-3.5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
                            >
                                Discover programs
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
