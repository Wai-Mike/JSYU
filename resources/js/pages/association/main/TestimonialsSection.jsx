import { sectionImages } from '../../../constants/sectionImages';

const placeholderTestimonials = [
    {
        id: 'placeholder-1',
        name: 'Youth member',
        role: 'JSYU member placeholder',
        text: 'This is a generic placeholder testimonial. Replace with a real story from a JSYU youth member when available.',
        image: sectionImages.testimonials[0],
        alt: 'Portrait of a young South Sudanese woman',
    },
    {
        id: 'placeholder-2',
        name: 'Community participant',
        role: 'Program participant placeholder',
        text: 'This is a generic placeholder testimonial. Replace with an authentic account of program impact or leadership experience.',
        image: sectionImages.testimonials[1],
        alt: 'Portrait of a young South Sudanese man',
    },
    {
        id: 'placeholder-3',
        name: 'Youth volunteer',
        role: 'Volunteer placeholder',
        text: 'This is a generic placeholder testimonial. Replace with a verified quote from a youth volunteer or program beneficiary.',
        image: sectionImages.testimonials[2],
        alt: 'Portrait of a young South Sudanese volunteer',
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
                        Placeholder content only — replace with verified testimonials from JSYU youth when ready.
                    </p>
                </div>

                <div className="grid gap-7 md:grid-cols-3">
                    {placeholderTestimonials.map((item) => (
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
