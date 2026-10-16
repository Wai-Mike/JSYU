import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import AssociationLayout from '../../layouts/AssociationLayout';
import { Calendar, FileText, Heart, Image as ImageIcon, MessageCircle, Smile, ThumbsUp, Video } from 'lucide-react';
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
            <div className="bg-jsyu-green-deep">
                <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
                    <span className="text-xs font-bold uppercase tracking-[0.22em] text-jsyu-accent">
                        Youth stories &amp; updates
                    </span>
                    <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                        latest news &amp; events
                    </h1>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
                <div className="mx-auto flex max-w-5xl flex-col gap-6 lg:flex-row">
                    {/* Left column: feed */}
                    <div className="mx-auto w-full max-w-2xl">
                        {flash?.success && (
                            <div className="mb-4 border border-jsyu-accent/40 bg-jsyu-accent/15 px-4 py-3 text-sm text-jsyu-green-deep">
                                {flash.success}
                            </div>
                        )}

                        {/* Composer (Facebook/Instagram-style) */}
                        {auth?.user && (
                            <div className="mb-4 border border-slate-200 bg-white p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-jsyu-green text-sm font-semibold text-white">
                                        {auth.user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => (window.location.href = route('blog.create'))}
                                        className="flex-1 bg-slate-100 px-4 py-2.5 text-left text-sm text-slate-600 transition hover:bg-slate-200"
                                    >
                                        What&apos;s on your mind, {auth.user.name?.split(' ')?.[0] ?? 'friend'}?
                                    </button>
                                </div>

                                <div className="mt-3 border-t border-slate-100 pt-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <button
                                            type="button"
                                            onClick={() => (window.location.href = route('blog.create'))}
                                            className="flex w-full items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 sm:text-sm"
                                        >
                                            <ImageIcon className="h-4 w-4 text-emerald-500" />
                                            Photo
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => (window.location.href = route('blog.create'))}
                                            className="flex w-full items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 sm:text-sm"
                                        >
                                            <Video className="h-4 w-4 text-rose-500" />
                                            Video
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => (window.location.href = route('blog.create'))}
                                            className="flex w-full items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 sm:text-sm"
                                        >
                                            <Smile className="h-4 w-4 text-amber-500" />
                                            Feeling
                                        </button>
                                    </div>
                                    <p className="mt-2 text-[0.7rem] text-slate-400">
                                        Posts are reviewed by admins before appearing in the feed.
                                    </p>
                                </div>
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
                                    className="border border-slate-300 px-3 py-2 text-xs text-slate-700 focus:border-jsyu-green focus:ring-jsyu-green"
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
                                        className="border border-slate-300 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
                                    >
                                        Clear
                                    </button>
                                )}
                            </form>
                        </div>

                        {posts.data.length === 0 ? (
                            <div className="mt-4 border border-slate-200 bg-slate-50 p-10 text-center">
                                <FileText className="mx-auto h-10 w-10 text-slate-400" />
                                <p className="mt-3 text-slate-600">No posts yet. Be the first to share something.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {posts.data.map((post) => (
                                    <article
                                        key={post.id}
                                        className="border border-slate-200 bg-white p-4"
                                    >
                                        {/* Header */} 
                                        <div className="mb-3 flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center bg-jsyu-green-light text-sm font-semibold text-jsyu-green-hover">
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
                                        {post.excerpt && <p className="mt-1 text-sm text-slate-700">{post.excerpt}</p>}
                                        {post.featured_image && (
                                            <div className="mt-3 overflow-hidden bg-slate-100">
                                                <img
                                                    src={post.featured_image}
                                                    alt=""
                                                    className="h-56 w-full object-cover sm:h-72"
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}
                                        {post.content && (
                                            <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                                                {post.content}
                                            </div>
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
                                                                className={`flex items-center gap-1  px-3 py-1.5 ${
                                                                    liked
                                                                        ? 'bg-jsyu-green-light text-jsyu-green'
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
                                                                <ThumbsUp className={`h-4 w-4 ${liked ? 'text-jsyu-green' : ''}`} />
                                                                Like
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className={`flex items-center gap-1  px-3 py-1.5 ${
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
                                                    className="flex items-center gap-1 px-3 py-1.5 hover:bg-slate-50"
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
                                                    className="w-full border border-slate-300 px-3 py-2 text-xs focus:border-jsyu-green focus:ring-jsyu-green"
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={commenting}
                                                    className="self-end bg-jsyu-green px-3 py-1.5 text-xs font-medium text-white hover:bg-jsyu-green-hover disabled:opacity-50"
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
                                        className="border border-slate-300 px-4 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
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
                                        className="border border-slate-300 px-4 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right column: small info sidebar (optional) */}
                    <aside className="hidden w-full max-w-xs space-y-4 text-sm text-slate-600 lg:block">
                        <div className="border border-slate-200 bg-white p-4">
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
