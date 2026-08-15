"use client";

import React from "react";
import Image from "next/image";
import notFoundImage from "@/assets/images/not-found.svg";

interface ErrorPageProps {
    alt?: string;
    message?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
    alt = "Error illustration",
    message = "Sorry, we couldn't retrieve the requested media right now.",
}) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#08090d] text-white px-6">
            <div className="p-8 rounded-3xl glass-panel border border-white/10 max-w-md text-center">
                <Image
                    src={notFoundImage}
                    alt={alt}
                    width={200}
                    height={200}
                    className="mb-6 mx-auto opacity-80"
                />
                <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
                <p className="text-sm text-gray-400 mb-6">{message}</p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-gray-200 transition-all shadow-lg"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default ErrorPage;
