import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Briefcase,
    HeartHandshake,
    Landmark,
    Leaf,
    Users,
} from 'lucide-react';

const programs = [
    {
        icon: Landmark,
        name: 'Youth Representation & Advocacy',
        description:
            'Promoting institutionalized representation of youth in state and county-level decision-making.',
    },
    {
        icon: HeartHandshake,
        name: 'Peacebuilding & Social Cohesion',
        description: 'Facilitating dialogues between ethnic communities to mitigate inter-communal violence.',
    },
    {
        icon: BookOpen,
        name: 'Education & Vocational Training',
        description:
            'Advocating for quality education and vocational training as alternatives to armed mobilization.',
    },
    {
        icon: Users,
        name: 'Humanitarian Advocacy',
        description: 'Advocating for humanitarian access and support for displaced youth across Jonglei.',
    },
    {
        icon: Briefcase,
        name: 'Youth Economic Empowerment',
        description: 'Supporting entrepreneurship, vocational skills, and livelihood opportunities in all 9 counties.',
    },
    {
        icon: Leaf,
        name: 'Climate & Environmental Protection',
        description: 'Building climate resilience and promoting environmental stewardship among young people.',
    },
];

export default function ProgramsPreviewSection() {
    return (
        <section className="bg-white py-20 lg:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-14 text-center">
                    <h2 className="font-display text-4xl font-extrabold lowercase tracking-tight text-jsyu-green-deep sm:text-5xl">
                        our programs
                    </h2>
                    <p className="mx-auto mt-3 max-w-lg text-sm font-medium text-jsyu-text-muted">
                        Key areas advancing youth representation, peace, education, and opportunity across Jonglei State.
                    </p>
                </div>

                <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                    {programs.map((program) => {
                        const Icon = program.icon;
                        return (
                            <Link
                                key={program.name}
                                href={route('programs')}
                                className="group text-left"
                            >
                                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center border border-jsyu-green-soft text-jsyu-green-muted transition-colors group-hover:border-jsyu-accent group-hover:text-jsyu-green-deep">
                                    <Icon className="h-7 w-7" strokeWidth={1.25} />
                                </div>
                                <h3 className="font-display text-xl font-bold text-jsyu-green-deep transition-colors group-hover:text-jsyu-green">
                                    {program.name}
                                </h3>
                                <p className="mt-2 text-sm font-medium leading-relaxed text-jsyu-text-muted">
                                    {program.description}
                                </p>
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-14 text-center">
                    <Link
                        href={route('programs')}
                        className="inline-flex items-center bg-jsyu-accent px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-jsyu-green-deep hover:bg-jsyu-accent-hover"
                    >
                        View All Programs
                    </Link>
                </div>
            </div>
        </section>
    );
}
