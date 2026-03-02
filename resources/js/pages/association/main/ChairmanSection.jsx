export default function ChairmanSection() {
    return (
        <section className="relative overflow-hidden py-24 sm:py-32">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-slate-50" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                    {/* Text side */}
                    <div className="order-2 space-y-6 lg:order-1">
                        <p className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                            Leadership &amp; Vision
                        </p>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.6rem]">
                            Meet our Chairman
                        </h2>
                        <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                            At the heart of the Jonglei State Youth Union is a leadership committed to{" "}
                            <span className="font-semibold text-sky-700">representation, peacebuilding, and opportunity</span>{" "}
                            for every young person across Jonglei. Our Chairman works with community leaders, youth groups,
                            and partners to turn the voice of youth into real change.
                        </p>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-sky-100 bg-white/80 p-4 shadow-sm backdrop-blur">
                                <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
                                    Focus areas
                                </p>
                                <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                                    <li>• Youth representation in state decisions</li>
                                    <li>• Community peace &amp; reconciliation</li>
                                    <li>• Education and livelihoods for youth</li>
                                </ul>
                            </div>
                            <div className="rounded-2xl border border-slate-100 bg-slate-900 p-4 text-slate-100 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-wide text-sky-300">
                                    A message to youth
                                </p>
                                <p className="mt-2 text-sm leading-relaxed text-slate-100/90">
                                    &ldquo;When youth are included, communities are safer, fairer, and more hopeful.
                                    Jonglei&apos;s future is in your hands, and we are here to walk with you.&rdquo;
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Portrait card */}
                    <div className="order-1 lg:order-2">
                        <div className="relative mx-auto max-w-xs sm:max-w-sm">
                            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-sky-500/20 via-sky-300/10 to-transparent blur-3xl" />
                            <div className="relative overflow-hidden rounded-3xl bg-slate-900/95 shadow-2xl ring-1 ring-slate-900/80">
                                <div className="relative">
                                    <img
                                        src="/images/chairman.jpeg"
                                        alt="Jonglei State Youth Union Chairman"
                                        className="h-[360px] w-full object-cover object-top sm:h-[420px] lg:h-[460px]"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/95 via-slate-900/60 to-transparent" />
                                </div>
                                <div className="relative px-5 pb-5 pt-4">
                                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">
                                        Chairman, Jonglei State Youth Union
                                    </p>
                                    <div className="mt-1 flex items-baseline justify-between gap-2">
                                        <h3 className="text-xl font-semibold text-white">
                                            Tot Bangot Deng
                                        </h3>
                                        <span className="rounded-full bg-sky-500/15 px-3 py-1 text-xs font-medium text-sky-200 ring-1 ring-sky-500/40">
                                            Serving the youth
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
