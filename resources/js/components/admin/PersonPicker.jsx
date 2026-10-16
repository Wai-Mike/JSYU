import axios from 'axios';
import { Check, Loader2, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Field } from './form';

/**
 * Searches the people directory (only records the user may see) and returns
 * the chosen person via onChange({id, full_name, ...}).
 */
export default function PersonPicker({ label = 'Person', value, onChange, error, required }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);

        const timer = setTimeout(() => {
            axios
                .get(route('admin.organisation.people.search'), { params: { q: query } })
                .then(({ data }) => !cancelled && setResults(data))
                .catch(() => !cancelled && setResults([]))
                .finally(() => !cancelled && setLoading(false));
        }, 250);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [query]);

    return (
        <Field label={label} error={error} required={required} hint="Not listed? Add them in People first.">
            <div className="focus-within:border-jsyu-green focus-within:ring-jsyu-green/20 border border-slate-200 focus-within:ring-2">
                <div className="relative border-b border-slate-200">
                    <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name, email or phone"
                        className="w-full border-0 py-2 pr-3 pl-9 text-sm focus:ring-0 focus:outline-none"
                    />
                    {loading && <Loader2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />}
                </div>
                <ul className="max-h-48 overflow-y-auto py-1" role="listbox">
                    {results.length === 0 && !loading && <li className="px-3 py-2 text-sm text-slate-500">No matching people.</li>}
                    {results.map((p) => (
                        <li key={p.id}>
                            <button
                                type="button"
                                onClick={() => onChange(p)}
                                className={`flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-sm hover:bg-slate-50 ${
                                    value?.id === p.id ? 'bg-jsyu-green-light' : ''
                                }`}
                            >
                                <span>
                                    <span className="font-medium text-slate-900">{p.full_name}</span>
                                    {(p.email || p.phone) && <span className="ml-2 text-xs text-slate-500">{p.email || p.phone}</span>}
                                </span>
                                {value?.id === p.id && <Check className="text-jsyu-green h-4 w-4" />}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </Field>
    );
}
