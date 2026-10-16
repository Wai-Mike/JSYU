import { Link } from '@inertiajs/react';
import Reveal from '../../../components/Reveal';
import { sectionImages } from '../../../constants/sectionImages';

const newsPosts = [
    {
        id: 'bor-forum',
        date: '12 March 2026',
        category: 'Community',
        title: 'County youth forum opens in Bor with all nine counties represented',
        description:
            'JSYU convened Nuer, Dinka, and Anyuak youth leaders in Bor to set shared priorities on livelihoods, peace, and flood preparedness for the 2026/2030 term.',
        image: sectionImages.news[0],
        alt: 'South Sudanese youth gathering outdoors in Jonglei',
    },
    {
        id: 'ayod-peace',
        date: '28 February 2026',
        category: 'Peace',
        title: 'Peace caravan links Ayod and Fangak youth ahead of rainy season',
        description:
            'Football matches and mediation training brought young people together to reduce revenge attacks and strengthen social cohesion along the White Nile corridor.',
        image: sectionImages.news[1],
        alt: 'South Sudanese youth in a community peace dialogue under a tree',
    },
    {
        id: 'pochalla-skills',
        date: '5 February 2026',
        category: 'Education',
        title: 'Vocational skills week launches for youth in Pochalla and Twic East',
        description:
            'Carpentry, tailoring, and ICT sessions opened under the Economic Empowerment program, with places reserved for young women and youth with disabilities.',
        image: sectionImages.news[2],
        alt: 'South Sudanese youth learning together in an outdoor classroom',
    },
];

export default function NewsPreviewSection() {
    return (
        <section className="bg-jsyu-green-light py-20 lg:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-14 text-center">
                    <h2 className="font-display text-jsyu-green-deep text-4xl font-extrabold tracking-tight lowercase sm:text-5xl">
                        latest news & events
                    </h2>
                    <p className="text-jsyu-text-muted mx-auto mt-3 max-w-lg text-sm font-medium">
                        Subscribe to our updates and get the latest news from youth programs across Jonglei.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {newsPosts.map((post, i) => (
                        <Reveal as="article" key={post.id} delay={i * 0.12} className="group bg-white transition-shadow duration-300 hover:shadow-xl">
                            <div className="bg-jsyu-green-soft aspect-[16/10] overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.alt}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="p-5">
                                <p className="text-jsyu-green-muted text-xs font-bold tracking-[0.12em] uppercase">
                                    {post.date} · {post.category}
                                </p>
                                <h3 className="font-display text-jsyu-green-deep group-hover:text-jsyu-green mt-2 text-xl leading-snug font-bold transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-jsyu-text-muted mt-2 line-clamp-3 text-sm leading-relaxed font-medium">{post.description}</p>
                                <Link
                                    href={route('blog.index')}
                                    className="text-jsyu-green hover:text-jsyu-accent-hover mt-4 inline-block text-xs font-bold tracking-[0.14em] uppercase"
                                >
                                    Read More
                                </Link>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
