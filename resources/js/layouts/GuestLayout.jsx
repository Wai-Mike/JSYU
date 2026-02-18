import GuestNavbar from '../components/navbars/GuestNavbar';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-white">
            <GuestNavbar />
            <main className="pt-16 lg:pt-20">{children}</main>
            <footer className="border-t border-slate-200 bg-slate-50">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                        <p className="text-sm text-slate-600">
                            &copy; {new Date().getFullYear()} Jonglei State Youth Union. All rights reserved.
                        </p>
                        <div className="flex gap-8">
                            <a href="/#about" className="text-sm text-slate-600 hover:text-sky-600">About</a>
                            <a href="/programs" className="text-sm text-slate-600 hover:text-sky-600">Programs</a>
                            <a href="mailto:info@jongleiyouthunion.org" className="text-sm text-slate-600 hover:text-sky-600">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
