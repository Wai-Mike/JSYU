import { Head, Link, useForm } from '@inertiajs/react';
import { ClipboardList, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';
import {
    Button,
    DataTable,
    FlashAlert,
    formatDate,
    Modal,
    PageHeader,
    Select,
    StatusBadge,
    TableCell,
    Textarea,
    TextInput,
    useTreeOptions,
} from '../../../components/admin';
import AdminLayout from '../../../layouts/AdminLayout';

export const campaignVariants = { draft: 'gray', open: 'green', closed: 'soft' };

export default function CensusIndex({ campaigns, statuses, areas, canCreate, canCreateStatewide }) {
    const [editing, setEditing] = useState(null); // {} for new, {campaign} to edit

    const columns = [
        { key: 'name', label: 'Campaign' },
        { key: 'area', label: 'Area' },
        { key: 'period', label: 'Period' },
        { key: 'records', label: 'Records', align: 'right' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: '', align: 'right' },
    ];

    return (
        <AdminLayout>
            <Head title="Youth Census - Admin" />
            <FlashAlert />

            <PageHeader
                title="Youth Census"
                icon={ClipboardList}
                actions={
                    canCreate && (
                        <Button onClick={() => setEditing({})}>
                            <Plus className="h-4 w-4" />
                            New campaign
                        </Button>
                    )
                }
            />

            <DataTable columns={columns} isEmpty={campaigns.length === 0} empty="No census campaigns yet.">
                {campaigns.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80">
                        <TableCell>
                            <Link href={route('admin.census.show', c.id)} className="hover:text-jsyu-green font-medium text-slate-900">
                                {c.name}
                            </Link>
                        </TableCell>
                        <TableCell className="text-slate-500">{c.area ?? 'State-wide'}</TableCell>
                        <TableCell className="text-slate-500">
                            {formatDate(c.starts_on)} – {c.ends_on ? formatDate(c.ends_on) : 'ongoing'}
                        </TableCell>
                        <TableCell align="right">
                            {c.counts ? (
                                <>
                                    <span className="font-medium text-slate-900">{c.counts.total}</span>
                                    {c.counts.submitted > 0 && <span className="block text-xs text-amber-700">{c.counts.submitted} to review</span>}
                                </>
                            ) : (
                                <span className="text-slate-400">—</span>
                            )}
                        </TableCell>
                        <TableCell>
                            <StatusBadge variant={campaignVariants[c.status]} dot>
                                {statuses[c.status]}
                            </StatusBadge>
                        </TableCell>
                        <TableCell align="right">
                            {c.can.update && (
                                <Button variant="ghost" size="sm" onClick={() => setEditing({ campaign: c })} aria-label={`Edit ${c.name}`}>
                                    <Pencil className="h-3.5 w-3.5" />
                                </Button>
                            )}
                        </TableCell>
                    </tr>
                ))}
            </DataTable>

            {editing && <CampaignForm campaign={editing.campaign} areas={areas} canStatewide={canCreateStatewide} onClose={() => setEditing(null)} />}
        </AdminLayout>
    );
}

export function CampaignForm({ campaign, areas, canStatewide, onClose }) {
    const creating = !campaign;
    const areaOptions = useTreeOptions(areas);
    const form = useForm({
        name: campaign?.name ?? '',
        description: campaign?.description ?? '',
        geographic_area_id: campaign?.geographic_area_id ?? '',
        starts_on: campaign?.starts_on ?? '',
        ends_on: campaign?.ends_on ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        form.transform((data) => ({ ...data, geographic_area_id: data.geographic_area_id || null, ends_on: data.ends_on || null }));
        const options = { preserveScroll: true, onSuccess: onClose };
        creating ? form.post(route('admin.census.store'), options) : form.put(route('admin.census.update', campaign.id), options);
    };

    return (
        <Modal
            open
            wide
            onClose={onClose}
            title={creating ? 'New census campaign' : `Edit ${campaign.name}`}
            description="Enumerators can enter records once the campaign is opened."
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" form="campaign-form" loading={form.processing}>
                        Save
                    </Button>
                </>
            }
        >
            <form id="campaign-form" onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <TextInput
                        id="name"
                        label="Name"
                        required
                        placeholder="e.g. Jonglei Youth Census 2026"
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        error={form.errors.name}
                    />
                </div>
                <div className="sm:col-span-2">
                    <Select
                        id="geographic_area_id"
                        label="Area"
                        placeholder={canStatewide ? 'State-wide' : 'Choose an area'}
                        required={!canStatewide}
                        value={form.data.geographic_area_id ?? ''}
                        onChange={(e) => form.setData('geographic_area_id', e.target.value)}
                        options={areaOptions}
                        error={form.errors.geographic_area_id}
                    />
                </div>
                <TextInput
                    id="starts_on"
                    type="date"
                    label="Starts"
                    required
                    value={form.data.starts_on}
                    onChange={(e) => form.setData('starts_on', e.target.value)}
                    error={form.errors.starts_on}
                />
                <TextInput
                    id="ends_on"
                    type="date"
                    label="Ends"
                    value={form.data.ends_on ?? ''}
                    onChange={(e) => form.setData('ends_on', e.target.value)}
                    error={form.errors.ends_on}
                />
                <div className="sm:col-span-2">
                    <Textarea
                        id="description"
                        label="Description"
                        hint="Purpose, and the legal basis and retention period approved for this data."
                        value={form.data.description ?? ''}
                        onChange={(e) => form.setData('description', e.target.value)}
                        error={form.errors.description}
                    />
                </div>
            </form>
        </Modal>
    );
}
