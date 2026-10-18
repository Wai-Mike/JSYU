import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Trash2, UsersRound } from 'lucide-react';
import { useState } from 'react';
import { Button, ConfirmDialog, FlashAlert, PageHeader, StatusBadge } from '../../../../components/admin';
import AdminLayout from '../../../../layouts/AdminLayout';
import { termLabel } from './index';

export default function TeamShow({ team, otherTeams, can }) {
    const [deleting, setDeleting] = useState(false);
    const [processing, setProcessing] = useState(false);

    const breadcrumbs = [
        { label: 'Organisation' },
        { label: 'Management Teams', href: route('admin.organisation.teams.index', { view: team.is_current ? 'current' : 'previous' }) },
        { label: team.name },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`${team.name} - Management Team`} />
            <FlashAlert />

            <PageHeader
                title={team.name}
                icon={UsersRound}
                actions={
                    <>
                        <StatusBadge variant={team.is_current ? 'green' : 'gray'} dot>
                            {team.is_current ? 'Current team' : 'Previous team'}
                        </StatusBadge>
                        {can.update && (
                            <Button variant="secondary" href={route('admin.organisation.teams.edit', team.id)}>
                                <Pencil className="h-4 w-4" />
                                Edit
                            </Button>
                        )}
                        {can.delete && (
                            <Button variant="secondary" onClick={() => setDeleting(true)}>
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </Button>
                        )}
                    </>
                }
            />

            <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
                <div className="space-y-6">
                    <section className="border border-slate-200/80 bg-white p-5">
                        <dl className="grid gap-4 text-sm sm:grid-cols-3">
                            <Detail label="Area">{team.area ?? 'State level'}</Detail>
                            <Detail label="Term">{termLabel(team)}</Detail>
                            <Detail label="Recorded by">{team.created_by ?? '—'}</Detail>
                        </dl>
                        {team.description && (
                            <div className="mt-4 border-t border-slate-100 pt-4">
                                <p className="text-sm whitespace-pre-line text-slate-700">{team.description}</p>
                            </div>
                        )}
                    </section>

                    <section className="border border-slate-200/80 bg-white">
                        <h2 className="border-b border-slate-100 px-5 py-3 text-sm font-semibold text-slate-900">
                            Team members ({team.members.length})
                        </h2>
                        <ol className="divide-y divide-slate-100">
                            {team.members.map((m) => (
                                <li key={m.id} className="flex flex-col gap-0.5 px-5 py-3 sm:flex-row sm:items-center sm:gap-4">
                                    <span className="text-sm text-slate-500 sm:w-56 sm:shrink-0">{m.position_title}</span>
                                    <span className="text-sm font-medium text-slate-900">
                                        {m.name}
                                        {m.person && (
                                            <span className="ml-2">
                                                <StatusBadge variant="soft">In People</StatusBadge>
                                            </span>
                                        )}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </section>
                </div>

                <aside className="border border-slate-200/80 bg-white">
                    <h2 className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-900">
                        Other teams for {team.area ?? 'the state'}
                    </h2>
                    {otherTeams.length === 0 ? (
                        <p className="px-4 py-6 text-center text-sm text-slate-500">No other teams recorded.</p>
                    ) : (
                        <ol className="divide-y divide-slate-100">
                            {otherTeams.map((t) => (
                                <li key={t.id} className="px-4 py-3">
                                    <Link
                                        href={route('admin.organisation.teams.show', t.id)}
                                        className="hover:text-jsyu-green text-sm font-medium text-slate-800"
                                    >
                                        {t.name}
                                    </Link>
                                    <p className="text-xs text-slate-500">
                                        {termLabel(t)}
                                        {t.is_current && ' · current'}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    )}
                </aside>
            </div>

            <ConfirmDialog
                open={deleting}
                onClose={() => setDeleting(false)}
                title="Delete team?"
                message={`${team.name} and its member list will be permanently deleted. To keep it as history, edit it and mark it as a previous team instead.`}
                confirmLabel="Delete"
                danger
                processing={processing}
                onConfirm={() =>
                    router.delete(route('admin.organisation.teams.destroy', team.id), {
                        onStart: () => setProcessing(true),
                        onFinish: () => setProcessing(false),
                    })
                }
            />
        </AdminLayout>
    );
}

function Detail({ label, children }) {
    return (
        <div>
            <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</dt>
            <dd className="mt-0.5 text-slate-800">{children}</dd>
        </div>
    );
}
