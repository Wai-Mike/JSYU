import { Link } from '@inertiajs/react';
import { sectionImages } from '../../../constants/sectionImages';

const panels = [
    { label: 'Community', image: sectionImages.news[0], href: route('blog.index') },
    { label: 'Peace', image: sectionImages.news[1], href: route('programs') },
    { label: 'Education', image: sectionImages.news[2], href: route('programs') },
    { label: 'Leadership', image: sectionImages.chairman, href: '/#about' },
];

export default function ImageRibbonSection() {
    return (
        <section className="grid grid-cols-2 lg:grid-cols-4">
            {panels.map((panel) => (
                <Link
                    key={panel.label}
                    href={panel.href}
                    className="group relative aspect-[4/3] overflow-hidden bg-jsyu-green-deep"
                >
                    <img
                        src={panel.image}
                        alt={panel.label}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-jsyu-green-deep/35 transition-colors group-hover:bg-jsyu-green-deep/55" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                        <p className="font-display text-lg font-bold uppercase tracking-wide text-white">
                            {panel.label}
                        </p>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-jsyu-accent">
                            View portfolio
                        </p>
                    </div>
                </Link>
            ))}
        </section>
    );
}
