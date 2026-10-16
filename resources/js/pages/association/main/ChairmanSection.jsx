import Reveal from '../../../components/Reveal';
import { sectionImages } from '../../../constants/sectionImages';

export default function ChairmanSection() {
    return (
        <section className="bg-white py-20 lg:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h2 className="font-display text-jsyu-green-deep text-4xl font-extrabold tracking-tight lowercase sm:text-5xl">our leadership</h2>
                </div>

                <div className="grid items-stretch gap-0 lg:grid-cols-2">
                    <Reveal from="right" className="bg-jsyu-green-deep relative min-h-[360px] overflow-hidden sm:min-h-[460px]">
                        <img
                            src={sectionImages.chairman}
                            alt="Jonglei State Youth Union Chairman Tot Bangot Deng"
                            className="h-full w-full object-cover object-top"
                        />
                    </Reveal>

                    <Reveal from="left" delay={0.1} className="bg-jsyu-green-light flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14">
                        <span className="text-jsyu-green text-xs font-bold tracking-[0.22em] uppercase">Chairman · Term 2026/2030</span>
                        <h3 className="font-display text-jsyu-green-deep mt-3 text-3xl font-extrabold sm:text-4xl">Tot Bangot Deng</h3>
                        <p className="text-jsyu-text-muted mt-5 text-base leading-relaxed font-medium">
                            At the heart of the Jonglei State Youth Union is leadership committed to representation, peacebuilding, and opportunity
                            for every young person across Jonglei — working with community leaders, youth groups, and partners to turn the voice of
                            youth into real change.
                        </p>

                        <div className="mt-8 grid gap-4 sm:grid-cols-2">
                            <div className="border-jsyu-green-soft border bg-white p-4">
                                <p className="text-jsyu-green text-xs font-bold tracking-wide uppercase">Focus areas</p>
                                <ul className="text-jsyu-text-muted mt-2 space-y-1.5 text-sm font-medium">
                                    <li>• Youth representation in state decisions</li>
                                    <li>• Community peace & reconciliation</li>
                                    <li>• Education and livelihoods for youth</li>
                                </ul>
                            </div>
                            <div className="bg-jsyu-green-deep p-4 text-white">
                                <p className="text-jsyu-accent text-xs font-bold tracking-wide uppercase">A message to youth</p>
                                <p className="mt-2 text-sm leading-relaxed font-medium text-white/90">
                                    &ldquo;When youth are included, communities are safer, fairer, and more hopeful. Jonglei&apos;s future is in your
                                    hands.&rdquo;
                                </p>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
