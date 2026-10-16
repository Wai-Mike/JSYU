import { Head, Link, router, useForm } from '@inertiajs/react';
import { CheckCircle, FileText, Pencil, Plus, Trash2 } from 'lucide-react';
import DataTable, { TableCell } from '../../../components/admin/DataTable';
import FilterBar, { FilterButton, FilterSelect } from '../../../components/admin/FilterBar';
import FlashAlert from '../../../components/admin/FlashAlert';
import PageHeader from '../../../components/admin/PageHeader';
import StatusBadge from '../../../components/admin/StatusBadge';
import AdminLayout from '../../../layouts/AdminLayout';

function statusVariant(status) {
    if (status === 'published') return 'green';
    if (status === 'draft') return 'amber';
    if (status === 'archived') return 'gray';
    return 'gray';
}

function typeVariant(type) {
    if (type === 'program') return 'soft';
    if (type === 'announcement') return 'amber';
    return 'gray';
}

export default function Index({ posts, filters, canPublish = false }) {
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

    const columns = [
        { key: 'title', label: 'Title' },
        { key: 'type', label: 'Type' },
        { key: 'status', label: 'Status' },
        { key: 'author', label: 'Author' },
        { key: 'published', label: 'Published' },
        { key: 'actions', label: '', align: 'right' },
    ];

    return (
        <AdminLayout>
            <Head title="Blog / Posts - Admin" />
            <FlashAlert />

            <PageHeader
                title="Blog & Posts"
                icon={FileText}
                actions={
                    <Link
                        href={route('admin.posts.create')}
                        className="bg-jsyu-green hover:bg-jsyu-green-hover inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white"
                    >
                        <Plus className="h-4 w-4" />
                        New post
                    </Link>
                }
            />

            <FilterBar
                onSubmit={handleFilter}
                searchValue={data.search}
                onSearchChange={(v) => setData('search', v)}
                searchPlaceholder="Search title or excerpt..."
            >
                <FilterSelect label="Type" value={data.type} onChange={(v) => setData('type', v)}>
                    <option value="">All types</option>
                    <option value="article">Article</option>
                    <option value="program">Program</option>
                    <option value="announcement">Announcement</option>
                    <option value="resource">Resource</option>
                </FilterSelect>
                <FilterSelect label="Status" value={data.status} onChange={(v) => setData('status', v)}>
                    <option value="">All statuses</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                </FilterSelect>
                <FilterButton>Filter</FilterButton>
            </FilterBar>

            <DataTable
                columns={columns}
                isEmpty={posts.data.length === 0}
                empty={
                    <div>
                        <FileText className="mx-auto h-10 w-10 text-slate-300" />
                        <p className="mt-2">No posts yet.</p>
                        <Link
                            href={route('admin.posts.create')}
                            className="text-jsyu-green hover:text-jsyu-green-hover mt-2 inline-block font-medium"
                        >
                            Create your first post
                        </Link>
                    </div>
                }
                footer={
                    posts.data.length > 0 && posts.last_page > 1 ? (
                        <div className="flex items-center justify-between text-sm text-slate-600">
                            <p>
                                Page {posts.current_page} of {posts.last_page}
                            </p>
                            <div className="flex gap-2">
                                {posts.prev_page_url && (
                                    <Link href={posts.prev_page_url} className="border border-slate-200 px-3 py-1.5 hover:bg-slate-50">
                                        Previous
                                    </Link>
                                )}
                                {posts.next_page_url && (
                                    <Link href={posts.next_page_url} className="border border-slate-200 px-3 py-1.5 hover:bg-slate-50">
                                        Next
                                    </Link>
                                )}
                            </div>
                        </div>
                    ) : null
                }
            >
                {posts.data.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-50/80">
                        <TableCell className="font-medium text-slate-900">
                            <span className="line-clamp-1">{post.title}</span>
                        </TableCell>
                        <TableCell>
                            <StatusBadge variant={typeVariant(post.type)}>{post.type}</StatusBadge>
                        </TableCell>
                        <TableCell>
                            <StatusBadge variant={statusVariant(post.status)} dot>
                                {post.status}
                            </StatusBadge>
                        </TableCell>
                        <TableCell className="text-slate-500">{post.user?.name ?? '—'}</TableCell>
                        <TableCell className="text-slate-500">{post.published_at ? new Date(post.published_at).toLocaleDateString() : '—'}</TableCell>
                        <TableCell align="right">
                            <div className="flex items-center justify-end gap-1">
                                {post.status === 'draft' && canPublish && (
                                    <button
                                        type="button"
                                        onClick={() => router.post(route('admin.posts.approve', post.id))}
                                        className="p-2 text-emerald-600 hover:bg-emerald-50"
                                        title="Approve & publish"
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                    </button>
                                )}
                                {/* Live posts can only be changed by publishers */}
                                {(post.status !== 'published' || canPublish) && (
                                    <>
                                        <Link
                                            href={route('admin.posts.edit', post.id)}
                                            className="text-jsyu-green hover:bg-jsyu-green-light px-2.5 py-1.5 text-xs font-semibold"
                                            title="Edit"
                                        >
                                            <span className="inline-flex items-center gap-1">
                                                <Pencil className="h-3.5 w-3.5" />
                                                Edit
                                            </span>
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(post)}
                                            className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </TableCell>
                    </tr>
                ))}
            </DataTable>
        </AdminLayout>
    );
}
