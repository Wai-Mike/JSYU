import { Head, Link, usePage } from '@inertiajs/react';
import { Activity, AlertTriangle, ArrowRight, BadgeCheck, Building2, CalendarClock, Contact, FileText, Map, ShieldCheck, Users } from 'lucide-react';
import { FlashAlert, StatCard, StatusBadge, usePermissions } from '../../../components/admin';
import AdminLayout from '../../../layouts/AdminLayout';

// Each card appears only when the server sent its figure, i.e. the user may see it
const statCards = [
    { key: 'units', label: 'Organisational units', hint: 'Active units', icon: Building2 },
    { key: 'active_appointments', label: 'Officials in office', hint: 'Current appointments', icon: BadgeCheck },
    { key: 'vacancies', label: 'Vacant seats', hint: 'Across active positions', icon: AlertTriangle },
    { key: 'terms_ending_soon', label: 'Terms ending', hint: 'Within 60 days', icon: CalendarClock },
    { key: 'people', label: 'People', hint: 'Directory records', icon: Contact },
    { key: 'counties', label: 'Counties', hint: 'Configured areas', icon: Map },
    { key: 'pending_posts', label: 'Draft posts', hint: 'Awaiting review', icon: FileText },
    { key: 'users', label: 'User accounts', hint: 'Registered logins', icon: Users },
];

const quickActions = [
    {
        permission: 'organisation.view',
        route: 'admin.organisation.units.index',
        title: 'Organisational structure',
        text: 'Units, positions and vacancies',
        icon: Building2,
    },
    {
        permission: 'appointments.view',
        route: 'admin.organisation.appointments.index',
        title: 'Leadership & officials',
        text: 'Current office holders and history',
        icon: BadgeCheck,
    },
    { permission: 'people.view', route: 'admin.organisation.people.index', title: 'People', text: 'Find or add a person record', icon: Contact },
    {
        permission: 'content.manage',
        route: 'admin.posts.index',
        title: 'Website posts',
        text: 'Write and review news and announcements',
        icon: FileText,
    },
    { permission: 'users.view', route: 'admin.users.index', title: 'Users & roles', text: 'Grant portal access', icon: ShieldCheck },
];

export default function Dashboard({ stats = {}, scopes = [], recentActivity = null }) {
    const { auth } = usePage().props;
    const can = usePermissions();
    const firstName = auth?.user?.name?.split(/\s+/)[0] ?? 'there';

    const cards = statCards.filter((card) => stats[card.key] !== undefined);
    const actions = quickActions.filter((action) => can(action.permission));

    return (
        <AdminLayout>
            <Head title="Dashboard - Admin" />
            <FlashAlert />

            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Welcome back, {firstName}</h1>
                </div>
                <div className="flex flex-wrap gap-2">
                    {scopes.map((s, i) => (
                        <StatusBadge key={i} variant="soft">
                            {s.role} · {s.area}
                        </StatusBadge>
                    ))}
                </div>
            </div>

            {stats.vacancies > 0 && can('organisation.view') && (
                <Attention
                    text={`${stats.vacancies} vacant seat${stats.vacancies === 1 ? '' : 's'} in positions you oversee.`}
                    href={route('admin.organisation.appointments.index', { view: 'vacancies' })}
                />
            )}
            {stats.pending_posts > 0 && can('content.manage') && (
                <Attention
                    text={`${stats.pending_posts} draft post${stats.pending_posts === 1 ? '' : 's'} awaiting review.`}
                    href={route('admin.posts.index', { status: 'draft' })}
                />
            )}

            {cards.length > 0 && (
                <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {cards.map((card) => (
                        <StatCard key={card.key} label={card.label} value={stats[card.key]} hint={card.hint} icon={card.icon} />
                    ))}
                </div>
            )}

            <div className="grid gap-4 lg:grid-cols-3">
                <div className="border border-slate-200/80 bg-white p-5 lg:col-span-2">
                    <h2 className="text-sm font-semibold text-slate-900">Quick actions</h2>
                    <p className="mt-0.5 mb-4 text-xs text-slate-500">Based on your roles</p>
                    {actions.length === 0 ? (
                        <p className="py-6 text-center text-sm text-slate-500">
                            Your role doesn't include any modules that are available yet. More modules are being added.
                        </p>
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {actions.map(({ route: name, title, text, icon: Icon }) => (
                                <Link
                                    key={name}
                                    href={route(name)}
                                    className="hover:border-jsyu-green-soft hover:bg-jsyu-green-light/40 flex items-center gap-3 border border-slate-200 p-4 transition"
                                >
                                    <div className="bg-jsyu-green-light text-jsyu-green flex h-10 w-10 shrink-0 items-center justify-center">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">{title}</p>
                                        <p className="text-xs text-slate-500">{text}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {recentActivity !== null && (
                    <div className="border border-slate-200/80 bg-white p-5">
                        <div className="mb-4 flex items-start justify-between gap-3">
                            <div>
                                <h2 className="text-sm font-semibold text-slate-900">Recent activity</h2>
                                <p className="mt-0.5 text-xs text-slate-500">From the audit log</p>
                            </div>
                            <Link href={route('admin.audit.index')} className="text-jsyu-green hover:text-jsyu-green-hover text-xs font-semibold">
                                View all
                            </Link>
                        </div>
                        {recentActivity.length ? (
                            <ul className="space-y-3">
                                {recentActivity.map((item) => (
                                    <li key={item.id} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                        <p className="text-sm text-slate-800">{item.description}</p>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {item.user ? `${item.user} · ` : ''}
                                            {item.created_at}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <Activity className="mb-2 h-8 w-8 text-slate-300" />
                                <p className="text-sm text-slate-500">No activity recorded yet</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

function Attention({ text, href }) {
    return (
        <div className="mb-4 flex flex-col gap-3 border border-amber-200/80 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-amber-50 text-amber-600">
                    <AlertTriangle className="h-4 w-4" />
                </div>
                <p className="text-sm text-slate-700">{text}</p>
            </div>
            <Link href={href} className="text-jsyu-green hover:text-jsyu-green-hover inline-flex items-center gap-1.5 text-sm font-semibold">
                Review
                <ArrowRight className="h-4 w-4" />
            </Link>
        </div>
    );
}
