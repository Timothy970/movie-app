'use client'
import React from "react";

const LoadingBubbles: React.FC = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent pointer-events-none">
            <div className="flex space-x-4">
                <div className="w-6 h-6 bg-blue-300 rounded-full animate-bounce"></div>
                <div className="w-6 h-6 bg-blue-300 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                <div className="w-6 h-6 bg-blue-300 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
            </div>
        </div>
    );
};

export default LoadingBubbles;
