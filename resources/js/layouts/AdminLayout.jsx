import { Link, router, usePage } from '@inertiajs/react';
import {
    BadgeCheck,
    Building2,
    Contact,
    ExternalLink,
    FileText,
    History,
    Home,
    LogOut,
    Map,
    Menu,
    PanelLeftClose,
    PanelLeftOpen,
    Search,
    ShieldCheck,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Breadcrumbs from '../components/admin/Breadcrumbs';
import { usePermissions } from '../components/admin/hooks';
import { sectionImages } from '../constants/sectionImages';

// Only built modules are listed. Each item needs its permission to show; the server enforces it again.
const navigationSections = [
    {
        label: null,
        items: [{ name: 'Dashboard', route: 'admin.dashboard', match: 'admin.dashboard', icon: Home, permission: 'portal.access' }],
    },
    {
        label: 'Organisation',
        items: [
            {
                name: 'Structure',
                route: 'admin.organisation.units.index',
                match: 'admin.organisation.units.*',
                icon: Building2,
                permission: 'organisation.view',
            },
            {
                name: 'Leadership & Officials',
                route: 'admin.organisation.appointments.index',
                match: 'admin.organisation.appointments.*',
                icon: BadgeCheck,
                permission: 'appointments.view',
            },
            {
                name: 'People',
                route: 'admin.organisation.people.index',
                match: 'admin.organisation.people.*',
                icon: Contact,
                permission: 'people.view',
            },
            {
                name: 'Geography',
                route: 'admin.organisation.geography.index',
                match: 'admin.organisation.geography.*',
                icon: Map,
                permission: 'geography.view',
            },
        ],
    },
    {
        label: 'Content',
        items: [{ name: 'Blog & Posts', route: 'admin.posts.index', match: 'admin.posts.*', icon: FileText, permission: 'content.manage' }],
    },
    {
        label: 'Administration',
        items: [
            { name: 'Users', route: 'admin.users.index', match: 'admin.users.*', icon: Users, permission: 'users.view' },
            { name: 'Roles & Permissions', route: 'admin.roles.index', match: 'admin.roles.*', icon: ShieldCheck, permission: 'users.view' },
            { name: 'Audit Logs', route: 'admin.audit.index', match: 'admin.audit.*', icon: History, permission: 'audit.view' },
        ],
    },
];

const breadcrumbMap = [
    { match: 'admin.dashboard', items: [{ label: 'JSYU' }, { label: 'Dashboard' }] },
    {
        match: 'admin.posts.create',
        items: [{ label: 'Content', href: null }, { label: 'Blog & Posts', href: 'admin.posts.index' }, { label: 'New post' }],
    },
    {
        match: 'admin.posts.edit',
        items: [{ label: 'Content', href: null }, { label: 'Blog & Posts', href: 'admin.posts.index' }, { label: 'Edit post' }],
    },
    {
        match: 'admin.posts.*',
        items: [{ label: 'Content' }, { label: 'Blog & Posts' }],
    },
    {
        match: 'admin.users.*',
        items: [{ label: 'Administration' }, { label: 'Users' }],
    },
    { match: 'admin.roles.*', items: [{ label: 'Administration' }, { label: 'Roles & Permissions' }] },
    { match: 'admin.audit.*', items: [{ label: 'Administration' }, { label: 'Audit Logs' }] },
    { match: 'admin.organisation.units.index', items: [{ label: 'Organisation' }, { label: 'Structure' }] },
    { match: 'admin.organisation.appointments.index', items: [{ label: 'Organisation' }, { label: 'Leadership & Officials' }] },
    { match: 'admin.organisation.people.*', items: [{ label: 'Organisation' }, { label: 'People' }] },
    { match: 'admin.organisation.geography.*', items: [{ label: 'Organisation' }, { label: 'Geography' }] },
];

function resolveBreadcrumbs() {
    for (const entry of breadcrumbMap) {
        if (route().current(entry.match)) {
            return entry.items.map((item) => ({
                label: item.label,
                href: item.href ? route(item.href) : undefined,
            }));
        }
    }
    return [{ label: 'JSYU' }, { label: 'Admin' }];
}

function userInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function Sidebar({ collapsed, onToggleCollapse, onNavigate, isDesktop }) {
    const can = usePermissions();
    const sections = navigationSections
        .map((section) => ({ ...section, items: section.items.filter((item) => can(item.permission)) }))
        .filter((section) => section.items.length > 0);

    return (
        <div className="bg-admin-sidebar flex h-full flex-col text-white">
            <Link
                href={route('admin.dashboard')}
                onClick={onNavigate}
                className={`flex items-center gap-3 border-b border-white/10 ${collapsed ? 'justify-center px-3 py-4' : 'px-4 py-4'}`}
            >
                <img src={sectionImages.logo} alt="JSYU" className="h-10 w-10 shrink-0 object-contain" />
                {!collapsed && (
                    <div className="min-w-0">
                        <p className="text-base font-bold tracking-tight">JSYU Admin</p>
                        <p className="truncate text-xs leading-tight text-white/55">Jonglei State Youth Union</p>
                    </div>
                )}
            </Link>

            <nav className={`flex-1 space-y-4 overflow-y-auto py-3 ${collapsed ? 'px-2' : 'px-3'}`}>
                {sections.map((section) => (
                    <div key={section.label ?? 'main'}>
                        {section.label && !collapsed && (
                            <p className="mb-1.5 px-3 text-xs font-semibold tracking-[0.12em] text-white/40 uppercase">
                                {section.label}
                            </p>
                        )}
                        <div className="space-y-0.5">
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                const active = route().current(item.match);

                                return (
                                    <Link
                                        key={item.name}
                                        href={route(item.route)}
                                        onClick={onNavigate}
                                        title={collapsed ? item.name : undefined}
                                        className={`relative flex items-center gap-3 text-[15px] font-medium transition-colors ${
                                            collapsed ? 'justify-center px-2 py-2' : 'px-3 py-2'
                                        } ${active ? 'bg-white/12 text-white' : 'text-white/70 hover:bg-white/8 hover:text-white'}`}
                                    >
                                        {active && (
                                            <span className="bg-jsyu-accent absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2" />
                                        )}
                                        <Icon className="h-5 w-5 shrink-0" />
                                        {!collapsed && <span className="truncate">{item.name}</span>}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}

                <a
                    href={route('home')}
                    title={collapsed ? 'View website' : undefined}
                    className={`flex items-center gap-3 text-[15px] font-medium text-white/70 transition-colors hover:bg-white/8 hover:text-white ${
                        collapsed ? 'justify-center px-2 py-2' : 'px-3 py-2'
                    }`}
                >
                    <ExternalLink className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>View website</span>}
                </a>
            </nav>

            {isDesktop && (
                <div className="border-t border-white/10 p-3">
                    <button
                        type="button"
                        onClick={onToggleCollapse}
                        className={`flex w-full items-center gap-2.5 px-3 py-2 text-[15px] font-medium text-white/60 transition-colors hover:bg-white/8 hover:text-white ${
                            collapsed ? 'justify-center' : ''
                        }`}
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {collapsed ? (
                            <PanelLeftOpen className="h-5 w-5" />
                        ) : (
                            <>
                                <PanelLeftClose className="h-5 w-5" />
                                <span>Collapse</span>
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}

function TopBar({ breadcrumbs, onOpenSidebar, searchRef }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        if (!menuOpen) return;
        const onClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, [menuOpen]);

    const handleLogout = () => {
        router.post(route('logout'));
    };

    // Search the most useful directory this user can see; hide the box if none
    const can = usePermissions();
    const searchTarget = can('people.view')
        ? { route: 'admin.organisation.people.index', placeholder: 'Search people…' }
        : can('content.manage')
          ? { route: 'admin.posts.index', placeholder: 'Search posts…' }
          : null;

    useEffect(() => {
        const onKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                searchRef.current?.focus();
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [searchRef]);

    return (
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-slate-200/80 bg-white/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-white/80 sm:px-4 lg:px-5">
            <button
                type="button"
                onClick={onOpenSidebar}
                className="p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                aria-label="Open menu"
            >
                <Menu className="h-5 w-5" />
            </button>

            <div className="hidden min-w-0 flex-1 lg:block">
                <Breadcrumbs items={breadcrumbs} />
            </div>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
                <div className={searchTarget ? 'relative hidden sm:block' : 'hidden'}>
                    <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        ref={searchRef}
                        type="search"
                        aria-label={searchTarget?.placeholder ?? 'Search'}
                        placeholder={searchTarget?.placeholder}
                        className="focus:border-jsyu-green focus:ring-jsyu-green/20 w-44 border border-slate-200 bg-slate-50 py-1.5 pr-16 pl-9 text-sm text-slate-700 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:outline-none md:w-56"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                const q = e.currentTarget.value.trim();
                                if (q && searchTarget) {
                                    router.get(route(searchTarget.route), { search: q });
                                }
                            }
                        }}
                    />
                    <kbd className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                        Ctrl K
                    </kbd>
                </div>

                <div className="relative" ref={menuRef}>
                    <button
                        type="button"
                        onClick={() => setMenuOpen((o) => !o)}
                        className="flex items-center gap-2.5 py-1 pr-1 pl-1 transition-colors hover:bg-slate-50 sm:pr-2"
                    >
                        {user?.avatar ? (
                            <img className="ring-jsyu-green-soft h-8 w-8 shrink-0 object-cover ring-2" src={user.avatar} alt="" />
                        ) : (
                            <div className="bg-jsyu-green flex h-8 w-8 shrink-0 items-center justify-center text-xs font-bold text-white">
                                {userInitials(user?.name)}
                            </div>
                        )}
                        <div className="hidden min-w-0 text-left md:block">
                            <p className="truncate text-sm font-semibold text-slate-800">{user?.name}</p>
                            <p className="truncate text-xs text-slate-500">Jonglei State Youth Union</p>
                        </div>
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-56 overflow-hidden border border-slate-200 bg-white py-1">
                            <div className="border-b border-slate-100 px-3 py-2.5 md:hidden">
                                <p className="truncate text-sm font-semibold text-slate-800">{user?.name}</p>
                                <p className="truncate text-xs text-slate-500">{user?.email}</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                            >
                                <LogOut className="h-4 w-4" />
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default function AdminLayout({ children, breadcrumbs: breadcrumbsProp }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const searchRef = useRef(null);

    const breadcrumbs = useMemo(() => breadcrumbsProp ?? resolveBreadcrumbs(), [breadcrumbsProp]);

    useEffect(() => {
        if (!sidebarOpen) return;
        const onKeyDown = (e) => e.key === 'Escape' && setSidebarOpen(false);
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [sidebarOpen]);

    const sidebarWidth = collapsed ? 'lg:w-[4.5rem]' : 'lg:w-[12.8rem]';
    const contentPad = collapsed ? 'lg:pl-[4.5rem]' : 'lg:pl-[12.8rem]';

    return (
        <div className="bg-admin-canvas min-h-screen">
            <aside className={`fixed inset-y-0 left-0 z-30 hidden transition-[width] duration-200 ${sidebarWidth} lg:block`}>
                <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)} isDesktop />
            </aside>

            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <aside className="relative h-full w-[12.8rem] max-w-[80%]">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(false)}
                            className="absolute top-4 -right-12 bg-white/10 p-2 text-white"
                            aria-label="Close menu"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <Sidebar collapsed={false} onNavigate={() => setSidebarOpen(false)} isDesktop={false} />
                    </aside>
                </div>
            )}

            <div className={`transition-[padding] duration-200 ${contentPad}`}>
                <TopBar breadcrumbs={breadcrumbs} onOpenSidebar={() => setSidebarOpen(true)} searchRef={searchRef} />

                <div className="border-b border-slate-200/60 bg-white px-3 py-2 lg:hidden">
                    <Breadcrumbs items={breadcrumbs} />
                </div>

                <main className="px-3 py-4 sm:px-4 lg:px-5">{children}</main>
            </div>
        </div>
    );
}
