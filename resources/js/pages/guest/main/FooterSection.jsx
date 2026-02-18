import { Link } from '@inertiajs/react';
import { Facebook, Instagram, Mail, MapPin, Phone, Sparkles, Twitter } from 'lucide-react';

export default function FooterSection() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        company: [
            { name: 'About Us', href: '/#about' },
            { name: 'Our Mission', href: '/#about' },
            { name: 'Programs', href: '/programs' },
            { name: 'Contact', href: 'mailto:info@jongleiyouthunion.org' },
        ],
        resources: [
            { name: 'Youth Representation', href: '/programs' },
            { name: 'Peacebuilding', href: '/programs' },
            { name: 'Education & Training', href: '/programs' },
            { name: 'Get Involved', href: 'mailto:info@jongleiyouthunion.org' },
        ],
        legal: [
            { name: 'Privacy Policy', href: '#' },
            { name: 'Terms of Service', href: '#' },
        ],
    };

    const socialLinks = [
        { name: 'Facebook', icon: Facebook, href: '#' },
        { name: 'Instagram', icon: Instagram, href: '#' },
        { name: 'Twitter', icon: Twitter, href: '#' },
    ];

    return (
        <footer className="bg-white text-gray-900">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link href={route('home')} className="mb-4 flex items-center gap-2">
                            <div className="relative">
                                <Sparkles className="h-8 w-8 text-yellow-500" />
                                <div className="absolute inset-0 animate-ping rounded-full bg-yellow-500 opacity-30 blur-md"></div>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">Jonglei State Youth Union</span>
                        </Link>
                        <p className="mb-6 max-w-sm text-sm leading-relaxed text-gray-600">
                            The primary representative body for young people in Jonglei State, South Sudan. Advocating
                            for youth representation, peacebuilding, education, and economic opportunities.
                        </p>
                        {/* Contact Info */}
                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-yellow-500" />
                                <a href="mailto:info@jongleiyouthunion.org" className="transition-colors hover:text-yellow-500">
                                    info@jongleiyouthunion.org
                                </a>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin className="mt-0.5 h-4 w-4 text-yellow-500" />
                                <span>Bor, Jonglei State, South Sudan</span>
                            </div>
                        </div>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Company</h3>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-gray-600 transition-colors hover:text-yellow-500">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Resources</h3>
                        <ul className="space-y-2">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-gray-600 transition-colors hover:text-yellow-500">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Legal</h3>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-gray-600 transition-colors hover:text-yellow-500">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Social Media & Bottom Bar */}
                <div className="mt-12 border-t border-gray-200 pt-8">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        {/* Social Media Icons */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">Follow us:</span>
                            <div className="flex gap-3">
                                {socialLinks.map((social) => {
                                    const Icon = social.icon;
                                    return (
                                        <a
                                            key={social.name}
                                            href={social.href}
                                            aria-label={social.name}
                                            className="group rounded-full bg-gray-100 p-2 text-gray-600 transition-all hover:bg-yellow-500 hover:text-white"
                                        >
                                            <Icon className="h-5 w-5" />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className="text-center text-sm text-gray-600 md:text-left">
                            <p>&copy; {currentYear} Jonglei State Youth Union. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
