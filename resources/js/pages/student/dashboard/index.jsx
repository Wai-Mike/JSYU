import StudentLayout from '../../../layouts/StudentLayout';

export default function StudentDashboard() {
    return (
        <StudentLayout>
            <div>
                <h1 className="mb-4 text-3xl font-bold text-gray-900">Student Dashboard</h1>
                <p className="text-gray-600">Welcome to your dashboard!</p>
            </div>
        </StudentLayout>
    );
}
