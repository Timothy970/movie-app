import { ArrowLeft } from 'lucide-react';
import { BackButtonProps } from "@/types/Movies";

export const BackButton: React.FC<BackButtonProps> = ({ onClick, className = '' }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-full glass-pill text-xs font-semibold text-gray-300 hover:text-white transition-all duration-200 ${className}`}
        >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
        </button>
    );
};
