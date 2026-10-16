import { Link } from '@inertiajs/react';

/** Footer for a Laravel paginator; pass to DataTable's `footer`. Renders nothing for a single page. */
export default function Pagination({ paginator }) {
    if (!paginator || paginator.last_page <= 1) {
        return paginator?.total ? <p className="text-sm text-slate-500">{paginator.total} total</p> : null;
    }

    return (
        <div className="flex items-center justify-between text-sm text-slate-600">
            <p>
                {paginator.from}–{paginator.to} of {paginator.total}
            </p>
            <div className="flex gap-2">
                {paginator.prev_page_url && (
                    <Link href={paginator.prev_page_url} preserveScroll className="border border-slate-200 px-3 py-1.5 hover:bg-slate-50">
                        Previous
                    </Link>
                )}
                {paginator.next_page_url && (
                    <Link href={paginator.next_page_url} preserveScroll className="border border-slate-200 px-3 py-1.5 hover:bg-slate-50">
                        Next
                    </Link>
                )}
            </div>
        </div>
    );
}
