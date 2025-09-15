import { CastCardProps } from "@/types/Movies";
import Image from "next/image";

export const CastCard: React.FC<CastCardProps> = ({ castMember, className = '' }) => {
    return (
        <div className={`flex-shrink-0 w-48 ${className}`}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Make this relative so Image (fill) can size correctly */}
                <div className="relative aspect-[3/4] bg-gray-200">
                    <Image
                        src={`https://image.tmdb.org/t/p/original${castMember.profile_path}`}
                        alt={castMember.name}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="p-3">
                    <h4 className="font-medium text-sm text-gray-900 truncate">{castMember.name}</h4>
                    <p className="text-xs text-gray-600 truncate">{castMember.character}</p>
                </div>
            </div>
        </div>
    );
};
