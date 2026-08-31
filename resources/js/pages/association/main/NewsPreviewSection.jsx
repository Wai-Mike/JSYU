import { Link } from '@inertiajs/react';
import { sectionImages } from '../../../constants/sectionImages';

const newsPosts = [
    {
        id: 'bor-forum',
        date: '12 March 2026',
        title: 'County youth forum opens in Bor with all nine counties represented',
        description:
            'JSYU convened Nuer, Dinka, and Anyuak youth leaders in Bor to set shared priorities on livelihoods, peace, and flood preparedness for the 2026/2030 term.',
        image: sectionImages.news[0],
        alt: 'South Sudanese youth gathering outdoors in Jonglei',
    },
    {
        id: 'ayod-peace',
        date: '28 February 2026',
        title: 'Peace caravan links Ayod and Fangak youth ahead of rainy season',
        description:
            'Football matches and mediation training brought young people together to reduce revenge attacks and strengthen social cohesion along the White Nile corridor.',
        image: sectionImages.news[1],
        alt: 'South Sudanese youth in a community peace dialogue under a tree',
    },
    {
        id: 'pochalla-skills',
        date: '5 February 2026',
        title: 'Vocational skills week launches for youth in Pochalla and Twic East',
        description:
            'Carpentry, tailoring, and ICT sessions opened under the Economic Empowerment program, with places reserved for young women and youth with disabilities.',
        image: sectionImages.news[2],
        alt: 'South Sudanese youth learning together in an outdoor classroom',
    },
];

export default function NewsPreviewSection() {
    return (
        <section className="bg-white py-20 lg:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 flex items-end justify-between">
                    <div>
                        <span className="text-sm font-bold uppercase tracking-wider text-jsyu-green">Latest</span>
                        <h2 className="mt-2 text-3xl font-extrabold text-jsyu-green-deep lg:text-4xl">
                            News & Events
                        </h2>
                        <p className="mt-2 text-sm font-medium text-jsyu-text-muted">
                            Updates from youth programs and gatherings across Jonglei State.
                        </p>
                    </div>
                    <Link
                        href={route('blog.index')}
                        className="hidden rounded-full border border-jsyu-green/30 px-5 py-2 text-sm font-bold text-jsyu-green transition-colors hover:bg-jsyu-green-light sm:inline-flex"
                    >
                        View All →
                    </Link>
                </div>

                <div className="grid gap-7 md:grid-cols-3">
                    {newsPosts.map((post) => (
                        <article
                            key={post.id}
                            className="group overflow-hidden rounded-2xl border border-jsyu-green-soft bg-jsyu-green-light transition-shadow duration-200 hover:shadow-lg"
                        >
                            <div className="aspect-[16/10] overflow-hidden bg-jsyu-green/10">
                                <img
                                    src={post.image}
                                    alt={post.alt}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="p-5">
                                <p className="mb-3 text-xs font-medium text-jsyu-text-muted">{post.date}</p>
                                <h3 className="mb-2 text-base font-bold leading-snug text-jsyu-green-deep transition-colors group-hover:text-jsyu-green">
                                    {post.title}
                                </h3>
                                <p className="mb-4 line-clamp-2 text-sm font-medium leading-relaxed text-jsyu-text-muted">
                                    {post.description}
                                </p>
                                <Link
                                    href={route('blog.index')}
                                    className="text-sm font-bold text-jsyu-green hover:underline"
                                >
                                    Read More →
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-8 text-center sm:hidden">
                    <Link
                        href={route('blog.index')}
                        className="inline-flex rounded-full border border-jsyu-green/30 px-5 py-2 text-sm font-bold text-jsyu-green"
                    >
                        View All News →
                    </Link>
                </div>
            </div>
        </section>
    );
}
