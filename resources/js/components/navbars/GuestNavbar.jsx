import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function GuestNavbar() {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigation = [
        { name: 'Home', href: route('home') },
        { name: 'About', href: '#' },
        { name: 'Features', href: '#' },
        { name: 'Contact', href: '#' },
    ];

    return (
        <nav className="border-red sticky top-0 z-50 border-b-4 bg-white shadow-lg">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Top Section: Logo */}
                <div className="flex items-center justify-between py-2">
                    <Link href={route('home')} className="block">
                        <div className="relative">
                            <img src="/images/logo.png" alt="DigiPhabet" className="h-20 md:h-16" />
                        </div>
                    </Link>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-full p-3 text-gray-700 transition-all duration-300 hover:scale-110 hover:bg-gray-100 active:scale-95"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                        </button>
                    </div>
                </div>

                {/* Bottom Section: Navigation Links */}
                <div className="hidden items-center justify-between border-t border-gray-200 py-3 md:flex">
                    {/* Desktop Navigation */}
                    <div className="flex items-center space-x-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="relative rounded-full px-4 py-2 text-base font-semibold text-gray-700 transition-all duration-300 hover:scale-110 hover:bg-gray-100 active:scale-95"
                            >
                                <span className="relative z-10">{item.name}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center space-x-3">
                        {auth?.user ? (
                            <Link
                                href={route('student.dashboard')}
                                className="rounded-full px-6 py-2.5 text-base font-bold text-white transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95"
                                style={{ backgroundColor: '#DC2626' }}
                            >
                                My Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="rounded-full px-5 py-2.5 text-base font-semibold text-gray-700 transition-all duration-300 hover:scale-110 hover:bg-gray-100 active:scale-95"
                                >
                                    Login
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="transform rounded-full px-6 py-2.5 text-base font-bold text-white transition-all duration-300 hover:scale-110 hover:rotate-1 hover:shadow-xl active:scale-95"
                                    style={{ backgroundColor: '#DC2626' }}
                                >
                                    Start Learning! 🚀
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="border-red border-t-2 bg-white md:hidden">
                    <div className="space-y-2 px-4 pt-4 pb-6">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="block rounded-full px-4 py-3 text-base font-semibold text-gray-700 transition-all duration-300 hover:scale-105 hover:bg-gray-100 active:scale-95"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="border-red mt-4 border-t-2 pt-4">
                            {auth?.user ? (
                                <Link
                                    href={route('student.dashboard')}
                                    className="block rounded-full px-4 py-3 text-center text-base font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95"
                                    style={{ backgroundColor: '#DC2626' }}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    My Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="mb-2 block rounded-full px-4 py-3 text-center text-base font-semibold text-gray-700 transition-all duration-300 hover:scale-105 hover:bg-gray-100 active:scale-95"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="block rounded-full px-4 py-3 text-center text-base font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95"
                                        style={{ backgroundColor: '#DC2626' }}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Start Learning! 🚀
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
