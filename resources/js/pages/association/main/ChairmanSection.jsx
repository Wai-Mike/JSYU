export default function ChairmanSection() {
    return (
        <section className="relative py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-center lg:gap-16">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Meet our Chairman
                        </h2>
                        <p className="mt-4 max-w-xl text-lg text-slate-600">
                            Leading the Jonglei State Youth Union in representing young people, building peace, and
                            empowering communities across Jonglei State.
                        </p>
                    </div>
                    <div className="relative shrink-0">
                        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-sky-500/20 to-transparent blur-2xl" />
                        <div className="relative overflow-hidden rounded-2xl shadow-xl ring-2 ring-slate-600"
                            style={{ backgroundColor: '#1e293b' }}>
                            <img
                                src="/images/chairman.jpeg"
                                alt="Jonglei State Youth Union Chairman"
                                className="h-[360px] w-[280px] object-cover object-top sm:h-[420px] sm:w-[320px] lg:h-[460px] lg:w-[360px]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
