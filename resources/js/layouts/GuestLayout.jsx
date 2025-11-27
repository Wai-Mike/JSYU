import GuestNavbar from '../components/navbars/GuestNavbar';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <GuestNavbar />
            <main className="flex-1">{children}</main>
            <footer className="mt-auto border-t border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="text-center text-sm text-gray-600">
                        <p>&copy; {new Date().getFullYear()} DigiPhabet. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
