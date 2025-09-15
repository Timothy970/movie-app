import React from "react";

interface LogoProps {
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => (
    <div className={`flex items-center ${className}`}>
        <h1 className="text-2xl font-bold text-blue-600">MovieRecs</h1>
    </div>
);

export default Logo;
