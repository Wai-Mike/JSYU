/**
 * @param {{
 *   title: string,
 *   icon?: import('react').ComponentType<{ className?: string }>,
 *   actions?: import('react').ReactNode,
 * }} props
 */
export default function PageHeader({ title, icon: Icon, actions }) {
    return (
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                    {Icon && (
                        <div className="bg-jsyu-green-light text-jsyu-green flex h-9 w-9 shrink-0 items-center justify-center">
                            <Icon className="h-5 w-5" />
                        </div>
                    )}
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
                </div>
            </div>
            {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
        </div>
    );
}
