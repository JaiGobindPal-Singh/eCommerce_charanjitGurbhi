import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
    currentPage,
    hasNextPage,
    onPageChange,
}) {

    return (
        <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            

            <div className="flex items-center gap-2">
                {/* Previous */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <ChevronLeft size={18} />
                    Prev
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-2">
                        <button
                            className="h-10 w-10 rounded-lg border text-sm font-medium transition border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-100">
                            {currentPage}
                        </button>
                </div>

                {/* Next */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!hasNextPage}
                    className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Next
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}