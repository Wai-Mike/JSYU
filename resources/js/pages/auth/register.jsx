import { Head, Link, useForm } from '@inertiajs/react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    ArrowLeft,
    ArrowRight,
    Calendar,
    Camera,
    Check,
    Eye,
    EyeOff,
    Globe,
    HandHeart,
    Lock,
    Mail,
    MapPin,
    Megaphone,
    Phone,
    Shield,
    Sprout,
    User,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { sectionImages } from '../../constants/sectionImages';
import { countryName, countryOptions } from '../../constants/countries';

const joinBenefits = [
    { icon: Users, title: 'Connect across Jonglei', text: 'Meet youth from all 9 counties of Jonglei.' },
    { icon: Sprout, title: 'Grow your skills', text: 'Access programs, forums, and volunteer opportunities.' },
    { icon: Megaphone, title: 'Make your voice heard', text: 'Share updates and join community conversations.' },
    { icon: HandHeart, title: 'Stand for peace', text: 'Unite with Nuer, Dinka, and Anyuak youth for unity and peace.' },
];

const counties = ['Akobo', 'Ayod', 'Bor', 'Duk', 'Fangak', 'Nyirol', 'Canal/Pigi', 'Twic East', 'Uror'];

const steps = [
    { title: 'Personal', subtitle: 'Tell us who you are', fields: ['first_name', 'middle_name', 'last_name', 'gender', 'date_of_birth', 'photo'] },
    {
        title: 'Contact & home',
        subtitle: 'How to reach you and where you are from',
        fields: ['email', 'phone', 'alternative_phone', 'home_area_id', 'current_country_code', 'current_location'],
    },
    { title: 'About & privacy', subtitle: 'Introduce yourself and choose who sees your profile', fields: ['bio', 'visibility'] },
    { title: 'Account', subtitle: 'Secure your membership account', fields: ['password', 'password_confirmation', 'terms'] },
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

const inputBase =
    'w-full border border-jsyu-green-soft bg-jsyu-green-light/40 py-3 pr-4 text-jsyu-charcoal transition-all placeholder:text-jsyu-text-muted/60 focus:border-jsyu-green focus:bg-white focus:ring-4 focus:ring-jsyu-green/10 focus:outline-none';
const inputClass = `${inputBase} pl-11`;
const plainInputClass = `${inputBase} pl-4`;

function passwordStrength(value) {
    if (!value) return { score: 0, label: '' };
    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    const s = Math.max(score, 1);
    return { score: s, label: ['', 'Weak', 'Fair', 'Good', 'Strong'][s] };
}

const strengthColors = ['', 'bg-red-500', 'bg-jsyu-gold', 'bg-jsyu-accent', 'bg-jsyu-green'];

function Label({ htmlFor, children, optional }) {
    return (
        <label htmlFor={htmlFor} className="text-jsyu-charcoal mb-1.5 flex items-baseline justify-between text-xs font-bold tracking-[0.12em] uppercase">
            {children}
            {optional && <span className="text-jsyu-text-muted text-[10px] font-semibold tracking-normal normal-case">Optional</span>}
        </label>
    );
}

function FieldError({ message }) {
    return message ? <p className="mt-1.5 text-xs font-medium text-red-600">{message}</p> : null;
}

function Field({ id, label, icon: Icon, error, optional, hint, children }) {
    return (
        <div>
            <Label htmlFor={id} optional={optional}>
                {label}
            </Label>
            <div className="relative">
                {Icon && <Icon className="text-jsyu-text-muted/70 pointer-events-none absolute top-1/2 left-4 z-10 h-4 w-4 -translate-y-1/2" />}
                {children}
            </div>
            {hint && !error && <p className="text-jsyu-text-muted mt-1.5 text-xs">{hint}</p>}
            <FieldError message={error} />
        </div>
    );
}

function PasswordToggle({ show, onToggle }) {
    return (
        <button
            type="button"
            className="text-jsyu-text-muted hover:text-jsyu-green absolute inset-y-0 right-0 flex items-center px-4 transition-colors"
            onClick={onToggle}
            aria-label={show ? 'Hide password' : 'Show password'}
        >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
    );
}

function BackgroundSlideshow() {
    const [active, setActive] = useState(0);
    const reduceMotion = useReducedMotion();
    const backgrounds = sectionImages.heroSlides;

    useEffect(() => {
        if (reduceMotion) return undefined;
        const timer = setInterval(() => setActive((i) => (i + 1) % backgrounds.length), 6000);
        return () => clearInterval(timer);
    }, [reduceMotion, backgrounds.length]);

    return backgrounds.map((src, i) => (
        <div key={src} className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${i === active ? 'opacity-100' : 'opacity-0'}`}>
            <div
                className={`absolute inset-0 bg-cover bg-center ${i === active ? 'animate-ken-burns' : ''}`}
                style={{ backgroundImage: `url("${encodeURI(src)}")` }}
            />
        </div>
    ));
}

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

function StepIndicator({ current, onSelect }) {
    return (
        <ol className="flex items-start">
            {steps.map((step, i) => {
                const done = i < current;
                const active = i === current;
                return (
                    <li key={step.title} className="relative flex flex-1 flex-col items-center">
                        {i > 0 && (
                            <span className="bg-jsyu-green-soft absolute top-4 right-1/2 h-0.5 w-full -translate-y-1/2">
                                <span className={`bg-jsyu-green block h-full transition-all duration-500 ${i <= current ? 'w-full' : 'w-0'}`} />
                            </span>
                        )}
                        <button
                            type="button"
                            disabled={!done}
                            onClick={() => onSelect(i)}
                            aria-current={active ? 'step' : undefined}
                            className={`relative z-10 flex h-8 w-8 items-center justify-center text-xs font-bold transition-all duration-300 ${
                                done
                                    ? 'bg-jsyu-green hover:bg-jsyu-green-hover cursor-pointer text-white'
                                    : active
                                      ? 'bg-jsyu-accent text-jsyu-green-deep ring-jsyu-accent/30 scale-110 ring-4'
                                      : 'border-jsyu-green-soft text-jsyu-text-muted border bg-white'
                            }`}
                        >
                            {done ? <Check className="h-4 w-4" /> : i + 1}
                        </button>
                        <span
                            className={`mt-2 hidden text-center text-[11px] font-bold tracking-wide uppercase sm:block ${
                                active ? 'text-jsyu-green-deep' : 'text-jsyu-text-muted'
                            }`}
                        >
                            {step.title}
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}

export default function Register({ areas = [], visibilities = {} }) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        first_name: '',
        middle_name: '',
        last_name: '',
        gender: '',
        date_of_birth: '',
        photo: null,
        email: '',
        phone: '',
        alternative_phone: '',
        home_area_id: '',
        current_country_code: 'SS',
        current_location: '',
        bio: '',
        visibility: 'officials',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoError, setPhotoError] = useState('');
    const [area, setArea] = useState({ county: '', payam: '', boma: '' });
    const formRef = useRef(null);
    const panelRef = useRef(null);

    const { priority, rest } = useMemo(() => countryOptions(), []);
    const countyOptions = areas.filter((a) => a.level === 'county');
    const payamOptions = areas.filter((a) => a.level === 'payam' && String(a.parent_id) === String(area.county));
    const bomaOptions = areas.filter((a) => a.level === 'boma' && String(a.parent_id) === String(area.payam));
    const areaName = (id) => areas.find((a) => String(a.id) === String(id))?.name;

    const strength = passwordStrength(data.password);
    const passwordsMatch = data.password_confirmation.length > 0 && data.password === data.password_confirmation;
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
    };

    const next = () => {
        if (formRef.current && !formRef.current.reportValidity()) return;
        goTo(step + 1);
    };

    const chooseArea = (level, value) => {
        const nextArea =
            level === 'county' ? { county: value, payam: '', boma: '' } : level === 'payam' ? { ...area, payam: value, boma: '' } : { ...area, boma: value };
        setArea(nextArea);
        setData('home_area_id', nextArea.boma || nextArea.payam || nextArea.county);
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
        if (!isLastStep) {
            next();
            return;
        }
        post(route('register'), {
            forceFormData: true,
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const fullName = [data.first_name, data.middle_name, data.last_name].filter(Boolean).join(' ');
    const homeLabel = [areaName(area.county), areaName(area.payam), areaName(area.boma)].filter(Boolean).join(' › ');

    return (
        <div className="bg-jsyu-green-deep flex min-h-screen lg:h-screen lg:overflow-hidden">
            <Head title="Become a Member - Jonglei State Youth Union" />

            {/* Brand panel */}
            <div className="relative hidden overflow-hidden lg:flex lg:w-[45%]">
                <BackgroundSlideshow />
                <div className="from-jsyu-green-deep/95 via-jsyu-green-deep/80 to-jsyu-green-deep/40 absolute inset-0 bg-gradient-to-tr" />
                <div className="bg-jsyu-accent/20 pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full blur-3xl" />

                <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
                    <motion.div {...fadeUp(0)}>
                        <Link href={route('home')} className="inline-flex items-center gap-3">
                            <img src={sectionImages.logo} alt="Jonglei State Youth Union" className="h-14 w-14 object-contain" />
                            <div>
                                <p className="font-display text-lg leading-none font-extrabold text-white">JSYU</p>
                                <p className="mt-1 text-xs text-white/70">Jonglei State Youth Union</p>
                            </div>
                        </Link>
                    </motion.div>

                    <div className="max-w-xl">
                        <motion.p {...fadeUp(0.1)} className="text-jsyu-accent text-sm font-bold tracking-[0.24em] uppercase">
                            Become a member
                        </motion.p>
                        <motion.h1
                            {...fadeUp(0.2)}
                            className="font-display mt-3 text-4xl leading-[1.05] font-extrabold tracking-tight text-white drop-shadow-lg xl:text-5xl"
                        >
                            Your voice matters
                            <br />
                            <span className="text-jsyu-accent">in Jonglei State</span>
                        </motion.h1>

                        <ul className="mt-10 grid gap-4 xl:grid-cols-2">
                            {joinBenefits.map(({ icon: Icon, title, text }, i) => (
                                <motion.li
                                    key={title}
                                    {...fadeUp(0.35 + i * 0.1)}
                                    className="group hover:border-jsyu-accent/60 border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-colors hover:bg-white/10"
                                >
                                    <span className="bg-jsyu-accent text-jsyu-green-deep inline-flex h-9 w-9 items-center justify-center transition-transform group-hover:scale-110">
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <p className="mt-3 text-sm font-bold text-white">{title}</p>
                                    <p className="mt-1 text-xs leading-relaxed font-medium text-white/70">{text}</p>
                                </motion.li>
                            ))}
                        </ul>
                    </div>

                    <motion.div {...fadeUp(0.8)}>
                        <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-white/60 uppercase">
                            <MapPin className="text-jsyu-accent h-3.5 w-3.5" />
                            Open to youth in all nine counties · Term 2026/2030
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {counties.map((county) => (
                                <span key={county} className="border border-white/15 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white/80 uppercase">
                                    {county}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Form panel */}
            <div ref={panelRef} className="relative flex w-full flex-col bg-white lg:w-[55%] lg:overflow-y-auto">
                {/* Mobile banner */}
                <div className="relative h-40 shrink-0 overflow-hidden lg:hidden">
                    <BackgroundSlideshow />
                    <div className="from-jsyu-green-deep/90 to-jsyu-green-deep/50 absolute inset-0 bg-gradient-to-t" />
                    <div className="relative flex h-full flex-col justify-between p-5">
                        <Link href={route('home')} className="inline-flex items-center gap-2">
                            <img src={sectionImages.logo} alt="JSYU" className="h-10 w-10 object-contain" />
                            <span className="font-display text-sm font-extrabold text-white">JSYU</span>
                        </Link>
                        <p className="font-display text-2xl leading-tight font-extrabold text-white">
                            Your voice matters <span className="text-jsyu-accent">in Jonglei</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-1 justify-center px-5 py-10 sm:px-10 lg:px-14 lg:py-12">
                    <motion.div {...fadeUp(0.15)} className="w-full max-w-xl">
                        <Link
                            href={route('home')}
                            className="text-jsyu-text-muted hover:text-jsyu-green mb-8 hidden items-center gap-1.5 text-xs font-bold tracking-[0.14em] uppercase transition-colors lg:inline-flex"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Back to home
                        </Link>

                        <h2 className="font-display text-jsyu-green-deep text-3xl font-extrabold tracking-tight sm:text-4xl">Membership registration</h2>
                        <span className="bg-jsyu-accent mt-3 block h-1 w-14" />
                        <p className="text-jsyu-text-muted mt-4 text-sm font-medium">
                            Already a member?{' '}
                            <Link href={route('login')} className="text-jsyu-green hover:text-jsyu-green-hover font-bold underline-offset-4 hover:underline">
                                Sign in
                            </Link>
                        </p>

                        <div className="mt-8">
                            <StepIndicator current={step} onSelect={goTo} />
                        </div>

                        <form ref={formRef} onSubmit={submit} noValidate={false} className="mt-8">
                            <div className="mb-6">
                                <p className="text-jsyu-green text-xs font-bold tracking-[0.2em] uppercase">
                                    Step {step + 1} of {steps.length}
                                </p>
                                <h3 className="font-display text-jsyu-green-deep mt-1 text-2xl font-extrabold">{steps[step].subtitle}</h3>
                            </div>

                            <AnimatePresence mode="wait" initial={false} custom={direction}>
                                <motion.div
                                    key={step}
                                    custom={direction}
                                    initial={{ opacity: 0, x: direction * 40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: direction * -40 }}
                                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                    className="space-y-5"
                                >
                                    {step === 0 && (
                                        <>
                                            <a
                                                href={route('auth.google')}
                                                className="border-jsyu-green-soft text-jsyu-charcoal hover:border-jsyu-green focus:ring-jsyu-green/10 flex w-full items-center justify-center gap-3 border bg-white px-4 py-3 text-sm font-semibold transition-all hover:shadow-md focus:ring-4 focus:outline-none"
                                            >
                                                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path
                                                        fill="#4285F4"
                                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                    />
                                                    <path
                                                        fill="#34A853"
                                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                    />
                                                    <path
                                                        fill="#FBBC05"
                                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                    />
                                                    <path
                                                        fill="#EA4335"
                                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                    />
                                                </svg>
                                                Sign up quickly with Google
                                            </a>
                                            <div className="flex items-center gap-4">
                                                <span className="bg-jsyu-green-soft h-px flex-1" />
                                                <span className="text-jsyu-text-muted text-xs font-bold tracking-[0.16em] uppercase">or fill in your details</span>
                                                <span className="bg-jsyu-green-soft h-px flex-1" />
                                            </div>

                                            {/* Photo */}
                                            <div className="flex items-center gap-5">
                                                <div className="border-jsyu-green-soft bg-jsyu-green-light relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden border-2 border-dashed">
                                                    {photoPreview ? (
                                                        <img src={photoPreview} alt="Your profile photo" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <Camera className="text-jsyu-green-muted h-8 w-8" />
                                                    )}
                                                </div>
                                                <div>
                                                    <Label optional>Profile photo</Label>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <label className="border-jsyu-green text-jsyu-green hover:bg-jsyu-green inline-flex cursor-pointer items-center gap-2 border px-4 py-2 text-xs font-bold tracking-[0.12em] uppercase transition-colors hover:text-white">
                                                            <Camera className="h-3.5 w-3.5" />
                                                            {photoPreview ? 'Change' : 'Upload'}
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
                                                    <p className="text-jsyu-text-muted mt-1.5 text-xs">JPG, PNG or WebP, up to {MAX_PHOTO_MB} MB.</p>
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
                                                        placeholder="e.g. Nyandeng"
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
                                                    placeholder="e.g. Mabior"
                                                    value={data.last_name}
                                                    onChange={(e) => setData('last_name', e.target.value)}
                                                />
                                            </Field>

                                            <div>
                                                <Label>Gender</Label>
                                                <div className="grid grid-cols-3 gap-3" role="radiogroup">
                                                    {genders.map((g) => (
                                                        <label
                                                            key={g.value}
                                                            className={`flex cursor-pointer items-center justify-center border px-3 py-3 text-sm font-semibold transition-all ${
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
                                            <Field id="email" label="Email address" icon={Mail} error={errors.email}>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    autoComplete="email"
                                                    required
                                                    className={inputClass}
                                                    placeholder="you@example.com"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
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
                                                    <p className="text-jsyu-text-muted text-sm">Home areas are not set up yet — you can add yours from your profile later.</p>
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
                                                <Field
                                                    id="current_location"
                                                    label="Town / city"
                                                    icon={MapPin}
                                                    error={errors.current_location}
                                                    optional
                                                >
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
                                                <div className="space-y-3" role="radiogroup">
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
                                                                {value === 'officials' && <span className="text-jsyu-green text-xs font-semibold">Recommended</span>}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                                <p className="text-jsyu-text-muted mt-2 inline-flex items-center gap-1.5 text-xs">
                                                    <Shield className="h-3.5 w-3.5" />
                                                    You can change this any time from your profile.
                                                </p>
                                                <FieldError message={errors.visibility} />
                                            </div>
                                        </>
                                    )}

                                    {step === 3 && (
                                        <>
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
                                                    <p className="text-jsyu-text-muted truncate">{data.email}</p>
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

                                            <Field id="password" label="Password" icon={Lock} error={errors.password}>
                                                <input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    autoComplete="new-password"
                                                    required
                                                    minLength={5}
                                                    className={`${inputClass} pr-12`}
                                                    placeholder="Create a strong password"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                />
                                                <PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                                            </Field>
                                            {data.password && (
                                                <div className="-mt-2 flex items-center gap-3" aria-live="polite">
                                                    <div className="flex flex-1 gap-1">
                                                        {[1, 2, 3, 4].map((s) => (
                                                            <span
                                                                key={s}
                                                                className={`h-1 flex-1 transition-colors duration-300 ${
                                                                    s <= strength.score ? strengthColors[strength.score] : 'bg-jsyu-green-soft'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-jsyu-text-muted w-12 text-right text-xs font-semibold">{strength.label}</span>
                                                </div>
                                            )}

                                            <Field id="password_confirmation" label="Confirm password" icon={Lock} error={errors.password_confirmation}>
                                                <input
                                                    id="password_confirmation"
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    autoComplete="new-password"
                                                    required
                                                    className={`${inputClass} pr-12`}
                                                    placeholder="Confirm your password"
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                />
                                                <PasswordToggle show={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />
                                            </Field>
                                            {data.password_confirmation && (
                                                <p
                                                    className={`-mt-2 inline-flex items-center gap-1.5 text-xs font-semibold ${passwordsMatch ? 'text-jsyu-green' : 'text-red-600'}`}
                                                    aria-live="polite"
                                                >
                                                    {passwordsMatch && <Check className="h-3.5 w-3.5" />}
                                                    {passwordsMatch ? 'Passwords match' : 'Passwords do not match yet'}
                                                </p>
                                            )}

                                            <label htmlFor="terms" className="flex cursor-pointer items-start gap-3 pt-1">
                                                <input
                                                    id="terms"
                                                    type="checkbox"
                                                    required
                                                    className="accent-jsyu-green mt-0.5 h-4 w-4 shrink-0"
                                                    checked={data.terms}
                                                    onChange={(e) => setData('terms', e.target.checked)}
                                                />
                                                <span className="text-jsyu-text-muted text-sm font-medium">
                                                    I agree to participate respectfully in JSYU activities and follow the community guidelines.
                                                </span>
                                            </label>
                                            <FieldError message={errors.terms} />
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
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="group bg-jsyu-green hover:bg-jsyu-green-hover focus:ring-jsyu-green/30 ml-auto flex flex-1 items-center justify-center gap-2 px-4 py-3.5 text-sm font-bold tracking-[0.14em] text-white uppercase transition-all hover:shadow-lg focus:ring-4 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:px-8"
                                >
                                    {processing ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            Submitting…
                                        </>
                                    ) : (
                                        <>
                                            {isLastStep ? 'Become a member' : 'Continue'}
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 text-center lg:hidden">
                            <Link href={route('home')} className="text-jsyu-green hover:text-jsyu-green-hover text-xs font-semibold">
                                ← Back to home
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
