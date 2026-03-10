export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-slate-950">
            {/* Subtle background tint */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950" />

            <div className="relative mx-auto flex min-h-[80vh] max-w-7xl flex-col items-center gap-12 px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-24">
                {/* Left content */}
                <div className="max-w-xl space-y-6 text-center lg:text-left">
                    <p className="inline-flex items-center rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
                        Jonglei State Youth Union • 9 counties
                    </p>
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[2.9rem]">
                        Youth leadership{' '}
                        <span className="bg-gradient-to-r from-sky-400 via-sky-300 to-red-300 bg-clip-text text-transparent">
                            shaping Jonglei&apos;s future
                        </span>
                        .
                    </h1>
                    <p className="text-base leading-relaxed text-slate-300 sm:text-lg">
                        A unified platform for young people across Jonglei State to organise, advocate, and build
                        peaceful, prosperous communities&mdash;from Bor to every county and payam&mdash;including youth
                        with disabilities who are represented in our leadership.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-2 lg:justify-start">
                        <a
                            href="/programs"
                            className="inline-flex items-center justify-center rounded-full bg-sky-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition-transform hover:scale-[1.02] hover:bg-sky-400"
                        >
                            Explore youth programs
                        </a>
                        <a
                            href="/blog"
                            className="inline-flex items-center justify-center rounded-full border border-slate-600 bg-white/5 px-7 py-3 text-sm font-semibold text-slate-100 backdrop-blur-sm transition-colors hover:border-slate-400 hover:bg-white/10"
                        >
                            Read stories &amp; updates
                        </a>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-400 lg:justify-start">
                        <div>
                            <p className="font-semibold text-slate-200">9 counties</p>
                            <p>represented across Jonglei State</p>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-200">Youth-led</p>
                            <p>peace &amp; advocacy initiatives</p>
                        </div>
                    </div>
                </div>

                {/* Right-side status card (Titan-inspired) */}
                <div className="w-full max-w-md">
                    <div className="relative rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/95 p-6 shadow-2xl shadow-slate-950/70 backdrop-blur">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
                                    Youth engagement snapshot
                                </p>
                                <p className="mt-1 text-sm text-slate-300">Live activity from Jonglei communities</p>
                            </div>
                            <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/30">
                                ● Active
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-3 rounded-2xl bg-slate-900/60 p-4">
                            <div>
                                <p className="text-[0.7rem] uppercase tracking-[0.18em] text-slate-400">Programs</p>
                                <p className="mt-1 text-xl font-semibold text-white">7+1</p>
                                <p className="text-[0.7rem] text-emerald-300">core &amp; cross-cutting</p>
                            </div>
                            <div>
                                <p className="text-[0.7rem] uppercase tracking-[0.18em] text-slate-400">Counties</p>
                                <p className="mt-1 text-xl font-semibold text-white">9</p>
                                <p className="text-[0.7rem] text-sky-300">represented</p>
                            </div>
                            <div>
                                <p className="text-[0.7rem] uppercase tracking-[0.18em] text-slate-400">Youth</p>
                                <p className="mt-1 text-xl font-semibold text-white">1.2k+</p>
                                <p className="text-[0.7rem] text-red-300">engaged &amp; organising</p>
                            </div>
                        </div>

                        <div className="mt-5 space-y-3 rounded-2xl bg-slate-900/40 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                Recent highlights
                            </p>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between text-slate-200">
                                    <span>Bor youth peace dialogue</span>
                                    <span className="text-xs text-sky-300">This week</span>
                                </div>
                                <div className="flex items-center justify-between text-slate-200">
                                    <span>Education &amp; skills forum</span>
                                    <span className="text-xs text-sky-300">Coming soon</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Bottom fade into white content background */}
            <div className="h-16 bg-gradient-to-t from-white to-transparent" />
        </section>
    );
}
