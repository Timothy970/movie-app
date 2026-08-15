import React from "react";

// Single dark shimmer card component
const ShimmerCard: React.FC = () => (
    <div data-testid="shimmer" className="glass-panel rounded-2xl overflow-hidden animate-pulse border border-white/5">
        <div className="aspect-[2/3] bg-gray-900 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer-wave"></div>
        </div>

        <div className="p-4 space-y-3 bg-[#0d0e17]">
            <div className="h-4 bg-white/10 rounded-md w-3/4"></div>
            <div className="h-3 bg-white/5 rounded-md w-1/2"></div>
        </div>
    </div>
);

// Main shimmer grid component
const MovieCardShimmer: React.FC<{ className?: string; count?: number }> = ({
    className = "",
    count = 10
}) => {
    return (
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 ${className}`}>
            {Array.from({ length: count }, (_, index) => (
                <ShimmerCard key={index} />
            ))}
        </div>
    );
};

export default MovieCardShimmer;