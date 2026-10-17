import { Head, useForm, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calendar, Camera, CheckCircle2, Globe, Mail, MapPin, Phone, Shield, User, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import AuthShell from '../../components/auth/AuthShell';
import { Field, FieldError, Label, SubmitButton, inputClass, plainInputClass } from '../../components/auth/FormFields';
import JourneySteps from '../../components/auth/JourneySteps';
import { countryName, countryOptions } from '../../constants/countries';

/** These steps continue the sign-up journey after Account (0) and Verify email (1). */
const JOURNEY_OFFSET = 2;

const steps = [
    { title: 'Tell us who you are', fields: ['first_name', 'middle_name', 'last_name', 'gender', 'date_of_birth', 'photo'] },
    {
        title: 'How to reach you and where you are from',
        fields: ['phone', 'alternative_phone', 'home_area_id', 'current_country_code', 'current_location'],
    },
    { title: 'Introduce yourself and choose who sees your profile', fields: ['bio', 'visibility'] },
];

const genders = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
];

// Brackets escaped so the pattern is also valid under the browser's `v` regex flag
const PHONE_PATTERN = String.raw`\+?[0-9\s\(\)\-]{7,40}`;
const MAX_PHOTO_MB = 5;
const BIO_LIMIT = 1000;

/** Rebuild the county › payam › boma picks from the saved (most specific) area. */
function areaChain(areas, id) {
    const chain = { county: '', payam: '', boma: '' };
    let area = areas.find((a) => String(a.id) === String(id));
    while (area) {
        if (area.level in chain) chain[area.level] = String(area.id);
        area = areas.find((a) => a.id === area.parent_id);
    }
    return chain;
}

export default function Membership({ member, areas = [], visibilities = {}, hasPhoto = false }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        first_name: member.first_name,
        middle_name: member.middle_name,
        last_name: member.last_name,
        gender: member.gender,
        date_of_birth: member.date_of_birth,
        photo: null,
        phone: member.phone,
        alternative_phone: member.alternative_phone,
        home_area_id: member.home_area_id,
        current_country_code: member.current_country_code,
        current_location: member.current_location,
        bio: member.bio,
        visibility: member.visibility,
    });

    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(1);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoError, setPhotoError] = useState('');
    const [area, setArea] = useState(() => areaChain(areas, member.home_area_id));
    const formRef = useRef(null);
    const panelRef = useRef(null);

    const { priority, rest } = useMemo(() => countryOptions(), []);
    const countyOptions = areas.filter((a) => a.level === 'county');
    const payamOptions = areas.filter((a) => a.level === 'payam' && String(a.parent_id) === area.county);
    const bomaOptions = areas.filter((a) => a.level === 'boma' && String(a.parent_id) === area.payam);
    const areaName = (id) => areas.find((a) => String(a.id) === String(id))?.name;

    const today = new Date().toISOString().slice(0, 10);
    const isLastStep = step === steps.length - 1;

    // After a failed submit, jump back to the first step that has an error
    useEffect(() => {
        const keys = Object.keys(errors);
        if (!keys.length) return;
        const target = steps.findIndex((s) => s.fields.some((f) => keys.includes(f)));
        if (target !== -1 && target !== step) {
            setDirection(target > step ? 1 : -1);
            setStep(target);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errors]);

    useEffect(() => () => photoPreview && URL.revokeObjectURL(photoPreview), [photoPreview]);

    const goTo = (target) => {
        setDirection(target > step ? 1 : -1);
        setStep(target);
        panelRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const chooseArea = (level, value) => {
        const next =
            level === 'county'
                ? { county: value, payam: '', boma: '' }
                : level === 'payam'
                  ? { ...area, payam: value, boma: '' }
                  : { ...area, boma: value };
        setArea(next);
        setData('home_area_id', next.boma || next.payam || next.county);
    };

    const choosePhoto = (file) => {
        setPhotoError('');
        clearErrors('photo');
        if (!file) return;
        if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
            setPhotoError('Please choose a JPG, PNG or WebP image.');
            return;
        }
        if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
            setPhotoError(`The photo must be smaller than ${MAX_PHOTO_MB} MB.`);
            return;
        }
        setData('photo', file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    const removePhoto = () => {
        setData('photo', null);
        setPhotoPreview(null);
    };

    const submit = (e) => {
        e.preventDefault();
        // Native validation only covers the fields of the step on screen
        if (formRef.current && !formRef.current.reportValidity()) return;
        if (!isLastStep) {
            goTo(step + 1);
            return;
        }
        post(route('member.membership.update'), { forceFormData: true });
    };

    const fullName = [data.first_name, data.middle_name, data.last_name].filter(Boolean).join(' ');
    const homeLabel = [areaName(area.county), areaName(area.payam), areaName(area.boma)].filter(Boolean).join(' › ');

    return (
        <AuthShell eyebrow="Email confirmed" title="Complete your" accent="membership" panelRef={panelRef}>
            <Head title="Complete Your Membership - Jonglei State Youth Union" />

            <JourneySteps
                current={JOURNEY_OFFSET + step}
                selectable={steps.map((_, i) => JOURNEY_OFFSET + i)}
                onSelect={(i) => goTo(i - JOURNEY_OFFSET)}
            />

            {flash?.success && (
                <div className="border-jsyu-green bg-jsyu-green-light text-jsyu-green-deep mt-8 flex items-center gap-3 border-l-4 px-4 py-3 text-sm font-medium">
                    <CheckCircle2 className="text-jsyu-green h-5 w-5 shrink-0" />
                    {flash.success}
                </div>
            )}

            <form ref={formRef} onSubmit={submit} className="mt-10">
                <div className="mb-6">
                    <p className="text-jsyu-green text-xs font-bold tracking-[0.2em] uppercase">
                        Step {JOURNEY_OFFSET + step + 1} · Membership details
                    </p>
                    <h2 className="font-display text-jsyu-green-deep mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">{steps[step].title}</h2>
                    <span className="bg-jsyu-accent mt-3 block h-1 w-14" />
                </div>

                <AnimatePresence mode="wait" initial={false} custom={direction}>
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: direction * 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction * -40 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="space-y-5"
                    >
                        {step === 0 && (
                            <>
                                {/* Photo */}
                                <div className="flex items-center gap-5">
                                    <div className="border-jsyu-green-soft bg-jsyu-green-light relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden border-2 border-dashed">
                                        {photoPreview ? (
                                            <img src={photoPreview} alt="Your new profile photo" className="h-full w-full object-cover" />
                                        ) : hasPhoto ? (
                                            <CheckCircle2 className="text-jsyu-green h-8 w-8" />
                                        ) : (
                                            <Camera className="text-jsyu-green-muted h-8 w-8" />
                                        )}
                                    </div>
                                    <div>
                                        <Label optional>Profile photo</Label>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <label className="border-jsyu-green text-jsyu-green hover:bg-jsyu-green inline-flex cursor-pointer items-center gap-2 border px-4 py-2 text-xs font-bold tracking-[0.12em] uppercase transition-colors hover:text-white">
                                                <Camera className="h-3.5 w-3.5" />
                                                {photoPreview || hasPhoto ? 'Change' : 'Upload'}
                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    className="sr-only"
                                                    onChange={(e) => choosePhoto(e.target.files?.[0])}
                                                />
                                            </label>
                                            {photoPreview && (
                                                <button
                                                    type="button"
                                                    onClick={removePhoto}
                                                    className="text-jsyu-text-muted inline-flex items-center gap-1 text-xs font-semibold hover:text-red-600"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-jsyu-text-muted mt-1.5 text-xs">
                                            {hasPhoto && !photoPreview ? 'You already have a photo on file. ' : ''}JPG, PNG or WebP, up to{' '}
                                            {MAX_PHOTO_MB} MB.
                                        </p>
                                        <FieldError message={photoError || errors.photo} />
                                    </div>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <Field id="first_name" label="First name" icon={User} error={errors.first_name}>
                                        <input
                                            id="first_name"
                                            type="text"
                                            autoComplete="given-name"
                                            required
                                            maxLength={80}
                                            className={inputClass}
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                        />
                                    </Field>
                                    <Field id="middle_name" label="Middle name" icon={User} error={errors.middle_name} optional>
                                        <input
                                            id="middle_name"
                                            type="text"
                                            autoComplete="additional-name"
                                            maxLength={80}
                                            className={inputClass}
                                            value={data.middle_name}
                                            onChange={(e) => setData('middle_name', e.target.value)}
                                        />
                                    </Field>
                                </div>
                                <Field id="last_name" label="Last name" icon={User} error={errors.last_name}>
                                    <input
                                        id="last_name"
                                        type="text"
                                        autoComplete="family-name"
                                        required
                                        maxLength={80}
                                        className={inputClass}
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                    />
                                </Field>

                                <div>
                                    <Label>Gender</Label>
                                    <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Gender">
                                        {genders.map((g) => (
                                            <label
                                                key={g.value}
                                                className={`has-[:focus-visible]:ring-jsyu-green/20 flex cursor-pointer items-center justify-center border px-3 py-3 text-sm font-semibold transition-all has-[:focus-visible]:ring-4 ${
                                                    data.gender === g.value
                                                        ? 'border-jsyu-green bg-jsyu-green text-white shadow-md'
                                                        : 'border-jsyu-green-soft text-jsyu-charcoal hover:border-jsyu-green bg-white'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value={g.value}
                                                    required
                                                    checked={data.gender === g.value}
                                                    onChange={(e) => setData('gender', e.target.value)}
                                                    className="sr-only"
                                                />
                                                {g.label}
                                            </label>
                                        ))}
                                    </div>
                                    <FieldError message={errors.gender} />
                                </div>

                                <Field id="date_of_birth" label="Date of birth" icon={Calendar} error={errors.date_of_birth}>
                                    <input
                                        id="date_of_birth"
                                        type="date"
                                        autoComplete="bday"
                                        required
                                        min="1900-01-01"
                                        max={today}
                                        className={inputClass}
                                        value={data.date_of_birth}
                                        onChange={(e) => setData('date_of_birth', e.target.value)}
                                    />
                                </Field>
                            </>
                        )}

                        {step === 1 && (
                            <>
                                <Field id="email" label="Email address" icon={Mail} hint="Confirmed — this is the address you sign in with.">
                                    <input
                                        id="email"
                                        type="email"
                                        readOnly
                                        className={`${inputClass} cursor-not-allowed opacity-70`}
                                        value={member.email}
                                    />
                                </Field>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <Field id="phone" label="Phone number" icon={Phone} error={errors.phone}>
                                        <input
                                            id="phone"
                                            type="tel"
                                            autoComplete="tel"
                                            required
                                            pattern={PHONE_PATTERN}
                                            className={inputClass}
                                            placeholder="+211 912 345 678"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                        />
                                    </Field>
                                    <Field id="alternative_phone" label="Alternative phone" icon={Phone} error={errors.alternative_phone} optional>
                                        <input
                                            id="alternative_phone"
                                            type="tel"
                                            pattern={PHONE_PATTERN}
                                            className={inputClass}
                                            placeholder="+211 …"
                                            value={data.alternative_phone}
                                            onChange={(e) => setData('alternative_phone', e.target.value)}
                                        />
                                    </Field>
                                </div>

                                <fieldset className="border-jsyu-green-soft bg-jsyu-green-light/50 border p-4 sm:p-5">
                                    <legend className="text-jsyu-green-deep inline-flex items-center gap-2 px-1 text-xs font-bold tracking-[0.14em] uppercase">
                                        <MapPin className="text-jsyu-green h-3.5 w-3.5" />
                                        Home area in Jonglei
                                    </legend>
                                    {countyOptions.length ? (
                                        <div className="grid gap-4 sm:grid-cols-3">
                                            <div>
                                                <Label htmlFor="county">County</Label>
                                                <select
                                                    id="county"
                                                    required
                                                    className={plainInputClass}
                                                    value={area.county}
                                                    onChange={(e) => chooseArea('county', e.target.value)}
                                                >
                                                    <option value="">Select county</option>
                                                    {countyOptions.map((c) => (
                                                        <option key={c.id} value={c.id}>
                                                            {c.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <Label htmlFor="payam" optional>
                                                    Payam
                                                </Label>
                                                <select
                                                    id="payam"
                                                    disabled={!payamOptions.length}
                                                    className={`${plainInputClass} disabled:cursor-not-allowed disabled:opacity-50`}
                                                    value={area.payam}
                                                    onChange={(e) => chooseArea('payam', e.target.value)}
                                                >
                                                    <option value="">{payamOptions.length ? 'Select payam' : 'Not listed'}</option>
                                                    {payamOptions.map((p) => (
                                                        <option key={p.id} value={p.id}>
                                                            {p.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <Label htmlFor="boma" optional>
                                                    Boma
                                                </Label>
                                                <select
                                                    id="boma"
                                                    disabled={!bomaOptions.length}
                                                    className={`${plainInputClass} disabled:cursor-not-allowed disabled:opacity-50`}
                                                    value={area.boma}
                                                    onChange={(e) => chooseArea('boma', e.target.value)}
                                                >
                                                    <option value="">{bomaOptions.length ? 'Select boma' : 'Not listed'}</option>
                                                    {bomaOptions.map((b) => (
                                                        <option key={b.id} value={b.id}>
                                                            {b.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-jsyu-text-muted text-sm">Home areas are not set up yet — you can add yours later.</p>
                                    )}
                                    <FieldError message={errors.home_area_id} />
                                </fieldset>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <Field id="current_country_code" label="Country you live in" icon={Globe} error={errors.current_country_code}>
                                        <select
                                            id="current_country_code"
                                            required
                                            autoComplete="country"
                                            className={inputClass}
                                            value={data.current_country_code}
                                            onChange={(e) => setData('current_country_code', e.target.value)}
                                        >
                                            <option value="">Select country</option>
                                            <optgroup label="Common">
                                                {priority.map((c) => (
                                                    <option key={c.code} value={c.code}>
                                                        {c.name}
                                                    </option>
                                                ))}
                                            </optgroup>
                                            <optgroup label="All countries">
                                                {rest.map((c) => (
                                                    <option key={c.code} value={c.code}>
                                                        {c.name}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        </select>
                                    </Field>
                                    <Field id="current_location" label="Town / city" icon={MapPin} error={errors.current_location} optional>
                                        <input
                                            id="current_location"
                                            type="text"
                                            autoComplete="address-level2"
                                            maxLength={150}
                                            className={inputClass}
                                            placeholder="e.g. Bor, Juba, Nairobi"
                                            value={data.current_location}
                                            onChange={(e) => setData('current_location', e.target.value)}
                                        />
                                    </Field>
                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <div>
                                    <Label htmlFor="bio" optional>
                                        Short bio
                                    </Label>
                                    <textarea
                                        id="bio"
                                        rows={5}
                                        maxLength={BIO_LIMIT}
                                        className={`${plainInputClass} resize-y`}
                                        placeholder="Tell other members a little about yourself — your studies, work, interests, or how you'd like to contribute."
                                        value={data.bio}
                                        onChange={(e) => setData('bio', e.target.value)}
                                    />
                                    <div className="mt-1.5 flex justify-between">
                                        <FieldError message={errors.bio} />
                                        <span className="text-jsyu-text-muted ml-auto text-xs">
                                            {data.bio.length}/{BIO_LIMIT}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <Label>Who can see your profile?</Label>
                                    <div className="space-y-3" role="radiogroup" aria-label="Profile visibility">
                                        {Object.entries(visibilities).map(([value, label]) => (
                                            <label
                                                key={value}
                                                className={`flex cursor-pointer items-start gap-3 border p-4 transition-all ${
                                                    data.visibility === value
                                                        ? 'border-jsyu-green bg-jsyu-green-light shadow-sm'
                                                        : 'border-jsyu-green-soft hover:border-jsyu-green bg-white'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="visibility"
                                                    value={value}
                                                    required
                                                    checked={data.visibility === value}
                                                    onChange={(e) => setData('visibility', e.target.value)}
                                                    className="accent-jsyu-green mt-0.5 h-4 w-4"
                                                />
                                                <span>
                                                    <span className="text-jsyu-charcoal block text-sm font-bold">{label}</span>
                                                    {value === 'officials' && (
                                                        <span className="text-jsyu-green text-xs font-semibold">Recommended</span>
                                                    )}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    <p className="text-jsyu-text-muted mt-2 inline-flex items-center gap-1.5 text-xs">
                                        <Shield className="h-3.5 w-3.5" />
                                        You can change this at any time.
                                    </p>
                                    <FieldError message={errors.visibility} />
                                </div>

                                {/* Summary */}
                                <div className="border-jsyu-green-soft bg-jsyu-green-light/50 flex items-center gap-4 border p-4">
                                    <div className="bg-jsyu-green flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden text-lg font-extrabold text-white">
                                        {photoPreview ? (
                                            <img src={photoPreview} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            (data.first_name[0] ?? '') + (data.last_name[0] ?? '')
                                        )}
                                    </div>
                                    <div className="min-w-0 text-sm">
                                        <p className="text-jsyu-green-deep truncate font-bold">{fullName}</p>
                                        <p className="text-jsyu-text-muted truncate">
                                            {member.email}
                                            {data.phone ? ` · ${data.phone}` : ''}
                                        </p>
                                        <p className="text-jsyu-text-muted truncate">
                                            {[homeLabel, countryName(data.current_country_code)].filter(Boolean).join(' · ')}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => goTo(0)}
                                        className="text-jsyu-green ml-auto shrink-0 text-xs font-bold tracking-[0.12em] uppercase hover:underline"
                                    >
                                        Edit
                                    </button>
                                </div>
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="border-jsyu-green-soft mt-8 flex items-center gap-3 border-t pt-6">
                    {step > 0 && (
                        <button
                            type="button"
                            onClick={() => goTo(step - 1)}
                            className="border-jsyu-green-soft text-jsyu-charcoal hover:border-jsyu-green inline-flex items-center gap-2 border px-5 py-3.5 text-xs font-bold tracking-[0.14em] uppercase transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </button>
                    )}
                    <SubmitButton processing={processing} busyLabel="Saving…" className="ml-auto flex-1 sm:flex-none sm:px-8">
                        {isLastStep ? 'Complete membership' : 'Continue'}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </SubmitButton>
                </div>
            </form>
        </AuthShell>
    );
}
