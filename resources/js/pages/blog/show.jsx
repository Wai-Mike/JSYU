import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AssociationLayout from '../../layouts/AssociationLayout';
import { ArrowLeft, Calendar, MessageCircle, User } from 'lucide-react';

const typeLabels = { article: 'Article', program: 'Program', announcement: 'Announcement', resource: 'Resource' };

export default function BlogShow({ post }) {
    const { auth, flash } = usePage().props;
    const { data, setData, post: submitComment, processing, errors, reset } = useForm({
        post_id: post.id,
        body: '',
    });

    const onCommentSubmit = (e) => {
        e.preventDefault();
        submitComment(route('comments.store'), { onSuccess: () => reset('body') });
    };
    return (
        <AssociationLayout>
            <Head title={`${post.title} - Jonglei State Youth Union`} />
            <article className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8 sm:py-32">
                <Link
                    href={route('blog.index')}
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-sky-600 hover:text-sky-700"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to blog
                </Link>

                <header>
                    <span className="text-sm font-semibold uppercase tracking-wider text-sky-600">
                        {typeLabels[post.type] ?? post.type}
                    </span>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        {post.title}
                    </h1>
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        {post.published_at && (
                            <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(post.published_at).toLocaleDateString()}
                            </span>
                        )}
                        {post.user?.name && (
                            <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {post.user.name}
                            </span>
                        )}
                    </div>
                </header>

                {post.featured_image && (
                    <img
                        src={post.featured_image}
                        alt=""
                        className="mt-8 w-full rounded-xl object-cover shadow-lg"
                    />
                )}

                {post.excerpt && (
                    <p className="mt-6 text-lg text-slate-600">{post.excerpt}</p>
                )}

                <div
                    className="prose prose-slate mt-8 max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-sky-600"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Comments */}
                <section className="mt-12 border-t border-slate-200 pt-10">
                    <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
                        <MessageCircle className="h-5 w-5 text-sky-600" />
                        Comments {post.comments?.length ? `(${post.comments.length})` : ''}
                    </h2>

                    {auth?.user && (
                        <form onSubmit={onCommentSubmit} className="mt-4">
                            <textarea
                                value={data.body}
                                onChange={(e) => setData('body', e.target.value)}
                                rows={3}
                                placeholder="Add a comment..."
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:ring-sky-500"
                            />
                            {errors.body && <p className="mt-1 text-sm text-red-600">{errors.body}</p>}
                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
                            >
                                {processing ? 'Posting...' : 'Post comment'}
                            </button>
                        </form>
                    )}
                    {!auth?.user && (
                        <p className="mt-4 text-sm text-slate-500">
                            <Link href={route('login')} className="font-medium text-sky-600 hover:text-sky-700">Log in</Link> to comment.
                        </p>
                    )}

                    {flash?.success && (
                        <p className="mt-2 text-sm text-green-600">{flash.success}</p>
                    )}

                    <ul className="mt-6 space-y-4">
                        {(post.comments ?? []).map((comment) => (
                            <li key={comment.id} className="flex gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700">
                                    {comment.user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-slate-900">{comment.user?.name}</p>
                                    <p className="mt-0.5 text-sm text-slate-600 whitespace-pre-wrap">{comment.body}</p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        {comment.created_at && new Date(comment.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {(!post.comments || post.comments.length === 0) && (
                        <p className="mt-4 text-sm text-slate-500">No comments yet. Be the first to comment.</p>
                    )}
                </section>
            </article>
        </AssociationLayout>
    );
}
