import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowRightLeft, BadgeCheck, Download, FileText, Trash2, Upload, UserMinus } from 'lucide-react';
import { useState } from 'react';
import {
    Button,
    ConfirmDialog,
    Field,
    FlashAlert,
    formatDate,
    Modal,
    PageHeader,
    PersonPicker,
    Select,
    StatusBadge,
    Textarea,
    TextInput,
} from '../../../../components/admin';
import AdminLayout from '../../../../layouts/AdminLayout';

const today = () => new Date().toISOString().slice(0, 10);

export default function AppointmentShow({ appointment, history, documents, endReasons, can }) {
    const [dialog, setDialog] = useState(null); // 'end' | 'transfer' | 'upload'
    const [removingDoc, setRemovingDoc] = useState(null);
    const active = appointment.status === 'active';

    const breadcrumbs = [
        { label: 'Organisation' },
        { label: 'Leadership & Officials', href: route('admin.organisation.appointments.index') },
        { label: appointment.person.full_name },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`${appointment.person.full_name} - Appointment`} />
            <FlashAlert />

            <PageHeader
                title={appointment.person.full_name}
                icon={BadgeCheck}
                actions={
                    <>
                        <StatusBadge variant={active ? 'green' : 'gray'} dot>
                            {active ? 'In office' : 'Ended'}
                        </StatusBadge>
                        {can.update && active && (
                            <>
                                <Button variant="secondary" onClick={() => setDialog('transfer')}>
                                    <ArrowRightLeft className="h-4 w-4" />
                                    Transfer
                                </Button>
                                <Button variant="secondary" onClick={() => setDialog('end')}>
                                    <UserMinus className="h-4 w-4" />
                                    End appointment
                                </Button>
                            </>
                        )}
                    </>
                }
            />

            <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
                <div className="space-y-6">
                    <section className="border border-slate-200/80 bg-white p-5">
                        <dl className="grid gap-4 text-sm sm:grid-cols-2">
                            <Detail label="Position">
                                <Link
                                    href={route('admin.organisation.units.show', appointment.unit.id)}
                                    className="text-jsyu-green hover:text-jsyu-green-hover"
                                >
                                    {appointment.position?.title} — {appointment.unit?.name}
                                </Link>
                            </Detail>
                            <Detail label="Contact">{[appointment.person.email, appointment.person.phone].filter(Boolean).join(' · ') || '—'}</Detail>
                            <Detail label="Started">{formatDate(appointment.starts_on)}</Detail>
                            <Detail label="Term ends">{formatDate(appointment.term_ends_on)}</Detail>
                            {!active && (
                                <>
                                    <Detail label="Ended">{formatDate(appointment.ended_on)}</Detail>
                                    <Detail label="Reason">{endReasons[appointment.end_reason] ?? appointment.end_reason}</Detail>
                                </>
                            )}
                            <Detail label="Appointed by">{appointment.appointed_by ?? '—'}</Detail>
                            {appointment.ended_by && <Detail label="Ended by">{appointment.ended_by}</Detail>}
                            {appointment.replaces && (
                                <Detail label="Succeeded">
                                    <Link
                                        href={route('admin.organisation.appointments.show', appointment.replaces.id)}
                                        className="text-jsyu-green hover:text-jsyu-green-hover"
                                    >
                                        {appointment.replaces.person}
                                    </Link>
                                </Detail>
                            )}
                        </dl>
                        {appointment.notes && (
                            <div className="mt-4 border-t border-slate-100 pt-4">
                                <p className="mb-1 text-xs font-medium tracking-wide text-slate-500 uppercase">Notes</p>
                                <p className="text-sm whitespace-pre-line text-slate-700">{appointment.notes}</p>
                            </div>
                        )}
                    </section>

                    {can.viewDocuments && (
                        <section className="border border-slate-200/80 bg-white">
                            <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3">
                                <h2 className="text-sm font-semibold text-slate-900">Documents</h2>
                                {can.update && (
                                    <Button size="sm" variant="secondary" onClick={() => setDialog('upload')}>
                                        <Upload className="h-3.5 w-3.5" />
                                        Upload
                                    </Button>
                                )}
                            </header>
                            {documents.length === 0 ? (
                                <p className="px-5 py-8 text-center text-sm text-slate-500">No documents attached.</p>
                            ) : (
                                <ul className="divide-y divide-slate-100">
                                    {documents.map((doc) => (
                                        <li key={doc.id} className="flex items-center gap-3 px-5 py-3">
                                            <FileText className="h-5 w-5 shrink-0 text-slate-400" />
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-slate-800">{doc.title || doc.original_name}</p>
                                                <p className="truncate text-xs text-slate-500">
                                                    {doc.original_name} · {Math.max(1, Math.round(doc.size / 1024))} KB ·{' '}
                                                    {doc.uploaded_by ?? 'Unknown'}
                                                </p>
                                            </div>
                                            {/* A real file download, so a plain anchor rather than an Inertia link */}
                                            <a
                                                href={route('admin.organisation.appointments.documents.download', [appointment.id, doc.id])}
                                                className="p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                                                aria-label={`Download ${doc.original_name}`}
                                            >
                                                <Download className="h-4 w-4" />
                                            </a>
                                            {can.update && (
                                                <button
                                                    type="button"
                                                    onClick={() => setRemovingDoc(doc)}
                                                    className="p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                                                    aria-label={`Delete ${doc.original_name}`}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    )}
                </div>

                <aside className="border border-slate-200/80 bg-white">
                    <h2 className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-900">Holders of this position</h2>
                    <ol className="divide-y divide-slate-100">
                        {history.map((h) => (
                            <li key={h.id} className={`px-4 py-3 ${h.id === appointment.id ? 'bg-jsyu-green-light/40' : ''}`}>
                                <Link
                                    href={route('admin.organisation.appointments.show', h.id)}
                                    className="hover:text-jsyu-green text-sm font-medium text-slate-800"
                                >
                                    {h.person?.full_name}
                                </Link>
                                <p className="text-xs text-slate-500">
                                    {formatDate(h.starts_on)} – {h.status === 'active' ? 'present' : formatDate(h.ended_on)}
                                </p>
                            </li>
                        ))}
                    </ol>
                </aside>
            </div>

            {dialog === 'end' && <EndDialog appointment={appointment} endReasons={endReasons} onClose={() => setDialog(null)} />}
            {dialog === 'transfer' && <TransferDialog appointment={appointment} onClose={() => setDialog(null)} />}
            {dialog === 'upload' && <UploadDialog appointment={appointment} onClose={() => setDialog(null)} />}

            <ConfirmDialog
                open={!!removingDoc}
                onClose={() => setRemovingDoc(null)}
                title="Delete document?"
                message={removingDoc && `${removingDoc.original_name} will be permanently deleted.`}
                confirmLabel="Delete"
                danger
                onConfirm={() =>
                    router.delete(route('admin.organisation.appointments.documents.destroy', [appointment.id, removingDoc.id]), {
                        preserveScroll: true,
                        onFinish: () => setRemovingDoc(null),
                    })
                }
            />
        </AdminLayout>
    );
}

function Detail({ label, children }) {
    return (
        <div>
            <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</dt>
            <dd className="mt-0.5 text-slate-800">{children}</dd>
        </div>
    );
}

function DialogFooter({ onClose, formId, processing, label, disabled }) {
    return (
        <>
            <Button variant="secondary" onClick={onClose}>
                Cancel
            </Button>
            <Button type="submit" form={formId} loading={processing} disabled={disabled}>
                {label}
            </Button>
        </>
    );
}

function EndDialog({ appointment, endReasons, onClose }) {
    const form = useForm({ ended_on: today(), end_reason: 'term_completed', notes: '' });

    return (
        <Modal
            open
            onClose={onClose}
            title="End appointment"
            description="The record stays in the leadership history. The seat becomes vacant."
            footer={<DialogFooter onClose={onClose} formId="end-form" processing={form.processing} label="End appointment" />}
        >
            <form
                id="end-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.post(route('admin.organisation.appointments.end', appointment.id), { preserveScroll: true, onSuccess: onClose });
                }}
                className="space-y-4"
            >
                <TextInput
                    id="ended_on"
                    type="date"
                    label="End date"
                    required
                    value={form.data.ended_on}
                    onChange={(e) => form.setData('ended_on', e.target.value)}
                    error={form.errors.ended_on}
                />
                <Select
                    id="end_reason"
                    label="Reason"
                    required
                    value={form.data.end_reason}
                    onChange={(e) => form.setData('end_reason', e.target.value)}
                    options={endReasons}
                    error={form.errors.end_reason}
                />
                <Textarea
                    id="notes"
                    label="Notes"
                    value={form.data.notes}
                    onChange={(e) => form.setData('notes', e.target.value)}
                    error={form.errors.notes}
                />
            </form>
        </Modal>
    );
}

function TransferDialog({ appointment, onClose }) {
    const [successor, setSuccessor] = useState(null);
    const form = useForm({ person_id: '', effective_on: today(), notes: '' });

    return (
        <Modal
            open
            wide
            onClose={onClose}
            title="Transfer responsibilities"
            description={`Ends ${appointment.person.full_name}'s appointment and appoints a successor to the same position, in one step.`}
            footer={
                <DialogFooter
                    onClose={onClose}
                    formId="transfer-form"
                    processing={form.processing}
                    label="Transfer"
                    disabled={!form.data.person_id}
                />
            }
        >
            <form
                id="transfer-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.post(route('admin.organisation.appointments.transfer', appointment.id), { onSuccess: onClose });
                }}
                className="space-y-4"
            >
                {form.errors.position_id && <p className="bg-red-50 px-3 py-2 text-sm text-red-700">{form.errors.position_id}</p>}
                <PersonPicker
                    label="Successor"
                    required
                    value={successor}
                    onChange={(p) => {
                        setSuccessor(p);
                        form.setData('person_id', p.id);
                    }}
                    error={form.errors.person_id}
                />
                <TextInput
                    id="effective_on"
                    type="date"
                    label="Effective date"
                    required
                    value={form.data.effective_on}
                    onChange={(e) => form.setData('effective_on', e.target.value)}
                    error={form.errors.effective_on ?? form.errors.ended_on}
                />
                <Textarea
                    id="notes"
                    label="Handover notes"
                    value={form.data.notes}
                    onChange={(e) => form.setData('notes', e.target.value)}
                    error={form.errors.notes}
                />
            </form>
        </Modal>
    );
}

function UploadDialog({ appointment, onClose }) {
    const form = useForm({ document: null, title: '' });

    return (
        <Modal
            open
            onClose={onClose}
            title="Upload document"
            description="Appointment letters and supporting documents. Stored privately; only authorised officers can download them."
            footer={
                <DialogFooter onClose={onClose} formId="upload-form" processing={form.processing} label="Upload" disabled={!form.data.document} />
            }
        >
            <form
                id="upload-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.post(route('admin.organisation.appointments.documents.store', appointment.id), {
                        forceFormData: true,
                        preserveScroll: true,
                        onSuccess: onClose,
                    });
                }}
                className="space-y-4"
            >
                <TextInput
                    id="title"
                    label="Title"
                    placeholder="e.g. Appointment letter"
                    value={form.data.title}
                    onChange={(e) => form.setData('title', e.target.value)}
                    error={form.errors.title}
                />
                <Field label="File" required hint="PDF, Word or image, up to 10 MB." error={form.errors.document} htmlFor="document">
                    <input
                        id="document"
                        type="file"
                        required
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => form.setData('document', e.target.files[0] ?? null)}
                        className="file:bg-jsyu-green-light file:text-jsyu-green-deep block w-full text-sm text-slate-600 file:mr-3 file:border-0 file:px-3 file:py-2 file:text-sm file:font-semibold"
                    />
                </Field>
            </form>
        </Modal>
    );
}
