import { Link } from '@inertiajs/react';
import { sectionImages } from '../../../constants/sectionImages';

const placeholderPosts = [
    {
        id: 'placeholder-1',
        date: 'Coming soon',
        title: 'Youth stories and program updates from across Jonglei',
        description:
            'Placeholder preview — connect the blog feed here to show the latest published posts from JSYU members and programs.',
        image: sectionImages.news[0],
        alt: 'South Sudanese youth gathering outdoors in Jonglei',
    },
    {
        id: 'placeholder-2',
        date: 'Coming soon',
        title: 'Peacebuilding and community dialogue highlights',
        description:
            'Placeholder preview — share news about youth-led peace initiatives, forums, and county-level activities.',
        image: sectionImages.news[1],
        alt: 'South Sudanese youth in a community peace dialogue under a tree',
    },
    {
        id: 'placeholder-3',
        date: 'Coming soon',
        title: 'Education, skills, and opportunity announcements',
        description:
            'Placeholder preview — highlight scholarships, training, and advocacy updates for youth across the state.',
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
                            Preview cards below are placeholders until live blog posts are surfaced here.
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
                    {placeholderPosts.map((post) => (
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
