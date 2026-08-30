import { Link } from '@inertiajs/react';
import { sectionImages } from '../../../constants/sectionImages';

const pillars = [
    {
        label: 'Mission',
        text: 'To empower young people across Jonglei State through inclusive representation, peacebuilding, education, and advocacy for their rights and opportunities.',
    },
    {
        label: 'Vision',
        text: 'A Jonglei State where every young person — including youth with disabilities — can participate, lead, and contribute to peaceful, prosperous communities.',
    },
    {
        label: 'Values',
        text: 'Unity · Integrity · Service · Peace · Inclusivity · Youth leadership',
    },
];

export default function AboutSection() {
    return (
        <section id="about" className="bg-jsyu-green-light py-20 lg:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-14 lg:grid-cols-2">
                    <div className="relative">
                        <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-jsyu-green-soft shadow-xl">
                            <img
                                src={sectionImages.about}
                                alt="JSYU leadership and youth representatives"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-6 -right-6 hidden rounded-2xl bg-jsyu-green-deep p-5 shadow-lg sm:block">
                            <div className="text-3xl font-extrabold text-white">9</div>
                            <div className="text-sm font-medium text-white/85">Counties united</div>
                        </div>
                    </div>

                    <div>
                        <span className="text-sm font-bold uppercase tracking-wider text-jsyu-green">Who We Are</span>
                        <h2 className="mt-2 text-3xl font-extrabold leading-snug text-jsyu-green-deep lg:text-4xl">
                            The voice of youth in Jonglei State
                        </h2>
                        <p className="mt-5 font-medium leading-relaxed text-jsyu-text-muted">
                            The Jonglei State Youth Union (JSYU) is an independent, non-political, and non-profit civil
                            society organisation serving as the primary representative body for young people in Jonglei
                            State, South Sudan. We comprise members from all 9 counties of Jonglei, across Lou Nuer,
                            Dinka, Murle and other communities.
                        </p>
                        <p className="mt-4 font-medium leading-relaxed text-jsyu-text-muted">
                            Under the framework of the South Sudan National Youth Union (SSNYU) and National Youth
                            Development Policy, we work to institutionalise youth representation, facilitate
                            peacebuilding dialogues, and advocate for education, vocational training, and economic
                            opportunities — with youth with disabilities represented in the youth structure, including
                            the Speaker.
                        </p>

                        <div className="mb-8 mt-8 grid gap-5 sm:grid-cols-3">
                            {pillars.map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-xl border border-jsyu-green-soft bg-white p-4 shadow-sm"
                                >
                                    <div className="mb-2 text-sm font-bold text-jsyu-green">{item.label}</div>
                                    <div className="text-xs font-medium leading-relaxed text-jsyu-text-muted">
                                        {item.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Link
                            href={route('programs')}
                            className="inline-flex items-center gap-2 rounded-full border-2 border-jsyu-green px-6 py-2.5 font-bold text-jsyu-green transition-colors hover:bg-jsyu-green hover:text-white"
                        >
                            Learn More About Our Work →
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
