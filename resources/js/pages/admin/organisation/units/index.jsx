import { Head, Link } from '@inertiajs/react';
import { Building2, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    Button,
    DataTable,
    FilterBar,
    FilterSelect,
    FlashAlert,
    PageHeader,
    StatusBadge,
    TableCell,
    useQueryFilters,
    useTreeOptions,
} from '../../../../components/admin';
import UnitForm from '../../../../components/admin/organisation/UnitForm';
import AdminLayout from '../../../../layouts/AdminLayout';

export default function UnitsIndex({ units, filters, types, formOptions, canCreate }) {
    const [query, setQuery] = useQueryFilters({ search: filters.search ?? '', type: filters.type ?? '' });
    const [creating, setCreating] = useState(false);
    const filtering = Boolean(filters.search || filters.type);

    // Show the hierarchy unless filtering, where a flat list is clearer
    const tree = useTreeOptions(units, { showLevel: false });
    const rows = useMemo(() => (filtering ? units.map((item) => ({ item, depth: 0 })) : tree), [filtering, units, tree]);

    const columns = [
        { key: 'name', label: 'Unit' },
        { key: 'type', label: 'Type' },
        { key: 'area', label: 'Area' },
        { key: 'positions', label: 'Positions', align: 'right' },
        { key: 'vacancies', label: 'Vacant seats', align: 'right' },
    ];

    return (
        <AdminLayout>
            <Head title="Organisational Structure - Admin" />
            <FlashAlert />

            <PageHeader
                title="Organisational Structure"
                icon={Building2}
                actions={
                    canCreate && (
                        <Button onClick={() => setCreating(true)}>
                            <Plus className="h-4 w-4" />
                            New unit
                        </Button>
                    )
                }
            />

            <FilterBar
                onSubmit={(e) => e.preventDefault()}
                searchValue={query.search}
                onSearchChange={(v) => setQuery('search', v)}
                searchPlaceholder="Name or code"
            >
                <FilterSelect label="Type" value={query.type} onChange={(v) => setQuery('type', v)}>
                    <option value="">All types</option>
                    {Object.entries(types).map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </FilterSelect>
            </FilterBar>

            <DataTable
                columns={columns}
                isEmpty={rows.length === 0}
                empty={
                    filtering
                        ? 'No units match your filters.'
                        : 'No organisational units yet. Add the headquarters first, then its offices and departments.'
                }
            >
                {rows.map(({ item: unit, depth }) => (
                    <tr key={unit.id} className="hover:bg-slate-50/80">
                        <TableCell>
                            <div style={{ paddingLeft: `${depth * 1.25}rem` }} className="flex items-center gap-2">
                                <Link
                                    href={route('admin.organisation.units.show', unit.id)}
                                    className="hover:text-jsyu-green font-medium text-slate-900"
                                >
                                    {unit.name}
                                </Link>
                                {!unit.is_active && <StatusBadge variant="gray">Inactive</StatusBadge>}
                            </div>
                        </TableCell>
                        <TableCell className="text-slate-500">{types[unit.type] ?? unit.type}</TableCell>
                        <TableCell className="text-slate-500">{unit.area?.name ?? 'State level'}</TableCell>
                        <TableCell align="right">{unit.positions_count}</TableCell>
                        <TableCell align="right">
                            {unit.vacancies > 0 ? (
                                <StatusBadge variant="amber">{unit.vacancies}</StatusBadge>
                            ) : (
                                <span className="text-slate-400">0</span>
                            )}
                        </TableCell>
                    </tr>
                ))}
            </DataTable>

            {creating && <UnitForm types={types} formOptions={formOptions} onClose={() => setCreating(false)} />}
        </AdminLayout>
    );
}
