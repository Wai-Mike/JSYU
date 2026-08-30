import { Link, router, usePage } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { sectionImages } from '../../constants/sectionImages';

export default function GuestNavbar() {
    const { auth } = usePage().props;
    const { url } = usePage();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

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

    const navigation = [
        { name: 'Home', href: route('home') },
        { name: 'About Us', href: '/#about' },
        { name: 'Programs', href: route('programs') },
        { name: 'Youth Opportunities', href: '/#opportunities' },
        { name: 'News & Events', href: route('blog.index') },
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

    const navLinkClass = (href, { mobile = false } = {}) =>
        `inline-flex items-center rounded-md transition-all duration-150 ${
            mobile
                ? 'min-h-[44px] px-4 py-2.5 text-left text-base font-medium'
                : 'px-3.5 py-2 text-base font-medium leading-none'
        } ${
            isActive(href)
                ? 'bg-jsyu-green-light text-jsyu-green'
                : 'text-jsyu-charcoal hover:bg-jsyu-green-light hover:text-jsyu-green'
        }`;

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled || mobileMenuOpen
                    ? 'border-b border-jsyu-green-soft bg-white shadow-sm'
                    : 'border-b border-transparent bg-white/97 backdrop-blur-sm'
            }`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between lg:h-[4.5rem]">
                    <Link href={route('home')} className="group flex min-w-0 shrink items-center gap-2.5 sm:gap-3">
                        <img
                            src={sectionImages.logo}
                            alt="Jonglei State Youth Union"
                            className="h-10 w-10 shrink-0 object-contain sm:h-11 sm:w-11"
                        />
                        <div className="hidden min-w-0 text-left md:block">
                            <div className="text-sm font-bold leading-tight text-jsyu-green-deep">JSYU</div>
                            <div className="truncate text-xs leading-tight text-jsyu-text-muted">
                                Jonglei State Youth Union
                            </div>
                        </div>
                    </Link>

                    <div className="hidden items-center gap-2.5 xl:flex">
                        {navigation.map((item) => (
                            <Link key={item.name} href={item.href} className={navLinkClass(item.href)}>
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        {auth?.user ? (
                            <div className="relative hidden sm:block" ref={userMenuRef}>
                                <button
                                    type="button"
                                    className="flex items-center gap-2 rounded-full text-sm font-semibold text-jsyu-charcoal hover:text-jsyu-green focus:outline-none"
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-jsyu-green text-white">
                                        <span className="text-sm font-semibold">
                                            {auth.user.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="hidden lg:block">Hi, {auth.user.name}</span>
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black/5">
                                        <div className="py-1">
                                            <div className="px-4 py-2 text-xs text-jsyu-text-muted">
                                                Signed in as
                                                <div className="truncate font-medium text-jsyu-charcoal">
                                                    {auth.user.email}
                                                </div>
                                            </div>
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
                                className="hidden text-sm font-semibold text-jsyu-green hover:text-jsyu-green-hover sm:inline-flex"
                            >
                                Login
                            </Link>
                        )}

                        <Link
                            href={route('register')}
                            className="hidden items-center rounded-full bg-jsyu-green px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-jsyu-green-hover sm:inline-flex"
                        >
                            Join the Union
                        </Link>

                        <button
                            type="button"
                            className="inline-flex flex-col gap-1.5 rounded-md p-2 transition-colors hover:bg-jsyu-green-light xl:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                        >
                            <span
                                className={`block h-0.5 w-5 bg-jsyu-charcoal transition-transform duration-200 ${
                                    mobileMenuOpen ? 'translate-y-2 rotate-45' : ''
                                }`}
                            />
                            <span
                                className={`block h-0.5 w-5 bg-jsyu-charcoal transition-opacity duration-200 ${
                                    mobileMenuOpen ? 'opacity-0' : ''
                                }`}
                            />
                            <span
                                className={`block h-0.5 w-5 bg-jsyu-charcoal transition-transform duration-200 ${
                                    mobileMenuOpen ? '-translate-y-2 -rotate-45' : ''
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-jsyu-green-soft xl:hidden">
                    <div className="flex flex-col gap-1 px-4 py-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`transition-colors ${navLinkClass(item.href, { mobile: true })}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}

                        <div className="mt-4 space-y-3 border-t border-jsyu-green-soft pt-4">
                            {auth?.user ? (
                                <div className="flex items-center justify-between px-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-jsyu-green text-white">
                                            <span className="text-sm font-semibold">
                                                {auth.user.name?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="min-w-0 text-left">
                                            <p className="truncate text-sm font-semibold text-jsyu-green-deep">
                                                {auth.user.name}
                                            </p>
                                            <p className="truncate text-xs text-jsyu-text-muted">{auth.user.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            setMobileMenuOpen(false);
                                            handleLogout(e);
                                        }}
                                        className="inline-flex items-center gap-1 rounded-md border border-jsyu-green-soft px-3 py-1.5 text-xs font-semibold text-jsyu-charcoal hover:bg-jsyu-green-light"
                                    >
                                        <LogOut className="h-3 w-3" />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="flex min-h-[44px] items-center justify-center rounded-lg border border-jsyu-green/30 px-4 py-3 text-sm font-bold text-jsyu-green"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="flex min-h-[44px] items-center justify-center rounded-full bg-jsyu-green px-4 py-3 text-sm font-bold text-white hover:bg-jsyu-green-hover"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Join the Union
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
