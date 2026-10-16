/**
 * @param {{
 *   columns: Array<{ key: string, label: string, align?: 'left' | 'right' | 'center', className?: string }>,
 *   children: import('react').ReactNode,
 *   empty?: import('react').ReactNode,
 *   isEmpty?: boolean,
 *   footer?: import('react').ReactNode,
 * }} props
 */
export default function DataTable({ columns, children, empty, isEmpty = false, footer }) {
    return (
        <div className="overflow-hidden border border-slate-200/80 bg-white">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-slate-100">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    scope="col"
                                    className={`px-4 py-3 text-xs font-medium tracking-wider text-slate-400 uppercase ${
                                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                                    } ${col.className ?? ''}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isEmpty ? (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-slate-500">
                                    {empty ?? 'No results.'}
                                </td>
                            </tr>
                        ) : (
                            children
                        )}
                    </tbody>
                </table>
            </div>
            {footer && <div className="border-t border-slate-100 px-4 py-3">{footer}</div>}
        </div>
    );
}

export function TableCell({ children, align = 'left', className = '' }) {
    return (
        <td
            className={`px-4 py-3.5 text-sm text-slate-700 ${
                align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
            } ${className}`}
        >
            {children}
        </td>
    );
}
