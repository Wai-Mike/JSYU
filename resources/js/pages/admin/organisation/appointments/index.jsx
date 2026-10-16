import { Head, Link } from '@inertiajs/react';
import { BadgeCheck } from 'lucide-react';
import {
    DataTable,
    FilterBar,
    FlashAlert,
    formatDate,
    PageHeader,
    Pagination,
    StatusBadge,
    TableCell,
    useQueryFilters,
} from '../../../../components/admin';
import AdminLayout from '../../../../layouts/AdminLayout';

const views = [
    { key: 'active', label: 'Current officials' },
    { key: 'history', label: 'Leadership history' },
    { key: 'vacancies', label: 'Vacancies' },
];

export default function AppointmentsIndex({ view, filters, appointments, vacancies }) {
    const [query, setQuery] = useQueryFilters({ view, search: filters.search ?? '' });

    return (
        <AdminLayout>
            <Head title="Leadership & Officials - Admin" />
            <FlashAlert />

            <PageHeader
                title="Leadership & Officials"
                icon={BadgeCheck}
            />

            <div role="tablist" className="mb-4 flex gap-1 overflow-x-auto border border-slate-200/80 bg-white p-1">
                {views.map((v) => (
                    <button
                        key={v.key}
                        role="tab"
                        type="button"
                        aria-selected={query.view === v.key}
                        onClick={() => setQuery('view', v.key)}
                        className={` px-4 py-2 text-sm font-medium whitespace-nowrap ${
                            query.view === v.key ? 'bg-jsyu-green text-white ' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        {v.label}
                    </button>
                ))}
            </div>

            <FilterBar
                onSubmit={(e) => e.preventDefault()}
                searchValue={query.search}
                onSearchChange={(v) => setQuery('search', v)}
                searchPlaceholder={view === 'vacancies' ? 'Position title' : 'Person or position'}
            />

            {view === 'vacancies' ? (
                <DataTable
                    columns={[
                        { key: 'position', label: 'Position' },
                        { key: 'unit', label: 'Unit' },
                        { key: 'vacant', label: 'Vacant seats', align: 'right' },
                    ]}
                    isEmpty={vacancies.length === 0}
                    empty="Every active position is filled."
                >
                    {vacancies.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/80">
                            <TableCell className="font-medium text-slate-900">{row.title}</TableCell>
                            <TableCell>
                                <Link
                                    href={route('admin.organisation.units.show', row.unit.id)}
                                    className="text-jsyu-green hover:text-jsyu-green-hover"
                                >
                                    {row.unit.name}
                                </Link>
                            </TableCell>
                            <TableCell align="right">
                                <StatusBadge variant="amber">
                                    {row.vacant} of {row.seats}
                                </StatusBadge>
                            </TableCell>
                        </tr>
                    ))}
                </DataTable>
            ) : (
                <DataTable
                    columns={[
                        { key: 'person', label: 'Person' },
                        { key: 'position', label: 'Position' },
                        { key: 'unit', label: 'Unit' },
                        { key: 'period', label: view === 'history' ? 'Served' : 'Since' },
                    ]}
                    isEmpty={appointments.data.length === 0}
                    empty={view === 'history' ? 'No past appointments yet.' : 'No current appointments.'}
                    footer={<Pagination paginator={appointments} />}
                >
                    {appointments.data.map((a) => (
                        <tr key={a.id} className="hover:bg-slate-50/80">
                            <TableCell>
                                <Link
                                    href={route('admin.organisation.appointments.show', a.id)}
                                    className="hover:text-jsyu-green font-medium text-slate-900"
                                >
                                    {a.person?.full_name}
                                </Link>
                            </TableCell>
                            <TableCell>{a.position?.title}</TableCell>
                            <TableCell className="text-slate-500">{a.unit?.name}</TableCell>
                            <TableCell className="whitespace-nowrap text-slate-500">
                                {view === 'history' ? `${formatDate(a.starts_on)} – ${formatDate(a.ended_on)}` : formatDate(a.starts_on)}
                                {view === 'active' && a.term_ends_on && <span className="block text-xs">Term ends {formatDate(a.term_ends_on)}</span>}
                            </TableCell>
                        </tr>
                    ))}
                </DataTable>
            )}
        </AdminLayout>
    );
}
