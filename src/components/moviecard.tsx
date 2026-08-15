'use client';

import React, { useEffect, useState } from "react";
import { Movie } from "../types/Movies";
import { MediaItem } from "@/types/Media";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Heart, Play, Star } from "lucide-react";
import toast from "react-hot-toast";
import { addFavorite, removeFavorite, isFavorite } from "@/lib/favourites";

interface MovieCardProps {
    movie: Movie | MediaItem;
    onClick?: (movie: Movie | MediaItem) => void;
    className?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, className = "" }) => {
    const { user } = useAuth();
    const [isFavoriteMovie, setIsFavoriteMovie] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Extract title, poster, type, and details
    const title = 'title' in movie && movie.title ? movie.title : ('name' in movie && movie.name ? movie.name : 'Untitled');
    const releaseDate = 'release_date' in movie && movie.release_date ? movie.release_date : ('first_air_date' in movie && movie.first_air_date ? movie.first_air_date : '');
    const year = releaseDate ? releaseDate.slice(0, 4) : '';
    const isTV = ('media_type' in movie && movie.media_type === 'tv') || ('first_air_date' in movie && !('title' in movie));
    const targetLink = isTV ? `/tvdetails/${movie.id}` : `/moviesdetails/${movie.id}`;

    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '/placeholder-poster.jpg';

    // Check favorite status on mount
    useEffect(() => {
        if (!user) return;
        const check = async () => {
            const fav = await isFavorite(user.uid, movie.id);
            setIsFavoriteMovie(fav);
        };
        check();
    }, [user, movie.id]);

    const handleFavoriteClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.error("You must be logged in to save favorites");
            return;
        }

        setIsLoading(true);
        try {
            if (isFavoriteMovie) {
                await removeFavorite(user.uid, movie.id);
                setIsFavoriteMovie(false);
                toast.success("Removed from favorites");
            } else {
                // Adapt to Movie interface for favorites storage if needed
                const favData: Movie = {
                    id: movie.id,
                    title: title,
                    poster_path: movie.poster_path || '',
                    backdrop_path: movie.backdrop_path || '',
                    overview: movie.overview || '',
                    vote_average: movie.vote_average || 0,
                    vote_count: movie.vote_count || 0,
                    release_date: releaseDate,
                    popularity: movie.popularity || 0,
                    adult: false,
                    genre_ids: [],
                    original_language: 'en',
                    original_title: title,
                    video: false
                };
                await addFavorite(user.uid, favData);
                setIsFavoriteMovie(true);
                toast.success("Added to favorites");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className={`group relative rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-white/25 transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer ${className}`}
            onClick={() => onClick?.(movie)}
        >
            {/* Favorite Button */}
            <button
                disabled={isLoading}
                onClick={handleFavoriteClick}
                className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 transition-all duration-200 disabled:opacity-50 border border-white/10"
                aria-label="Add to Favorites"
            >
                <Heart
                    size={16}
                    className={`transition-colors duration-200 ${isFavoriteMovie ? "text-red-500 fill-red-500" : "text-white hover:text-red-300"
                        }`}
                />
            </button>

            {/* Media Type Badge */}
            <div className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold tracking-wider text-gray-200 border border-white/10 uppercase">
                {isTV ? 'Series' : 'Movie'}
            </div>

            <Link href={targetLink} className="block w-full">
                {/* Poster Container */}
                <div className="relative aspect-[2/3] w-full bg-gray-900 overflow-hidden">
                    <Image
                        src={posterUrl}
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Play Button Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-xl shadow-white/30">
                            <Play className="w-5 h-5 fill-black ml-0.5" />
                        </div>
                    </div>

                    {/* Bottom Gradient Fade */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-transparent to-transparent opacity-80"></div>
                </div>

                {/* Info Footer */}
                <div className="p-4 bg-gradient-to-b from-[#12141f]/90 to-[#0c0e17]">
                    <h3 className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors mb-1">
                        {title}
                    </h3>

                    <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                        <span>{year || 'N/A'}</span>
                        <div className="flex items-center gap-1 text-yellow-400">
                            <Star className="w-3 h-3 fill-yellow-400" />
                            <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default MovieCard;
