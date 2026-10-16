import { useForm } from '@inertiajs/react';
import { Button, Checkbox, Modal, Textarea, TextInput } from '../index';

export default function PositionForm({ unit, position, onClose }) {
    const creating = !position;
    const form = useForm({
        title: position?.title ?? '',
        description: position?.description ?? '',
        seats: position?.seats ?? 1,
        term_months: position?.term_months ?? '',
        sort_order: position?.sort_order ?? 0,
        is_leadership: position?.is_leadership ?? true,
        is_active: position?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        const options = { preserveScroll: true, onSuccess: onClose };
        creating
            ? form.post(route('admin.organisation.positions.store', unit.id), options)
            : form.put(route('admin.organisation.positions.update', position.id), options);
    };

    return (
        <Modal
            open
            onClose={onClose}
            title={creating ? `New position in ${unit.name}` : `Edit ${position.title}`}
            description="Use the titles in the Union's approved structure."
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" form="position-form" loading={form.processing}>
                        Save
                    </Button>
                </>
            }
        >
            <form id="position-form" onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <TextInput
                        id="title"
                        label="Title"
                        required
                        value={form.data.title}
                        onChange={(e) => form.setData('title', e.target.value)}
                        error={form.errors.title}
                    />
                </div>
                <TextInput
                    id="seats"
                    type="number"
                    min={1}
                    label="Seats"
                    required
                    hint="How many people can hold it at once"
                    value={form.data.seats}
                    onChange={(e) => form.setData('seats', e.target.value)}
                    error={form.errors.seats}
                />
                <TextInput
                    id="term_months"
                    type="number"
                    min={1}
                    label="Term length (months)"
                    hint="Pre-fills the term end date"
                    value={form.data.term_months}
                    onChange={(e) => form.setData('term_months', e.target.value)}
                    error={form.errors.term_months}
                />
                <div className="sm:col-span-2">
                    <Textarea
                        id="description"
                        label="Responsibilities"
                        value={form.data.description}
                        onChange={(e) => form.setData('description', e.target.value)}
                        error={form.errors.description}
                    />
                </div>
                <TextInput
                    id="sort_order"
                    type="number"
                    min={0}
                    label="Display order"
                    value={form.data.sort_order}
                    onChange={(e) => form.setData('sort_order', e.target.value)}
                    error={form.errors.sort_order}
                />
                <div className="space-y-2 pt-6">
                    <Checkbox
                        id="is_leadership"
                        label="Leadership position"
                        checked={form.data.is_leadership}
                        onChange={(e) => form.setData('is_leadership', e.target.checked)}
                    />
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
