import { Head, Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import MemberLayout from '../../../layouts/MemberLayout';

export function formatDateTime(value) {
    return value ? new Date(value).toLocaleString(undefined, { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
}

function statusLine(election) {
    if (election.accepting) return election.voted ? 'You have voted' : `Voting open until ${formatDateTime(election.closes_at)}`;
    if (election.status === 'open') return new Date(election.opens_at) > new Date() ? `Voting opens ${formatDateTime(election.opens_at)}` : 'Voting has ended';
    if (election.status === 'published') return 'Results published';
    return 'Voting closed. Results will be published after certification.';
}

export default function MemberElections({ elections }) {
    return (
        <MemberLayout>
            <Head title="Elections" />

            <h1 className="mb-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Elections</h1>

            {elections.length === 0 ? (
                <p className="border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500">
                    There are no elections for you right now. Only approved members can vote, in elections for their home area.
                </p>
            ) : (
                <ul className="space-y-3">
                    {elections.map((e) => (
                        <li key={e.id}>
                            <Link
                                href={route('member.elections.show', e.id)}
                                className="hover:border-jsyu-green group flex items-center justify-between gap-4 border border-slate-200 bg-white px-5 py-4"
                            >
                                <span className="min-w-0">
                                    <span className="block font-semibold text-slate-900">{e.title}</span>
                                    <span className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500">
                                        {e.voted && <CheckCircle2 className="text-jsyu-green h-4 w-4" />}
                                        {statusLine(e)}
                                    </span>
                                </span>
                                {e.accepting && !e.voted ? (
                                    <span className="bg-jsyu-green group-hover:bg-jsyu-green-hover inline-flex shrink-0 items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white">
                                        Vote
                                        <ArrowRight className="h-4 w-4" />
                                    </span>
                                ) : (
                                    <ArrowRight className="group-hover:text-jsyu-green h-4 w-4 shrink-0 text-slate-400" />
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </MemberLayout>
    );
}
