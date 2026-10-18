import { Head, Link, router } from '@inertiajs/react';
import { ChevronRight, ClipboardList, Lock, Pencil, Play, Plus, Square } from 'lucide-react';
import { useState } from 'react';
import {
    Button,
    Checkbox,
    ConfirmDialog,
    DataTable,
    FilterBar,
    FilterSelect,
    FlashAlert,
    formatDate,
    PageHeader,
    Pagination,
    StatCard,
    StatusBadge,
    TableCell,
    useQueryFilters,
} from '../../../components/admin';
import AdminLayout from '../../../layouts/AdminLayout';
import { CampaignForm, campaignVariants } from './index';

export const recordVariants = { submitted: 'amber', approved: 'green', rejected: 'red' };

export default function CensusShow({ campaign, records, filters, recordStatuses, statuses, report, areas, can }) {
    const [query, setQuery] = useQueryFilters({ status: filters.status, search: filters.search ?? '', mine: filters.mine });
    const [editing, setEditing] = useState(false);
    const [confirm, setConfirm] = useState(null); // 'open' | 'close'
    const [processing, setProcessing] = useState(false);

    const breadcrumbs = [{ label: 'Youth Management' }, { label: 'Youth Census', href: route('admin.census.index') }, { label: campaign.name }];

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'sex', label: 'Sex / age' },
        { key: 'area', label: 'Area' },
        { key: 'enumerator', label: 'Entered by' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: '', align: 'right' },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`${campaign.name} - Census`} />
            <FlashAlert />

            <PageHeader
                title={campaign.name}
                icon={ClipboardList}
                actions={
                    <>
                        <StatusBadge variant={campaignVariants[campaign.status]} dot>
                            {statuses[campaign.status]}
                        </StatusBadge>
                        {can.update && (
                            <Button variant="secondary" onClick={() => setEditing(true)}>
                                <Pencil className="h-4 w-4" />
                                Edit
                            </Button>
                        )}
                        {can.update && campaign.status !== 'open' && (
                            <Button variant="secondary" onClick={() => setConfirm('open')}>
                                <Play className="h-4 w-4" />
                                {campaign.status === 'closed' ? 'Reopen' : 'Open collection'}
                            </Button>
                        )}
                        {can.update && campaign.status === 'open' && (
                            <Button variant="secondary" onClick={() => setConfirm('close')}>
                                <Square className="h-4 w-4" />
                                Close
                            </Button>
                        )}
                        {can.collect && (
                            <Button href={route('admin.census.records.create', campaign.id)}>
                                <Plus className="h-4 w-4" />
                                Add record
                            </Button>
                        )}
                    </>
                }
            />

            <p className="mb-4 text-sm text-slate-500">
                {campaign.area ?? 'State-wide'} · {formatDate(campaign.starts_on)} – {campaign.ends_on ? formatDate(campaign.ends_on) : 'ongoing'}
                {campaign.description && <span className="mt-1 block whitespace-pre-line text-slate-600">{campaign.description}</span>}
            </p>

            {report && <Report report={report} />}

            <h2 className="mb-3 text-lg font-semibold text-slate-900">Records</h2>

            <FilterBar
                onSubmit={(e) => e.preventDefault()}
                searchValue={query.search}
                onSearchChange={(v) => setQuery('search', v)}
                searchPlaceholder="Name or phone"
            >
                <FilterSelect label="Status" value={query.status} onChange={(v) => setQuery('status', v)}>
                    <option value="all">All</option>
                    {Object.entries(recordStatuses).map(([key, label]) => (
                        <option key={key} value={key}>
                            {label}
                        </option>
                    ))}
                </FilterSelect>
                <div className="pb-2">
                    <Checkbox id="mine" label="Only records I entered" checked={!!query.mine} onChange={(e) => setQuery('mine', e.target.checked ? 1 : '')} />
                </div>
            </FilterBar>

            <DataTable columns={columns} isEmpty={records.data.length === 0} empty="No records match." footer={<Pagination paginator={records} />}>
                {records.data.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/80">
                        <TableCell>
                            <Link href={route('admin.census.records.show', r.id)} className="hover:text-jsyu-green font-medium text-slate-900">
                                {r.full_name}
                            </Link>
                            <span className="block text-xs text-slate-500">{formatDate(r.created_at)}</span>
                        </TableCell>
                        <TableCell className="text-slate-500">
                            {r.sex === 'female' ? 'F' : 'M'} · {r.age ?? '—'}
                        </TableCell>
                        <TableCell className="text-slate-500">{r.area}</TableCell>
                        <TableCell className="text-slate-500">{r.enumerator ?? '—'}</TableCell>
                        <TableCell>
                            <StatusBadge variant={recordVariants[r.status]} dot>
                                {recordStatuses[r.status]}
                            </StatusBadge>
                        </TableCell>
                        <TableCell align="right">
                            <Link
                                href={route('admin.census.records.show', r.id)}
                                className="text-jsyu-green hover:text-jsyu-green-hover inline-flex items-center gap-1 text-sm font-medium"
                            >
                                View
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </TableCell>
                    </tr>
                ))}
            </DataTable>

            {editing && (
                <CampaignForm campaign={campaign} areas={areas} canStatewide={can.canCreateStatewide} onClose={() => setEditing(false)} />
            )}

            <ConfirmDialog
                open={!!confirm}
                onClose={() => setConfirm(null)}
                title={confirm === 'open' ? 'Open for collection?' : 'Close this campaign?'}
                message={
                    confirm === 'open'
                        ? 'Enumerators in the campaign area will be able to enter records.'
                        : 'No new records can be entered. Review and reports stay available, and you can reopen it later.'
                }
                confirmLabel={confirm === 'open' ? 'Open' : 'Close campaign'}
                processing={processing}
                onConfirm={() =>
                    router.post(route(confirm === 'open' ? 'admin.census.open' : 'admin.census.close', campaign.id), {}, {
                        preserveScroll: true,
                        onStart: () => setProcessing(true),
                        onFinish: () => {
                            setProcessing(false);
                            setConfirm(null);
                        },
                    })
                }
            />
        </AdminLayout>
    );
}

function Report({ report }) {
    const female = report.bySex.find((r) => r.label === 'Female')?.count ?? 0;
    const male = report.bySex.find((r) => r.label === 'Male')?.count ?? 0;
    const inSchool = report.inSchool.find((r) => r.label === 'In school')?.count ?? 0;

    return (
        <section className="mb-8">
            <div className="mb-4 flex items-baseline justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900">Summary</h2>
                <p className="text-xs text-slate-500">Approved records in your area only. These are census counts, not the total youth population.</p>
            </div>

            <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Youth counted" value={report.total.toLocaleString()} />
                <StatCard label="Female" value={female.toLocaleString()} hint={share(female, report.total)} />
                <StatCard label="Male" value={male.toLocaleString()} hint={share(male, report.total)} />
                <StatCard label="In school" value={inSchool.toLocaleString()} hint={share(inSchool, report.total)} />
            </div>

            {report.total === 0 ? (
                <p className="border border-slate-200/80 bg-white px-4 py-8 text-center text-sm text-slate-500">
                    Breakdowns appear once records are approved.
                </p>
            ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                    <Breakdown title="By county" rows={report.byCounty} total={report.total} />
                    <Breakdown title="By age" rows={report.byAge} total={report.total} />
                    <Breakdown title="Highest education" rows={report.byEducation} total={report.total} />
                    <Breakdown title="Employment" rows={report.byEmployment} total={report.total} />
                    {report.sensitive && (
                        <>
                            <Breakdown title="Disability" rows={report.sensitive.disability} total={report.total} sensitive />
                            <Breakdown title="Displacement" rows={report.sensitive.displacement} total={report.total} sensitive />
                        </>
                    )}
                </div>
            )}
        </section>
    );
}

function share(count, total) {
    return total ? `${Math.round((count / total) * 100)}% of counted youth` : undefined;
}

/** One series of counts as thin horizontal bars; the numbers are printed, so the bars are a reading aid only. */
function Breakdown({ title, rows, total, sensitive = false }) {
    const max = Math.max(1, ...rows.map((r) => r.count));

    return (
        <div className="border border-slate-200/80 bg-white">
            <h3 className="flex items-center gap-1.5 border-b border-slate-100 px-5 py-3 text-sm font-semibold text-slate-900">
                {title}
                {sensitive && (
                    <span className="inline-flex items-center gap-1 text-xs font-normal text-slate-500">
                        <Lock className="h-3 w-3" />
                        Sensitive
                    </span>
                )}
            </h3>
            <ul className="space-y-2.5 px-5 py-4">
                {rows.map((row) => (
                    <li
                        key={row.label}
                        className="group grid grid-cols-[9rem_1fr_4.5rem] items-center gap-3 text-sm"
                        title={`${row.label}: ${row.count} (${total ? Math.round((row.count / total) * 100) : 0}%)`}
                    >
                        <span className="truncate text-slate-600">{row.label}</span>
                        <span className="h-2.5 bg-slate-100">
                            <span
                                className="bg-jsyu-green group-hover:bg-jsyu-green-deep block h-full rounded-r"
                                style={{ width: `${(row.count / max) * 100}%` }}
                            />
                        </span>
                        <span className="text-right text-slate-900 tabular-nums">
                            {row.count.toLocaleString()}
                            <span className="ml-1 text-xs text-slate-400">{total ? Math.round((row.count / total) * 100) : 0}%</span>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
