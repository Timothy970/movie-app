'use client';

import React from 'react';

interface LoadingBubblesProps {
    message?: string;
}

export const LoadingBubbles: React.FC<LoadingBubblesProps> = ({ message = 'Loading...' }) => {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#08090d]/90 backdrop-blur-xl z-50 select-none animate-fade-in">
            {/* Ambient Background Glow */}
            <div className="absolute w-72 h-72 bg-gradient-to-tr from-blue-600/25 via-indigo-600/20 to-purple-600/25 rounded-full blur-3xl animate-pulse pointer-events-none"></div>

            {/* Spinner Container */}
            <div className="relative flex items-center justify-center w-24 h-24 mb-6">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-indigo-500 border-b-purple-500/30 animate-spin"></div>

                {/* Inner Counter-Rotating Ring */}
                <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-purple-500 border-l-blue-400/40 border-b-indigo-500/30 animate-[spin_1.5s_linear_infinite_reverse]"></div>

                {/* Pulsing MovieRecs Brand Emblem */}
                <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/40 border border-white/20 animate-pulse">
                    <span className="text-xl font-black text-white tracking-tighter drop-shadow-md">
                        M
                    </span>
                </div>
            </div>

            {/* Animated Loading Text */}
            <div className="flex flex-col items-center gap-1.5 z-10 text-center">
                <span className="text-sm font-bold tracking-widest bg-gradient-to-r from-blue-400 via-indigo-200 to-purple-400 bg-clip-text text-transparent uppercase drop-shadow">
                    {message}
                </span>
                <span className="text-[11px] text-gray-400 font-medium tracking-widest uppercase opacity-75">
                    MovieRecs Stream
                </span>
            </div>
        </div>
    );
};

export default LoadingBubbles;
