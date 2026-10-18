import { BadgeCheck, CircleAlert } from 'lucide-react';

/** Votes per candidate for each position, winners marked. Used by the admin and member election pages. */
export default function ElectionResults({ results }) {
    return (
        <div className="grid gap-4 lg:grid-cols-2">
            {results.map((position) => {
                const max = Math.max(1, ...position.candidates.map((c) => c.votes));

                return (
                    <div key={position.id} className="border border-slate-200/80 bg-white">
                        <h3 className="border-b border-slate-100 px-5 py-3 text-sm font-semibold text-slate-900">
                            {position.title}
                            <span className="ml-2 text-xs font-normal text-slate-500">{position.total.toLocaleString()} votes</span>
                        </h3>
                        {position.tie && (
                            <p className="flex items-center gap-1.5 bg-amber-50 px-5 py-2 text-xs text-amber-800">
                                <CircleAlert className="h-3.5 w-3.5" />
                                Tie for the last seat. It must be resolved under the election rules.
                            </p>
                        )}
                        <ul className="space-y-2.5 px-5 py-4">
                            {position.candidates.map((c) => (
                                <li
                                    key={c.id}
                                    className="group grid grid-cols-[minmax(0,9rem)_1fr_5rem] items-center gap-3 text-sm"
                                    title={`${c.name}: ${c.votes} votes`}
                                >
                                    <span className={`flex items-center gap-1 truncate ${c.elected ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                                        {c.elected && <BadgeCheck className="text-jsyu-green h-3.5 w-3.5 shrink-0" aria-label="Elected" />}
                                        <span className="truncate">{c.name}</span>
                                    </span>
                                    <span className="h-2.5 bg-slate-100">
                                        <span
                                            className={`block h-full rounded-r ${c.elected ? 'bg-jsyu-green' : 'bg-slate-400'}`}
                                            style={{ width: `${(c.votes / max) * 100}%` }}
                                        />
                                    </span>
                                    <span className="text-right text-slate-900 tabular-nums">
                                        {c.votes.toLocaleString()}
                                        <span className="ml-1 text-xs text-slate-400">
                                            {position.total ? Math.round((c.votes / position.total) * 100) : 0}%
                                        </span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
}
