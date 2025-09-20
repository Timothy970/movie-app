import { ArrowLeft } from 'lucide-react';
import { BackButtonProps } from "@/types/Movies"


export const BackButton: React.FC<BackButtonProps> = ({ onClick, className = '' }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center underline text-blue-500 hover:text-blue-900 transition-colors duration-200 ${className}`}
        >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
        </button>
    );
};
