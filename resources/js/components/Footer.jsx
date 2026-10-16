import { Link } from '@inertiajs/react';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { sectionImages } from '../constants/sectionImages';

const aboutLinks = [
    { name: 'About Us', href: '/#about' },
    { name: 'Programs', href: route('programs') },
    { name: 'Work Plan', href: route('work-plan') },
    { name: 'Contact', href: '/#contact' },
    { name: 'News', href: route('blog.index') },
    { name: 'Join', href: route('register') },
];

const categoryLinks = [
    { name: 'Representation', href: route('programs') },
    { name: 'Peacebuilding', href: route('programs') },
    { name: 'Education', href: route('programs') },
    { name: 'Livelihoods', href: route('programs') },
    { name: 'Climate', href: route('programs') },
    { name: 'Inclusion', href: route('programs') },
];

const productTags = [
    'Advocacy',
    'Peace Forums',
    'Skills Training',
    'VSLA Groups',
    'Volunteerism',
    'Sports',
    'Disability Inclusion',
];

const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer>
            {/* Tier 1 — dark contact band */}
            <div className="bg-jsyu-charcoal text-white">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8 lg:gap-12">
                    <div>
                        <h4 className="font-display text-lg font-bold uppercase tracking-wide text-jsyu-accent">
                            Headquarters
                        </h4>
                        <p className="mt-3 text-sm leading-relaxed text-white/65">
                            Interactively coordinate youth representation, peacebuilding, and opportunity across
                            Jonglei State.
                        </p>
                        <ul className="mt-5 space-y-3 text-sm text-white/70">
                            <li className="flex gap-2">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-jsyu-accent" />
                                <span>Bor, Jonglei State, South Sudan</span>
                            </li>
                            <li className="flex gap-2">
                                <Phone className="h-4 w-4 shrink-0 text-jsyu-accent" />
                                <span>Working hours: Mon – Sat</span>
                            </li>
                            <li className="flex gap-2">
                                <Mail className="h-4 w-4 shrink-0 text-jsyu-accent" />
                                <a
                                    href="mailto:info@jsyu.org"
                                    className="hover:text-jsyu-accent"
                                >
                                    info@jsyu.org
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="text-center md:text-left">
                        <h4 className="font-display text-lg font-bold uppercase tracking-wide text-jsyu-accent">
                            We are everywhere
                        </h4>
                        <p className="mt-3 text-sm text-white/65">
                            County youth coordination across all 9 counties of Jonglei — Nuer, Dinka, and Anyuak
                            communities.
                        </p>
                        <div className="mt-5 space-y-1.5 text-sm font-medium text-white/80">
                            <p>Bor · Twic East · Duk</p>
                            <p>Ayod · Fangak · Canal/Pigi</p>
                            <p>Nyirol · Uror · Pochalla</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-display text-lg font-bold uppercase tracking-wide text-jsyu-accent">
                            Get Social
                        </h4>
                        <p className="mt-3 text-sm leading-relaxed text-white/65">
                            Follow our activity and stay connected with youth programs across Jonglei.
                        </p>
                        <div className="mt-5 flex gap-3">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        aria-label={social.name}
                                        className="flex h-10 w-10 items-center justify-center bg-jsyu-accent text-jsyu-green-deep hover:bg-jsyu-accent-hover"
                                    >
                                        <Icon className="h-4 w-4" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tier 2 — white link columns */}
            <div className="border-t border-jsyu-green-soft bg-white">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
                    <div>
                        <Link href={route('home')} className="mb-4 flex items-center gap-3">
                            <img
                                src={sectionImages.logo}
                                alt="Jonglei State Youth Union"
                                className="h-11 w-11 object-contain"
                            />
                            <div>
                                <div className="font-display text-base font-bold uppercase text-jsyu-green-deep">
                                    About us
                                </div>
                            </div>
                        </Link>
                        <ul className="space-y-2">
                            {aboutLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm font-medium text-jsyu-text-muted hover:text-jsyu-green-deep"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-display text-base font-bold uppercase tracking-wide text-jsyu-green-deep">
                            Popular categories
                        </h4>
                        <ul className="mt-4 space-y-2">
                            {categoryLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm font-medium text-jsyu-text-muted hover:text-jsyu-green-deep"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-display text-base font-bold uppercase tracking-wide text-jsyu-green-deep">
                            Our focus
                        </h4>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {productTags.map((tag) => (
                                <Link
                                    key={tag}
                                    href={route('programs')}
                                    className="bg-jsyu-green-deep px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-jsyu-green"
                                >
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tier 3 — bottom bar */}
            <div className="border-t border-jsyu-green-soft bg-jsyu-green-light">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 text-sm text-jsyu-text-muted sm:flex-row sm:px-6 lg:px-8">
                    <p>&copy; {currentYear} Jonglei State Youth Union. All rights reserved.</p>
                    <div className="flex flex-wrap justify-center gap-5">
                        <Link href={route('home')} className="hover:text-jsyu-green-deep">
                            Home
                        </Link>
                        <Link href="/#about" className="hover:text-jsyu-green-deep">
                            About us
                        </Link>
                        <Link href={route('programs')} className="hover:text-jsyu-green-deep">
                            Programs
                        </Link>
                        <Link href={route('blog.index')} className="hover:text-jsyu-green-deep">
                            News
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
