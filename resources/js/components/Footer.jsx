import { Link } from '@inertiajs/react';
import { Facebook, Instagram, Mail, MapPin, Twitter } from 'lucide-react';
import { sectionImages } from '../constants/sectionImages';

const quickLinks = [
    { name: 'Home', href: route('home') },
    { name: 'About Us', href: '/#about' },
    { name: 'Programs', href: route('programs') },
    { name: 'News & Events', href: route('blog.index') },
    { name: 'Contact', href: '/#contact' },
];

const programLinks = [
    'Youth Representation & Advocacy',
    'Peacebuilding & Social Cohesion',
    'Education & Vocational Training',
    'Humanitarian Advocacy',
    'Youth Economic Empowerment',
    'Climate & Environment',
];

const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-jsyu-green-deep text-white">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
                    <div>
                        <Link href={route('home')} className="mb-4 flex items-center gap-3">
                            <img
                                src={sectionImages.logo}
                                alt="Jonglei State Youth Union"
                                className="h-12 w-12 shrink-0 object-contain"
                            />
                            <div>
                                <div className="text-base font-bold">JSYU</div>
                                <div className="text-xs text-white/60">Jonglei State Youth Union</div>
                            </div>
                        </Link>
                        <p className="mb-6 max-w-xs text-sm leading-relaxed text-white/65">
                            The primary representative body for young people in Jonglei State, South Sudan —
                            advocating for representation, peacebuilding, education, and opportunity.
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        aria-label={social.name}
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-jsyu-green"
                                    >
                                        <Icon className="h-4 w-4 text-white/75" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-jsyu-accent">
                            Quick Links
                        </h4>
                        <ul className="space-y-2.5">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/65 transition-colors hover:text-jsyu-accent"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link
                                    href={route('work-plan')}
                                    className="text-sm text-white/65 transition-colors hover:text-jsyu-accent"
                                >
                                    Work Plan
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-jsyu-accent">
                            Programs
                        </h4>
                        <ul className="space-y-2.5">
                            {programLinks.map((program) => (
                                <li key={program}>
                                    <Link
                                        href={route('programs')}
                                        className="text-sm text-white/65 transition-colors hover:text-jsyu-accent"
                                    >
                                        {program}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-jsyu-accent">
                            Contact
                        </h4>
                        <ul className="mb-6 space-y-3 text-sm text-white/65">
                            <li className="flex gap-2">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-jsyu-accent" />
                                <span>Bor, Jonglei State, South Sudan</span>
                            </li>
                            <li className="flex gap-2">
                                <Mail className="h-4 w-4 shrink-0 text-jsyu-accent" />
                                <a
                                    href="mailto:info@jongleiyouthunion.org"
                                    className="transition-colors hover:text-jsyu-accent"
                                >
                                    info@jongleiyouthunion.org
                                </a>
                            </li>
                        </ul>
                        <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-jsyu-accent">
                            Newsletter
                        </h4>
                        <p className="mb-2 text-xs text-white/45">
                            Get JSYU updates on programs, peace forums, and county events across Jonglei.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="you@example.com"
                                aria-label="Newsletter email"
                                className="flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/40"
                            />
                            <button
                                type="button"
                                className="rounded-lg bg-jsyu-green px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-jsyu-green-hover"
                            >
                                →
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
                    <p className="text-sm text-white/45">
                        &copy; {currentYear} Jonglei State Youth Union. All rights reserved.
                    </p>
                    <div className="flex gap-5 text-sm text-white/45">
                        <span>Privacy Policy</span>
                        <span>Terms of Use</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
