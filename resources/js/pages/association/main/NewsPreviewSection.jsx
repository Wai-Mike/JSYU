import { Link } from '@inertiajs/react';
import { sectionImages } from '../../../constants/sectionImages';

const placeholderPosts = [
    {
        id: 'placeholder-1',
        category: 'Updates',
        date: 'Coming soon',
        title: 'Youth stories and program updates from across Jonglei',
        description:
            'Placeholder preview — connect the blog feed here to show the latest published posts from JSYU members and programs.',
        image: sectionImages.news[0],
    },
    {
        id: 'placeholder-2',
        category: 'Programs',
        date: 'Coming soon',
        title: 'Peacebuilding and community dialogue highlights',
        description:
            'Placeholder preview — share news about youth-led peace initiatives, forums, and county-level activities.',
        image: sectionImages.news[1],
    },
    {
        id: 'placeholder-3',
        category: 'Community',
        date: 'Coming soon',
        title: 'Education, skills, and opportunity announcements',
        description:
            'Placeholder preview — highlight scholarships, training, and advocacy updates for youth across the state.',
        image: sectionImages.news[2],
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
                                    alt=""
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="p-5">
                                <div className="mb-3 flex items-center gap-3">
                                    <span className="rounded-full bg-jsyu-green/10 px-2.5 py-1 text-xs font-bold text-jsyu-green">
                                        {post.category}
                                    </span>
                                    <span className="text-xs font-medium text-jsyu-text-muted">{post.date}</span>
                                </div>
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
