export default function AboutSection() {
    return (
        <section id="about" className="relative py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl border-2 border-slate-600 bg-slate-900 px-8 py-16 sm:px-12 sm:py-20 lg:px-16 lg:py-24">
                    <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30" style={{ backgroundImage: "url('/images/hero-section.jpeg')" }} />
                    <div className="absolute inset-0 bg-slate-900/75" />
                    <div className="relative z-10 mx-auto max-w-3xl text-center">
                        <span className="text-sm font-semibold uppercase tracking-wider text-sky-400">About Us</span>
                        <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            The voice of youth in Jonglei State
                        </h2>
                        <p className="mt-6 text-lg leading-relaxed text-slate-300">
                            The Jonglei State Youth Union (JSYI) is an independent, non-political, and non-profit civil society
                            organization serving as the primary representative body for young people in Jonglei State,
                            South Sudan. We comprise members from all counties of Jonglei, including Lou Nuer, Dinka,
                            and Murle communities.
                        </p>
                        <p className="mt-6 text-lg leading-relaxed text-slate-300">
                            Under the framework of the South Sudan National Youth Union (SSNYU) and National Youth
                            Development Policy, we work to institutionalize youth representation, facilitate peacebuilding
                            dialogues, and advocate for education, vocational training, and economic opportunities for
                            young people across the state.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
