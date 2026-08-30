import { Link } from '@inertiajs/react';
import { CalendarDays, GraduationCap, HandHeart, Rocket, Sparkles, Wrench } from 'lucide-react';

const opportunities = [
    {
        icon: GraduationCap,
        title: 'Scholarships & Education',
        description: 'Explore education pathways and advocacy for quality learning across Jonglei State.',
        cta: 'Learn more',
    },
    {
        icon: Wrench,
        title: 'Training Programs',
        description: 'Vocational and professional development opportunities for youth skills building.',
        cta: 'Learn more',
    },
    {
        icon: CalendarDays,
        title: 'Youth Events & Forums',
        description: 'Participate in dialogues, forums, and community activities organised by JSYU.',
        cta: 'Learn more',
    },
    {
        icon: HandHeart,
        title: 'Volunteer Opportunities',
        description: 'Contribute your time and energy to peacebuilding, advocacy, and community initiatives.',
        cta: 'Get involved',
    },
    {
        icon: Rocket,
        title: 'Entrepreneurship & Livelihoods',
        description: 'Connect with programs supporting youth entrepreneurship and income generation.',
        cta: 'Explore',
    },
    {
        icon: Sparkles,
        title: 'Leadership & Governance',
        description: 'Build civic skills and engage in youth representation at county and state levels.',
        cta: 'Learn more',
    },
];

export default function OpportunitiesSection() {
    return (
        <section id="opportunities" className="bg-jsyu-green-light py-20 lg:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <span className="text-sm font-bold uppercase tracking-wider text-jsyu-green">For You</span>
                    <h2 className="mt-2 text-3xl font-extrabold text-jsyu-green-deep lg:text-4xl">
                        Youth Opportunities
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl font-medium text-jsyu-text-muted">
                        Ways for young people to participate, learn, lead, and contribute across Jonglei State.
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {opportunities.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.title}
                                className="rounded-2xl border border-jsyu-green-soft bg-white p-6 shadow-sm transition-shadow duration-200 hover:border-jsyu-green/30 hover:shadow-md"
                            >
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-jsyu-green/10">
                                    <Icon className="h-6 w-6 text-jsyu-green" />
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-jsyu-green-deep">{item.title}</h3>
                                <p className="mb-5 text-sm font-medium leading-relaxed text-jsyu-text-muted">
                                    {item.description}
                                </p>
                                <Link
                                    href={route('programs')}
                                    className="inline-flex rounded-full bg-jsyu-green px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-jsyu-green-hover"
                                >
                                    {item.cta}
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
