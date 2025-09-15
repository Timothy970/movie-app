import { StarRatingProps } from "@/types/Movies";
import { Star } from 'lucide-react';

export const StarRating: React.FC<StarRatingProps> = ({ rating, maxRating = 10, className = '' }) => {
    const stars = Math.round((rating / maxRating) * 5);

    return (
        <div className={`flex items-center ${className}`}>
            <div className="flex mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-5 h-5 ${star <= stars ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                    />
                ))}
            </div>
            <span className="text-gray-600">({rating}/{maxRating})</span>
        </div>
    );
};
