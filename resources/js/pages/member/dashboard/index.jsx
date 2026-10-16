import { Head, usePage } from '@inertiajs/react';
import { CheckCircle2, Circle, PenSquare } from 'lucide-react';
import MemberLayout from '../../../layouts/MemberLayout';

function Row({ label, value }) {
    return (
        <div className="flex flex-col gap-0.5 border-b border-slate-100 py-3 last:border-b-0 sm:flex-row sm:gap-4">
            <dt className="w-40 shrink-0 text-sm text-slate-500">{label}</dt>
            <dd className="text-sm font-medium text-slate-900">{value || '—'}</dd>
        </div>
    );
}

export default function MemberDashboard({ account, profile }) {
    const { flash } = usePage().props;
    const firstName = account.name?.split(' ')[0] || 'member';
    const joined = account.joined
        ? new Date(account.joined).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
        : null;

    return (
        <MemberLayout>
            <Head title="Member Dashboard" />

            {flash?.success && (
                <div className="mb-4 border-l-4 border-jsyu-green bg-jsyu-green-light px-4 py-3 text-sm font-medium text-jsyu-green-deep">
                    {flash.success}
                </div>
            )}

            <h1 className="mb-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Welcome, {firstName}</h1>

            <div className="grid gap-4 lg:grid-cols-3">
                <section className="border border-slate-200 bg-white lg:col-span-2">
                    <h2 className="border-b border-slate-200 px-5 py-3 text-sm font-bold text-slate-900">Your account</h2>
                    <dl className="px-5">
                        <Row label="Name" value={account.name} />
                        <Row label="Email" value={account.email} />
                        <Row label="Signs in with" value={account.signInMethod} />
                        <Row label="Member since" value={joined} />
                        {profile && <Row label="Home area" value={profile.homeArea} />}
                    </dl>
                </section>

                <div className="space-y-4">
                    <section className="border border-slate-200 bg-white">
                        <h2 className="border-b border-slate-200 px-5 py-3 text-sm font-bold text-slate-900">Member profile</h2>
                        {profile ? (
                            <ul className="space-y-2.5 px-5 py-4">
                                {profile.sections.map((section) => (
                                    <li key={section.key} className="flex items-center gap-2.5 text-sm">
                                        {section.complete ? (
                                            <CheckCircle2 className="h-4 w-4 shrink-0 text-jsyu-green" />
                                        ) : (
                                            <Circle className="h-4 w-4 shrink-0 text-slate-300" />
                                        )}
                                        <span className={section.complete ? 'text-slate-900' : 'text-slate-500'}>{section.label}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="px-5 py-4 text-sm text-slate-500">No member profile is linked to your account yet.</p>
                        )}
                    </section>

                    <a
                        href={route('blog.create')}
                        className="flex items-center gap-3 border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-900 hover:border-jsyu-green hover:bg-jsyu-green-light"
                    >
                        <PenSquare className="h-4 w-4 text-jsyu-green" />
                        Write a post for the news page
                    </a>
                </div>
            </div>
        </MemberLayout>
    );
}
