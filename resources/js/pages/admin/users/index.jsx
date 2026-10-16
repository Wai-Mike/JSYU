import { Head, router, useForm } from '@inertiajs/react';
import { Plus, ShieldCheck, Users, X } from 'lucide-react';
import { useState } from 'react';
import {
    Button,
    ConfirmDialog,
    DataTable,
    FilterBar,
    FilterSelect,
    FlashAlert,
    formatDate,
    Modal,
    PageHeader,
    Pagination,
    Select,
    StatusBadge,
    TableCell,
    useQueryFilters,
    useTreeOptions,
} from '../../../components/admin';
import AdminLayout from '../../../layouts/AdminLayout';

export default function UsersIndex({ users, filters, canAssign, roles, areas }) {
    const [query, setQuery] = useQueryFilters({ search: filters.search ?? '', staff: filters.staff ?? '' });
    const [assigningTo, setAssigningTo] = useState(null);
    const [revoking, setRevoking] = useState(null);

    const columns = [
        { key: 'name', label: 'User' },
        { key: 'roles', label: 'Portal roles' },
        { key: 'joined', label: 'Joined' },
        ...(canAssign ? [{ key: 'actions', label: '', align: 'right' }] : []),
    ];

    return (
        <AdminLayout>
            <Head title="Users - Admin" />
            <FlashAlert />

            <PageHeader
                title="Users"
                icon={Users}
            />

            <FilterBar
                onSubmit={(e) => e.preventDefault()}
                searchValue={query.search}
                onSearchChange={(v) => setQuery('search', v)}
                searchPlaceholder="Name or email"
            >
                <FilterSelect label="Show" value={query.staff} onChange={(v) => setQuery('staff', v)}>
                    <option value="">All accounts</option>
                    <option value="1">Portal staff only</option>
                </FilterSelect>
            </FilterBar>

            <DataTable
                columns={columns}
                isEmpty={users.data.length === 0}
                empty="No users match your filters."
                footer={<Pagination paginator={users} />}
            >
                {users.data.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/80">
                        <TableCell>
                            <div className="flex items-center gap-2.5">
                                <div className="bg-jsyu-green-light text-jsyu-green-deep flex h-8 w-8 shrink-0 items-center justify-center text-xs font-semibold">
                                    {user.name?.charAt(0)?.toUpperCase() ?? '?'}
                                </div>
                                <div className="min-w-0">
                                    <div className="font-medium text-slate-900">{user.name}</div>
                                    <div className="truncate text-xs text-slate-500">{user.email}</div>
                                </div>
                                {!user.verified && <StatusBadge variant="amber">Unverified</StatusBadge>}
                            </div>
                        </TableCell>
                        <TableCell>
                            {user.assignments.length === 0 ? (
                                <span className="text-xs text-slate-400">Member — no portal access</span>
                            ) : (
                                <div className="flex flex-wrap gap-1.5">
                                    {user.assignments.map((a) => (
                                        <StatusBadge key={a.id} variant="soft">
                                            <ShieldCheck className="h-3 w-3" />
                                            {a.role.name}
                                            <span className="text-jsyu-green-deep/60">· {a.area?.name ?? 'State-wide'}</span>
                                            {canAssign && (
                                                <button
                                                    type="button"
                                                    onClick={() => setRevoking({ user, assignment: a })}
                                                    className="ml-0.5 p-0.5 hover:bg-white"
                                                    aria-label={`Remove ${a.role.name} from ${user.name}`}
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            )}
                                        </StatusBadge>
                                    ))}
                                </div>
                            )}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-slate-500">{formatDate(user.joined)}</TableCell>
                        {canAssign && (
                            <TableCell align="right">
                                <Button variant="secondary" size="sm" onClick={() => setAssigningTo(user)}>
                                    <Plus className="h-3.5 w-3.5" />
                                    Assign role
                                </Button>
                            </TableCell>
                        )}
                    </tr>
                ))}
            </DataTable>

            {assigningTo && <AssignRoleModal user={assigningTo} roles={roles} areas={areas} onClose={() => setAssigningTo(null)} />}

            <ConfirmDialog
                open={!!revoking}
                onClose={() => setRevoking(null)}
                title="Remove role?"
                message={
                    revoking &&
                    `${revoking.user.name} will lose the ${revoking.assignment.role.name} role (${revoking.assignment.area?.name ?? 'state-wide'}).`
                }
                confirmLabel="Remove role"
                danger
                onConfirm={() =>
                    router.delete(route('admin.users.roles.destroy', revoking.assignment.id), {
                        preserveScroll: true,
                        onFinish: () => setRevoking(null),
                    })
                }
            />
        </AdminLayout>
    );
}

function AssignRoleModal({ user, roles, areas, onClose }) {
    const form = useForm({ role_id: '', geographic_area_id: '' });
    const areaOptions = useTreeOptions(areas);
    const isSuperAdmin = roles.find((r) => String(r.id) === String(form.data.role_id))?.key === 'super_admin';

    const submit = (e) => {
        e.preventDefault();
        form.post(route('admin.users.roles.store', user.id), { preserveScroll: true, onSuccess: onClose });
    };

    return (
        <Modal
            open
            onClose={onClose}
            title={`Assign a role to ${user.name}`}
            description="Leave the area empty for a state-wide role. An area limits the role to that county or payam and everything inside it."
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" form="assign-role" loading={form.processing}>
                        Assign role
                    </Button>
                </>
            }
        >
            <form id="assign-role" onSubmit={submit} className="space-y-4">
                <Select
                    id="role_id"
                    label="Role"
                    required
                    placeholder="Choose a role"
                    value={form.data.role_id}
                    onChange={(e) => form.setData('role_id', e.target.value)}
                    options={roles.map((r) => ({ value: r.id, label: r.name }))}
                    error={form.errors.role_id}
                />
                <Select
                    id="geographic_area_id"
                    label="Area"
                    placeholder="State-wide"
                    value={form.data.geographic_area_id}
                    onChange={(e) => form.setData('geographic_area_id', e.target.value)}
                    options={areaOptions}
                    disabled={isSuperAdmin}
                    hint={isSuperAdmin ? 'Super Administrator is always state-wide.' : undefined}
                    error={form.errors.geographic_area_id}
                />
            </form>
        </Modal>
    );
}
