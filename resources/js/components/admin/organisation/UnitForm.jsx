import { useForm } from '@inertiajs/react';
import { Button, Checkbox, Modal, Select, Textarea, TextInput, useTreeOptions } from '../index';

/** Create or edit an organisational unit. Used by the structure list and the unit page. */
export default function UnitForm({ unit, types, formOptions, defaultParentId, onClose }) {
    const creating = !unit;
    const form = useForm({
        parent_id: unit?.parent_id ?? defaultParentId ?? '',
        type: unit?.type ?? Object.keys(types)[0],
        name: unit?.name ?? '',
        code: unit?.code ?? '',
        description: unit?.description ?? '',
        geographic_area_id: unit?.geographic_area_id ?? '',
        is_active: unit?.is_active ?? true,
    });
    const areaOptions = useTreeOptions(formOptions.areas);
    const parentOptions = formOptions.parents.filter((p) => p.id !== unit?.id).map((p) => ({ value: p.id, label: p.name }));

    const submit = (e) => {
        e.preventDefault();
        const options = { preserveScroll: true, onSuccess: onClose };
        creating ? form.post(route('admin.organisation.units.store'), options) : form.put(route('admin.organisation.units.update', unit.id), options);
    };

    return (
        <Modal
            open
            wide
            onClose={onClose}
            title={creating ? 'New organisational unit' : `Edit ${unit.name}`}
            description="Offices, departments, committees and working groups. Linking a unit to an area puts it under that area's jurisdiction."
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" form="unit-form" loading={form.processing}>
                        Save
                    </Button>
                </>
            }
        >
            <form id="unit-form" onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <TextInput
                        id="name"
                        label="Name"
                        required
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        error={form.errors.name}
                    />
                </div>
                <Select
                    id="type"
                    label="Type"
                    required
                    value={form.data.type}
                    onChange={(e) => form.setData('type', e.target.value)}
                    options={types}
                    error={form.errors.type}
                />
                <TextInput
                    id="code"
                    label="Code"
                    value={form.data.code}
                    onChange={(e) => form.setData('code', e.target.value)}
                    error={form.errors.code}
                    hint="Optional reference"
                />
                <Select
                    id="parent_id"
                    label="Part of"
                    placeholder="— Top level —"
                    value={form.data.parent_id}
                    onChange={(e) => form.setData('parent_id', e.target.value)}
                    options={parentOptions}
                    error={form.errors.parent_id}
                />
                <Select
                    id="geographic_area_id"
                    label="Area"
                    placeholder={formOptions.statewide ? 'State level (no area)' : 'Choose an area'}
                    value={form.data.geographic_area_id}
                    onChange={(e) => form.setData('geographic_area_id', e.target.value)}
                    options={areaOptions}
                    error={form.errors.geographic_area_id}
                    required={!formOptions.statewide}
                />
                <div className="sm:col-span-2">
                    <Textarea
                        id="description"
                        label="Description"
                        value={form.data.description}
                        onChange={(e) => form.setData('description', e.target.value)}
                        error={form.errors.description}
                    />
                </div>
                <div className="sm:col-span-2">
                    <Checkbox
                        id="is_active"
                        label="Active"
                        checked={form.data.is_active}
                        onChange={(e) => form.setData('is_active', e.target.checked)}
                    />
                </div>
            </form>
        </Modal>
    );
}
