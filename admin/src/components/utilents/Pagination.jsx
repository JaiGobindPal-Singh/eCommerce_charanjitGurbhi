import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-color-medium">
                Page <span className="font-semibold text-slate-800">{currentPage}</span>{" "}
                of <span className="font-semibold text-slate-800">{totalPages}</span>
            </p>

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
                    {pages.map((page) => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`h-10 w-10 rounded-lg border text-sm font-medium transition ${currentPage === page
                                    ? "border-slate-800 bg-slate-800 text-white"
                                    : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-100"
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                {/* Next */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Next
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}