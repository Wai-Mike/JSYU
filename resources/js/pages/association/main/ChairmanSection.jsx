import { sectionImages } from '../../../constants/sectionImages';

export default function ChairmanSection() {
    return (
        <section className="bg-white py-20 lg:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <span className="text-sm font-bold uppercase tracking-wider text-jsyu-green">Our Team</span>
                    <h2 className="mt-2 text-3xl font-extrabold text-jsyu-green-deep lg:text-4xl">Leadership</h2>
                </div>

                <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                    <div className="order-1 lg:order-none">
                        <div className="relative mx-auto max-w-sm">
                            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-jsyu-green/20 via-jsyu-accent/10 to-transparent blur-3xl" />
                            <div className="relative overflow-hidden rounded-3xl bg-jsyu-green-deep shadow-2xl ring-1 ring-jsyu-green-deep/80">
                                <img
                                    src={sectionImages.chairman}
                                    alt="Jonglei State Youth Union Chairman"
                                    className="h-[360px] w-full object-cover object-top sm:h-[420px] lg:h-[460px]"
                                />
                                <div className="relative px-5 pb-5 pt-4">
                                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-jsyu-accent">
                                        Chairman, Jonglei State Youth Union
                                    </p>
                                    <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
                                        <h3 className="text-xl font-bold text-white">Tot Bangot Deng</h3>
                                        <span className="rounded-full bg-jsyu-green/25 px-3 py-1 text-xs font-semibold text-jsyu-accent ring-1 ring-jsyu-green/40">
                                            Serving the youth
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="order-2 space-y-6">
                        <p className="inline-flex items-center rounded-full bg-jsyu-green-light px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-jsyu-green">
                            Leadership & Vision
                        </p>
                        <h3 className="text-2xl font-extrabold text-jsyu-green-deep sm:text-3xl">Meet our Chairman</h3>
                        <p className="max-w-2xl text-base font-medium leading-relaxed text-jsyu-text-muted sm:text-lg">
                            At the heart of the Jonglei State Youth Union is a leadership committed to{' '}
                            <span className="font-bold text-jsyu-green">
                                representation, peacebuilding, and opportunity
                            </span>{' '}
                            for every young person across Jonglei. Our Chairman works with community leaders, youth
                            groups, and partners to turn the voice of youth into real change.
                        </p>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-jsyu-green-soft bg-jsyu-green-light p-4">
                                <p className="text-xs font-bold uppercase tracking-wide text-jsyu-green">
                                    Focus areas
                                </p>
                                <ul className="mt-2 space-y-1.5 text-sm font-medium text-jsyu-text-muted">
                                    <li>• Youth representation in state decisions</li>
                                    <li>• Community peace & reconciliation</li>
                                    <li>• Education and livelihoods for youth</li>
                                </ul>
                            </div>
                            <div className="rounded-2xl bg-jsyu-green-deep p-4 text-white">
                                <p className="text-xs font-bold uppercase tracking-wide text-jsyu-accent">
                                    A message to youth
                                </p>
                                <p className="mt-2 text-sm font-medium leading-relaxed text-white/90">
                                    &ldquo;When youth are included, communities are safer, fairer, and more hopeful.
                                    Jonglei&apos;s future is in your hands, and we are here to walk with you.&rdquo;
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
