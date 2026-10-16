import { Head, Link, useForm } from '@inertiajs/react';
import { FilePlus2 } from 'lucide-react';
import FlashAlert from '../../../components/admin/FlashAlert';
import PageHeader from '../../../components/admin/PageHeader';
import AdminLayout from '../../../layouts/AdminLayout';

const fieldClass =
    'w-full  border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-jsyu-green focus:ring-2 focus:ring-jsyu-green/20 focus:outline-none';

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
        featured_image_upload: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.posts.store'), { forceFormData: true });
    };

    return (
        <AdminLayout>
            <Head title="New post - Admin" />
            <FlashAlert />

            <PageHeader
                title="New post"
                icon={FilePlus2}
                actions={
                    <Link
                        href={route('admin.posts.index')}
                        className="border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Back to posts
                    </Link>
                }
            />

            <form onSubmit={submit} className="space-y-6 border border-slate-200/80 bg-white p-6">
                <div>
                    <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-700">
                        Title *
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className={fieldClass}
                        placeholder="Post title"
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                </div>

                <div>
                    <label htmlFor="slug" className="mb-1 block text-sm font-medium text-slate-700">
                        URL slug (leave blank to auto-generate from title)
                    </label>
                    <input
                        id="slug"
                        type="text"
                        value={data.slug}
                        onChange={(e) => setData('slug', e.target.value)}
                        className={fieldClass}
                        placeholder="url-friendly-slug"
                    />
                    {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="type" className="mb-1 block text-sm font-medium text-slate-700">
                            Type
                        </label>
                        <select id="type" value={data.type} onChange={(e) => setData('type', e.target.value)} className={fieldClass}>
                            {Object.entries(types).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                        {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                    </div>
                    <div>
                        <label htmlFor="status" className="mb-1 block text-sm font-medium text-slate-700">
                            Status
                        </label>
                        <select id="status" value={data.status} onChange={(e) => setData('status', e.target.value)} className={fieldClass}>
                            {Object.entries(statuses).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                        {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                    </div>
                </div>

                <div>
                    <label htmlFor="published_at" className="mb-1 block text-sm font-medium text-slate-700">
                        Publish date (optional)
                    </label>
                    <input
                        id="published_at"
                        type="datetime-local"
                        value={data.published_at}
                        onChange={(e) => setData('published_at', e.target.value)}
                        className={fieldClass}
                    />
                    {errors.published_at && <p className="mt-1 text-sm text-red-600">{errors.published_at}</p>}
                </div>

                <div>
                    <label htmlFor="excerpt" className="mb-1 block text-sm font-medium text-slate-700">
                        Short excerpt
                    </label>
                    <textarea
                        id="excerpt"
                        rows={2}
                        value={data.excerpt}
                        onChange={(e) => setData('excerpt', e.target.value)}
                        className={fieldClass}
                        placeholder="Brief summary for listings"
                    />
                    {errors.excerpt && <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>}
                </div>

                <div>
                    <label htmlFor="content" className="mb-1 block text-sm font-medium text-slate-700">
                        Content *
                    </label>
                    <textarea
                        id="content"
                        rows={12}
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        className={`${fieldClass} font-mono`}
                        placeholder="Full post content (HTML or plain text)"
                    />
                    {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
                </div>

                <div>
                    <label htmlFor="featured_image" className="mb-1 block text-sm font-medium text-slate-700">
                        Featured image URL
                    </label>
                    <input
                        id="featured_image"
                        type="text"
                        value={data.featured_image}
                        onChange={(e) => setData('featured_image', e.target.value)}
                        className={fieldClass}
                        placeholder="https://..."
                    />
                    {errors.featured_image && <p className="mt-1 text-sm text-red-600">{errors.featured_image}</p>}
                </div>

                <div>
                    <label htmlFor="featured_image_upload" className="mb-1 block text-sm font-medium text-slate-700">
                        Or upload an image
                    </label>
                    <input
                        id="featured_image_upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setData('featured_image_upload', e.target.files?.[0] ?? null)}
                        className={fieldClass}
                    />
                    {errors.featured_image_upload && <p className="mt-1 text-sm text-red-600">{errors.featured_image_upload}</p>}
                </div>

                <div className="flex gap-3 border-t border-slate-100 pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-jsyu-green hover:bg-jsyu-green-hover px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                        {processing ? 'Saving...' : 'Create post'}
                    </button>
                    <Link
                        href={route('admin.posts.index')}
                        className="border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </AdminLayout>
    );
}
