import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../../layouts/AdminLayout';
import { CheckCircle, FileText, Pencil, Plus, Search, Trash2 } from 'lucide-react';

export default function Index({ posts, filters }) {
    const { flash } = usePage().props;
    const { data, setData, get } = useForm({
        search: filters?.search ?? '',
        type: filters?.type ?? '',
        status: filters?.status ?? '',
    });

    const handleFilter = (e) => {
        e.preventDefault();
        get(route('admin.posts.index'), { preserveState: true });
    };

    const handleDelete = (post) => {
        if (confirm(`Delete "${post.title}"?`)) {
            router.delete(route('admin.posts.destroy', post.id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Blog / Posts - Admin" />
            <div>
                {flash?.success && (
                    <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                        {flash.success}
                    </div>
                )}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">Blog &amp; Posts</h1>
                    <Link
                        href={route('admin.posts.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-red-700"
                    >
                        <Plus className="h-4 w-4" />
                        New post
                    </Link>
                </div>

                <form onSubmit={handleFilter} className="mb-6 flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-white p-4">
                    <div className="flex-1 min-w-[180px]">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={data.search}
                                onChange={(e) => setData('search', e.target.value)}
                                placeholder="Title or excerpt..."
                                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-red-500 focus:ring-red-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Type</label>
                        <select
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            className="rounded-lg border border-gray-300 py-2 pl-3 pr-8 text-sm focus:border-red-500 focus:ring-red-500"
                        >
                            <option value="">All</option>
                            <option value="article">Article</option>
                            <option value="program">Program</option>
                            <option value="announcement">Announcement</option>
                            <option value="resource">Resource</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="rounded-lg border border-gray-300 py-2 pl-3 pr-8 text-sm focus:border-red-500 focus:ring-red-500"
                        >
                            <option value="">All</option>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                    >
                        Filter
                    </button>
                </form>

                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                    <ul className="divide-y divide-gray-200">
                        {posts.data.length === 0 ? (
                            <li className="px-4 py-12 text-center text-gray-500">
                                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2">No posts yet.</p>
                                <Link href={route('admin.posts.create')} className="mt-2 inline-block text-red-600 hover:text-red-700">
                                    Create your first post
                                </Link>
                            </li>
                        ) : (
                            posts.data.map((post) => (
                                <li key={post.id} className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-gray-50">
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-medium text-gray-900">{post.title}</p>
                                        <p className="flex items-center gap-2 text-sm text-gray-500">
                                            <span className="rounded bg-gray-100 px-1.5 py-0.5">{post.type}</span>
                                            <span className="rounded bg-gray-100 px-1.5 py-0.5">{post.status}</span>
                                            {post.user?.name && <span>by {post.user.name}</span>}
                                            {post.published_at && (
                                                <span>{new Date(post.published_at).toLocaleDateString()}</span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-2">
                                        {post.status === 'draft' && (
                                            <button
                                                type="button"
                                                onClick={() => router.post(route('admin.posts.approve', post.id))}
                                                className="rounded p-2 text-green-600 hover:bg-green-50"
                                                title="Approve & publish"
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                            </button>
                                        )}
                                        <Link
                                            href={route('admin.posts.edit', post.id)}
                                            className="rounded p-2 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                                            title="Edit"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(post)}
                                            className="rounded p-2 text-gray-600 hover:bg-red-50 hover:text-red-600"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                    {posts.data.length > 0 && posts.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
                            <p className="text-sm text-gray-600">
                                Page {posts.current_page} of {posts.last_page}
                            </p>
                            <div className="flex gap-2">
                                {posts.prev_page_url && (
                                    <Link
                                        href={posts.prev_page_url}
                                        className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
                                    >
                                        Previous
                                    </Link>
                                )}
                                {posts.next_page_url && (
                                    <Link
                                        href={posts.next_page_url}
                                        className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
