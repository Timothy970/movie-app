import { ArrowLeft } from 'lucide-react';
import { BackButtonProps } from "@/types/Movies"


export const BackButton: React.FC<BackButtonProps> = ({ onClick, className = '' }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 ${className}`}
        >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to list
        </button>
    );
};
