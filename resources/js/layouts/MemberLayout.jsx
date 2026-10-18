import { Link, router, usePage } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import { sectionImages } from '../constants/sectionImages';

const memberLinks = [
    { name: 'Dashboard', route: 'member.dashboard', match: 'member.dashboard' },
    { name: 'Elections', route: 'member.elections.index', match: 'member.elections.*' },
];

const siteLinks = [
    { name: 'News', route: 'blog.index' },
    { name: 'Programs', route: 'programs' },
    { name: 'Work Plan', route: 'work-plan' },
];

export default function MemberLayout({ children }) {
    const { auth } = usePage().props;

    const logout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    return (
        <div className="flex min-h-screen flex-col bg-admin-canvas">
            <header className="bg-jsyu-green-deep text-white">
                <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4">
                    <a href={route('member.dashboard')} className="flex items-center gap-2.5">
                        <img src={sectionImages.logo} alt="JSYU" className="h-8 w-8 object-contain" />
                        <span className="text-sm font-bold">
                            JSYU <span className="font-medium text-white/60">· Members</span>
                        </span>
                    </a>

                    <nav className="ml-6 hidden items-center gap-5 md:flex">
                        {/* Member pages are Inertia pages; the site links leave the portal */}
                        {memberLinks.map((link) => (
                            <Link
                                key={link.route}
                                href={route(link.route)}
                                className={`text-sm font-medium ${route().current(link.match) ? 'text-white' : 'text-white/70 hover:text-white'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <span className="h-4 w-px bg-white/20" />
                        {siteLinks.map((link) => (
                            <a key={link.route} href={route(link.route)} className="text-sm font-medium text-white/70 hover:text-white">
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    <div className="ml-auto flex items-center gap-3">
                        <span className="hidden text-sm text-white/80 sm:block">{auth.user?.name}</span>
                        <button
                            type="button"
                            onClick={logout}
                            className="flex items-center gap-1.5 border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/90 hover:bg-white/10"
                        >
                            <LogOut className="h-3.5 w-3.5" />
                            Log out
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>

            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 text-xs text-slate-500">
                    <span>© {new Date().getFullYear()} Jonglei State Youth Union</span>
                    <a href={route('home')} className="font-semibold hover:text-jsyu-green">
                        Main website →
                    </a>
                </div>
            </footer>
        </div>
    );
}
