import AssociationLayout from '../../../layouts/AssociationLayout';

const strategicObjectives = [
    'Enhance youth economic empowerment and self-reliance.',
    'Promote peace, unity, and conflict resolution among communities.',
    'Strengthen youth leadership, governance participation, and skills development.',
    'Increase youth engagement in climate resilience and environmental protection.',
    'Promote healthy lifestyles and social responsibility.',
    'Encourage volunteerism, civic engagement, and community service.',
];

const crossCutting = [
    'Gender equality and meaningful participation of young women.',
    'Full inclusion and representation of youth with disabilities in leadership and programs (including the Speaker).',
    'Transparency, accountability, and responsible use of resources.',
    'Youth participation in planning, implementation, and decision-making at all levels.',
    'Coverage of all 9 counties of Jonglei through county-level youth coordination.',
];

export default function WorkPlanIndex() {
    return (
        <AssociationLayout>
            <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8 sm:py-32">
                <header className="mx-auto max-w-3xl text-center">
                    <span className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">
                        Annual Work Plan 2026/2027
                    </span>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                        Jonglei State Youth Union Work Plan
                    </h1>
                    <p className="mt-6 text-base text-slate-600 sm:text-lg">
                        This Annual Work Plan sets out how the Jonglei State Youth Union will mobilise, empower, and
                        represent youth across all 9 counties in the 2026/2027 fiscal year&mdash;with a clear focus on
                        economic empowerment, peacebuilding, climate resilience, health, and inclusion of youth with
                        disabilities.
                    </p>
                </header>

                <section className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                    <div className="space-y-6">
                        <div className="rounded-3xl bg-slate-950 px-6 py-6 shadow-xl ring-1 ring-slate-800 sm:px-8 sm:py-8">
                            <h2 className="text-xl font-semibold text-white">Vision</h2>
                            <p className="mt-3 text-sm text-slate-200">
                                A united, skilled, peaceful, and economically empowered youth population contributing to
                                sustainable development in Jonglei State.
                            </p>
                            <h2 className="mt-6 text-xl font-semibold text-white">Mission</h2>
                            <p className="mt-3 text-sm text-slate-200">
                                To mobilise, empower, and represent youth through capacity building, peacebuilding
                                initiatives, economic programmes, and community development activities, with deliberate
                                inclusion of youth with disabilities.
                            </p>
                        </div>

                        <div className="rounded-3xl bg-sky-50 px-6 py-6 shadow-sm ring-1 ring-sky-100 sm:px-8 sm:py-8">
                            <h2 className="text-lg font-semibold text-slate-900">Strategic Objectives</h2>
                            <ul className="mt-4 space-y-2 text-sm text-slate-700">
                                {strategicObjectives.map((item) => (
                                    <li key={item} className="flex gap-2">
                                        <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-sky-500" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-3xl bg-white px-6 py-6 shadow-sm ring-1 ring-slate-200 sm:px-8 sm:py-8">
                            <h2 className="text-lg font-semibold text-slate-900">Program Areas</h2>
                            <p className="mt-3 text-sm text-slate-700">
                                The work plan is implemented through 7 core program areas and a cross-cutting inclusion
                                program for youth with disabilities:
                            </p>
                            <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm text-slate-700">
                                <li>Youth Economic Empowerment &amp; Livelihoods (including fishing livelihoods in the SUDD swamps)</li>
                                <li>Peacebuilding &amp; Social Cohesion</li>
                                <li>Education, Leadership &amp; Capacity Building</li>
                                <li>Climate Change &amp; Environmental Protection</li>
                                <li>Health &amp; Social Awareness</li>
                                <li>Sports, Talent &amp; Cultural Development</li>
                                <li>Volunteerism &amp; Community Service</li>
                                <li>Inclusion &amp; Youth with Disabilities (cross-cutting)</li>
                            </ol>
                            <p className="mt-4 text-sm text-slate-700">
                                You can explore the details of each program area on the{' '}
                                <a
                                    href="/programs"
                                    className="font-semibold text-sky-600 underline-offset-2 hover:underline"
                                >
                                    Programs page
                                </a>
                                .
                            </p>
                        </div>

                        <div className="rounded-3xl bg-slate-50 px-6 py-6 shadow-sm ring-1 ring-slate-200 sm:px-8 sm:py-8">
                            <h2 className="text-lg font-semibold text-slate-900">Implementation &amp; Monitoring</h2>
                            <p className="mt-3 text-sm text-slate-700">
                                Implementation will be led by the JSYU Secretariat in partnership with county youth
                                unions, State Government ministries, NGOs, and development partners. Youth structures in
                                all 9 counties will help adapt activities to local realities.
                            </p>
                            <p className="mt-3 text-sm text-slate-700">
                                Progress will be tracked through quarterly review meetings, activity and financial
                                reports, and an annual performance review, ensuring that youth themselves can hold their
                                leaders accountable.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mt-16 rounded-3xl bg-sky-900 px-6 py-8 text-slate-50 sm:px-8">
                    <h2 className="text-lg font-semibold">Cross-cutting priorities</h2>
                    <ul className="mt-4 space-y-2 text-sm">
                        {crossCutting.map((item) => (
                            <li key={item} className="flex gap-2">
                                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-sky-300" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="mt-16 rounded-3xl bg-slate-900 px-6 py-8 text-slate-50 sm:px-8">
                    <h2 className="text-lg font-semibold">Conclusion</h2>
                    <p className="mt-3 text-sm text-slate-200">
                        The Annual Work Plan 2026/2027 is a roadmap for youth empowerment, peace, and development in
                        Jonglei State. Its success depends on strong coordination, transparent leadership, and active
                        participation from youth, communities, partners, and government. Together, we can ensure that no
                        young person&mdash;including youth with disabilities&mdash;is left behind.
                    </p>
                </section>
            </div>
        </AssociationLayout>
    );
}

