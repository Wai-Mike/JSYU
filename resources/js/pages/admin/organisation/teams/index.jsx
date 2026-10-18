import { Head, Link } from '@inertiajs/react';
import { History, Pencil, Plus, UsersRound } from 'lucide-react';
import { Button, FilterBar, FlashAlert, formatDate, PageHeader, Pagination, StatusBadge, useQueryFilters } from '../../../../components/admin';
import AdminLayout from '../../../../layouts/AdminLayout';

const tabs = [
    { key: 'current', label: 'Current teams' },
    { key: 'previous', label: 'Previous teams' },
];

export function termLabel(team) {
    return `${formatDate(team.starts_on)} – ${team.ends_on ? formatDate(team.ends_on) : 'present'}`;
}

export default function TeamsIndex({ view, filters, teams, canCreate }) {
    const [query, setQuery] = useQueryFilters({ view, search: filters.search ?? '' });

    return (
        <AdminLayout>
            <Head title="Management Teams - Admin" />
            <FlashAlert />

            <PageHeader
                title="Management Teams"
                icon={UsersRound}
                actions={
                    canCreate && (
                        <>
                            <Button variant="secondary" href={route('admin.organisation.teams.create', { previous: 1 })}>
                                <History className="h-4 w-4" />
                                Record previous team
                            </Button>
                            <Button href={route('admin.organisation.teams.create')}>
                                <Plus className="h-4 w-4" />
                                New team
                            </Button>
                        </>
                    )
                }
            />

            <div className="mb-4 flex flex-wrap gap-1 border-b border-slate-200" role="tablist">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        role="tab"
                        aria-selected={query.view === tab.key}
                        onClick={() => setQuery('view', tab.key)}
                        className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${
                            query.view === tab.key ? 'border-jsyu-green text-jsyu-green-deep' : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <FilterBar
                onSubmit={(e) => e.preventDefault()}
                searchValue={query.search}
                onSearchChange={(v) => setQuery('search', v)}
                searchPlaceholder="Team or member name"
            />

            {teams.data.length === 0 ? (
                <div className="border border-slate-200/80 bg-white px-4 py-12 text-center text-sm text-slate-500">
                    {view === 'current' ? 'No current management team has been recorded.' : 'No previous teams have been recorded yet.'}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {teams.data.map((team) => (
                        <article key={team.id} className="flex flex-col border border-slate-200/80 bg-white">
                            <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
                                <div className="min-w-0">
                                    <Link
                                        href={route('admin.organisation.teams.show', team.id)}
                                        className="hover:text-jsyu-green block font-semibold text-slate-900"
                                    >
                                        {team.name}
                                    </Link>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        {team.area ?? 'State level'} · {termLabel(team)}
                                    </p>
                                </div>
                                {team.is_current ? (
                                    <StatusBadge variant="green" dot>
                                        Current
                                    </StatusBadge>
                                ) : (
                                    <StatusBadge variant="gray">Previous</StatusBadge>
                                )}
                            </header>
                            <ul className="flex-1 divide-y divide-slate-50 px-5 py-2">
                                {team.leaders.map((m, i) => (
                                    <li key={i} className="flex justify-between gap-3 py-1.5 text-sm">
                                        <span className="truncate text-slate-500">{m.position_title}</span>
                                        <span className="truncate text-right font-medium text-slate-800">{m.name}</span>
                                    </li>
                                ))}
                            </ul>
                            <footer className="flex items-center justify-between border-t border-slate-100 px-5 py-2.5 text-sm">
                                <span className="text-slate-500">{team.members_count} members</span>
                                <span className="flex gap-1">
                                    {team.can.update && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            href={route('admin.organisation.teams.edit', team.id)}
                                            aria-label={`Edit ${team.name}`}
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                    )}
                                    <Button variant="ghost" size="sm" href={route('admin.organisation.teams.show', team.id)}>
                                        View
                                    </Button>
                                </span>
                            </footer>
                        </article>
                    ))}
                </div>
            )}

            {teams.data.length > 0 && (
                <div className="mt-4">
                    <Pagination paginator={teams} />
                </div>
            )}
        </AdminLayout>
    );
}
