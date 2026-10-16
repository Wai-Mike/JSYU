import { Link } from '@inertiajs/react';
import { sectionImages } from '../../../constants/sectionImages';

export default function AboutSection() {
    return (
        <section id="about" className="bg-white">
            <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
                <div className="relative min-h-[320px] overflow-hidden bg-jsyu-green-deep sm:min-h-[420px]">
                    <img
                        src={sectionImages.about}
                        alt="JSYU leadership and youth representatives"
                        className="absolute inset-0 h-full w-full object-cover object-[center_15%] opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-jsyu-green-deep/40 to-transparent" />
                </div>

                <div className="flex flex-col justify-center bg-jsyu-green-deep px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
                    <span className="text-xs font-bold uppercase tracking-[0.22em] text-jsyu-accent">Consulting</span>
                    <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                        How we can help you?
                    </h2>
                    <p className="mt-5 max-w-lg text-sm font-medium leading-relaxed text-white/75 sm:text-base">
                        The Jonglei State Youth Union is an independent, non-political civil society organisation — the
                        primary representative body for young people across all 9 counties of Jonglei State, South Sudan.
                        Under SSNYU and the National Youth Development Policy, we institutionalise youth representation,
                        facilitate peacebuilding, and advocate for education, skills, and economic opportunity —
                        including youth with disabilities in our leadership.
                    </p>
                    <div className="mt-8">
                        <Link
                            href={route('programs')}
                            className="inline-flex items-center bg-jsyu-accent px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-jsyu-green-deep hover:bg-jsyu-accent-hover"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>

            <div className="bg-jsyu-green">
                <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
                    <p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-white sm:text-sm">
                        More from Jonglei State Youth Union — representation · peace · opportunity
                    </p>
                </div>
            </div>
        </section>
    );
}
