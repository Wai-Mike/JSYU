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
        highlight: 'Governance participation, petitions, peaceful demonstrations, SSNYU coordination.',
    },
    {
        icon: HeartHandshake,
        name: 'Peacebuilding & Social Cohesion',
        description: 'Facilitating dialogues between ethnic communities to mitigate inter-communal violence.',
        highlight: 'Cross-community dialogue, peace initiatives, advocacy for abductees.',
    },
    {
        icon: BookOpen,
        name: 'Education & Vocational Training',
        description:
            'Advocating for quality education and vocational training as alternatives to armed mobilization.',
        highlight: 'Education support, skills training, livelihood opportunities.',
    },
    {
        icon: Users,
        name: 'Humanitarian Advocacy',
        description: 'Advocating for humanitarian access and support for displaced youth.',
        highlight: 'Humanitarian access demands, IDP camp support, partner coordination.',
    },
    {
        icon: Briefcase,
        name: 'Youth Economic Empowerment',
        description: 'Supporting entrepreneurship, vocational skills, and livelihood opportunities across all 9 counties.',
        highlight: 'VSLA groups, vocational training, agricultural and fishing livelihoods.',
    },
    {
        icon: Leaf,
        name: 'Climate & Environmental Protection',
        description: 'Building climate resilience and promoting environmental stewardship among young people.',
        highlight: 'Tree planting, clean-up campaigns, flood awareness, climate-smart agriculture.',
    },
];

export default function ProgramsPreviewSection() {
    return (
        <section className="bg-white py-20 lg:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <span className="text-sm font-bold uppercase tracking-wider text-jsyu-green">What We Do</span>
                    <h2 className="mt-2 text-3xl font-extrabold text-jsyu-green-deep lg:text-4xl">Our Programs</h2>
                    <p className="mx-auto mt-3 max-w-xl font-medium text-jsyu-text-muted">
                        Key program areas advancing youth representation, peace, education, and opportunity across
                        Jonglei State.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {programs.map((program) => {
                        const Icon = program.icon;
                        return (
                            <Link
                                key={program.name}
                                href={route('programs')}
                                className="group cursor-pointer rounded-2xl border border-jsyu-green-soft bg-jsyu-green-light p-6 transition-all duration-200 hover:border-jsyu-green/40 hover:shadow-md"
                            >
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-jsyu-green/10">
                                    <Icon className="h-6 w-6 text-jsyu-green" />
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-jsyu-green-deep transition-colors group-hover:text-jsyu-green">
                                    {program.name}
                                </h3>
                                <p className="mb-3 text-sm font-medium leading-relaxed text-jsyu-text-muted">
                                    {program.description}
                                </p>
                                <p className="mb-4 text-xs font-semibold text-jsyu-green/80">{program.highlight}</p>
                                <span className="text-sm font-bold text-jsyu-green group-hover:underline">
                                    Learn More →
                                </span>
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-10 text-center">
                    <Link
                        href={route('programs')}
                        className="inline-flex items-center gap-2 text-base font-bold text-jsyu-green transition-colors hover:text-jsyu-green-hover"
                    >
                        View all programs →
                    </Link>
                </div>
            </div>
        </section>
    );
}
