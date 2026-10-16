import { Search } from 'lucide-react';

/**
 * @param {{
 *   children?: import('react').ReactNode,
 *   onSubmit?: (e: import('react').FormEvent) => void,
 *   searchValue?: string,
 *   onSearchChange?: (value: string) => void,
 *   searchPlaceholder?: string,
 *   showSearch?: boolean,
 * }} props
 */
export default function FilterBar({ children, onSubmit, searchValue = '', onSearchChange, searchPlaceholder = 'Search...', showSearch = true }) {
    return (
        <form
            onSubmit={onSubmit}
            className="mb-6 flex flex-col gap-3 border border-slate-200/80 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-end"
        >
            {showSearch && (
                <div className="min-w-[200px] flex-1">
                    <label className="mb-1 block text-xs font-medium tracking-wide text-slate-500 uppercase">Search</label>
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="focus:border-jsyu-green focus:ring-jsyu-green/20 w-full border border-slate-200 bg-white py-2 pr-3 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:outline-none"
                        />
                    </div>
                </div>
            )}
            {children}
        </form>
    );
}

export function FilterSelect({ label, value, onChange, children }) {
    return (
        <div>
            <label className="mb-1 block text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="focus:border-jsyu-green focus:ring-jsyu-green/20 border border-slate-200 bg-white py-2 pr-8 pl-3 text-sm text-slate-900 focus:ring-2 focus:outline-none"
            >
                {children}
            </select>
        </div>
    );
}

export function FilterButton({ children, type = 'submit' }) {
    return (
        <button type={type} className="bg-jsyu-green-deep hover:bg-jsyu-green px-4 py-2 text-sm font-semibold text-white">
            {children}
        </button>
    );
}
