import { Link, usePage } from '@inertiajs/react';
import AdminLayout from '../../../layouts/AdminLayout';
import { FileText } from 'lucide-react';

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
                <h1 className="mb-4 text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="mb-8 text-gray-600">Welcome to the admin panel. Manage content and settings below.</p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Link
                        href={route('admin.posts.index')}
                        className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:border-red-200 hover:shadow-md"
                    >
                        <div className="rounded-lg bg-red-100 p-3">
                            <FileText className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">Blog &amp; Posts</p>
                            <p className="text-sm text-gray-500">Create and edit articles, programs, and announcements</p>
                        </div>
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}
