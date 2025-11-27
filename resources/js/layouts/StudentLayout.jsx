import StudentNavbar from '../components/navbars/StudentNavbar';

export default function StudentLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <StudentNavbar />
            <main className="flex-1">
                <div className="">{children}</div>
            </main>
        </div>
    );
}
