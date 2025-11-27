import { Link, router, usePage } from '@inertiajs/react';
import { BarChart3, Home, LogOut, Menu, Settings, Shield, User, Users, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function AdminNavbar() {
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

    const navigation = [
        { name: 'Dashboard', href: route('admin.dashboard'), icon: Home },
        { name: 'Users', href: '#', icon: Users },
        { name: 'Analytics', href: '#', icon: BarChart3 },
        { name: 'Settings', href: '#', icon: Settings },
    ];

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    return (
        <nav className="border-b border-gray-800 bg-gray-900 shadow-lg">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href={route('admin.dashboard')} className="flex items-center">
                            <Shield className="mr-2 h-6 w-6 text-red-500" />
                            <span className="text-2xl font-bold text-white">DigiPhabet Admin</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* User Menu */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        <div className="relative" ref={userMenuRef}>
                            <button
                                type="button"
                                className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white focus:outline-none"
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                            >
                                {auth?.user?.avatar ? (
                                    <img className="h-8 w-8 rounded-full" src={auth.user.avatar} alt={auth.user.name} />
                                ) : (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white">
                                        <span className="text-sm font-medium">{auth?.user?.name?.charAt(0).toUpperCase()}</span>
                                    </div>
                                )}
                                <span className="hidden lg:block">{auth?.user?.name}</span>
                                <span className="hidden text-xs text-gray-400 lg:block">(Admin)</span>
                            </button>

                            {userMenuOpen && (
                                <div className="ring-opacity-5 absolute right-0 z-50 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black">
                                    <div className="py-1">
                                        <Link
                                            href="#"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <User className="h-4 w-4" />
                                            Profile
                                        </Link>
                                        <Link
                                            href="#"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <Settings className="h-4 w-4" />
                                            Settings
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:bg-gray-800 hover:text-white"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="border-t border-gray-800 md:hidden">
                    <div className="space-y-1 px-2 pt-2 pb-3">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                        <div className="border-t border-gray-800 pt-4">
                            <div className="px-3 py-2">
                                <p className="text-sm font-medium text-white">{auth?.user?.name}</p>
                                <p className="text-sm text-gray-400">{auth?.user?.email}</p>
                            </div>
                            <Link
                                href="#"
                                className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <User className="h-5 w-5" />
                                Profile
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Settings className="h-5 w-5" />
                                Settings
                            </Link>
                            <button
                                onClick={(e) => {
                                    setMobileMenuOpen(false);
                                    handleLogout(e);
                                }}
                                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
                            >
                                <LogOut className="h-5 w-5" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
