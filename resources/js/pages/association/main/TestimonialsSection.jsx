import { useEffect, useState } from 'react';
import { sectionImages } from '../../../constants/sectionImages';

const testimonials = [
    {
        id: 'nyandeng',
        name: 'Nyandeng Mabior',
        role: 'Youth member · Bor County',
        text: 'Through JSYU dialogues in Bor, I learned how young people from Nuer, Dinka, and Anyuak communities can sit together and push for peace in our payams.',
        image: sectionImages.testimonials[0],
    },
    {
        id: 'gatwech',
        name: 'Gatwech Deng',
        role: 'Peace caravan participant · Ayod County',
        text: 'The inter-county peace football tournament brought youth from Fangak and Ayod into one pitch. We left with friendships and a shared promise to reject revenge violence.',
        image: sectionImages.testimonials[1],
    },
    {
        id: 'achol',
        name: 'Achol Omot',
        role: 'Volunteer · Pochalla County',
        text: 'I joined a JSYU clean-up and tree-planting day near Pochalla. Serving our neighbours taught me that climate action and community care start with youth hands.',
        image: sectionImages.testimonials[2],
    },
];

export default function TestimonialsSection() {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActive((prev) => (prev + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const item = testimonials[active];

    return (
        <section className="bg-jsyu-green-deep py-20 lg:py-28">
            <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
                <img
                    key={item.id}
                    src={item.image}
                    alt={item.name}
                    className="mx-auto h-24 w-24 object-cover ring-4 ring-jsyu-accent/40 transition-opacity duration-500"
                />
                <p className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-jsyu-accent">{item.name}</p>
                <p className="mt-1 text-xs font-medium text-white/50">{item.role}</p>
                <blockquote className="mt-8 font-display text-2xl font-bold leading-snug text-white sm:text-3xl lg:text-4xl">
                    &ldquo;{item.text}&rdquo;
                </blockquote>

                <div className="mt-8 flex justify-center gap-2">
                    {testimonials.map((t, index) => (
                        <button
                            key={t.id}
                            type="button"
                            aria-label={`Show testimonial from ${t.name}`}
                            onClick={() => setActive(index)}
                            className={`h-2 w-2  transition-colors ${
                                index === active ? 'bg-jsyu-accent' : 'bg-white/30 hover:bg-white/50'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
