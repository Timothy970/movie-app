import React from "react";

// Single shimmer card component
const ShimmerCard: React.FC = () => (
    <div data-testid="shimmer" className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        {/* Poster placeholder with shimmer */}
        <div className="aspect-[3/4] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-wave"></div>
        </div>

        {/* Content placeholder */}
        <div className="p-4 space-y-3">
            {/* Title placeholder */}
            <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-md relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-wave"></div>
            </div>

            {/* Subtitle placeholder */}
            <div className="h-3 w-3/4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-md relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-wave"></div>
            </div>
        </div>
    </div>
);

// Main shimmer grid component
const MovieCardShimmer: React.FC<{ className?: string; count?: number }> = ({
    className = "",
    count = 4
}) => {
    return (
        <>
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${className}`}>
                {/* Generate shimmer cards based on count */}
                {Array.from({ length: count }, (_, index) => (
                    <ShimmerCard key={index} />
                ))}
            </div>

            {/* Custom CSS for shimmer animations */}
            <style jsx>{`
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                
                @keyframes shimmer-wave {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                .animate-shimmer {
                    animation: shimmer 2s infinite linear;
                }
                
                .animate-shimmer-wave {
                    animation: shimmer-wave 2s infinite linear;
                }
            `}</style>
        </>
    );
};

export default MovieCardShimmer;