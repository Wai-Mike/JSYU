import { Head, useForm } from '@inertiajs/react';
import { Link2, Plus, Trash2, Vote, X } from 'lucide-react';
import { useState } from 'react';
import {
    Button,
    FlashAlert,
    Modal,
    PageHeader,
    PersonPicker,
    Select,
    Textarea,
    TextInput,
    usePermissions,
    useTreeOptions,
} from '../../../components/admin';
import AdminLayout from '../../../layouts/AdminLayout';

const emptyCandidate = () => ({ name: '', statement: '', person_id: null, person: null });
const emptyPosition = () => ({ title: '', seats: 1, candidates: [emptyCandidate(), emptyCandidate()] });

export default function ElectionForm({ election, areas, canStatewide }) {
    const editing = !!election;
    const can = usePermissions();
    const areaOptions = useTreeOptions(areas);
    const [linking, setLinking] = useState(null); // [positionIndex, candidateIndex]

    const form = useForm({
        title: election?.title ?? '',
        description: election?.description ?? '',
        geographic_area_id: election?.geographic_area_id ?? '',
        opens_at: election?.opens_at ?? '',
        closes_at: election?.closes_at ?? '',
        positions: election?.positions?.length ? election.positions : [emptyPosition()],
    });

    const positions = form.data.positions;
    const setPositions = (next) => form.setData('positions', next);
    const setPosition = (i, changes) => setPositions(positions.map((p, j) => (j === i ? { ...p, ...changes } : p)));
    const setCandidate = (i, k, changes) =>
        setPosition(i, { candidates: positions[i].candidates.map((c, j) => (j === k ? { ...c, ...changes } : c)) });

    const submit = (e) => {
        e.preventDefault();
        form.transform((data) => ({
            ...data,
            geographic_area_id: data.geographic_area_id || null,
            positions: data.positions.map((p) => ({
                title: p.title,
                seats: Number(p.seats) || 1,
                candidates: p.candidates.map(({ name, statement, person_id }) => ({ name, statement: statement || null, person_id })),
            })),
        }));
        editing ? form.put(route('admin.elections.update', election.id)) : form.post(route('admin.elections.store'));
    };

    const breadcrumbs = [
        { label: 'Youth Management' },
        { label: 'Elections', href: route('admin.elections.index') },
        { label: editing ? election.title : 'New election' },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`${editing ? 'Edit election' : 'New election'} - Admin`} />
            <FlashAlert />

            <PageHeader title={editing ? `Edit ${election.title}` : 'New election'} icon={Vote} />

            {form.errors.status && <p className="mb-4 bg-red-50 px-4 py-3 text-sm text-red-700">{form.errors.status}</p>}

            <form onSubmit={submit} className="space-y-6">
                <section className="border border-slate-200/80 bg-white">
                    <h2 className="border-b border-slate-100 px-5 py-3 text-sm font-semibold text-slate-900">Election details</h2>
                    <div className="grid gap-4 p-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <TextInput
                                id="title"
                                label="Title"
                                required
                                placeholder="e.g. Bor County Youth Executive Election 2026"
                                value={form.data.title}
                                onChange={(e) => form.setData('title', e.target.value)}
                                error={form.errors.title}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <Select
                                id="geographic_area_id"
                                label="Who votes"
                                hint="Approved members whose home area is inside the chosen area."
                                placeholder={canStatewide ? 'All approved members (state-wide)' : 'Choose an area'}
                                required={!canStatewide}
                                value={form.data.geographic_area_id ?? ''}
                                onChange={(e) => form.setData('geographic_area_id', e.target.value)}
                                options={areaOptions}
                                error={form.errors.geographic_area_id}
                            />
                        </div>
                        <TextInput
                            id="opens_at"
                            type="datetime-local"
                            label="Voting opens"
                            required
                            value={form.data.opens_at}
                            onChange={(e) => form.setData('opens_at', e.target.value)}
                            error={form.errors.opens_at}
                        />
                        <TextInput
                            id="closes_at"
                            type="datetime-local"
                            label="Voting closes"
                            required
                            value={form.data.closes_at}
                            onChange={(e) => form.setData('closes_at', e.target.value)}
                            error={form.errors.closes_at}
                        />
                        <div className="sm:col-span-2">
                            <Textarea
                                id="description"
                                label="Information for voters"
                                value={form.data.description ?? ''}
                                onChange={(e) => form.setData('description', e.target.value)}
                                error={form.errors.description}
                            />
                        </div>
                    </div>
                </section>

                {form.errors.positions && <p className="bg-red-50 px-4 py-3 text-sm text-red-700">{form.errors.positions}</p>}

                {positions.map((position, i) => (
                    <section key={i} className="border border-slate-200/80 bg-white">
                        <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3">
                            <h2 className="text-sm font-semibold text-slate-900">Position {i + 1}</h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                disabled={positions.length === 1}
                                onClick={() => setPositions(positions.filter((_, j) => j !== i))}
                                aria-label="Remove position"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </header>
                        <div className="grid gap-4 p-5 sm:grid-cols-[1fr_10rem]">
                            <TextInput
                                id={`positions.${i}.title`}
                                label="Position"
                                required
                                placeholder="e.g. Chairperson"
                                value={position.title}
                                onChange={(e) => setPosition(i, { title: e.target.value })}
                                error={form.errors[`positions.${i}.title`]}
                            />
                            <TextInput
                                id={`positions.${i}.seats`}
                                type="number"
                                min={1}
                                label="Seats"
                                hint="Choices per voter"
                                required
                                value={position.seats}
                                onChange={(e) => setPosition(i, { seats: e.target.value })}
                                error={form.errors[`positions.${i}.seats`]}
                            />
                        </div>

                        <div className="border-t border-slate-100 px-5 py-4">
                            <p className="mb-3 text-xs font-medium tracking-wide text-slate-500 uppercase">Candidates</p>
                            {form.errors[`positions.${i}.candidates`] && (
                                <p className="mb-3 text-xs text-red-600">{form.errors[`positions.${i}.candidates`]}</p>
                            )}
                            <ol className="space-y-3">
                                {position.candidates.map((candidate, k) => (
                                    <li key={k} className="grid gap-3 border border-slate-100 p-3 sm:grid-cols-[1fr_1.5fr_auto]">
                                        <div>
                                            <TextInput
                                                id={`positions.${i}.candidates.${k}.name`}
                                                label="Name"
                                                required
                                                value={candidate.name}
                                                onChange={(e) => setCandidate(i, k, { name: e.target.value })}
                                                error={form.errors[`positions.${i}.candidates.${k}.name`]}
                                            />
                                            {candidate.person ? (
                                                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                                    <Link2 className="h-3 w-3" />
                                                    Linked to {candidate.person.full_name}
                                                    <button
                                                        type="button"
                                                        onClick={() => setCandidate(i, k, { person_id: null, person: null })}
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
                                                        onClick={() => setLinking([i, k])}
                                                        className="text-jsyu-green hover:text-jsyu-green-hover mt-1 text-xs font-medium"
                                                    >
                                                        Choose from People
                                                    </button>
                                                )
                                            )}
                                        </div>
                                        <Textarea
                                            id={`positions.${i}.candidates.${k}.statement`}
                                            label="Statement (optional)"
                                            rows={2}
                                            value={candidate.statement ?? ''}
                                            onChange={(e) => setCandidate(i, k, { statement: e.target.value })}
                                            error={form.errors[`positions.${i}.candidates.${k}.statement`]}
                                        />
                                        <div className="sm:pt-6">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                disabled={position.candidates.length === 1}
                                                onClick={() => setPosition(i, { candidates: position.candidates.filter((_, j) => j !== k) })}
                                                aria-label="Remove candidate"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                            <Button
                                size="sm"
                                variant="secondary"
                                className="mt-3"
                                onClick={() => setPosition(i, { candidates: [...position.candidates, emptyCandidate()] })}
                            >
                                <Plus className="h-3.5 w-3.5" />
                                Add candidate
                            </Button>
                        </div>
                    </section>
                ))}

                <Button variant="secondary" onClick={() => setPositions([...positions, emptyPosition()])}>
                    <Plus className="h-4 w-4" />
                    Add position
                </Button>

                <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
                    <Button variant="secondary" href={editing ? route('admin.elections.show', election.id) : route('admin.elections.index')}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={form.processing}>
                        Save draft
                    </Button>
                </div>
            </form>

            {linking && (
                <Modal open wide onClose={() => setLinking(null)} title="Choose from People" description="Links the candidate to their person record.">
                    <PersonPicker
                        label="Person"
                        value={null}
                        onChange={(person) => {
                            const [i, k] = linking;
                            setCandidate(i, k, {
                                person_id: person.id,
                                person: { id: person.id, full_name: person.full_name },
                                name: positions[i].candidates[k].name || person.full_name,
                            });
                            setLinking(null);
                        }}
                    />
                </Modal>
            )}
        </AdminLayout>
    );
}
