import { Head, Link, router } from '@inertiajs/react';
import { Building2, Pencil, Plus, Trash2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Button, ConfirmDialog, FlashAlert, formatDate, PageHeader, StatusBadge } from '../../../../components/admin';
import AppointForm from '../../../../components/admin/organisation/AppointForm';
import PositionForm from '../../../../components/admin/organisation/PositionForm';
import UnitForm from '../../../../components/admin/organisation/UnitForm';
import AdminLayout from '../../../../layouts/AdminLayout';

export default function UnitShow({ unit, children, positions, types, formOptions, can }) {
    const [editingUnit, setEditingUnit] = useState(false);
    const [addingChild, setAddingChild] = useState(false);
    const [positionForm, setPositionForm] = useState(null); // {} for new, {position} to edit
    const [appointing, setAppointing] = useState(null);
    const [confirm, setConfirm] = useState(null);

    const breadcrumbs = [
        { label: 'Organisation' },
        { label: 'Structure', href: route('admin.organisation.units.index') },
        ...(unit.parent ? [{ label: unit.parent.name, href: route('admin.organisation.units.show', unit.parent.id) }] : []),
        { label: unit.name },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`${unit.name} - Admin`} />
            <FlashAlert />

            <PageHeader
                title={unit.name}
                icon={Building2}
                actions={
                    <>
                        {!unit.is_active && <StatusBadge variant="gray">Inactive</StatusBadge>}
                        {can.update && (
                            <Button variant="secondary" onClick={() => setEditingUnit(true)}>
                                <Pencil className="h-4 w-4" />
                                Edit
                            </Button>
                        )}
                        {can.delete && children.length === 0 && positions.length === 0 && (
                            <Button
                                variant="secondary"
                                onClick={() =>
                                    setConfirm({
                                        title: 'Delete unit?',
                                        message: `${unit.name} will be removed permanently.`,
                                        action: () => router.delete(route('admin.organisation.units.destroy', unit.id)),
                                    })
                                }
                            >
                                <Trash2 className="h-4 w-4 text-red-600" />
                                Delete
                            </Button>
                        )}
                    </>
                }
            />

            {unit.description && <p className="mb-6 max-w-3xl text-sm whitespace-pre-line text-slate-600">{unit.description}</p>}

            <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
                <section className="border border-slate-200/80 bg-white">
                    <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3">
                        <h2 className="text-sm font-semibold text-slate-900">Positions & holders</h2>
                        {can.managePositions && (
                            <Button size="sm" onClick={() => setPositionForm({})}>
                                <Plus className="h-3.5 w-3.5" />
                                Add position
                            </Button>
                        )}
                    </header>

                    {positions.length === 0 ? (
                        <p className="px-5 py-10 text-center text-sm text-slate-500">No positions defined for this unit yet.</p>
                    ) : (
                        <ul className="divide-y divide-slate-100">
                            {positions.map((position) => (
                                <li key={position.id} className="px-5 py-4">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="flex flex-wrap items-center gap-2 font-medium text-slate-900">
                                                {position.title}
                                                {!position.is_active && <StatusBadge variant="gray">Inactive</StatusBadge>}
                                                {position.vacant_seats > 0 && position.is_active && (
                                                    <StatusBadge variant="amber" dot>
                                                        {position.vacant_seats} vacant
                                                    </StatusBadge>
                                                )}
                                            </p>
                                            <p className="mt-0.5 text-xs text-slate-500">
                                                {position.seats} seat{position.seats === 1 ? '' : 's'}
                                                {position.term_months ? ` · ${position.term_months}-month term` : ''}
                                            </p>
                                        </div>
                                        <div className="flex gap-1">
                                            {can.appoint && position.is_active && position.vacant_seats > 0 && (
                                                <Button variant="secondary" size="sm" onClick={() => setAppointing(position)}>
                                                    <UserPlus className="h-3.5 w-3.5" />
                                                    Appoint
                                                </Button>
                                            )}
                                            {can.managePositions && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setPositionForm({ position })}
                                                    aria-label={`Edit ${position.title}`}
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                            )}
                                            {can.managePositions && !position.has_history && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    aria-label={`Delete ${position.title}`}
                                                    onClick={() =>
                                                        setConfirm({
                                                            title: 'Delete position?',
                                                            message: `${position.title} has never been filled and will be removed.`,
                                                            action: () =>
                                                                router.delete(route('admin.organisation.positions.destroy', position.id), {
                                                                    preserveScroll: true,
                                                                }),
                                                        })
                                                    }
                                                >
                                                    <Trash2 className="h-3.5 w-3.5 text-red-600" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {position.holders.length > 0 && (
                                        <ul className="mt-3 space-y-2">
                                            {position.holders.map((holder) => (
                                                <li
                                                    key={holder.appointment_id}
                                                    className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 px-3 py-2 text-sm"
                                                >
                                                    <span className="font-medium text-slate-800">{holder.person?.full_name}</span>
                                                    <span className="text-xs text-slate-500">
                                                        Since {formatDate(holder.starts_on)}
                                                        {holder.term_ends_on && ` · term ends ${formatDate(holder.term_ends_on)}`}
                                                        {can.viewAppointments && (
                                                            <Link
                                                                href={route('admin.organisation.appointments.show', holder.appointment_id)}
                                                                className="text-jsyu-green hover:text-jsyu-green-hover ml-2 font-semibold"
                                                            >
                                                                Details
                                                            </Link>
                                                        )}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <aside className="space-y-4">
                    <section className="border border-slate-200/80 bg-white">
                        <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
                            <h2 className="text-sm font-semibold text-slate-900">Sub-units</h2>
                            {can.update && (
                                <Button variant="ghost" size="sm" onClick={() => setAddingChild(true)}>
                                    <Plus className="h-3.5 w-3.5" />
                                    Add
                                </Button>
                            )}
                        </header>
                        {children.length === 0 ? (
                            <p className="px-4 py-6 text-center text-sm text-slate-500">None</p>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {children.map((child) => (
                                    <li key={child.id} className="px-4 py-2.5">
                                        <Link
                                            href={route('admin.organisation.units.show', child.id)}
                                            className="hover:text-jsyu-green text-sm font-medium text-slate-800"
                                        >
                                            {child.name}
                                        </Link>
                                        <p className="text-xs text-slate-500">{types[child.type] ?? child.type}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </aside>
            </div>

            {editingUnit && <UnitForm unit={unit} types={types} formOptions={formOptions} onClose={() => setEditingUnit(false)} />}
            {addingChild && <UnitForm types={types} formOptions={formOptions} defaultParentId={unit.id} onClose={() => setAddingChild(false)} />}
            {positionForm && <PositionForm unit={unit} position={positionForm.position} onClose={() => setPositionForm(null)} />}
            {appointing && <AppointForm position={appointing} onClose={() => setAppointing(null)} />}

            <ConfirmDialog
                open={!!confirm}
                onClose={() => setConfirm(null)}
                title={confirm?.title}
                message={confirm?.message}
                confirmLabel="Delete"
                danger
                onConfirm={() => {
                    confirm.action();
                    setConfirm(null);
                }}
            />
        </AdminLayout>
    );
}
