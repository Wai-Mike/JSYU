import { usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

// Validation errors the server raises about a whole record rather than one form field
const GENERAL_ERROR_KEYS = ['area', 'unit', 'position', 'appointment', 'role', 'permission_ids'];

function Alert({ tone, children }) {
    const Icon = tone === 'error' ? AlertCircle : CheckCircle2;
    const classes = tone === 'error' ? 'border-red-200 bg-red-50 text-red-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800';

    return (
        <div role={tone === 'error' ? 'alert' : 'status'} className={`mb-4 flex items-start gap-3  border px-4 py-3 text-sm ${classes}`}>
            <Icon className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{children}</p>
        </div>
    );
}

export default function FlashAlert() {
    const { flash, errors } = usePage().props;
    const general = GENERAL_ERROR_KEYS.map((key) => errors?.[key]).filter(Boolean);

    return (
        <>
            {flash?.success && <Alert tone="success">{flash.success}</Alert>}
            {flash?.error && <Alert tone="error">{flash.error}</Alert>}
            {general.map((message) => (
                <Alert key={message} tone="error">
                    {message}
                </Alert>
            ))}
        </>
    );
}
