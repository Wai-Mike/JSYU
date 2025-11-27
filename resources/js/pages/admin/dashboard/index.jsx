import AdminLayout from '../../../layouts/AdminLayout';

export default function Dashboard() {
    return (
        <AdminLayout>
            <div>
                <h1 className="mb-4 text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome to the admin panel!</p>
            </div>
        </AdminLayout>
    );
}
