import { Link, router, usePage } from '@inertiajs/react';
import { Menu, Shield, User, X, LogOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function GuestNavbar() {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        };

        if (userMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [userMenuOpen]);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    const navigation = [
        { name: 'Home', href: route('home') },
        { name: 'About', href: '/#about' },
        { name: 'Programs', href: route('programs') },
        { name: 'Blog', href: route('blog.index') },
        { name: 'Contact', href: '/#contact' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 lg:h-20 items-center justify-between">
                    <Link href={route('home')} className="flex min-w-0 shrink items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-white sm:h-12 sm:w-12 lg:h-14 lg:w-14">
                            <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <span className="hidden truncate text-base font-semibold text-slate-900 sm:block sm:text-lg">
                            Jonglei State Youth Union
                        </span>
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
                        <div className="ml-4 flex items-center gap-4">
                            {auth?.user ? (
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        type="button"
                                        className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-sky-700 focus:outline-none"
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-white">
                                            <span className="text-sm font-medium">
                                                {auth.user.name?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="hidden lg:block">Hi, {auth.user.name}</span>
                                    </button>

                                    {userMenuOpen && (
                                        <div className="absolute right-0 z-50 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black/5">
                                            <div className="py-1">
                                                <div className="px-4 py-2 text-xs text-slate-500">
                                                    Signed in as
                                                    <div className="truncate font-medium text-slate-800">
                                                        {auth.user.email}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                                >
                                                    <LogOut className="h-4 w-4" />
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
                                >
                                    Login / Register
                                </Link>
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
                        <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4">
                            {auth?.user ? (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-white">
                                            <span className="text-sm font-medium">
                                                {auth.user.name?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-semibold text-slate-900">
                                                {auth.user.name}
                                            </p>
                                            <p className="text-xs text-slate-500 truncate">
                                                {auth.user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            setMobileMenuOpen(false);
                                            handleLogout(e);
                                        }}
                                        className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                        <LogOut className="h-3 w-3" />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="flex min-h-[48px] items-center justify-center rounded-lg bg-sky-600 px-4 py-3 text-base font-semibold text-white active:bg-sky-700"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login / Register to post and engage
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
