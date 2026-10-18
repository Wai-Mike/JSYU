import { Head, useForm } from '@inertiajs/react';
import { ArrowDown, ArrowUp, Link2, Plus, Trash2, UsersRound, X } from 'lucide-react';
import { useState } from 'react';
import {
    Button,
    Checkbox,
    FlashAlert,
    Modal,
    PageHeader,
    PersonPicker,
    Select,
    Textarea,
    TextInput,
    usePermissions,
    useTreeOptions,
} from '../../../../components/admin';
import AdminLayout from '../../../../layouts/AdminLayout';

const emptyMember = () => ({ person_id: null, person: null, name: '', position_title: '' });

export default function TeamForm({ team, defaults, areas, canStatewide, positionTitles }) {
    const editing = !!team;
    const can = usePermissions();
    const areaOptions = useTreeOptions(areas);
    const [linking, setLinking] = useState(null); // index of the row being linked to a person record

    const form = useForm({
        name: team?.name ?? '',
        geographic_area_id: team?.geographic_area_id ?? '',
        starts_on: team?.starts_on ?? '',
        ends_on: team?.ends_on ?? '',
        is_current: team?.is_current ?? defaults.is_current,
        description: team?.description ?? '',
        members: team?.members?.length ? team.members : [emptyMember()],
    });

    const setMember = (index, changes) =>
        form.setData(
            'members',
            form.data.members.map((m, i) => (i === index ? { ...m, ...changes } : m)),
        );

    const moveMember = (index, offset) => {
        const members = [...form.data.members];
        [members[index], members[index + offset]] = [members[index + offset], members[index]];
        form.setData('members', members);
    };

    const submit = (e) => {
        e.preventDefault();
        // Only send what the server stores for each seat
        form.transform((data) => ({
            ...data,
            geographic_area_id: data.geographic_area_id || null,
            ends_on: data.ends_on || null,
            members: data.members.map(({ person_id, name, position_title }) => ({ person_id, name, position_title })),
        }));
        editing ? form.put(route('admin.organisation.teams.update', team.id)) : form.post(route('admin.organisation.teams.store'));
    };

    const title = editing ? `Edit ${team.name}` : form.data.is_current ? 'New management team' : 'Record a previous team';
    const breadcrumbs = [
        { label: 'Organisation' },
        { label: 'Management Teams', href: route('admin.organisation.teams.index') },
        { label: editing ? team.name : 'New team' },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`${title} - Admin`} />
            <FlashAlert />

            <PageHeader title={title} icon={UsersRound} />

            <form onSubmit={submit} className="space-y-6">
                <section className="border border-slate-200/80 bg-white">
                    <h2 className="border-b border-slate-100 px-5 py-3 text-sm font-semibold text-slate-900">Team details</h2>
                    <div className="grid gap-4 p-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <TextInput
                                id="name"
                                label="Team name"
                                required
                                placeholder="e.g. State Executive Committee 2023–2026"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                error={form.errors.name}
                            />
                        </div>
                        <Select
                            id="geographic_area_id"
                            label="Area"
                            placeholder={canStatewide ? 'State level' : 'Choose an area'}
                            required={!canStatewide}
                            value={form.data.geographic_area_id ?? ''}
                            onChange={(e) => form.setData('geographic_area_id', e.target.value)}
                            options={areaOptions}
                            error={form.errors.geographic_area_id}
                        />
                        <div className="flex items-end pb-2">
                            <Checkbox
                                id="is_current"
                                label="This is the current team"
                                hint="Marking it current moves the area's existing current team to previous teams."
                                checked={form.data.is_current}
                                onChange={(e) => form.setData('is_current', e.target.checked)}
                            />
                        </div>
                        <TextInput
                            id="starts_on"
                            type="date"
                            label="Term started"
                            required
                            value={form.data.starts_on}
                            onChange={(e) => form.setData('starts_on', e.target.value)}
                            error={form.errors.starts_on}
                        />
                        <TextInput
                            id="ends_on"
                            type="date"
                            label={form.data.is_current ? 'Term ends (if known)' : 'Term ended'}
                            required={!form.data.is_current}
                            value={form.data.ends_on ?? ''}
                            onChange={(e) => form.setData('ends_on', e.target.value)}
                            error={form.errors.ends_on}
                        />
                        <div className="sm:col-span-2">
                            <Textarea
                                id="description"
                                label="Notes"
                                hint="How the team was elected or appointed, key achievements, etc."
                                value={form.data.description}
                                onChange={(e) => form.setData('description', e.target.value)}
                                error={form.errors.description}
                            />
                        </div>
                    </div>
                </section>

                <section className="border border-slate-200/80 bg-white">
                    <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3">
                        <h2 className="text-sm font-semibold text-slate-900">Team members</h2>
                        <Button size="sm" variant="secondary" onClick={() => form.setData('members', [...form.data.members, emptyMember()])}>
                            <Plus className="h-3.5 w-3.5" />
                            Add member
                        </Button>
                    </header>

                    {form.errors.members && <p className="mx-5 mt-4 bg-red-50 px-3 py-2 text-sm text-red-700">{form.errors.members}</p>}

                    <datalist id="position-titles">
                        {positionTitles.map((t) => (
                            <option key={t} value={t} />
                        ))}
                    </datalist>

                    <ol className="divide-y divide-slate-100">
                        {form.data.members.map((member, index) => (
                            <li key={index} className="grid gap-3 px-5 py-4 sm:grid-cols-[2rem_1fr_1fr_auto] sm:items-start">
                                <span className="pt-2 text-sm font-medium text-slate-400">{index + 1}.</span>
                                <TextInput
                                    id={`members.${index}.position_title`}
                                    label="Position"
                                    required
                                    list="position-titles"
                                    placeholder="e.g. Chairperson"
                                    value={member.position_title}
                                    onChange={(e) => setMember(index, { position_title: e.target.value })}
                                    error={form.errors[`members.${index}.position_title`]}
                                />
                                <div>
                                    <TextInput
                                        id={`members.${index}.name`}
                                        label="Name"
                                        required
                                        value={member.name}
                                        onChange={(e) => setMember(index, { name: e.target.value })}
                                        error={form.errors[`members.${index}.name`] ?? form.errors[`members.${index}.person_id`]}
                                    />
                                    {member.person ? (
                                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                            <Link2 className="h-3 w-3" />
                                            Linked to {member.person.full_name}
                                            <button
                                                type="button"
                                                onClick={() => setMember(index, { person_id: null, person: null })}
                                                className="ml-1 text-slate-400 hover:text-red-600"
                                                aria-label="Unlink person record"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </p>
                                    ) : (
                                        can('people.view') && (
                                            <button
                                                type="button"
                                                onClick={() => setLinking(index)}
                                                className="text-jsyu-green hover:text-jsyu-green-hover mt-1 text-xs font-medium"
                                            >
                                                Choose from People
                                            </button>
                                        )
                                    )}
                                </div>
                                <div className="flex gap-1 sm:pt-6">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled={index === 0}
                                        onClick={() => moveMember(index, -1)}
                                        aria-label="Move up"
                                    >
                                        <ArrowUp className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled={index === form.data.members.length - 1}
                                        onClick={() => moveMember(index, 1)}
                                        aria-label="Move down"
                                    >
                                        <ArrowDown className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled={form.data.members.length === 1}
                                        onClick={() =>
                                            form.setData(
                                                'members',
                                                form.data.members.filter((_, i) => i !== index),
                                            )
                                        }
                                        aria-label="Remove member"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ol>
                </section>

                <div className="flex justify-end gap-2">
                    <Button variant="secondary" href={editing ? route('admin.organisation.teams.show', team.id) : route('admin.organisation.teams.index')}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={form.processing}>
                        {editing ? 'Save changes' : 'Save team'}
                    </Button>
                </div>
            </form>

            {linking !== null && (
                <LinkPersonDialog
                    onClose={() => setLinking(null)}
                    onSelect={(person) => {
                        setMember(linking, {
                            person_id: person.id,
                            person: { id: person.id, full_name: person.full_name },
                            name: form.data.members[linking].name || person.full_name,
                        });
                        setLinking(null);
                    }}
                />
            )}
        </AdminLayout>
    );
}

function LinkPersonDialog({ onClose, onSelect }) {
    return (
        <Modal open wide onClose={onClose} title="Choose from People" description="Links this seat to the person's record. The name shown on the team stays as entered.">
            <PersonPicker label="Person" value={null} onChange={onSelect} />
        </Modal>
    );
}
