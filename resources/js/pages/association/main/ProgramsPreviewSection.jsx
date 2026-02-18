const programs = [
    {
        name: 'Youth Representation & Advocacy',
        description: 'Promoting institutionalized representation of youth in state and county-level decision-making.',
        highlight: 'Governance participation, petitions, peaceful demonstrations, SSNYU coordination.',
    },
    {
        name: 'Peacebuilding & Social Cohesion',
        description: 'Facilitating dialogues between ethnic communities to mitigate inter-communal violence.',
        highlight: 'Cross-community dialogue, peace initiatives, advocacy for abductees.',
    },
    {
        name: 'Education & Vocational Training',
        description: 'Advocating for quality education and vocational training as alternatives to armed mobilization.',
        highlight: 'Education support, skills training, livelihood opportunities.',
    },
    {
        name: 'Humanitarian Advocacy',
        description: 'Advocating for humanitarian access and support for displaced youth.',
        highlight: 'Humanitarian access demands, IDP camp support, partner coordination.',
    },
];

export default function ProgramsPreviewSection() {
    return (
        <section className="relative bg-slate-50 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <span className="text-sm font-semibold uppercase tracking-wider text-sky-600">Our Work</span>
                        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Key program areas
                        </h2>
                    </div>
                    <a
                        href="/programs"
                        className="inline-flex items-center gap-2 text-base font-semibold text-sky-600 transition-colors hover:text-sky-700"
                    >
                        View all programs
                    </a>
                </div>
                <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {programs.map((program) => (
                        <div
                            key={program.name}
                            className="group relative overflow-hidden rounded-2xl p-8 shadow-sm ring-1 ring-slate-600 transition-all hover:shadow-xl hover:ring-sky-500"
                            style={{ backgroundColor: '#1e293b' }}
                        >
                            <h3 className="text-lg font-semibold text-white">{program.name}</h3>
                            <p className="mt-3 text-slate-300">{program.description}</p>
                            <p className="mt-4 text-sm font-medium text-sky-400">{program.highlight}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
