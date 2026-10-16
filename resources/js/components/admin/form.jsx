import { useMemo } from 'react';

const inputClasses =
    'block w-full  border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900  placeholder:text-slate-400 focus:border-jsyu-green focus:ring-2 focus:ring-jsyu-green/20 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500';

export function Field({ label, error, hint, required, htmlFor, children }) {
    return (
        <div>
            {label && (
                <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-slate-700">
                    {label}
                    {required && <span className="ml-0.5 text-red-600">*</span>}
                </label>
            )}
            {children}
            {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}

export function TextInput({ label, error, hint, required, id, className = '', ...props }) {
    return (
        <Field label={label} error={error} hint={hint} required={required} htmlFor={id}>
            <input id={id} required={required} className={`${inputClasses} ${error ? 'border-red-400' : ''} ${className}`} {...props} />
        </Field>
    );
}

export function Textarea({ label, error, hint, required, id, rows = 3, ...props }) {
    return (
        <Field label={label} error={error} hint={hint} required={required} htmlFor={id}>
            <textarea id={id} rows={rows} required={required} className={`${inputClasses} ${error ? 'border-red-400' : ''}`} {...props} />
        </Field>
    );
}

/** options: array of {value, label} or a {value: label} map. */
export function Select({ label, error, hint, required, id, options, placeholder, ...props }) {
    const list = Array.isArray(options) ? options : Object.entries(options ?? {}).map(([value, text]) => ({ value, label: text }));

    return (
        <Field label={label} error={error} hint={hint} required={required} htmlFor={id}>
            <select id={id} required={required} className={`${inputClasses} ${error ? 'border-red-400' : ''}`} {...props}>
                {placeholder !== undefined && <option value="">{placeholder}</option>}
                {list.map((o) => (
                    <option key={o.value} value={o.value} disabled={o.disabled}>
                        {o.label}
                    </option>
                ))}
            </select>
        </Field>
    );
}

export function Checkbox({ label, hint, id, ...props }) {
    return (
        <label htmlFor={id} className="flex items-start gap-2 text-sm text-slate-700">
            <input id={id} type="checkbox" className="text-jsyu-green focus:ring-jsyu-green/30 mt-0.5 h-4 w-4 border-slate-300" {...props} />
            <span>
                {label}
                {hint && <span className="block text-xs text-slate-500">{hint}</span>}
            </span>
        </label>
    );
}

/**
 * Turns a flat list of {id, parent_id, name, level} into indented options in
 * tree order. Items whose parent isn't in the list are shown as roots.
 */
export function useTreeOptions(items, { showLevel = true } = {}) {
    return useMemo(() => {
        const ids = new Set(items.map((i) => i.id));
        const byParent = new Map();
        items.forEach((i) => {
            const key = i.parent_id && ids.has(i.parent_id) ? i.parent_id : null;
            byParent.set(key, [...(byParent.get(key) ?? []), i]);
        });

        const out = [];
        const walk = (parentId, depth) => {
            [...(byParent.get(parentId) ?? [])]
                .sort((a, b) => a.name.localeCompare(b.name))
                .forEach((i) => {
                    out.push({
                        value: i.id,
                        depth,
                        item: i,
                        label: `${'   '.repeat(depth)}${i.name}${showLevel && i.level ? ` (${i.level})` : ''}`,
                    });
                    walk(i.id, depth + 1);
                });
        };
        walk(null, 0);

        return out;
    }, [items, showLevel]);
}
