import { Head, useForm } from '@inertiajs/react';
import { Check, ClipboardList, Lock, Pencil, X } from 'lucide-react';
import { useState } from 'react';
import { Button, FlashAlert, formatDate, Modal, PageHeader, StatusBadge, Textarea } from '../../../../components/admin';
import AdminLayout from '../../../../layouts/AdminLayout';
import { recordVariants } from '../show';

export default function CensusRecordShow({ record, campaign, statuses, can }) {
    const [dialog, setDialog] = useState(null); // 'approve' | 'reject'

    const breadcrumbs = [
        { label: 'Youth Management' },
        { label: 'Youth Census', href: route('admin.census.index') },
        { label: campaign.name, href: route('admin.census.show', campaign.id) },
        { label: record.full_name },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`${record.full_name} - Census record`} />
            <FlashAlert />

            <PageHeader
                title={record.full_name}
                icon={ClipboardList}
                actions={
                    <>
                        <StatusBadge variant={recordVariants[record.status]} dot>
                            {statuses[record.status]}
                        </StatusBadge>
                        {can.update && (
                            <Button variant="secondary" href={route('admin.census.records.edit', record.id)}>
                                <Pencil className="h-4 w-4" />
                                Correct
                            </Button>
                        )}
                        {can.review && record.status !== 'approved' && (
                            <Button onClick={() => setDialog('approve')}>
                                <Check className="h-4 w-4" />
                                Approve
                            </Button>
                        )}
                        {can.review && record.status !== 'rejected' && (
                            <Button variant="secondary" onClick={() => setDialog('reject')}>
                                <X className="h-4 w-4" />
                                Return for correction
                            </Button>
                        )}
                    </>
                }
            />

            {record.review && (
                <div
                    className={`mb-4 border-l-4 px-4 py-3 text-sm ${
                        record.status === 'rejected' ? 'border-red-400 bg-red-50 text-red-800' : 'border-jsyu-green bg-jsyu-green-light text-jsyu-green-deep'
                    }`}
                >
                    <p className="font-medium">
                        {statuses[record.status]} · {record.review.by} · {formatDate(record.review.at)}
                    </p>
                    {record.review.note && <p className="mt-1 whitespace-pre-line">{record.review.note}</p>}
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                <Section title="Identity">
                    <Detail label="Sex">{record.sex}</Detail>
                    <Detail label="Age">
                        {record.age}
                        {record.date_of_birth ? ` (born ${formatDate(record.date_of_birth)})` : record.age != null ? ' (approximate)' : ''}
                    </Detail>
                    <Detail label="Phone">{record.phone}</Detail>
                    <Detail label="Area">{record.area}</Detail>
                </Section>

                <Section title="Education">
                    <Detail label="Highest level">{record.education_level}</Detail>
                    <Detail label="In school">{record.in_school == null ? null : record.in_school ? 'Yes' : 'No'}</Detail>
                </Section>

                <Section title="Employment & skills">
                    <Detail label="Status">{record.employment_status}</Detail>
                    <Detail label="Occupation">{record.occupation}</Detail>
                    <div className="sm:col-span-2">
                        <Detail label="Skills">{record.skills}</Detail>
                    </div>
                </Section>

                <Section
                    title={
                        <span className="flex items-center gap-1.5">
                            <Lock className="h-3.5 w-3.5 text-slate-400" />
                            Sensitive
                        </span>
                    }
                >
                    {record.sensitive ? (
                        <>
                            <Detail label="Disability">{record.sensitive.disability}</Detail>
                            <Detail label="Displacement">{record.sensitive.displacement_status}</Detail>
                        </>
                    ) : (
                        <p className="text-sm text-slate-500 sm:col-span-2">Only authorised state officers can see these answers.</p>
                    )}
                </Section>
            </div>

            <p className="mt-4 text-xs text-slate-500">
                Entered by {record.enumerator ?? 'a former enumerator'} on {formatDate(record.created_at)}
            </p>

            {dialog && <ReviewDialog record={record} approving={dialog === 'approve'} onClose={() => setDialog(null)} />}
        </AdminLayout>
    );
}

function Section({ title, children }) {
    return (
        <section className="border border-slate-200/80 bg-white">
            <h2 className="border-b border-slate-100 px-5 py-3 text-sm font-semibold text-slate-900">{title}</h2>
            <dl className="grid gap-4 p-5 text-sm sm:grid-cols-2">{children}</dl>
        </section>
    );
}

function Detail({ label, children }) {
    return (
        <div>
            <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</dt>
            <dd className="mt-0.5 whitespace-pre-line text-slate-800">{children ?? '—'}</dd>
        </div>
    );
}

function ReviewDialog({ record, approving, onClose }) {
    const form = useForm({ note: '' });

    return (
        <Modal
            open
            onClose={onClose}
            title={approving ? 'Approve record' : 'Return for correction'}
            description={approving ? 'Approved records count in the campaign reports.' : 'The enumerator sees your note and can correct the record.'}
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" form="review-form" variant={approving ? 'primary' : 'danger'} loading={form.processing}>
                        {approving ? 'Approve' : 'Return'}
                    </Button>
                </>
            }
        >
            <form
                id="review-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.post(route(approving ? 'admin.census.records.approve' : 'admin.census.records.reject', record.id), {
                        preserveScroll: true,
                        onSuccess: onClose,
                    });
                }}
            >
                <Textarea
                    id="note"
                    label={approving ? 'Note (optional)' : 'What needs correcting'}
                    required={!approving}
                    rows={4}
                    value={form.data.note}
                    onChange={(e) => form.setData('note', e.target.value)}
                    error={form.errors.note}
                />
            </form>
        </Modal>
    );
}
