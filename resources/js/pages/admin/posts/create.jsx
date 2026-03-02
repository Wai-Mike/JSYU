import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../layouts/AdminLayout';

export default function Create({ types, statuses }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        type: 'article',
        status: 'draft',
        published_at: '',
        featured_image: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.posts.store'));
    };

    return (
        <AdminLayout>
            <Head title="New post - Admin" />
            <div>
                <div className="mb-6 flex items-center gap-4">
                    <Link
                        href={route('admin.posts.index')}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        ← Back to posts
                    </Link>
                </div>
                <h1 className="mb-6 text-3xl font-bold text-gray-900">New post</h1>

                <form onSubmit={submit} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <div>
                        <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">Title *</label>
                        <input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500"
                            placeholder="Post title"
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                    </div>

                    <div>
                        <label htmlFor="slug" className="mb-1 block text-sm font-medium text-gray-700">URL slug (leave blank to auto-generate from title)</label>
                        <input
                            id="slug"
                            type="text"
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500"
                            placeholder="url-friendly-slug"
                        />
                        {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <label htmlFor="type" className="mb-1 block text-sm font-medium text-gray-700">Type</label>
                            <select
                                id="type"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500"
                            >
                                {Object.entries(types).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                            {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                        </div>
                        <div>
                            <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                            <select
                                id="status"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500"
                            >
                                {Object.entries(statuses).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                            {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="published_at" className="mb-1 block text-sm font-medium text-gray-700">Publish date (optional)</label>
                        <input
                            id="published_at"
                            type="datetime-local"
                            value={data.published_at}
                            onChange={(e) => setData('published_at', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500"
                        />
                        {errors.published_at && <p className="mt-1 text-sm text-red-600">{errors.published_at}</p>}
                    </div>

                    <div>
                        <label htmlFor="excerpt" className="mb-1 block text-sm font-medium text-gray-700">Short excerpt</label>
                        <textarea
                            id="excerpt"
                            rows={2}
                            value={data.excerpt}
                            onChange={(e) => setData('excerpt', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500"
                            placeholder="Brief summary for listings"
                        />
                        {errors.excerpt && <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>}
                    </div>

                    <div>
                        <label htmlFor="content" className="mb-1 block text-sm font-medium text-gray-700">Content *</label>
                        <textarea
                            id="content"
                            rows={12}
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-red-500 focus:ring-red-500"
                            placeholder="Full post content (HTML or plain text)"
                        />
                        {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
                    </div>

                    <div>
                        <label htmlFor="featured_image" className="mb-1 block text-sm font-medium text-gray-700">Featured image URL</label>
                        <input
                            id="featured_image"
                            type="text"
                            value={data.featured_image}
                            onChange={(e) => setData('featured_image', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500"
                            placeholder="https://..."
                        />
                        {errors.featured_image && <p className="mt-1 text-sm text-red-600">{errors.featured_image}</p>}
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Create post'}
                        </button>
                        <Link
                            href={route('admin.posts.index')}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
