import { Head, Link } from '@inertiajs/react';
import { ChevronRight, UserCheck } from 'lucide-react';
import {
    DataTable,
    FilterBar,
    FilterSelect,
    FlashAlert,
    formatDate,
    PageHeader,
    Pagination,
    StatusBadge,
    TableCell,
    useQueryFilters,
    useTreeOptions,
} from '../../../components/admin';
import AdminLayout from '../../../layouts/AdminLayout';

export const statusVariants = { pending: 'amber', approved: 'green', rejected: 'red' };

export default function MembersIndex({ members, status, filters, counts, statuses, areas }) {
    const [query, setQuery] = useQueryFilters({ status, search: filters.search ?? '', area: filters.area ?? '' });
    const areaOptions = useTreeOptions(areas);
    const total = Object.values(counts).reduce((sum, n) => sum + Number(n), 0);
    const tabs = [...Object.entries(statuses).map(([key, label]) => ({ key, label, count: counts[key] ?? 0 })), { key: 'all', label: 'All', count: total }];

    const columns = [
        { key: 'name', label: 'Member' },
        { key: 'contact', label: 'Contact' },
        { key: 'area', label: 'Home area' },
        { key: 'status', label: 'Status' },
        { key: 'updated', label: 'Last updated' },
        { key: 'actions', label: '', align: 'right' },
    ];

    return (
        <AdminLayout>
            <Head title="Members - Admin" />
            <FlashAlert />

            <PageHeader title="Members" icon={UserCheck} />

            <div className="mb-4 flex flex-wrap gap-1 border-b border-slate-200" role="tablist">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        role="tab"
                        aria-selected={query.status === tab.key}
                        onClick={() => setQuery('status', tab.key)}
                        className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium ${
                            query.status === tab.key ? 'border-jsyu-green text-jsyu-green-deep' : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        {tab.label}
                        <span className="bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">{tab.count}</span>
                    </button>
                ))}
            </div>

            <FilterBar
                onSubmit={(e) => e.preventDefault()}
                searchValue={query.search}
                onSearchChange={(v) => setQuery('search', v)}
                searchPlaceholder="Name, email or phone"
            >
                <FilterSelect label="Home area" value={query.area} onChange={(v) => setQuery('area', v)}>
                    <option value="">All areas</option>
                    {areaOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </FilterSelect>
            </FilterBar>

            <DataTable
                columns={columns}
                isEmpty={members.data.length === 0}
                empty={status === 'pending' ? 'No applications are waiting for review.' : 'No members match your filters.'}
                footer={<Pagination paginator={members} />}
            >
                {members.data.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50/80">
                        <TableCell>
                            <Link href={route('admin.members.show', member.id)} className="hover:text-jsyu-green font-medium text-slate-900">
                                {member.name}
                            </Link>
                            <span className="block text-xs text-slate-500">
                                {[member.gender && member.gender[0].toUpperCase() + member.gender.slice(1), member.age && `${member.age} yrs`]
                                    .filter(Boolean)
                                    .join(' · ') || '—'}
                            </span>
                        </TableCell>
                        <TableCell className="text-slate-500">
                            {member.email && <span className="block">{member.email}</span>}
                            {member.phone && <span className="block">{member.phone}</span>}
                            {!member.email && !member.phone && '—'}
                        </TableCell>
                        <TableCell className="text-slate-500">{member.home_area ?? '—'}</TableCell>
                        <TableCell>
                            <div className="flex flex-wrap gap-1">
                                <StatusBadge variant={statusVariants[member.status]} dot>
                                    {statuses[member.status] ?? member.status}
                                </StatusBadge>
                                {!member.complete && <StatusBadge variant="gray">Incomplete</StatusBadge>}
                            </div>
                        </TableCell>
                        <TableCell className="text-slate-500">{formatDate(member.updated_at)}</TableCell>
                        <TableCell align="right">
                            <Link
                                href={route('admin.members.show', member.id)}
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
