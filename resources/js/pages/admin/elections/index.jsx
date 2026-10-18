import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Plus, Vote } from 'lucide-react';
import { Button, DataTable, FlashAlert, PageHeader, StatusBadge, TableCell } from '../../../components/admin';
import AdminLayout from '../../../layouts/AdminLayout';

export const electionVariants = { draft: 'gray', open: 'green', closed: 'amber', published: 'soft' };

export function formatDateTime(value) {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? value
        : date.toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function ElectionsIndex({ elections, statuses, canCreate }) {
    const columns = [
        { key: 'title', label: 'Election' },
        { key: 'area', label: 'Electorate' },
        { key: 'window', label: 'Voting window' },
        { key: 'votes', label: 'Voted', align: 'right' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: '', align: 'right' },
    ];

    return (
        <AdminLayout>
            <Head title="Elections - Admin" />
            <FlashAlert />

            <PageHeader
                title="Elections"
                icon={Vote}
                actions={
                    canCreate && (
                        <Button href={route('admin.elections.create')}>
                            <Plus className="h-4 w-4" />
                            New election
                        </Button>
                    )
                }
            />

            <DataTable columns={columns} isEmpty={elections.length === 0} empty="No elections yet.">
                {elections.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50/80">
                        <TableCell>
                            <Link href={route('admin.elections.show', e.id)} className="hover:text-jsyu-green font-medium text-slate-900">
                                {e.title}
                            </Link>
                            <span className="block text-xs text-slate-500">
                                {e.positions_count} {e.positions_count === 1 ? 'position' : 'positions'}
                            </span>
                        </TableCell>
                        <TableCell className="text-slate-500">{e.area ? `Members in ${e.area}` : 'All approved members'}</TableCell>
                        <TableCell className="text-slate-500">
                            {formatDateTime(e.opens_at)}
                            <span className="block">to {formatDateTime(e.closes_at)}</span>
                        </TableCell>
                        <TableCell align="right" className="tabular-nums">
                            {e.status === 'draft' ? '—' : e.voters_count}
                        </TableCell>
                        <TableCell>
                            <StatusBadge variant={electionVariants[e.status]} dot>
                                {statuses[e.status]}
                            </StatusBadge>
                        </TableCell>
                        <TableCell align="right">
                            <Link
                                href={route('admin.elections.show', e.id)}
                                className="text-jsyu-green hover:text-jsyu-green-hover inline-flex items-center gap-1 text-sm font-medium"
                            >
                                View
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </TableCell>
                    </tr>
                ))}
            </DataTable>
        </AdminLayout>
    );
}
