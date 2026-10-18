import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Lock } from 'lucide-react';
import { useState } from 'react';
import ElectionResults from '../../../components/ElectionResults';
import MemberLayout from '../../../layouts/MemberLayout';
import { formatDateTime } from './index';

export default function MemberElection({ election, voted, results, turnout }) {
    const { flash } = usePage().props;

    return (
        <MemberLayout>
            <Head title={election.title} />

            <Link href={route('member.elections.index')} className="hover:text-jsyu-green mb-3 inline-flex items-center gap-1 text-sm text-slate-500">
                <ArrowLeft className="h-4 w-4" />
                All elections
            </Link>

            {flash?.success && (
                <div className="border-jsyu-green bg-jsyu-green-light text-jsyu-green-deep mb-4 border-l-4 px-4 py-3 text-sm font-medium">{flash.success}</div>
            )}

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{election.title}</h1>
            <p className="mt-1 mb-4 text-sm text-slate-500">
                Voting {formatDateTime(election.opens_at)} – {formatDateTime(election.closes_at)}
            </p>
            {election.description && <p className="mb-6 text-sm whitespace-pre-line text-slate-700">{election.description}</p>}

            {results ? (
                <>
                    <h2 className="mb-1 text-lg font-bold text-slate-900">Certified results</h2>
                    <p className="mb-3 text-sm text-slate-500">
                        {turnout.voted.toLocaleString()} of {turnout.eligible.toLocaleString()} eligible members voted.
                    </p>
                    <ElectionResults results={results} />
                </>
            ) : voted ? (
                <Notice icon={CheckCircle2} title="You have voted">
                    Your ballot is secret: the Union records that you voted, not who you chose. Results will appear here once they are certified.
                </Notice>
            ) : election.accepting ? (
                <Ballot election={election} />
            ) : (
                <Notice icon={Lock} title={new Date(election.opens_at) > new Date() ? 'Voting has not opened yet' : 'Voting has closed'}>
                    Results will appear here once they are certified.
                </Notice>
            )}
        </MemberLayout>
    );
}

function Notice({ icon: Icon, title, children }) {
    return (
        <div className="flex gap-3 border border-slate-200 bg-white px-5 py-4">
            <Icon className="text-jsyu-green mt-0.5 h-5 w-5 shrink-0" />
            <div>
                <p className="font-semibold text-slate-900">{title}</p>
                <p className="mt-0.5 text-sm text-slate-600">{children}</p>
            </div>
        </div>
    );
}

function Ballot({ election }) {
    const form = useForm({ ballot: Object.fromEntries(election.positions.map((p) => [p.id, []])) });
    const [reviewing, setReviewing] = useState(false);

    const toggle = (position, candidateId) => {
        const current = form.data.ballot[position.id] ?? [];
        let next;
        if (position.seats === 1) {
            next = current.includes(candidateId) ? [] : [candidateId];
        } else if (current.includes(candidateId)) {
            next = current.filter((id) => id !== candidateId);
        } else if (current.length < position.seats) {
            next = [...current, candidateId];
        } else {
            return;
        }
        form.setData('ballot', { ...form.data.ballot, [position.id]: next });
    };

    const name = (position, id) => position.candidates.find((c) => c.id === id)?.name;

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (!reviewing) return setReviewing(true);
                form.post(route('member.elections.vote', election.id), { preserveScroll: true, onError: () => setReviewing(false) });
            }}
            className="space-y-4"
        >
            {form.errors.ballot && <p className="border-l-4 border-red-400 bg-red-50 px-4 py-3 text-sm text-red-800">{form.errors.ballot}</p>}

            {reviewing ? (
                <section className="border border-slate-200 bg-white">
                    <h2 className="border-b border-slate-200 px-5 py-3 text-sm font-bold text-slate-900">Check your choices</h2>
                    <dl className="divide-y divide-slate-100 px-5">
                        {election.positions.map((p) => (
                            <div key={p.id} className="flex flex-col gap-0.5 py-3 sm:flex-row sm:gap-4">
                                <dt className="w-48 shrink-0 text-sm text-slate-500">{p.title}</dt>
                                <dd className="text-sm font-medium text-slate-900">
                                    {(form.data.ballot[p.id] ?? []).map((id) => name(p, id)).join(', ') || <span className="text-slate-400">No choice (abstain)</span>}
                                </dd>
                            </div>
                        ))}
                    </dl>
                    <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">Once submitted, your vote cannot be changed.</p>
                </section>
            ) : (
                election.positions.map((p) => {
                    const chosen = form.data.ballot[p.id] ?? [];

                    return (
                        <fieldset key={p.id} className="border border-slate-200 bg-white">
                            <legend className="sr-only">{p.title}</legend>
                            <div className="flex items-baseline justify-between gap-3 border-b border-slate-200 px-5 py-3">
                                <h2 className="text-sm font-bold text-slate-900">{p.title}</h2>
                                <span className="text-xs text-slate-500">
                                    {p.seats === 1 ? 'Choose one' : `Choose up to ${p.seats} (${chosen.length} chosen)`}
                                </span>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {p.candidates.map((c) => {
                                    const selected = chosen.includes(c.id);
                                    const full = !selected && p.seats > 1 && chosen.length >= p.seats;

                                    return (
                                        <label
                                            key={c.id}
                                            className={`flex cursor-pointer items-start gap-3 px-5 py-3 ${selected ? 'bg-jsyu-green-light' : 'hover:bg-slate-50'} ${full ? 'cursor-not-allowed opacity-50' : ''}`}
                                        >
                                            <input
                                                type={p.seats === 1 ? 'radio' : 'checkbox'}
                                                name={`position-${p.id}`}
                                                checked={selected}
                                                disabled={full}
                                                onChange={() => toggle(p, c.id)}
                                                onClick={() => p.seats === 1 && selected && toggle(p, c.id)}
                                                className="text-jsyu-green focus:ring-jsyu-green/30 mt-0.5 h-4 w-4 border-slate-300"
                                            />
                                            <span>
                                                <span className="block text-sm font-semibold text-slate-900">{c.name}</span>
                                                {c.statement && <span className="mt-0.5 block text-sm text-slate-600">{c.statement}</span>}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                            {form.errors[`ballot.${p.id}`] && <p className="px-5 pb-3 text-xs text-red-600">{form.errors[`ballot.${p.id}`]}</p>}
                        </fieldset>
                    );
                })
            )}

            <div className="flex justify-end gap-2">
                {reviewing && (
                    <button type="button" onClick={() => setReviewing(false)} className="border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                        Change choices
                    </button>
                )}
                <button
                    type="submit"
                    disabled={form.processing}
                    className="bg-jsyu-green hover:bg-jsyu-green-hover px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                    {reviewing ? 'Submit my vote' : 'Review my choices'}
                </button>
            </div>
        </form>
    );
}
