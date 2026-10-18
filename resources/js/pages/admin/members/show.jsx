import { Head, Link, useForm } from '@inertiajs/react';
import { CheckCircle2, Circle, UserCheck, UserX } from 'lucide-react';
import { useState } from 'react';
import { Button, FlashAlert, formatDate, Modal, PageHeader, StatusBadge, Textarea } from '../../../components/admin';
import AdminLayout from '../../../layouts/AdminLayout';
import { statusVariants } from './index';

export default function MemberShow({ member, statuses, can }) {
    const [dialog, setDialog] = useState(null); // 'approve' | 'reject'

    const breadcrumbs = [{ label: 'Youth Management' }, { label: 'Members', href: route('admin.members.index') }, { label: member.name }];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`${member.name} - Member`} />
            <FlashAlert />

            <PageHeader
                title={member.name}
                icon={UserCheck}
                actions={
                    <>
                        <StatusBadge variant={statusVariants[member.status]} dot>
                            {statuses[member.status] ?? member.status}
                        </StatusBadge>
                        {can.review && member.status !== 'approved' && (
                            <Button onClick={() => setDialog('approve')} disabled={!member.complete} title={member.complete ? undefined : 'Profile incomplete'}>
                                <UserCheck className="h-4 w-4" />
                                Approve
                            </Button>
                        )}
                        {can.review && member.status !== 'rejected' && (
                            <Button variant="secondary" onClick={() => setDialog('reject')}>
                                <UserX className="h-4 w-4" />
                                {member.status === 'approved' ? 'Revoke' : 'Reject'}
                            </Button>
                        )}
                    </>
                }
            />

            {!member.complete && (
                <p className="mb-4 border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    This member hasn't finished their membership details yet. It can be approved once the profile is complete.
                </p>
            )}

            {member.review && (
                <div
                    className={`mb-4 border-l-4 px-4 py-3 text-sm ${
                        member.status === 'rejected' ? 'border-red-400 bg-red-50 text-red-800' : 'border-jsyu-green bg-jsyu-green-light text-jsyu-green-deep'
                    }`}
                >
                    <p className="font-medium">
                        {statuses[member.status]} by {member.review.by} on {formatDate(member.review.at)}
                    </p>
                    {member.review.note && <p className="mt-1 whitespace-pre-line">{member.review.note}</p>}
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
                <div className="space-y-6">
                    <Section title="Personal details">
                        <dl className="grid gap-4 text-sm sm:grid-cols-2">
                            <Detail label="First name">{member.first_name}</Detail>
                            <Detail label="Middle name">{member.middle_name}</Detail>
                            <Detail label="Last name">{member.last_name}</Detail>
                            <Detail label="Gender">{member.gender && member.gender[0].toUpperCase() + member.gender.slice(1)}</Detail>
                            <Detail label="Date of birth">
                                {member.date_of_birth ? `${formatDate(member.date_of_birth)}${member.age != null ? ` (${member.age} yrs)` : ''}` : null}
                            </Detail>
                        </dl>
                    </Section>

                    <Section title="Contact">
                        <dl className="grid gap-4 text-sm sm:grid-cols-2">
                            <Detail label="Email">{member.email}</Detail>
                            <Detail label="Phone">{member.phone}</Detail>
                            <Detail label="Alternative phone">{member.alternative_phone}</Detail>
                        </dl>
                    </Section>

                    <Section title="Origin & residence">
                        <dl className="grid gap-4 text-sm sm:grid-cols-2">
                            <Detail label="Home area">{member.home_area}</Detail>
                            <Detail label="Country of residence">{member.country}</Detail>
                            <Detail label="Current location">{member.current_location}</Detail>
                        </dl>
                    </Section>

                    {member.bio && (
                        <Section title="About">
                            <p className="text-sm whitespace-pre-line text-slate-700">{member.bio}</p>
                        </Section>
                    )}
                </div>

                <aside className="space-y-6">
                    <section className="border border-slate-200/80 bg-white p-5 text-center">
                        {member.photo_url ? (
                            <img src={member.photo_url} alt={member.name} className="mx-auto h-32 w-32 object-cover" />
                        ) : (
                            <div className="bg-jsyu-green-light text-jsyu-green-deep mx-auto flex h-32 w-32 items-center justify-center text-3xl font-bold">
                                {initials(member.name)}
                            </div>
                        )}
                        <p className="mt-3 font-semibold text-slate-900">{member.name}</p>
                        <p className="text-xs text-slate-500">Profile shared with: {member.visibility}</p>
                    </section>

                    <Section title="Profile completeness">
                        <ul className="space-y-2.5">
                            {member.sections.map((section) => (
                                <li key={section.key} className="flex items-center gap-2.5 text-sm">
                                    {section.complete ? (
                                        <CheckCircle2 className="text-jsyu-green h-4 w-4 shrink-0" />
                                    ) : (
                                        <Circle className="h-4 w-4 shrink-0 text-slate-300" />
                                    )}
                                    <span className={section.complete ? 'text-slate-900' : 'text-slate-500'}>{section.label}</span>
                                </li>
                            ))}
                        </ul>
                    </Section>

                    <Section title="Account">
                        {member.account ? (
                            <dl className="space-y-3 text-sm">
                                <Detail label="Joined">{formatDate(member.account.joined)}</Detail>
                                <Detail label="Email verified">{member.account.verified ? 'Yes' : 'No'}</Detail>
                                <Detail label="Signs in with">{member.account.sign_in}</Detail>
                                <Detail label="Profile updated">{formatDate(member.updated_at)}</Detail>
                            </dl>
                        ) : (
                            <p className="text-sm text-slate-500">No login account is linked.</p>
                        )}
                    </Section>

                    {member.positions.length > 0 && (
                        <Section title="Current positions">
                            <ul className="space-y-2 text-sm">
                                {member.positions.map((p) => (
                                    <li key={p.id}>
                                        {can.viewAppointments ? (
                                            <Link
                                                href={route('admin.organisation.appointments.show', p.id)}
                                                className="text-jsyu-green hover:text-jsyu-green-hover font-medium"
                                            >
                                                {p.title}
                                            </Link>
                                        ) : (
                                            <span className="font-medium text-slate-800">{p.title}</span>
                                        )}
                                        <span className="block text-xs text-slate-500">{p.unit}</span>
                                    </li>
                                ))}
                            </ul>
                        </Section>
                    )}
                </aside>
            </div>

            {dialog && <ReviewDialog member={member} action={dialog} onClose={() => setDialog(null)} />}
        </AdminLayout>
    );
}

function Section({ title, children }) {
    return (
        <section className="border border-slate-200/80 bg-white">
            <h2 className="border-b border-slate-100 px-5 py-3 text-sm font-semibold text-slate-900">{title}</h2>
            <div className="p-5">{children}</div>
        </section>
    );
}

function Detail({ label, children }) {
    return (
        <div>
            <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</dt>
            <dd className="mt-0.5 text-slate-800">{children || '—'}</dd>
        </div>
    );
}

function initials(name) {
    const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

function ReviewDialog({ member, action, onClose }) {
    const approving = action === 'approve';
    const form = useForm({ note: '' });

    return (
        <Modal
            open
            onClose={onClose}
            title={approving ? 'Approve membership' : member.status === 'approved' ? 'Revoke membership' : 'Reject membership'}
            description={
                approving
                    ? `${member.name} will become an approved member of the Union.`
                    : 'The member sees this reason on their dashboard. Updating their details sends the application back for review.'
            }
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" form="review-form" variant={approving ? 'primary' : 'danger'} loading={form.processing}>
                        {approving ? 'Approve' : member.status === 'approved' ? 'Revoke' : 'Reject'}
                    </Button>
                </>
            }
        >
            <form
                id="review-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.post(route(approving ? 'admin.members.approve' : 'admin.members.reject', member.id), {
                        preserveScroll: true,
                        onSuccess: onClose,
                    });
                }}
            >
                <Textarea
                    id="note"
                    label={approving ? 'Note (optional)' : 'Reason'}
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
