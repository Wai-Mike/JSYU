import { Link } from '@inertiajs/react';
import Reveal from '../../../components/Reveal';
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
            {panels.map((panel, i) => (
                <Reveal key={panel.label} delay={i * 0.1} from="none" scale>
                    <Link href={panel.href} className="group bg-jsyu-green-deep relative block aspect-[4/3] overflow-hidden">
                        <img
                            src={panel.image}
                            alt={panel.label}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="bg-jsyu-green-deep/35 group-hover:bg-jsyu-green-deep/55 absolute inset-0 transition-colors" />
                        <div className="absolute inset-x-0 bottom-0 p-4">
                            <p className="font-display text-lg font-bold tracking-wide text-white uppercase">{panel.label}</p>
                            <p className="text-jsyu-accent text-xs font-bold tracking-[0.14em] uppercase">View portfolio</p>
                        </div>
                    </Link>
                </Reveal>
            ))}
        </section>
    );
}
