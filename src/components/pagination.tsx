import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    className = "",
}) => {
    // Limit max pagination pages display to 500 for TMDB limits
    const maxPages = Math.min(totalPages, 500);

    const getVisiblePages = () => {
        const delta = 1;
        const range: number[] = [];
        const rangeWithDots: (number | string)[] = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(maxPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, "...");
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < maxPages - 1) {
            rangeWithDots.push("...", maxPages);
        } else if (maxPages > 1) {
            rangeWithDots.push(maxPages);
        }

        return rangeWithDots;
    };

    return (
        <div className={`flex items-center justify-center gap-2 ${className}`}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center px-4 py-2 text-xs font-semibold text-gray-300 rounded-full glass-pill hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Prev
            </button>

            <div className="flex items-center gap-1.5">
                {getVisiblePages().map((page, index) => {
                    const isCurrent = page === currentPage;
                    const isNumber = typeof page === "number";

                    return (
                        <button
                            key={index}
                            onClick={() => isNumber ? onPageChange(page as number) : null}
                            disabled={!isNumber}
                            className={`min-w-9 h-9 px-3 rounded-full text-xs font-semibold transition-all duration-200 ${isCurrent
                                    ? "bg-white text-black shadow-md shadow-white/20 scale-105"
                                    : isNumber
                                        ? "text-gray-300 glass-pill hover:text-white"
                                        : "text-gray-500 cursor-default"
                                }`}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === maxPages}
                className="flex items-center px-4 py-2 text-xs font-semibold text-gray-300 rounded-full glass-pill hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
            </button>
        </div>
    );
};

export default Pagination;
