import { Head } from '@inertiajs/react';
import { History } from 'lucide-react';
import { useState } from 'react';
import {
    DataTable,
    FilterBar,
    FilterSelect,
    FlashAlert,
    PageHeader,
    Pagination,
    StatusBadge,
    TableCell,
    useQueryFilters,
} from '../../../components/admin';
import AdminLayout from '../../../layouts/AdminLayout';

export default function AuditIndex({ logs, filters, actions }) {
    const [query, setQuery] = useQueryFilters({
        search: filters.search ?? '',
        action: filters.action ?? '',
        from: filters.from ?? '',
        to: filters.to ?? '',
    });
    const [expanded, setExpanded] = useState(null);

    const columns = [
        { key: 'when', label: 'When' },
        { key: 'who', label: 'Who' },
        { key: 'what', label: 'What' },
        { key: 'action', label: 'Action' },
    ];

    return (
        <AdminLayout>
            <Head title="Audit Logs - Admin" />
            <FlashAlert />

            <PageHeader title="Audit Logs" icon={History} />

            <FilterBar
                onSubmit={(e) => e.preventDefault()}
                searchValue={query.search}
                onSearchChange={(v) => setQuery('search', v)}
                searchPlaceholder="Description or user"
            >
                <FilterSelect label="Action" value={query.action} onChange={(v) => setQuery('action', v)}>
                    <option value="">All actions</option>
                    {actions.map((a) => (
                        <option key={a} value={a}>
                            {a}
                        </option>
                    ))}
                </FilterSelect>
                <DateFilter label="From" value={query.from} onChange={(v) => setQuery('from', v)} />
                <DateFilter label="To" value={query.to} onChange={(v) => setQuery('to', v)} />
            </FilterBar>

            <DataTable
                columns={columns}
                isEmpty={logs.data.length === 0}
                empty="No audit entries match your filters."
                footer={<Pagination paginator={logs} />}
            >
                {logs.data.map((log) => (
                    <tr key={log.id} className="align-top hover:bg-slate-50/80">
                        <TableCell className="whitespace-nowrap text-slate-500">{log.created_at}</TableCell>
                        <TableCell className="whitespace-nowrap">{log.user ?? <span className="text-slate-400">System</span>}</TableCell>
                        <TableCell>
                            <p className="text-slate-800">{log.description}</p>
                            {log.subject && <p className="text-xs text-slate-400">{log.subject}</p>}
                            {log.properties && (
                                <button
                                    type="button"
                                    onClick={() => setExpanded(expanded === log.id ? null : log.id)}
                                    className="text-jsyu-green hover:text-jsyu-green-hover mt-1 text-xs font-medium"
                                >
                                    {expanded === log.id ? 'Hide details' : 'Details'}
                                </button>
                            )}
                            {expanded === log.id && (
                                <pre className="mt-2 max-w-xl overflow-x-auto bg-slate-50 p-3 text-xs text-slate-600">
                                    {JSON.stringify(log.properties, null, 2)}
                                </pre>
                            )}
                        </TableCell>
                        <TableCell>
                            <StatusBadge variant="gray">{log.action}</StatusBadge>
                        </TableCell>
                    </tr>
                ))}
            </DataTable>
        </AdminLayout>
    );
}

function DateFilter({ label, value, onChange }) {
    return (
        <div>
            <label className="mb-1 block text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</label>
            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="focus:border-jsyu-green focus:ring-jsyu-green/20 border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:outline-none"
            />
        </div>
    );
}
