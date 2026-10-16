/**
 * @param {{
 *   label: string,
 *   value: string | number,
 *   hint?: string,
 *   icon?: import('react').ComponentType<{ className?: string }>,
 * }} props
 */
export default function StatCard({ label, value, hint, icon: Icon }) {
    return (
        <div className="border border-slate-200/80 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</p>
                    <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
                    {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
                </div>
                {Icon && (
                    <div className="bg-jsyu-green-light text-jsyu-green flex h-9 w-9 shrink-0 items-center justify-center">
                        <Icon className="h-[18px] w-[18px]" />
                    </div>
                )}
            </div>
        </div>
    );
}
