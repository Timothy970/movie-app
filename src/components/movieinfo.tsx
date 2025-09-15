import { MovieInfoProps } from "@/types/Movies";
import { StarRating } from "./starrating";
import Image from "next/image";



export const MovieInfo: React.FC<MovieInfoProps> = ({ movie, className = '' }) => {
    const formatRuntime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    };

    const formatReleaseDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.getFullYear().toString();
    };

    const handleOfficialSiteClick = () => {
        if (movie.homepage) {
            window.open(movie.homepage, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className={`flex flex-col md:flex-row gap-6 ${className}`}>
            {/* Movie Poster */}
            <div className="flex-shrink-0">
                <div className="relative w-64 h-96 bg-gray-200 rounded-lg overflow-hidden">
                    <Image
                        src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                        alt={movie.title}
                        fill
                        className="object-cover"
                    />
                </div>
            </div>


            {/* Movie Details */}
            <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-0">
                        {movie.title} ({formatReleaseDate(movie.release_date)})
                    </h1>

                    {movie.homepage && (
                        <button
                            onClick={handleOfficialSiteClick}
                            className="self-start px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                        >
                            Official Website
                        </button>
                    )}
                </div>

                {/* Genres */}
                <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                        {movie.genres.map((genre) => (
                            <span
                                key={genre.id}
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium"
                            >
                                {genre.name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Movie Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <span className="text-gray-600 text-sm font-medium block">Runtime</span>
                        <span className="text-gray-900 font-semibold">{formatRuntime(movie.runtime)}</span>
                    </div>
                    <div>
                        <span className="text-gray-600 text-sm font-medium block">Status</span>
                        <span className="text-gray-900 font-semibold">{movie.status}</span>
                    </div>
                    <div>
                        <span className="text-gray-600 text-sm font-medium block">Rating</span>
                        <StarRating rating={movie.vote_average} />
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Overview</h3>
                    <p className="text-gray-700 leading-relaxed">
                        {movie.overview}
                    </p>
                </div>
            </div>
        </div>
    );
};