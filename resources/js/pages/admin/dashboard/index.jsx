import { Link, usePage } from '@inertiajs/react';
import AdminLayout from '../../../layouts/AdminLayout';
import { FileText, Users } from 'lucide-react';

export default function Dashboard() {
    const { flash } = usePage().props;
    return (
        <AdminLayout>
            <div>
                {flash?.success && (
                    <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                        {flash.success}
                    </div>
                )}
                <div className="mb-8 rounded-2xl border border-sky-100 bg-white/80 p-6 shadow-sm backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Admin</p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Manage blog posts, approve community submissions, and promote trusted users to admin.
                    </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Link
                        href={route('admin.posts.index')}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
                    >
                        <div className="rounded-2xl bg-sky-100 p-3">
                            <FileText className="h-6 w-6 text-sky-700" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">Blog &amp; Posts</p>
                            <p className="text-sm text-slate-500">Create, edit, and approve articles, programs, and announcements</p>
                        </div>
                    </Link>
                    <Link
                        href={route('admin.users.index')}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
                    >
                        <div className="rounded-2xl bg-sky-100 p-3">
                            <Users className="h-6 w-6 text-sky-700" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">Users</p>
                            <p className="text-sm text-slate-500">Promote users to admin and manage access</p>
                        </div>
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}
