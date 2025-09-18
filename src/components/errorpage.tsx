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
    message = "Sorry, we couldn't get what you are looking for.",
}) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
            <Image
                src={notFoundImage}
                alt={alt}
                width={300}
                height={300}
                className="mb-6"
            />
            <p className="text-lg text-gray-700 text-center">{message}</p>
        </div>
    );
};

export default ErrorPage;
