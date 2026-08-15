import { MovieInfoProps } from "@/types/Movies";
import { StarRating } from "./starrating";
import Image from "next/image";
import { Clock, Calendar, Film, ExternalLink } from "lucide-react";

export const MovieInfo: React.FC<MovieInfoProps> = ({ movie, className = '' }) => {
    const formatRuntime = (minutes: number) => {
        if (!minutes) return 'N/A';
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    };

    const formatReleaseDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.getFullYear().toString();
    };

    const handleOfficialSiteClick = () => {
        if (movie.homepage) {
            window.open(movie.homepage, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className={`glass-panel rounded-3xl p-6 md:p-8 border border-white/10 ${className}`}>
            <div className="flex flex-col md:flex-row gap-8">
                {/* Poster Image */}
                <div className="flex-shrink-0 mx-auto md:mx-0">
                    <div className="relative w-56 h-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                        <Image
                            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-poster.jpg'}
                            alt={movie.title}
                            fill
                            priority
                            sizes="224px"
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Details Column */}
                <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                            <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
                                {movie.title} <span className="text-gray-400 font-normal">({formatReleaseDate(movie.release_date)})</span>
                            </h1>
                            {movie.tagline && (
                                <p className="text-sm italic text-blue-400 mt-1">&quot;{movie.tagline}&quot;</p>
                            )}
                        </div>

                        {movie.homepage && (
                            <button
                                onClick={handleOfficialSiteClick}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-all self-start md:self-auto"
                            >
                                <span>Official Site</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Genres Badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {movie.genres?.map((genre) => (
                            <span
                                key={genre.id}
                                className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-medium"
                            >
                                {genre.name}
                            </span>
                        ))}
                    </div>

                    {/* Metadata Grid (Duration, Release Date, Status, Rating) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 mb-6 text-sm">
                        <div>
                            <span className="text-gray-400 text-xs flex items-center gap-1 mb-1">
                                <Clock className="w-3.5 h-3.5 text-blue-400" /> Duration
                            </span>
                            <span className="text-white font-semibold">{formatRuntime(movie.runtime)}</span>
                        </div>

                        <div>
                            <span className="text-gray-400 text-xs flex items-center gap-1 mb-1">
                                <Calendar className="w-3.5 h-3.5 text-blue-400" /> Release Date
                            </span>
                            <span className="text-white font-semibold">{movie.release_date || 'N/A'}</span>
                        </div>

                        <div>
                            <span className="text-gray-400 text-xs flex items-center gap-1 mb-1">
                                <Film className="w-3.5 h-3.5 text-blue-400" /> Status
                            </span>
                            <span className="text-white font-semibold">{movie.status}</span>
                        </div>

                        <div>
                            <span className="text-gray-400 text-xs mb-1 block">Rating</span>
                            <StarRating rating={movie.vote_average} />
                        </div>
                    </div>

                    {/* Description / Overview */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">Description</h3>
                        <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                            {movie.overview || 'No synopsis available for this title.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};