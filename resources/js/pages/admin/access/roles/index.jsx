import { Head, useForm } from '@inertiajs/react';
import { Lock, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button, FlashAlert, PageHeader, StatusBadge } from '../../../../components/admin';
import AdminLayout from '../../../../layouts/AdminLayout';

export default function RolesIndex({ roles, permissions, canManage, grantable }) {
    const [selectedId, setSelectedId] = useState(roles[0]?.id);
    const role = roles.find((r) => r.id === selectedId);

    const groups = useMemo(
        () =>
            permissions.reduce((acc, p) => {
                (acc[p.group] ??= []).push(p);
                return acc;
            }, {}),
        [permissions],
    );

    return (
        <AdminLayout>
            <Head title="Roles & Permissions - Admin" />
            <FlashAlert />

            <PageHeader
                title="Roles & Permissions"
                icon={ShieldCheck}
            />

            <div className="grid gap-4 lg:grid-cols-[18rem_1fr]">
                <nav aria-label="Roles" className="border border-slate-200/80 bg-white p-2">
                    {roles.map((r) => (
                        <button
                            key={r.id}
                            type="button"
                            onClick={() => setSelectedId(r.id)}
                            className={`flex w-full items-center justify-between gap-2  px-3 py-2 text-left text-sm ${
                                r.id === selectedId ? 'bg-jsyu-green-light text-jsyu-green-deep font-semibold' : 'text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            <span className="truncate">{r.name}</span>
                            <span className="shrink-0 text-xs text-slate-400">{r.assignments_count}</span>
                        </button>
                    ))}
                </nav>

                {role && <RolePermissions key={role.id} role={role} groups={groups} canManage={canManage} grantable={grantable} />}
            </div>
        </AdminLayout>
    );
}

function RolePermissions({ role, groups, canManage, grantable }) {
    const form = useForm({ permission_ids: role.permission_ids });
    const editable = canManage && !role.locked;
    const selected = new Set(form.data.permission_ids);

    const toggle = (id) =>
        form.setData('permission_ids', selected.has(id) ? form.data.permission_ids.filter((x) => x !== id) : [...form.data.permission_ids, id]);

    return (
        <div className="border border-slate-200/80 bg-white">
            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 className="flex items-center gap-2 font-semibold text-slate-900">
                        {role.name}
                        {role.locked && (
                            <StatusBadge variant="gray">
                                <Lock className="h-3 w-3" />
                                Always has every permission
                            </StatusBadge>
                        )}
                    </h2>
                    {role.description && <p className="mt-0.5 text-sm text-slate-500">{role.description}</p>}
                    <p className="mt-1 text-xs text-slate-400">
                        {role.assignments_count} assignment{role.assignments_count === 1 ? '' : 's'}
                    </p>
                </div>
                {editable && (
                    <Button
                        onClick={() => form.put(route('admin.roles.update', role.id), { preserveScroll: true })}
                        loading={form.processing}
                        disabled={!form.isDirty}
                    >
                        Save permissions
                    </Button>
                )}
            </div>

            {form.errors.permission_ids && (
                <p className="mx-5 mt-4 bg-red-50 px-3 py-2 text-sm text-red-700">{form.errors.permission_ids}</p>
            )}

            <div className="divide-y divide-slate-100">
                {Object.entries(groups).map(([group, items]) => (
                    <fieldset key={group} className="px-5 py-4">
                        <legend className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">{group}</legend>
                        <div className="grid gap-2 sm:grid-cols-2">
                            {items.map((p) => {
                                const canToggle = editable && grantable.includes(p.id);

                                return (
                                    <label
                                        key={p.id}
                                        className={`flex items-start gap-2.5  border px-3 py-2 text-sm ${
                                            selected.has(p.id) ? 'border-jsyu-green-soft bg-jsyu-green-light/40' : 'border-slate-200'
                                        } ${canToggle ? 'cursor-pointer' : 'cursor-default opacity-80'}`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="text-jsyu-green focus:ring-jsyu-green/30 mt-0.5 h-4 w-4 border-slate-300"
                                            checked={selected.has(p.id)}
                                            disabled={!canToggle}
                                            onChange={() => toggle(p.id)}
                                        />
                                        <span className="min-w-0">
                                            <span className="block text-slate-800">{p.name}</span>
                                            <span className="block text-xs text-slate-400">
                                                {p.key}
                                                {p.is_scoped ? ' · can be limited to an area' : ' · state-wide only'}
                                            </span>
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </fieldset>
                ))}
            </div>
        </div>
    );
}
