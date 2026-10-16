import { Link, router, usePage } from '@inertiajs/react';
import { LayoutDashboard, LogOut, Mail, MapPin, Phone, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { sectionImages } from '../../constants/sectionImages';

export default function GuestNavbar() {
    const { auth } = usePage().props;
    const { url } = usePage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

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

    useEffect(() => {
        document.body.classList.toggle('mobile-menu-open', mobileMenuOpen);
        return () => document.body.classList.remove('mobile-menu-open');
    }, [mobileMenuOpen]);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    // Portal users and members each have their own subdomain
    const dashboardUrl = auth?.user?.role === 'admin' ? route('admin.dashboard') : route('member.dashboard');

    const navigation = [
        { name: 'Home', href: route('home') },
        { name: 'About Us', href: '/#about' },
        { name: 'Programs', href: route('programs') },
        { name: 'Opportunities', href: '/#opportunities' },
        { name: 'News', href: route('blog.index') },
        { name: 'Work Plan', href: route('work-plan') },
        { name: 'Contact', href: '/#contact' },
    ];

    const isActive = (href) => {
        if (href.startsWith('/#')) return false;
        try {
            const path = new URL(href, window.location.origin).pathname;
            return url === path || url.startsWith(path + '/');
        } catch {
            return false;
        }
    };

    return (
        <header className="fixed top-0 right-0 left-0 z-50">
            {/* Top utility bar */}
            <div className="border-b border-jsyu-green-soft bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
                    <Link href={route('home')} className="flex min-w-0 items-center gap-2.5">
                        <img
                            src={sectionImages.logo}
                            alt="Jonglei State Youth Union"
                            className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
                        />
                        <div className="min-w-0 text-left">
                            <div className="font-display text-base font-bold uppercase tracking-wide text-jsyu-green-deep sm:text-lg">
                                JSYU
                            </div>
                            <div className="hidden truncate text-[11px] font-medium text-jsyu-text-muted sm:block">
                                Jonglei State Youth Union
                            </div>
                        </div>
                    </Link>

                    <div className="hidden items-center gap-6 text-xs font-medium text-jsyu-text-muted md:flex lg:text-sm">
                        <a
                            href="tel:+211000000000"
                            className="inline-flex items-center gap-2 hover:text-jsyu-green-deep"
                        >
                            <Phone className="h-3.5 w-3.5 text-jsyu-green-muted" />
                            <span>Bor, Jonglei State</span>
                        </a>
                        <a
                            href="mailto:info@jsyu.org"
                            className="inline-flex items-center gap-2 hover:text-jsyu-green-deep"
                        >
                            <Mail className="h-3.5 w-3.5 text-jsyu-green-muted" />
                            <span>info@jsyu.org</span>
                        </a>
                        <span className="hidden items-center gap-2 xl:inline-flex">
                            <MapPin className="h-3.5 w-3.5 text-jsyu-green-muted" />
                            South Sudan
                        </span>
                    </div>
                </div>
            </div>

            {/* Main navy navigation */}
            <nav className="bg-jsyu-green-deep">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    <div className="hidden items-stretch lg:flex">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`navbar-link inline-flex items-center px-3.5 py-4 text-xs font-bold uppercase tracking-[0.12em] text-white/90 hover:text-jsyu-accent xl:px-4 ${
                                    isActive(item.href) ? 'text-jsyu-accent' : ''
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex flex-1 items-center justify-end gap-2 py-2 lg:flex-none lg:py-0">
                        <Link
                            href={route('blog.index')}
                            className="hidden p-2 text-white/70 hover:text-jsyu-accent sm:inline-flex"
                            aria-label="Search news"
                        >
                            <Search className="h-4 w-4" />
                        </Link>

                        {auth?.user ? (
                            <div className="relative hidden sm:block" ref={userMenuRef}>
                                <button
                                    type="button"
                                    className="flex items-center gap-2 px-2 py-2 text-sm font-semibold text-white hover:text-jsyu-accent focus:outline-none"
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                >
                                    <div className="flex h-8 w-8 items-center justify-center bg-jsyu-accent text-jsyu-green-deep">
                                        <span className="text-sm font-bold">
                                            {auth.user.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="hidden lg:block">Hi, {auth.user.name}</span>
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 z-50 mt-2 w-48 bg-white ring-1 ring-black/5">
                                        <div className="py-1">
                                            <div className="px-4 py-2 text-xs text-jsyu-text-muted">
                                                Signed in as
                                                <div className="truncate font-medium text-jsyu-charcoal">
                                                    {auth.user.email}
                                                </div>
                                            </div>
                                            <a
                                                href={dashboardUrl}
                                                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-jsyu-charcoal hover:bg-jsyu-green-light"
                                            >
                                                <LayoutDashboard className="h-4 w-4" />
                                                My dashboard
                                            </a>
                                            <button
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-jsyu-charcoal hover:bg-jsyu-green-light"
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
                                className="hidden px-2 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white/80 hover:text-jsyu-accent sm:inline-flex"
                            >
                                Login
                            </Link>
                        )}

                        <Link
                            href={route('register')}
                            className="inline-flex items-center bg-jsyu-accent px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-jsyu-green-deep hover:bg-jsyu-accent-hover sm:px-5"
                        >
                            Join the Union
                        </Link>

                        <button
                            type="button"
                            className="inline-flex flex-col gap-1.5 p-2 lg:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                        >
                            <span
                                className={`block h-0.5 w-5 bg-white transition-transform duration-200 ${
                                    mobileMenuOpen ? 'translate-y-2 rotate-45' : ''
                                }`}
                            />
                            <span
                                className={`block h-0.5 w-5 bg-white transition-opacity duration-200 ${
                                    mobileMenuOpen ? 'opacity-0' : ''
                                }`}
                            />
                            <span
                                className={`block h-0.5 w-5 bg-white transition-transform duration-200 ${
                                    mobileMenuOpen ? '-translate-y-2 -rotate-45' : ''
                                }`}
                            />
                        </button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="max-h-[calc(100vh-7rem)] overflow-y-auto border-t border-white/10 bg-jsyu-green-deep lg:hidden">
                        <div className="flex flex-col px-4 py-3">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`min-h-[44px] px-2 py-3 text-sm font-bold uppercase tracking-[0.12em] ${
                                        isActive(item.href)
                                            ? 'text-jsyu-accent'
                                            : 'text-white/90 hover:text-jsyu-accent'
                                    }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            <div className="mt-3 space-y-3 border-t border-white/10 pt-4 pb-4">
                                {auth?.user && (
                                    <a
                                        href={dashboardUrl}
                                        className="flex min-h-[44px] items-center justify-center gap-2 bg-jsyu-accent px-4 py-3 text-sm font-bold uppercase tracking-wider text-jsyu-green-deep"
                                    >
                                        <LayoutDashboard className="h-4 w-4" />
                                        My dashboard
                                    </a>
                                )}
                                {auth?.user ? (
                                    <div className="flex items-center justify-between px-2">
                                        <div className="min-w-0 text-left">
                                            <p className="truncate text-sm font-semibold text-white">
                                                {auth.user.name}
                                            </p>
                                            <p className="truncate text-xs text-white/50">{auth.user.email}</p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                setMobileMenuOpen(false);
                                                handleLogout(e);
                                            }}
                                            className="inline-flex items-center gap-1 border border-white/20 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
                                        >
                                            <LogOut className="h-3 w-3" />
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        href={route('login')}
                                        className="flex min-h-[44px] items-center justify-center border border-white/25 px-4 py-3 text-sm font-bold uppercase tracking-wider text-white"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
