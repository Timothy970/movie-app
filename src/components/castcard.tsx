import { CastCardProps } from "@/types/Movies";
import Image from "next/image";

export const CastCard: React.FC<CastCardProps> = ({ castMember, className = '' }) => {
    const photoUrl = castMember.profile_path
        ? `https://image.tmdb.org/t/p/w185${castMember.profile_path}`
        : '/placeholder-avatar.jpg';

    return (
        <div className={`flex-shrink-0 w-36 sm:w-40 group ${className}`}>
            <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-white/25 transition-all duration-300 transform group-hover:-translate-y-1">
                <div className="relative aspect-[3/4] bg-gray-900 overflow-hidden">
                    <Image
                        src={photoUrl}
                        alt={castMember.name}
                        fill
                        sizes="160px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
                <div className="p-3 bg-black/40">
                    <h4 className="font-semibold text-xs text-white truncate group-hover:text-blue-400 transition-colors">
                        {castMember.name}
                    </h4>
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">{castMember.character}</p>
                </div>
            </div>
        </div>
    );
};
