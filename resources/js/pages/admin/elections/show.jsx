import { Head, router, usePage } from '@inertiajs/react';
import { BadgeCheck, CircleAlert, Lock, Pencil, Play, Square, Trash2, Vote } from 'lucide-react';
import { useState } from 'react';
import { Button, ConfirmDialog, FlashAlert, PageHeader, StatCard, StatusBadge } from '../../../components/admin';
import AdminLayout from '../../../layouts/AdminLayout';
import ElectionResults from '../../../components/ElectionResults';
import { electionVariants, formatDateTime } from './index';

const actions = {
    open: {
        route: 'admin.elections.open',
        title: 'Open voting?',
        message: 'Eligible members can vote during the voting window. The ballot can no longer be changed.',
        label: 'Open voting',
    },
    close: {
        route: 'admin.elections.close',
        title: 'Close voting?',
        message: 'No more votes will be accepted, and the results will be counted for certification. This cannot be undone.',
        label: 'Close voting',
    },
    publish: {
        route: 'admin.elections.publish',
        title: 'Certify and publish results?',
        message: 'You confirm the results are correct. Members will see them in the portal.',
        label: 'Certify & publish',
    },
};

export default function ElectionShow({ election, turnout, results, statuses, windowPassed, can }) {
    const { errors } = usePage().props;
    const [pending, setPending] = useState(null); // key of actions, or 'delete'
    const [processing, setProcessing] = useState(false);

    const breadcrumbs = [{ label: 'Youth Management' }, { label: 'Elections', href: route('admin.elections.index') }, { label: election.title }];
    const percent = turnout.eligible ? Math.round((turnout.voted / turnout.eligible) * 100) : 0;

    const run = (key) =>
        key === 'delete'
            ? router.delete(route('admin.elections.destroy', election.id), { onStart: () => setProcessing(true), onFinish: () => setProcessing(false) })
            : router.post(route(actions[key].route, election.id), {}, {
                  preserveScroll: true,
                  onStart: () => setProcessing(true),
                  onFinish: () => {
                      setProcessing(false);
                      setPending(null);
                  },
              });

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`${election.title} - Election`} />
            <FlashAlert />

            <PageHeader
                title={election.title}
                icon={Vote}
                actions={
                    <>
                        <StatusBadge variant={electionVariants[election.status]} dot>
                            {statuses[election.status]}
                        </StatusBadge>
                        {can.update && election.status === 'draft' && (
                            <>
                                <Button variant="secondary" href={route('admin.elections.edit', election.id)}>
                                    <Pencil className="h-4 w-4" />
                                    Edit
                                </Button>
                                <Button variant="secondary" onClick={() => setPending('delete')}>
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </Button>
                                <Button onClick={() => setPending('open')}>
                                    <Play className="h-4 w-4" />
                                    Open voting
                                </Button>
                            </>
                        )}
                        {can.update && election.status === 'open' && (
                            <Button onClick={() => setPending('close')}>
                                <Square className="h-4 w-4" />
                                Close voting
                            </Button>
                        )}
                        {can.certify && election.status === 'closed' && (
                            <Button onClick={() => setPending('publish')}>
                                <BadgeCheck className="h-4 w-4" />
                                Certify & publish
                            </Button>
                        )}
                    </>
                }
            />

            {errors.status && <p className="mb-4 bg-red-50 px-4 py-3 text-sm text-red-700">{errors.status}</p>}
            {election.status === 'open' && windowPassed && (
                <p className="mb-4 flex items-center gap-2 border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    <CircleAlert className="h-4 w-4 shrink-0" />
                    The voting window has ended and no more votes are accepted. Close voting to count the results.
                </p>
            )}

            <p className="mb-4 text-sm text-slate-500">
                {election.area ? `Approved members in ${election.area}` : 'All approved members'} · {formatDateTime(election.opens_at)} to{' '}
                {formatDateTime(election.closes_at)}
                {election.description && <span className="mt-1 block whitespace-pre-line text-slate-600">{election.description}</span>}
            </p>

            <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <StatCard label="Eligible voters" value={turnout.eligible.toLocaleString()} hint="Approved members in the electorate now" />
                <StatCard label="Voted" value={turnout.voted.toLocaleString()} />
                <StatCard label="Turnout" value={`${percent}%`} />
            </div>

            {results ? (
                <section className="mb-6">
                    <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                        <h2 className="text-lg font-semibold text-slate-900">Results</h2>
                        <p className="text-xs text-slate-500">
                            {election.status === 'published'
                                ? `Certified by ${election.certified_by ?? 'a former officer'} and published to members.`
                                : 'Not yet certified. Members cannot see these results.'}
                        </p>
                    </div>
                    <ElectionResults results={results} />
                </section>
            ) : (
                election.status !== 'draft' && (
                    <p className="mb-6 flex items-center gap-2 border border-slate-200/80 bg-white px-4 py-4 text-sm text-slate-500">
                        <Lock className="h-4 w-4" />
                        Results stay sealed until voting is closed.
                    </p>
                )
            )}

            <section className="border border-slate-200/80 bg-white">
                <h2 className="border-b border-slate-100 px-5 py-3 text-sm font-semibold text-slate-900">Ballot</h2>
                <div className="divide-y divide-slate-100">
                    {election.positions.map((p) => (
                        <div key={p.id} className="px-5 py-4">
                            <p className="font-medium text-slate-900">
                                {p.title}
                                <span className="ml-2 text-xs font-normal text-slate-500">
                                    {p.seats === 1 ? 'choose 1' : `choose up to ${p.seats}`}
                                </span>
                            </p>
                            <ul className="mt-2 space-y-1.5">
                                {p.candidates.map((c) => (
                                    <li key={c.id} className="text-sm text-slate-700">
                                        {c.name}
                                        {c.statement && <span className="block text-xs text-slate-500">{c.statement}</span>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            <ConfirmDialog
                open={!!pending}
                onClose={() => setPending(null)}
                title={pending === 'delete' ? 'Delete this draft?' : actions[pending]?.title}
                message={pending === 'delete' ? 'The draft election and its ballot will be permanently deleted.' : actions[pending]?.message}
                confirmLabel={pending === 'delete' ? 'Delete' : actions[pending]?.label}
                danger={pending === 'delete' || pending === 'close'}
                processing={processing}
                onConfirm={() => run(pending)}
            />
        </AdminLayout>
    );
}
