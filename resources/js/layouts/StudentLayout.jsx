import StudentNavbar from '../components/navbars/StudentNavbar';

export default function StudentLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <StudentNavbar />
            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
            </main>
        </div>
    );
}
