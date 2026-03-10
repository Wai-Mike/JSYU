import AssociationLayout from '../../../layouts/AssociationLayout';

const programs = [
    {
        id: 'economic-empowerment',
        number: 'Program 1',
        name: 'Youth Economic Empowerment & Livelihoods',
        objective: 'Reduce unemployment and promote entrepreneurship and self-reliance among youth across all 9 counties.',
        activities: [
            'Vocational skills training (carpentry, welding, tailoring, mechanics)',
            'Entrepreneurship and small business management workshops',
            'Youth savings and loan groups (VSLA model)',
            'Support to agricultural initiatives (seed distribution and modern farming training)',
            'Youth Fishing & Livelihoods in the SUDD swamps: workshops on better fishing behaviours, ethics, and good practices',
        ],
        outcomes: [
            'More youth in dignified income-generating activities',
            'Reduced idleness and dependency',
            'Stronger local economies in counties and payams',
        ],
        tags: ['Income generation', 'All 9 counties', 'Youth with disabilities included'],
        highlight: 'Includes targeted livelihood support and training for youth with disabilities.',
    },
    {
        id: 'peacebuilding-cohesion',
        number: 'Program 2',
        name: 'Peacebuilding & Social Cohesion',
        objective: 'Strengthen unity and prevent youth involvement in violence and revenge attacks.',
        activities: [
            'Inter-county youth dialogue forums and peace caravans',
            'Peace football tournaments and cultural events for unity',
            'Training on mediation, non-violent communication, and conflict resolution',
            'Anti-cattle raiding and anti-revenge violence campaigns',
        ],
        outcomes: [
            'Youth recognized as peace ambassadors in their communities',
            'Reduced participation of youth in cycles of violence',
            'Improved inter-communal relationships across Jonglei',
        ],
        tags: ['Peace & reconciliation', 'All 9 counties'],
    },
    {
        id: 'education-capacity',
        number: 'Program 3',
        name: 'Education, Leadership & Capacity Building',
        objective: 'Improve youth leadership, participation in governance, and employability.',
        activities: [
            'Leadership, governance, and public speaking training',
            'Advocacy and civic engagement workshops',
            'ICT and computer literacy training',
            'Mentorship programs linking youth with professionals',
            'Scholarship mobilisation and support where possible',
        ],
        outcomes: [
            'Stronger youth leadership at state and county levels',
            'More skilled and employable young people',
            'Better representation of youth in governance spaces',
        ],
        tags: ['Leadership', 'Skills', 'Youth with disabilities included'],
    },
    {
        id: 'climate-environment',
        number: 'Program 4',
        name: 'Climate Change & Environmental Protection',
        objective: 'Build climate resilience and promote environmental stewardship among young people.',
        activities: [
            'Tree planting and re-greening campaigns',
            'Community clean-up days in towns and IDP sites',
            'Flood awareness and disaster risk education',
            'Training on climate-smart agriculture and responsible natural resource use',
        ],
        outcomes: [
            'Cleaner and safer environments for communities',
            'Greater youth participation in climate action',
            'Improved preparedness for floods and climate shocks',
        ],
        tags: ['Climate action', 'Environment', 'All 9 counties'],
    },
    {
        id: 'health-social',
        number: 'Program 5',
        name: 'Health & Social Awareness',
        objective: 'Promote healthy lifestyles and responsible behaviour among youth.',
        activities: [
            'HIV/AIDS and sexual & reproductive health awareness campaigns',
            'Anti-drug and alcohol abuse campaigns',
            'Mental health and psychosocial awareness sessions',
            'Community conversations on positive social norms',
        ],
        outcomes: [
            'Healthier and more informed youth population',
            'Reduced risky behaviours and substance abuse',
            'Greater openness to discuss mental health and wellbeing',
        ],
        tags: ['Health', 'Wellbeing'],
    },
    {
        id: 'sports-talent',
        number: 'Program 6',
        name: 'Sports, Talent & Cultural Development',
        objective: 'Engage youth positively and nurture their talents for peace and development.',
        activities: [
            'State-wide football and athletics competitions',
            'Cultural dance, music, and poetry festivals',
            'Talent shows and talent identification events',
            'Inclusive sporting activities that involve youth with disabilities',
        ],
        outcomes: [
            'Reduced idleness and crime among youth',
            'Social cohesion across communities and counties',
            'Discovery and promotion of promising young talents',
        ],
        tags: ['Sports', 'Culture', 'Youth with disabilities included'],
    },
    {
        id: 'volunteerism-service',
        number: 'Program 7',
        name: 'Volunteerism & Community Service',
        objective: 'Promote civic responsibility and community service by youth.',
        activities: [
            'Formation and support of youth volunteer groups',
            'School and health facility renovation and clean-up',
            'Community road repair and basic infrastructure support',
            'Support to elderly people, vulnerable families, and persons with disabilities',
        ],
        outcomes: [
            'Stronger community trust in youth structures',
            'Visible youth-led solutions in communities',
            'Positive image of youth as partners in development',
        ],
        tags: ['Community service', 'Inclusion'],
    },
    {
        id: 'disability-inclusion',
        number: 'Program 8',
        name: 'Inclusion & Youth with Disabilities',
        objective:
            'Ensure that youth with disabilities are fully represented, participate, and benefit from all JSYU programs.',
        activities: [
            'Strengthening representation of youth with disabilities in JSYU leadership (including the Speaker position)',
            'Ensuring accessibility and reasonable accommodation in trainings, events, and information sharing',
            'Awareness sessions on disability rights and inclusion for community leaders and youth groups',
            'Working with partners to tailor economic and skills programmes for youth with disabilities',
        ],
        outcomes: [
            'Youth with disabilities visibly participating and leading within the Union',
            'All 9 counties recognising youth with disabilities in youth structures',
            'Disability inclusion mainstreamed across every JSYU program area',
        ],
        tags: ['Disability inclusion', 'All 9 counties', 'Cross-cutting'],
        highlight: 'This program cuts across every other area and ensures no young person is left behind.',
    },
];

export default function ProgramsIndex() {
    return (
        <AssociationLayout>
            <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 sm:py-32">
                <header className="mx-auto max-w-3xl text-center">
                    <span className="text-sm font-semibold uppercase tracking-wider text-sky-600">
                        Our Strategic Programs
                    </span>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                        Fiscal Year 2026/2027 programs for Jonglei youth
                    </h1>
                    <p className="mt-6 text-lg text-slate-600">
                        These program areas come from the Jonglei State Youth Union Fiscal Year Plan and Annual Work Plan
                        2026/2027. They respond to unemployment, conflict, climate shocks, health risks, and leadership
                        gaps affecting young people across all 9 counties&mdash;with a deliberate focus on youth with
                        disabilities.
                    </p>
                </header>

                <div className="mt-16 grid gap-8 md:grid-cols-2">
                    {programs.map((program) => (
                        <article
                            key={program.id}
                            className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-950/95 p-7 shadow-sm ring-1 ring-slate-800 transition-all hover:-translate-y-1 hover:shadow-2xl hover:ring-sky-500/70"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
                                        {program.number}
                                    </p>
                                    <h2 className="mt-2 text-xl font-semibold text-white">{program.name}</h2>
                                </div>
                                {program.highlight && (
                                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200 ring-1 ring-emerald-500/40">
                                        Inclusive
                                    </span>
                                )}
                            </div>

                            <p className="mt-4 text-sm font-medium text-sky-100">Objective</p>
                            <p className="mt-1 text-sm text-slate-200">{program.objective}</p>

                            <div className="mt-5 space-y-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        Key activities
                                    </p>
                                    <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-slate-200">
                                        {program.activities.map((activity) => (
                                            <li key={activity}>{activity}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        Expected results
                                    </p>
                                    <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-slate-200">
                                        {program.outcomes.map((outcome) => (
                                            <li key={outcome}>{outcome}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {program.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center rounded-full bg-slate-900/70 px-3 py-1 text-xs font-medium text-slate-100 ring-1 ring-slate-700"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {program.highlight && (
                                <p className="mt-3 text-xs text-emerald-200/90">{program.highlight}</p>
                            )}
                        </article>
                    ))}
                </div>

                <section className="mt-20 rounded-3xl bg-sky-50 px-6 py-8 text-slate-800 sm:px-8">
                    <h2 className="text-xl font-semibold text-slate-900">Cross-cutting priorities</h2>
                    <p className="mt-3 text-sm text-slate-700">
                        Every program in this plan is designed to intentionally include{' '}
                        <span className="font-semibold">young women</span>,{' '}
                        <span className="font-semibold">youth with disabilities</span>, and{' '}
                        <span className="font-semibold">youth from all 9 counties of Jonglei</span>. Transparency,
                        accountability, and youth participation in decision-making are non-negotiable principles in how
                        we plan, implement, and report on our work.
                    </p>
                </section>
            </div>
        </AssociationLayout>
    );
}
