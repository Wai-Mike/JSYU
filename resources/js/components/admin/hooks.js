import { router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

/**
 * Returns can(permission) for showing/hiding UI. The server enforces every
 * permission again, so this is only about what to display.
 */
export function usePermissions() {
    const { auth } = usePage().props;
    const permissions = auth?.permissions ?? [];

    return (permission) => permissions.includes(permission);
}

/**
 * Keeps filter values in the URL query string (debounced), so lists are
 * filtered server-side and shareable. Resets pagination on change.
 */
export function useQueryFilters(initial) {
    const [values, setValues] = useState(initial);
    const skip = useRef(true);

    useEffect(() => {
        if (skip.current) {
            skip.current = false;
            return;
        }

        const timer = setTimeout(() => {
            const query = Object.fromEntries(Object.entries(values).filter(([, v]) => v !== '' && v !== null && v !== undefined && v !== false));
            router.get(window.location.pathname, query, { preserveState: true, preserveScroll: true, replace: true });
        }, 300);

        return () => clearTimeout(timer);
    }, [values]);

    return [values, (key, value) => setValues((current) => ({ ...current, [key]: value }))];
}

export function formatDate(value) {
    if (!value) return '—';
    const date = new Date(String(value).length === 10 ? `${value}T00:00:00` : value);

    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}
