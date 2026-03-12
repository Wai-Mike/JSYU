import { Head, Link, useForm } from '@inertiajs/react';
import AssociationLayout from '../../layouts/AssociationLayout';

export default function BlogCreate({ types }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        excerpt: '',
        content: '',
        type: 'article',
        featured_image_upload: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('blog.store'), { forceFormData: true });
    };

    return (
        <AssociationLayout>
            <Head title="Write a post - Jonglei State Youth Union" />
            <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8 sm:py-32">
                <Link
                    href={route('blog.index')}
                    className="mb-6 inline-block text-sm font-medium text-sky-600 hover:text-sky-700"
                >
                    ← Back to blog
                </Link>
                <h1 className="mb-2 text-3xl font-bold text-slate-900">Write a post</h1>
                <p className="mb-8 text-slate-600">
                    Your post will be reviewed by an admin before it appears on the blog.
                </p>

                <form onSubmit={submit} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-700">Title *</label>
                        <input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:ring-sky-500"
                            placeholder="Post title"
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                    </div>

                    <div>
                        <label htmlFor="type" className="mb-1 block text-sm font-medium text-slate-700">Type</label>
                        <select
                            id="type"
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:ring-sky-500"
                        >
                            {Object.entries(types).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                        {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                    </div>

                    <div>
                        <label htmlFor="excerpt" className="mb-1 block text-sm font-medium text-slate-700">Short summary (optional)</label>
                        <textarea
                            id="excerpt"
                            rows={2}
                            value={data.excerpt}
                            onChange={(e) => setData('excerpt', e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:ring-sky-500"
                            placeholder="Brief summary"
                        />
                        {errors.excerpt && <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>}
                    </div>

                    <div>
                        <label htmlFor="content" className="mb-1 block text-sm font-medium text-slate-700">Content *</label>
                        <textarea
                            id="content"
                            rows={10}
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:ring-sky-500"
                            placeholder="Write your post..."
                        />
                        {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
                    </div>

                    <div>
                        <label htmlFor="featured_image_upload" className="mb-1 block text-sm font-medium text-slate-700">
                            Featured image (optional)
                        </label>
                        <input
                            id="featured_image_upload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('featured_image_upload', e.target.files?.[0] ?? null)}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:ring-sky-500"
                        />
                        {errors.featured_image_upload && (
                            <p className="mt-1 text-sm text-red-600">{errors.featured_image_upload}</p>
                        )}
                        <p className="mt-1 text-xs text-slate-500">
                            Add a photo for your article/program (max 4MB).
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
                        >
                            {processing ? 'Submitting...' : 'Submit for approval'}
                        </button>
                        <Link
                            href={route('blog.index')}
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AssociationLayout>
    );
}
