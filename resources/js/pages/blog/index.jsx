import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import AssociationLayout from '../../layouts/AssociationLayout';
import { Calendar, FileText, Heart, MessageCircle, PenSquare, ThumbsUp } from 'lucide-react';
import { useState } from 'react';

export default function BlogIndex({ posts, filters }) {
    const { auth, flash } = usePage().props;

    // Filter form
    const { data: filterData, setData: setFilterData, get } = useForm({
        type: filters?.type ?? '',
    });

    // Inline comment form (feed-style)
    const [activePostId, setActivePostId] = useState(null);
    const {
        data: commentData,
        setData: setCommentData,
        post: postComment,
        processing: commenting,
        errors: commentErrors,
        reset: resetComment,
    } = useForm({
        post_id: null,
        body: '',
    });

    const handleFilter = (e) => {
        e?.preventDefault();
        get(route('blog.index'), { preserveState: true });
    };

    const typeLabels = { article: 'Article', program: 'Program', announcement: 'Announcement', resource: 'Resource' };

    return (
        <AssociationLayout>
            <Head title="Blog - Jonglei State Youth Union" />
            <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 sm:py-32">
                <div className="mx-auto flex max-w-5xl flex-col gap-6 lg:flex-row">
                    {/* Left column: feed */}
                    <div className="mx-auto w-full max-w-2xl">
                        {flash?.success && (
                            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                                {flash.success}
                            </div>
                        )}

                        <header className="mb-4">
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
                                Youth stories &amp; updates
                            </span>
                            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Jonglei youth newsfeed
                            </h1>
                            <p className="mt-2 text-sm text-slate-600">
                                Share experiences, highlight programs, and stay connected with youth across Jonglei State.
                            </p>
                        </header>

                        {/* Composer, like Facebook */} 
                        {auth?.user && (
                            <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-600 text-sm font-semibold text-white">
                                        {auth.user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => (window.location.href = route('blog.create'))}
                                        className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-left text-sm text-slate-500 hover:bg-slate-100"
                                    >
                                        Share an update with Jonglei youth…
                                    </button>
                                </div>
                                <p className="mt-2 text-[0.7rem] text-slate-400">
                                    Posts are reviewed by admins before appearing in the feed.
                                </p>
                            </div>
                        )}

                        {/* Filter */}
                        <div className="mb-4 flex justify-end">
                            <form onSubmit={handleFilter} className="flex gap-2">
                                <select
                                    value={filterData.type}
                                    onChange={(e) => {
                                        setFilterData('type', e.target.value);
                                        get(route('blog.index'), { preserveState: true });
                                    }}
                                    className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 focus:border-sky-500 focus:ring-sky-500"
                                >
                                    <option value="">All types</option>
                                    {Object.entries(typeLabels).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                                {filterData.type && (
                                    <button
                                        type="button"
                                        onClick={() => { setFilterData('type', ''); get(route('blog.index')); }}
                                        className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
                                    >
                                        Clear
                                    </button>
                                )}
                            </form>
                        </div>

                        {posts.data.length === 0 ? (
                            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center">
                                <FileText className="mx-auto h-10 w-10 text-slate-400" />
                                <p className="mt-3 text-slate-600">No posts yet. Be the first to share something.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {posts.data.map((post) => (
                                    <article
                                        key={post.id}
                                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                                    >
                                        {/* Header */} 
                                        <div className="mb-3 flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700">
                                                {post.user?.name?.charAt(0).toUpperCase() ?? '?'}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-900">
                                                    {post.user?.name ?? 'Jonglei Youth Member'}
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    {post.published_at
                                                        ? new Date(post.published_at).toLocaleDateString()
                                                        : '—'}{' '}
                                                    · {typeLabels[post.type] ?? post.type}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Body */} 
                                        <h2 className="text-base font-semibold text-slate-900">
                                            {post.title}
                                        </h2>
                                        {post.excerpt && (
                                            <p className="mt-1 text-sm text-slate-700">
                                                {post.excerpt}
                                            </p>
                                        )}
                                        {post.featured_image && (
                                            <img
                                                src={post.featured_image}
                                                alt=""
                                                className="mt-3 max-h-72 w-full rounded-xl object-cover"
                                            />
                                        )}

                                        {/* Footer actions */} 
                                        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                                            <span>
                                                {post.likes_count ?? 0} likes · {post.hearts_count ?? 0} hearts ·{' '}
                                                {post.comments_count
                                                    ? `${post.comments_count} comment${post.comments_count === 1 ? '' : 's'}`
                                                    : 'No comments yet'}
                                            </span>
                                        </div>
                                        <div className="mt-2 border-t border-slate-100 pt-1">
                                            <div className="flex items-center justify-around text-xs font-medium text-slate-500">
                                                {(() => {
                                                    const reactions = post.current_user_reactions || {};
                                                    const liked = !!reactions.like;
                                                    const hearted = !!reactions.heart;
                                                    return (
                                                        <>
                                                            <button
                                                                type="button"
                                                                className={`flex items-center gap-1 rounded-md px-3 py-1.5 ${
                                                                    liked
                                                                        ? 'bg-sky-50 text-sky-600'
                                                                        : 'hover:bg-slate-50'
                                                                }`}
                                                                onClick={() => {
                                                                    if (!auth?.user) {
                                                                        window.location.href = route('login');
                                                                        return;
                                                                    }
                                                                    router.post(route('reactions.toggle'), {
                                                                        post_id: post.id,
                                                                        type: 'like',
                                                                    }, { preserveScroll: true });
                                                                }}
                                                            >
                                                                <ThumbsUp className={`h-4 w-4 ${liked ? 'text-sky-600' : ''}`} />
                                                                Like
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className={`flex items-center gap-1 rounded-md px-3 py-1.5 ${
                                                                    hearted
                                                                        ? 'bg-red-50 text-red-500'
                                                                        : 'hover:bg-slate-50'
                                                                }`}
                                                                onClick={() => {
                                                                    if (!auth?.user) {
                                                                        window.location.href = route('login');
                                                                        return;
                                                                    }
                                                                    router.post(route('reactions.toggle'), {
                                                                        post_id: post.id,
                                                                        type: 'heart',
                                                                    }, { preserveScroll: true });
                                                                }}
                                                            >
                                                                <Heart className={`h-4 w-4 ${hearted ? 'fill-red-500 text-red-500' : ''}`} />
                                                                Heart
                                                            </button>
                                                        </>
                                                    );
                                                })()}
                                                <button
                                                    type="button"
                                                    className="flex items-center gap-1 rounded-md px-3 py-1.5 hover:bg-slate-50"
                                                    onClick={() => {
                                                        if (!auth?.user) {
                                                            window.location.href = route('login');
                                                            return;
                                                        }
                                                        setActivePostId(post.id === activePostId ? null : post.id);
                                                        setCommentData('post_id', post.id);
                                                    }}
                                                >
                                                    <MessageCircle className="h-4 w-4" />
                                                    Comment
                                                </button>
                                            </div>
                                        </div>

                                        {/* Inline comment composer */} 
                                        {auth?.user && activePostId === post.id && (
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    postComment(route('comments.store'), {
                                                        onSuccess: () => {
                                                            resetComment('body');
                                                            setActivePostId(null);
                                                        },
                                                    });
                                                }}
                                                className="mt-2 flex gap-2"
                                            >
                                                <textarea
                                                    rows={2}
                                                    value={commentData.body}
                                                    onChange={(e) => setCommentData('body', e.target.value)}
                                                    placeholder="Write a comment..."
                                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-sky-500 focus:ring-sky-500"
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={commenting}
                                                    className="self-end rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-700 disabled:opacity-50"
                                                >
                                                    Post
                                                </button>
                                            </form>
                                        )}
                                        {commentErrors?.body && activePostId === post.id && (
                                            <p className="mt-1 text-xs text-red-600">{commentErrors.body}</p>
                                        )}
                                    </article>
                                ))}
                            </div>
                        )}

                        {posts.data.length > 0 && posts.last_page > 1 && (
                            <div className="mt-6 flex justify-center gap-2 text-xs">
                                {posts.prev_page_url && (
                                    <Link
                                        href={posts.prev_page_url}
                                        className="rounded-full border border-slate-300 px-4 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                        Previous
                                    </Link>
                                )}
                                <span className="flex items-center px-4 py-1.5 text-slate-600">
                                    Page {posts.current_page} of {posts.last_page}
                                </span>
                                {posts.next_page_url && (
                                    <Link
                                        href={posts.next_page_url}
                                        className="rounded-full border border-slate-300 px-4 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right column: small info sidebar (optional) */}
                    <aside className="hidden w-full max-w-xs space-y-4 text-sm text-slate-600 lg:block">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                About this space
                            </h2>
                            <p className="mt-2 text-sm text-slate-600">
                                This feed is for youth across Jonglei to share stories, programs, and ideas that move the
                                state forward.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </AssociationLayout>
    );
}
