import { Head, useForm } from '@inertiajs/react';
import { ClipboardList, Lock } from 'lucide-react';
import { Button, Checkbox, FlashAlert, PageHeader, Select, Textarea, TextInput, useTreeOptions } from '../../../../components/admin';
import AdminLayout from '../../../../layouts/AdminLayout';

export default function CensusRecordForm({ campaign, record, areas, options, canSeeSensitive }) {
    const editing = !!record;
    const areaOptions = useTreeOptions(areas);

    const form = useForm({
        geographic_area_id: record?.geographic_area_id ?? (areas.length === 1 ? areas[0].id : ''),
        full_name: record?.full_name ?? '',
        sex: record?.sex ?? '',
        date_of_birth: record?.date_of_birth ?? '',
        age_years: record?.age_years ?? '',
        phone: record?.phone ?? '',
        education_level: record?.education_level ?? '',
        in_school: record?.in_school ?? '',
        employment_status: record?.employment_status ?? '',
        occupation: record?.occupation ?? '',
        skills: record?.skills ?? '',
        disability: record?.disability ?? '',
        displacement_status: record?.displacement_status ?? '',
        confirm_not_duplicate: false,
        add_another: false,
    });

    const field = (name) => ({
        id: name,
        value: form.data[name] ?? '',
        onChange: (e) => form.setData(name, e.target.value),
        error: form.errors[name],
    });

    const submit = (addAnother) => (e) => {
        e?.preventDefault();
        // Empty strings become nulls so optional answers are stored as "not recorded"
        form.transform((data) => ({
            ...Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v === '' ? null : v])),
            in_school: data.in_school === '' ? null : data.in_school === true || data.in_school === '1',
            add_another: addAnother,
        }));
        const onSuccess = () => addAnother && form.reset();
        editing
            ? form.put(route('admin.census.records.update', record.id))
            : form.post(route('admin.census.records.store', campaign.id), { preserveScroll: true, onSuccess });
    };

    const title = editing ? `Correct ${record.full_name}` : 'Add census record';
    const breadcrumbs = [
        { label: 'Youth Management' },
        { label: 'Youth Census', href: route('admin.census.index') },
        { label: campaign.name, href: route('admin.census.show', campaign.id) },
        { label: editing ? 'Correct record' : 'Add record' },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`${title} - Census`} />
            <FlashAlert />

            <PageHeader title={title} icon={ClipboardList} />

            {record?.review_note && (
                <p className="mb-4 border-l-4 border-red-400 bg-red-50 px-4 py-3 text-sm text-red-800">
                    <span className="font-semibold">Returned by the reviewer:</span> {record.review_note}
                </p>
            )}
            {form.errors.campaign && <p className="mb-4 bg-red-50 px-4 py-3 text-sm text-red-700">{form.errors.campaign}</p>}

            <form onSubmit={submit(false)} className="space-y-6">
                <Section title="Identity">
                    <div className="sm:col-span-2">
                        <TextInput label="Full name" required {...field('full_name')} />
                    </div>
                    <Select label="Sex" required placeholder="Choose" options={options.sex} {...field('sex')} />
                    <Select label="Area" required placeholder="Choose county, payam or boma" options={areaOptions} {...field('geographic_area_id')} />
                    <TextInput
                        type="date"
                        label="Date of birth"
                        hint="Leave empty if unknown and give an approximate age."
                        {...field('date_of_birth')}
                    />
                    <TextInput
                        type="number"
                        min={options.min_age}
                        max={options.max_age}
                        label="Approximate age"
                        hint={`Only if the date of birth is unknown (${options.min_age}–${options.max_age}).`}
                        disabled={!!form.data.date_of_birth}
                        {...field('age_years')}
                    />
                    <TextInput type="tel" label="Phone" {...field('phone')} />
                </Section>

                <Section title="Education">
                    <Select label="Highest level completed" placeholder="Not recorded" options={options.education_levels} {...field('education_level')} />
                    <Select
                        label="Currently in school?"
                        placeholder="Not recorded"
                        options={{ 1: 'Yes', 0: 'No' }}
                        {...field('in_school')}
                        value={form.data.in_school === '' || form.data.in_school === null ? '' : String(Number(form.data.in_school === true || form.data.in_school === '1'))}
                    />
                </Section>

                <Section title="Employment & skills">
                    <Select label="Employment status" placeholder="Not recorded" options={options.employment_statuses} {...field('employment_status')} />
                    <TextInput label="Occupation" {...field('occupation')} />
                    <div className="sm:col-span-2">
                        <Textarea label="Skills" hint="e.g. tailoring, carpentry, computer skills" {...field('skills')} />
                    </div>
                </Section>

                <Section
                    title={
                        <span className="flex items-center gap-1.5">
                            <Lock className="h-3.5 w-3.5 text-slate-400" />
                            Sensitive
                        </span>
                    }
                    note={
                        editing && !canSeeSensitive
                            ? 'Previous answers are hidden from you. Leave blank to keep them, or choose a new answer to replace them.'
                            : 'Ask only with consent; "Prefers not to say" is always acceptable. Only authorised state officers can see these answers.'
                    }
                >
                    <Select label="Disability" placeholder="Not recorded" options={options.disability} {...field('disability')} />
                    <Select label="Displacement" placeholder="Not recorded" options={options.displacement_statuses} {...field('displacement_status')} />
                </Section>

                {form.errors.duplicate && (
                    <div className="border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        <p className="mb-2">{form.errors.duplicate}</p>
                        <Checkbox
                            id="confirm_not_duplicate"
                            label="I've checked: this is a different person"
                            checked={form.data.confirm_not_duplicate}
                            onChange={(e) => form.setData('confirm_not_duplicate', e.target.checked)}
                        />
                    </div>
                )}

                <div className="flex flex-wrap justify-end gap-2">
                    <Button variant="secondary" href={editing ? route('admin.census.records.show', record.id) : route('admin.census.show', campaign.id)}>
                        Cancel
                    </Button>
                    {!editing && (
                        <Button variant="secondary" onClick={submit(true)} loading={form.processing}>
                            Save & add another
                        </Button>
                    )}
                    <Button type="submit" loading={form.processing}>
                        {editing ? 'Save & resubmit' : 'Save record'}
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}

function Section({ title, note, children }) {
    return (
        <section className="border border-slate-200/80 bg-white">
            <h2 className="border-b border-slate-100 px-5 py-3 text-sm font-semibold text-slate-900">{title}</h2>
            {note && <p className="px-5 pt-4 text-xs text-slate-500">{note}</p>}
            <div className="grid gap-4 p-5 sm:grid-cols-2">{children}</div>
        </section>
    );
}
