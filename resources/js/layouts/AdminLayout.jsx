import AdminNavbar from '../components/navbars/AdminNavbar';

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white">
            <AdminNavbar />
            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
            </main>
        </div>
    );
}
