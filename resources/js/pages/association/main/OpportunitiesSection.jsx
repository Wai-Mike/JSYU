import { Link } from '@inertiajs/react';
import Reveal from '../../../components/Reveal';
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
                    <h2 className="font-display text-jsyu-green-deep text-4xl font-extrabold tracking-tight lowercase sm:text-5xl">
                        opportunities served
                    </h2>
                    <p className="text-jsyu-text-muted mx-auto mt-3 max-w-lg text-sm font-medium">
                        Ways for young people to participate, learn, lead, and contribute across Jonglei State.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {opportunities.map((item, i) => (
                        <Reveal key={item.title} delay={(i % 3) * 0.12} className="h-full">
                            {item.featured ? (
                                <div className="bg-jsyu-green-deep flex h-full flex-col justify-between p-7 text-white">
                                    <div>
                                        <h3 className="font-display text-2xl font-bold">{item.title}</h3>
                                        <p className="mt-3 text-sm leading-relaxed font-medium text-white/70">{item.description}</p>
                                        <ul className="mt-6 space-y-4 border-t border-white/15 pt-5">
                                            {item.jobs.map((job) => (
                                                <li key={job.role}>
                                                    <p className="text-jsyu-accent text-xs font-medium tracking-wider uppercase">{job.location}</p>
                                                    <p className="mt-1 text-sm font-bold">{job.role}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <Link
                                        href={item.href}
                                        className="bg-jsyu-accent text-jsyu-green-deep hover:bg-jsyu-accent-hover mt-8 inline-flex w-fit px-5 py-2.5 text-xs font-bold tracking-[0.14em] uppercase"
                                    >
                                        {item.cta}
                                    </Link>
                                </div>
                            ) : (
                                <article className="group flex h-full flex-col bg-white transition-shadow duration-300 hover:shadow-xl">
                                    <div className="bg-jsyu-green-soft aspect-[16/10] overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col p-5">
                                        <p className="text-jsyu-green-muted text-xs font-bold tracking-[0.14em] uppercase">{item.tag}</p>
                                        <h3 className="font-display text-jsyu-green-deep mt-2 text-xl font-bold">{item.title}</h3>
                                        <p className="text-jsyu-text-muted mt-2 flex-1 text-sm leading-relaxed font-medium">{item.description}</p>
                                        <Link
                                            href={item.href}
                                            className="text-jsyu-green hover:text-jsyu-accent-hover mt-4 text-xs font-bold tracking-[0.14em] uppercase"
                                        >
                                            {item.cta}
                                        </Link>
                                    </div>
                                </article>
                            )}
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
