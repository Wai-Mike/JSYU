import { sectionImages } from '../../../constants/sectionImages';

const testimonials = [
    {
        id: 'nyandeng',
        name: 'Nyandeng Mabior',
        role: 'Youth member · Bor County',
        text: 'Through JSYU dialogues in Bor, I learned how young people from Nuer, Dinka, and Anyuak communities can sit together and push for peace in our payams. That voice now reaches county leaders.',
        image: sectionImages.testimonials[0],
        alt: 'Portrait of Nyandeng Mabior',
    },
    {
        id: 'gatwech',
        name: 'Gatwech Deng',
        role: 'Peace caravan participant · Ayod County',
        text: 'The inter-county peace football tournament brought youth from Fangak and Ayod into one pitch. We left with friendships and a shared promise to reject revenge violence in Jonglei.',
        image: sectionImages.testimonials[1],
        alt: 'Portrait of Gatwech Deng',
    },
    {
        id: 'achol',
        name: 'Achol Omot',
        role: 'Volunteer · Pochalla County',
        text: 'I joined a JSYU clean-up and tree-planting day along the river near Pochalla. Serving our Anyuak neighbours taught me that climate action and community care start with youth hands.',
        image: sectionImages.testimonials[2],
        alt: 'Portrait of Achol Omot',
    },
];

export default function TestimonialsSection() {
    return (
        <section className="relative overflow-hidden bg-jsyu-green-deep py-20 lg:py-28">
            <div className="pointer-events-none absolute inset-0 opacity-5">
                <div className="absolute left-0 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
                <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-jsyu-accent" />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <span className="text-sm font-bold uppercase tracking-wider text-jsyu-accent">Youth Stories</span>
                    <h2 className="mt-2 text-3xl font-extrabold text-white lg:text-4xl">Voices from Our Community</h2>
                    <p className="mx-auto mt-3 max-w-xl text-sm font-medium text-white/55">
                        Young people across Jonglei&apos;s nine counties sharing how the Union shapes peace, skills, and
                        daily life.
                    </p>
                </div>

                <div className="grid gap-7 md:grid-cols-3">
                    {testimonials.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm"
                        >
                            <div className="mb-4 flex items-center gap-4">
                                <img
                                    src={item.image}
                                    alt={item.alt}
                                    className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-jsyu-accent/40"
                                />
                                <div>
                                    <div className="text-sm font-bold text-white/90">{item.name}</div>
                                    <div className="text-xs font-medium text-white/50">{item.role}</div>
                                </div>
                            </div>
                            <p className="text-sm font-medium italic leading-relaxed text-white/75">
                                &ldquo;{item.text}&rdquo;
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
