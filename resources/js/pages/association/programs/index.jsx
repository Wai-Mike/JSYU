import AssociationLayout from '../../../layouts/AssociationLayout';

const programs = [
    {
        id: 'representation',
        name: 'Youth Representation & Advocacy',
        description: 'Promoting institutionalized representation of youth in state and county-level decision-making across Jonglei.',
        activities: [
            'Participation in governance and policy dialogue',
            'Petitions and peaceful demonstrations in Bor',
            'Coordination with the South Sudan National Youth Union (SSNYU)',
        ],
    },
    {
        id: 'peacebuilding',
        name: 'Peacebuilding & Social Cohesion',
        description: 'Facilitating dialogues between different ethnic communities to mitigate inter-communal violence and cattle raiding.',
        activities: [
            'Cross-community dialogue forums',
            'Peace and reconciliation initiatives',
            'Advocacy for return of abducted women and children',
        ],
    },
    {
        id: 'education',
        name: 'Education & Vocational Training',
        description: 'Advocating for access to quality education and vocational training to provide alternatives to armed mobilization.',
        activities: [
            'Support for education continuity in conflict-affected areas',
            'Vocational skills and livelihood training',
            'Partnerships with schools and training centers',
        ],
    },
    {
        id: 'humanitarian',
        name: 'Humanitarian Advocacy',
        description: 'Advocating for humanitarian access, protection of aid convoys, and support for displaced youth in IDP camps.',
        activities: [
            'Demands for security and humanitarian access',
            'Support for youth in displacement camps',
            'Coordination with humanitarian partners',
        ],
    },
];

export default function ProgramsIndex() {
    return (
        <AssociationLayout>
            <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 sm:py-32">
                <header className="mx-auto max-w-3xl text-center">
                    <span className="text-sm font-semibold uppercase tracking-wider text-sky-600">Our Work</span>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                        Programs that empower youth and strengthen community
                    </h1>
                    <p className="mt-6 text-lg text-slate-600">
                        Each program area addresses the critical challenges facing youth in Jonglei: armed violence,
                        economic precarity, displacement, and gaps in education. Together, they advance our mandate
                        to represent, protect, and empower young people across the state.
                    </p>
                </header>

                <div className="mt-16 grid gap-8 md:grid-cols-2">
                    {programs.map((program) => (
                        <article
                            key={program.id}
                            className="group flex h-full flex-col rounded-2xl border border-slate-600 p-8 shadow-sm ring-1 ring-slate-600 transition-all hover:shadow-xl hover:ring-sky-500"
                            style={{ backgroundColor: '#1e293b' }}
                        >
                            <h2 className="text-xl font-semibold text-white">{program.name}</h2>
                            <p className="mt-4 text-slate-300">{program.description}</p>
                            <ul className="mt-6 list-disc space-y-2 pl-5 text-slate-300">
                                {program.activities.map((activity) => (
                                    <li key={activity}>{activity}</li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </div>
        </AssociationLayout>
    );
}
