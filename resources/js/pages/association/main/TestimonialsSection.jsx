const placeholderTestimonials = [
    {
        id: 'placeholder-1',
        role: 'Youth member placeholder',
        text: 'This is a generic placeholder testimonial. Replace with a real story from a JSYU youth member when available.',
    },
    {
        id: 'placeholder-2',
        role: 'Community participant placeholder',
        text: 'This is a generic placeholder testimonial. Replace with an authentic account of program impact or leadership experience.',
    },
    {
        id: 'placeholder-3',
        role: 'Volunteer placeholder',
        text: 'This is a generic placeholder testimonial. Replace with a verified quote from a youth volunteer or program beneficiary.',
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
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-jsyu-accent/40 bg-jsyu-green/25 text-sm font-bold text-white/75">
                                    JS
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white/90">Placeholder</div>
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
