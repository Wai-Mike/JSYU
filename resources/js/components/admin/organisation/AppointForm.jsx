import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Button, Field, Modal, PersonPicker, Textarea, TextInput } from '../index';

/** Appoint a person to a position, optionally attaching the appointment letter. */
export default function AppointForm({ position, onClose }) {
    const [person, setPerson] = useState(null);
    const form = useForm({
        position_id: position.id,
        person_id: '',
        starts_on: new Date().toISOString().slice(0, 10),
        term_ends_on: '',
        notes: '',
        document: null,
        document_title: 'Appointment letter',
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('admin.organisation.appointments.store'), { forceFormData: true, onSuccess: onClose });
    };

    return (
        <Modal
            open
            wide
            onClose={onClose}
            title={`Appoint to ${position.title}`}
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" form="appoint-form" loading={form.processing} disabled={!form.data.person_id}>
                        Appoint
                    </Button>
                </>
            }
        >
            <form id="appoint-form" onSubmit={submit} className="space-y-4">
                {form.errors.position_id && <p className="bg-red-50 px-3 py-2 text-sm text-red-700">{form.errors.position_id}</p>}
                <PersonPicker
                    required
                    value={person}
                    onChange={(p) => {
                        setPerson(p);
                        form.setData('person_id', p.id);
                    }}
                    error={form.errors.person_id}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                    <TextInput
                        id="starts_on"
                        type="date"
                        label="Start date"
                        required
                        value={form.data.starts_on}
                        onChange={(e) => form.setData('starts_on', e.target.value)}
                        error={form.errors.starts_on}
                    />
                    <TextInput
                        id="term_ends_on"
                        type="date"
                        label="Term ends"
                        hint={position.term_months ? `Defaults to ${position.term_months} months after the start` : 'Optional'}
                        value={form.data.term_ends_on}
                        onChange={(e) => form.setData('term_ends_on', e.target.value)}
                        error={form.errors.term_ends_on}
                    />
                </div>
                <Textarea
                    id="notes"
                    label="Notes"
                    value={form.data.notes}
                    onChange={(e) => form.setData('notes', e.target.value)}
                    error={form.errors.notes}
                />
                <Field
                    label="Appointment letter"
                    hint="Optional. PDF, Word or image, up to 10 MB. Stored privately."
                    error={form.errors.document}
                    htmlFor="document"
                >
                    <input
                        id="document"
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => form.setData('document', e.target.files[0] ?? null)}
                        className="file:bg-jsyu-green-light file:text-jsyu-green-deep block w-full text-sm text-slate-600 file:mr-3 file:border-0 file:px-3 file:py-2 file:text-sm file:font-semibold"
                    />
                </Field>
            </form>
        </Modal>
    );
}
