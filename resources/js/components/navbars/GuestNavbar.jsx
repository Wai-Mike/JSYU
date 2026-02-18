import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function GuestNavbar() {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigation = [
        { name: 'Home', href: route('home') },
        { name: 'About', href: '/#about' },
        { name: 'Programs', href: route('programs') },
        { name: 'Contact', href: '/#contact' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 lg:h-20 items-center justify-between">
                    <Link href={route('home')} className="flex min-w-0 shrink items-center gap-2">
                        <img src="/images/logo.png" alt="Jonglei State Youth Union" className="h-10 shrink-0 w-auto sm:h-12 lg:h-14" />
                        <span className="hidden truncate text-base font-semibold text-slate-900 sm:block sm:text-lg">Jonglei State Youth Union</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:gap-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-medium text-slate-600 transition-colors hover:text-sky-600"
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="flex items-center gap-3 ml-4">
                            {auth?.user ? (
                                <Link
                                    href={route('student.dashboard')}
                                    className="rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-lg px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:text-sky-600"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
                                    >
                                        Get Involved
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        type="button"
                        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 active:bg-slate-200 md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-slate-200 bg-white md:hidden">
                    <div className="space-y-1 px-4 py-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="block min-h-[44px] rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="border-t border-slate-200 pt-4 mt-4 flex flex-col gap-3">
                            {auth?.user ? (
                                <Link
                                    href={route('student.dashboard')}
                                    className="flex min-h-[48px] items-center justify-center rounded-lg bg-sky-600 px-4 py-3 text-base font-semibold text-white active:bg-sky-700"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="flex min-h-[48px] items-center justify-center rounded-lg border-2 border-slate-300 px-4 py-3 text-base font-semibold text-slate-700 active:bg-slate-100"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="flex min-h-[48px] items-center justify-center rounded-lg bg-sky-600 px-4 py-3 text-base font-semibold text-white active:bg-sky-700"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Get Involved
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
