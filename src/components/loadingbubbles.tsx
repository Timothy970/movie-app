'use client'
import React from "react";

const LoadingBubbles: React.FC = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#08090d]/80 backdrop-blur-md z-50">
            <div className="flex space-x-4">
                <div className="w-5 h-5 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-5 h-5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                <div className="w-5 h-5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
            </div>
        </div>
    );
};

export default LoadingBubbles;
