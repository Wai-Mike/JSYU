import { sectionImages } from '../../../constants/sectionImages';

export default function ChairmanSection() {
    return (
        <section className="bg-white py-20 lg:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h2 className="font-display text-4xl font-extrabold lowercase tracking-tight text-jsyu-green-deep sm:text-5xl">
                        our leadership
                    </h2>
                </div>

                <div className="grid items-stretch gap-0 lg:grid-cols-2">
                    <div className="relative min-h-[360px] overflow-hidden bg-jsyu-green-deep sm:min-h-[460px]">
                        <img
                            src={sectionImages.chairman}
                            alt="Jonglei State Youth Union Chairman Tot Bangot Deng"
                            className="h-full w-full object-cover object-top"
                        />
                    </div>

                    <div className="flex flex-col justify-center bg-jsyu-green-light px-6 py-10 sm:px-10 lg:px-14">
                        <span className="text-xs font-bold uppercase tracking-[0.22em] text-jsyu-green">
                            Chairman · Term 2026/2030
                        </span>
                        <h3 className="mt-3 font-display text-3xl font-extrabold text-jsyu-green-deep sm:text-4xl">
                            Tot Bangot Deng
                        </h3>
                        <p className="mt-5 text-base font-medium leading-relaxed text-jsyu-text-muted">
                            At the heart of the Jonglei State Youth Union is leadership committed to representation,
                            peacebuilding, and opportunity for every young person across Jonglei — working with
                            community leaders, youth groups, and partners to turn the voice of youth into real change.
                        </p>

                        <div className="mt-8 grid gap-4 sm:grid-cols-2">
                            <div className="border border-jsyu-green-soft bg-white p-4">
                                <p className="text-xs font-bold uppercase tracking-wide text-jsyu-green">Focus areas</p>
                                <ul className="mt-2 space-y-1.5 text-sm font-medium text-jsyu-text-muted">
                                    <li>• Youth representation in state decisions</li>
                                    <li>• Community peace & reconciliation</li>
                                    <li>• Education and livelihoods for youth</li>
                                </ul>
                            </div>
                            <div className="bg-jsyu-green-deep p-4 text-white">
                                <p className="text-xs font-bold uppercase tracking-wide text-jsyu-accent">
                                    A message to youth
                                </p>
                                <p className="mt-2 text-sm font-medium leading-relaxed text-white/90">
                                    &ldquo;When youth are included, communities are safer, fairer, and more hopeful.
                                    Jonglei&apos;s future is in your hands.&rdquo;
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
