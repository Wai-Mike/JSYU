import { Link } from '@inertiajs/react';
import { HandHeart, Megaphone, Sprout } from 'lucide-react';
import Reveal from '../../../components/Reveal';
import { sectionImages } from '../../../constants/sectionImages';

const pillars = [
    { icon: Megaphone, label: 'Representation' },
    { icon: HandHeart, label: 'Peace' },
    { icon: Sprout, label: 'Opportunity' },
];

export default function AboutSection() {
    return (
        <section id="about" className="bg-jsyu-green-light">
            <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
                <Reveal from="right" className="relative mx-auto w-full max-w-lg lg:mx-0">
                    <div className="border-jsyu-accent absolute -top-4 -left-4 h-full w-full border-2" />
                    <img
                        src={sectionImages.about}
                        alt="JSYU leadership and youth representatives"
                        className="relative aspect-[4/5] w-full object-cover object-[center_15%] shadow-xl sm:aspect-[5/5]"
                        loading="lazy"
                    />
                </Reveal>

                <div>
                    <span className="text-jsyu-green text-xs font-bold tracking-[0.22em] uppercase">Who We Are</span>
                    <h2 className="font-display text-jsyu-green-deep mt-3 text-3xl leading-tight font-extrabold sm:text-4xl">How we can help you?</h2>
                    <span className="bg-jsyu-accent mt-4 block h-1 w-16" />
                    <p className="text-jsyu-text-muted mt-6 max-w-xl text-sm leading-relaxed font-medium sm:text-base">
                        The Jonglei State Youth Union is an independent, non-political civil society organisation — the primary representative body
                        for young people across all 9 counties of Jonglei State, South Sudan. Under SSNYU and the National Youth Development Policy,
                        we institutionalise youth representation, facilitate peacebuilding, and advocate for education, skills, and economic
                        opportunity — including youth with disabilities in our leadership.
                    </p>

                    <ul className="mt-8 grid grid-cols-3 gap-3 sm:max-w-md">
                        {pillars.map(({ icon: Icon, label }, i) => (
                            <Reveal
                                as="li"
                                key={label}
                                delay={0.15 + i * 0.12}
                                scale
                                className="border-jsyu-green-soft flex flex-col items-center gap-2 border bg-white px-3 py-4 text-center"
                            >
                                <Icon className="text-jsyu-green h-6 w-6" />
                                <span className="text-jsyu-charcoal text-xs font-bold tracking-[0.12em] uppercase">{label}</span>
                            </Reveal>
                        ))}
                    </ul>

                    <div className="mt-8">
                        <Link
                            href={route('programs')}
                            className="bg-jsyu-green hover:bg-jsyu-green-hover inline-flex items-center px-6 py-3 text-xs font-bold tracking-[0.14em] text-white uppercase"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
