import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Shield, User as UserIcon, UserPlus } from 'lucide-react';

export default function UsersIndex({ users }) {
    const { flash, auth } = usePage().props;

    const handleMakeAdmin = (user) => {
        if (!confirm(`Make "${user.name}" an admin?`)) return;
        router.post(route('admin.users.make-admin', user.id));
    };

    const isPrimaryAdmin = (user) => user.email === 'waimichael35@gmail.com';

    return (
        <AdminLayout>
            <Head title="Users - Admin" />
            <div>
                {flash?.success && (
                    <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                        {flash.success}
                    </div>
                )}

                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
                        <p className="text-sm text-gray-600">
                            View registered members and promote trusted users to admin.
                        </p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Name
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Email
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Role
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Joined
                                </th>
                                <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {users.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
                                                    {user.name?.charAt(0)?.toUpperCase() ?? '?'}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{user.name}</div>
                                                    {isPrimaryAdmin(user) && (
                                                        <div className="flex items-center gap-1 text-xs text-red-600">
                                                            <Shield className="h-3 w-3" />
                                                            Primary admin
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    user.role === 'admin'
                                                        ? 'bg-red-50 text-red-700'
                                                        : 'bg-sky-50 text-sky-700'
                                                }`}
                                            >
                                                {user.role === 'admin' ? (
                                                    <>
                                                        <Shield className="h-3 w-3" />
                                                        Admin
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserIcon className="h-3 w-3" />
                                                        Member
                                                    </>
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {user.created_at && new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm">
                                            {user.role !== 'admin' ? (
                                                <button
                                                    type="button"
                                                    onClick={() => handleMakeAdmin(user)}
                                                    className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                                >
                                                    <UserPlus className="h-3 w-3" />
                                                    Make admin
                                                </button>
                                            ) : (
                                                <span className="text-xs text-gray-400">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {users.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm text-gray-600">
                            <p>
                                Page {users.current_page} of {users.last_page}
                            </p>
                            <div className="flex gap-2">
                                {users.prev_page_url && (
                                    <Link
                                        href={users.prev_page_url}
                                        className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-50"
                                    >
                                        Previous
                                    </Link>
                                )}
                                {users.next_page_url && (
                                    <Link
                                        href={users.next_page_url}
                                        className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-50"
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

