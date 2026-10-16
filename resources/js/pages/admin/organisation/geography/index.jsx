import { Head, router, useForm } from '@inertiajs/react';
import { Map, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button, Checkbox, ConfirmDialog, FlashAlert, Modal, PageHeader, StatusBadge, TextInput, useTreeOptions } from '../../../../components/admin';
import AdminLayout from '../../../../layouts/AdminLayout';

export default function GeographyIndex({ areas, levels, childLevels, canCreateRoot }) {
    const tree = useTreeOptions(areas, { showLevel: false });
    const [editing, setEditing] = useState(null); // { area } to edit, or { parent } to add a child
    const [deleting, setDeleting] = useState(null);

    return (
        <AdminLayout>
            <Head title="Geography - Admin" />
            <FlashAlert />

            <PageHeader
                title="Geography"
                icon={Map}
                actions={
                    canCreateRoot && (
                        <Button onClick={() => setEditing({ parent: null })}>
                            <Plus className="h-4 w-4" />
                            Add country
                        </Button>
                    )
                }
            />

            <div className="overflow-hidden border border-slate-200/80 bg-white">
                {tree.length === 0 ? (
                    <div className="px-6 py-12 text-center text-sm text-slate-500">
                        No areas yet.{canCreateRoot ? ' Run the Jonglei geography seeder, or add a country first.' : ''}
                    </div>
                ) : (
                    <ul className="divide-y divide-slate-100">
                        {tree.map(({ item: area, depth }) => (
                            <li
                                key={area.id}
                                className="flex flex-wrap items-center gap-3 px-4 py-2.5 hover:bg-slate-50/80"
                                style={{ paddingLeft: `${1 + depth * 1.5}rem` }}
                            >
                                <div className="flex min-w-0 flex-1 items-center gap-2">
                                    <span className="truncate font-medium text-slate-900">{area.name}</span>
                                    <StatusBadge variant="soft">{levels[area.level] ?? area.level}</StatusBadge>
                                    {area.code && <span className="text-xs text-slate-400">{area.code}</span>}
                                    {!area.is_active && <StatusBadge variant="gray">Inactive</StatusBadge>}
                                </div>
                                <span className="text-xs text-slate-400">
                                    {area.children_count} sub-area{area.children_count === 1 ? '' : 's'} · {area.units_count} unit
                                    {area.units_count === 1 ? '' : 's'}
                                </span>
                                <div className="flex gap-1">
                                    {area.can.addChild && (
                                        <Button variant="ghost" size="sm" onClick={() => setEditing({ parent: area })}>
                                            <Plus className="h-3.5 w-3.5" />
                                            Add {levels[childLevels[area.level]?.[0]]?.toLowerCase()}
                                        </Button>
                                    )}
                                    {area.can.update && (
                                        <Button variant="ghost" size="sm" onClick={() => setEditing({ area })} aria-label={`Edit ${area.name}`}>
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                    )}
                                    {area.can.delete && area.children_count === 0 && area.units_count === 0 && (
                                        <Button variant="ghost" size="sm" onClick={() => setDeleting(area)} aria-label={`Delete ${area.name}`}>
                                            <Trash2 className="h-3.5 w-3.5 text-red-600" />
                                        </Button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {editing && <AreaForm {...editing} levels={levels} childLevels={childLevels} onClose={() => setEditing(null)} />}

            <ConfirmDialog
                open={!!deleting}
                onClose={() => setDeleting(null)}
                title="Delete area?"
                message={
                    deleting && `${deleting.name} will be removed. Areas used by people or role scopes cannot be deleted; deactivate them instead.`
                }
                confirmLabel="Delete"
                danger
                onConfirm={() =>
                    router.delete(route('admin.organisation.geography.destroy', deleting.id), {
                        preserveScroll: true,
                        onFinish: () => setDeleting(null),
                    })
                }
            />
        </AdminLayout>
    );
}

function AreaForm({ area, parent, levels, childLevels, onClose }) {
    const creating = !area;
    const level = creating ? (parent ? childLevels[parent.level]?.[0] : 'country') : area.level;
    const form = useForm(
        creating
            ? { parent_id: parent?.id ?? '', level, name: '', code: '', is_active: true }
            : { name: area.name, code: area.code ?? '', is_active: area.is_active },
    );

    const submit = (e) => {
        e.preventDefault();
        const options = { preserveScroll: true, onSuccess: onClose };
        creating
            ? form.post(route('admin.organisation.geography.store'), options)
            : form.put(route('admin.organisation.geography.update', area.id), options);
    };

    return (
        <Modal
            open
            onClose={onClose}
            title={creating ? `Add ${levels[level]?.toLowerCase()}${parent ? ` in ${parent.name}` : ''}` : `Edit ${area.name}`}
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" form="area-form" loading={form.processing}>
                        Save
                    </Button>
                </>
            }
        >
            <form id="area-form" onSubmit={submit} className="space-y-4">
                {form.errors.level && <p className="bg-red-50 px-3 py-2 text-sm text-red-700">{form.errors.level}</p>}
                <TextInput
                    id="name"
                    label="Name"
                    required
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                    error={form.errors.name}
                />
                <TextInput
                    id="code"
                    label="Code"
                    hint="Optional short reference, e.g. an official area code."
                    value={form.data.code}
                    onChange={(e) => form.setData('code', e.target.value)}
                    error={form.errors.code}
                />
                <Checkbox
                    id="is_active"
                    label="Active"
                    hint="Inactive areas stay in history but shouldn't be used for new records."
                    checked={form.data.is_active}
                    onChange={(e) => form.setData('is_active', e.target.checked)}
                />
            </form>
        </Modal>
    );
}
