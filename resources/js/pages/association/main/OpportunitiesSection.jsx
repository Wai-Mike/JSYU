import { Link } from '@inertiajs/react';
import { sectionImages } from '../../../constants/sectionImages';

const opportunities = [
    {
        tag: 'From Education',
        title: 'Scholarships & Learning',
        description: 'Explore education pathways and advocacy for quality learning across Jonglei State.',
        image: sectionImages.news[2],
        cta: 'Read More',
        href: route('programs'),
    },
    {
        tag: 'From Training',
        title: 'Vocational Skills',
        description: 'Professional development and vocational opportunities for youth skills building.',
        image: sectionImages.news[0],
        cta: 'Read More',
        href: route('programs'),
    },
    {
        featured: true,
        title: 'Get Involved',
        description: 'Volunteer, lead, and join forums shaping peace and opportunity in every county.',
        jobs: [
            { location: 'Bor County', role: 'Youth Forum Volunteer' },
            { location: 'Ayod · Fangak', role: 'Peace Caravan Lead' },
        ],
        cta: 'View Opportunities',
        href: route('register'),
    },
    {
        tag: 'From Community',
        title: 'Youth Events & Forums',
        description: 'Participate in dialogues, forums, and community activities organised by JSYU.',
        image: sectionImages.news[1],
        cta: 'Read More',
        href: route('blog.index'),
    },
    {
        tag: 'From Enterprise',
        title: 'Livelihoods & Startups',
        description: 'Connect with programs supporting entrepreneurship and income generation.',
        image: sectionImages.testimonials[1],
        cta: 'Read More',
        href: route('programs'),
    },
    {
        tag: 'From Governance',
        title: 'Leadership Pathways',
        description: 'Build civic skills and engage in youth representation at county and state levels.',
        image: sectionImages.testimonials[0],
        cta: 'Read More',
        href: route('work-plan'),
    },
];

export default function OpportunitiesSection() {
    return (
        <section id="opportunities" className="bg-jsyu-green-light py-20 lg:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-14 text-center">
                    <h2 className="font-display text-4xl font-extrabold lowercase tracking-tight text-jsyu-green-deep sm:text-5xl">
                        opportunities served
                    </h2>
                    <p className="mx-auto mt-3 max-w-lg text-sm font-medium text-jsyu-text-muted">
                        Ways for young people to participate, learn, lead, and contribute across Jonglei State.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {opportunities.map((item) =>
                        item.featured ? (
                            <div
                                key={item.title}
                                className="flex flex-col justify-between bg-jsyu-green-deep p-7 text-white"
                            >
                                <div>
                                    <h3 className="font-display text-2xl font-bold">{item.title}</h3>
                                    <p className="mt-3 text-sm font-medium leading-relaxed text-white/70">
                                        {item.description}
                                    </p>
                                    <ul className="mt-6 space-y-4 border-t border-white/15 pt-5">
                                        {item.jobs.map((job) => (
                                            <li key={job.role}>
                                                <p className="text-xs font-medium uppercase tracking-wider text-jsyu-accent">
                                                    {job.location}
                                                </p>
                                                <p className="mt-1 text-sm font-bold">{job.role}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Link
                                    href={item.href}
                                    className="mt-8 inline-flex w-fit bg-jsyu-accent px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-jsyu-green-deep hover:bg-jsyu-accent-hover"
                                >
                                    {item.cta}
                                </Link>
                            </div>
                        ) : (
                            <article key={item.title} className="group flex flex-col bg-white">
                                <div className="aspect-[16/10] overflow-hidden bg-jsyu-green-soft">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="flex flex-1 flex-col p-5">
                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-jsyu-green-muted">
                                        {item.tag}
                                    </p>
                                    <h3 className="mt-2 font-display text-xl font-bold text-jsyu-green-deep">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 flex-1 text-sm font-medium leading-relaxed text-jsyu-text-muted">
                                        {item.description}
                                    </p>
                                    <Link
                                        href={item.href}
                                        className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-jsyu-green hover:text-jsyu-accent-hover"
                                    >
                                        {item.cta}
                                    </Link>
                                </div>
                            </article>
                        ),
                    )}
                </div>
            </div>
        </section>
    );
}
