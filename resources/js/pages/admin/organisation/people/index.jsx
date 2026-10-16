import { Head, useForm } from '@inertiajs/react';
import { Contact, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';
import {
    Button,
    Checkbox,
    DataTable,
    FilterBar,
    FilterSelect,
    FlashAlert,
    Modal,
    PageHeader,
    Pagination,
    Select,
    StatusBadge,
    TableCell,
    Textarea,
    TextInput,
    useQueryFilters,
    useTreeOptions,
} from '../../../../components/admin';
import AdminLayout from '../../../../layouts/AdminLayout';

export default function PeopleIndex({ people, filters, areas, manageAreas, canCreate, canCreateStatewide }) {
    const [query, setQuery] = useQueryFilters({ search: filters.search ?? '', area: filters.area ?? '' });
    const [editing, setEditing] = useState(null); // {} for new, {person} to edit
    const areaOptions = useTreeOptions(areas);

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'contact', label: 'Contact' },
        { key: 'area', label: 'Area' },
        { key: 'positions', label: 'Current positions' },
        { key: 'actions', label: '', align: 'right' },
    ];

    return (
        <AdminLayout>
            <Head title="People - Admin" />
            <FlashAlert />

            <PageHeader
                title="People"
                icon={Contact}
                actions={
                    canCreate && (
                        <Button onClick={() => setEditing({})}>
                            <Plus className="h-4 w-4" />
                            Add person
                        </Button>
                    )
                }
            />

            <FilterBar
                onSubmit={(e) => e.preventDefault()}
                searchValue={query.search}
                onSearchChange={(v) => setQuery('search', v)}
                searchPlaceholder="Name, email or phone"
            >
                <FilterSelect label="Area" value={query.area} onChange={(v) => setQuery('area', v)}>
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
                isEmpty={people.data.length === 0}
                empty="No people match your filters."
                footer={<Pagination paginator={people} />}
            >
                {people.data.map((person) => (
                    <tr key={person.id} className="hover:bg-slate-50/80">
                        <TableCell>
                            <span className="font-medium text-slate-900">{person.full_name}</span>
                            {person.has_account && (
                                <span className="ml-2">
                                    <StatusBadge variant="soft">Has account</StatusBadge>
                                </span>
                            )}
                        </TableCell>
                        <TableCell className="text-slate-500">
                            {person.email && <span className="block">{person.email}</span>}
                            {person.phone && <span className="block">{person.phone}</span>}
                            {!person.email && !person.phone && '—'}
                        </TableCell>
                        <TableCell className="text-slate-500">{person.area ?? 'State level'}</TableCell>
                        <TableCell>
                            {person.positions.length ? (
                                <div className="flex flex-wrap gap-1">
                                    {person.positions.map((title) => (
                                        <StatusBadge key={title} variant="gray">
                                            {title}
                                        </StatusBadge>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-slate-400">—</span>
                            )}
                        </TableCell>
                        <TableCell align="right">
                            {person.can.update && (
                                <Button variant="ghost" size="sm" onClick={() => setEditing({ person })} aria-label={`Edit ${person.full_name}`}>
                                    <Pencil className="h-3.5 w-3.5" />
                                </Button>
                            )}
                        </TableCell>
                    </tr>
                ))}
            </DataTable>

            {editing && <PersonForm person={editing.person} areas={manageAreas} canStatewide={canCreateStatewide} onClose={() => setEditing(null)} />}
        </AdminLayout>
    );
}

function PersonForm({ person, areas, canStatewide, onClose }) {
    const creating = !person;
    const areaOptions = useTreeOptions(areas);
    const form = useForm({
        full_name: person?.full_name ?? '',
        email: person?.email ?? '',
        phone: person?.phone ?? '',
        gender: person?.gender ?? '',
        geographic_area_id: person?.geographic_area_id ?? '',
        notes: person?.notes ?? '',
        link_account: false,
    });

    const submit = (e) => {
        e.preventDefault();
        const options = { preserveScroll: true, onSuccess: onClose };
        creating
            ? form.post(route('admin.organisation.people.store'), options)
            : form.put(route('admin.organisation.people.update', person.id), options);
    };

    return (
        <Modal
            open
            wide
            onClose={onClose}
            title={creating ? 'Add person' : `Edit ${person.full_name}`}
            description="Record only what the Union needs to contact and recognise this person."
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" form="person-form" loading={form.processing}>
                        Save
                    </Button>
                </>
            }
        >
            <form id="person-form" onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <TextInput
                        id="full_name"
                        label="Full name"
                        required
                        value={form.data.full_name}
                        onChange={(e) => form.setData('full_name', e.target.value)}
                        error={form.errors.full_name}
                    />
                </div>
                <TextInput
                    id="email"
                    type="email"
                    label="Email"
                    value={form.data.email}
                    onChange={(e) => form.setData('email', e.target.value)}
                    error={form.errors.email}
                />
                <TextInput
                    id="phone"
                    type="tel"
                    label="Phone"
                    value={form.data.phone}
                    onChange={(e) => form.setData('phone', e.target.value)}
                    error={form.errors.phone}
                />
                <Select
                    id="gender"
                    label="Gender"
                    placeholder="Not recorded"
                    value={form.data.gender}
                    onChange={(e) => form.setData('gender', e.target.value)}
                    options={{ male: 'Male', female: 'Female', other: 'Other' }}
                    error={form.errors.gender}
                />
                <Select
                    id="geographic_area_id"
                    label="Area"
                    placeholder={canStatewide ? 'State level' : 'Choose an area'}
                    required={!canStatewide}
                    value={form.data.geographic_area_id}
                    onChange={(e) => form.setData('geographic_area_id', e.target.value)}
                    options={areaOptions}
                    error={form.errors.geographic_area_id}
                />
                <div className="sm:col-span-2">
                    <Textarea
                        id="notes"
                        label="Restricted notes"
                        hint="Visible only to officers who can edit this record."
                        value={form.data.notes}
                        onChange={(e) => form.setData('notes', e.target.value)}
                        error={form.errors.notes}
                    />
                </div>
                {(creating || !person.has_account) && (
                    <div className="sm:col-span-2">
                        <Checkbox
                            id="link_account"
                            label="Link to the user account with this email"
                            hint="Avoids a separate profile when the person already has a JSYU login."
                            checked={form.data.link_account}
                            onChange={(e) => form.setData('link_account', e.target.checked)}
                        />
                        {form.errors.link_account && <p className="mt-1 text-xs text-red-600">{form.errors.link_account}</p>}
                    </div>
                )}
            </form>
        </Modal>
    );
}
