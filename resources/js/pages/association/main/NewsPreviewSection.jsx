import { Link } from '@inertiajs/react';
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
                    <h2 className="font-display text-4xl font-extrabold lowercase tracking-tight text-jsyu-green-deep sm:text-5xl">
                        latest news & events
                    </h2>
                    <p className="mx-auto mt-3 max-w-lg text-sm font-medium text-jsyu-text-muted">
                        Subscribe to our updates and get the latest news from youth programs across Jonglei.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {newsPosts.map((post) => (
                        <article key={post.id} className="group bg-white">
                            <div className="aspect-[16/10] overflow-hidden bg-jsyu-green-soft">
                                <img
                                    src={post.image}
                                    alt={post.alt}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="p-5">
                                <p className="text-xs font-bold uppercase tracking-[0.12em] text-jsyu-green-muted">
                                    {post.date} · {post.category}
                                </p>
                                <h3 className="mt-2 font-display text-xl font-bold leading-snug text-jsyu-green-deep transition-colors group-hover:text-jsyu-green">
                                    {post.title}
                                </h3>
                                <p className="mt-2 line-clamp-3 text-sm font-medium leading-relaxed text-jsyu-text-muted">
                                    {post.description}
                                </p>
                                <Link
                                    href={route('blog.index')}
                                    className="mt-4 inline-block text-xs font-bold uppercase tracking-[0.14em] text-jsyu-green hover:text-jsyu-accent-hover"
                                >
                                    Read More
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
