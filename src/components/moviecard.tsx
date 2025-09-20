import React, { useEffect, useState } from "react";
import { Movie } from "../types/Movies";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import { addFavorite, removeFavorite, isFavorite } from "@/lib/favourites";

interface MovieCardProps {
    movie: Movie;
    onClick?: (movie: Movie) => void;
    className?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, className = "" }) => {
    const { user } = useAuth(); // Ensure this provides Supabase user
    const [isFavoriteMovie, setIsFavoriteMovie] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
            toast.error("You should be logged in to add a movie to favourites");
            return;
        }

        setIsLoading(true);
        try {
            if (isFavoriteMovie) {
                await removeFavorite(user.uid, movie.id);
                setIsFavoriteMovie(false);
                toast.success("Removed from favorites");
            } else {
                await addFavorite(user.uid, movie);
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
            className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer relative ${className}`}
            onClick={() => onClick?.(movie)}
        >
            {/* Favorite Button */}
            <button
                disabled={isLoading}
                className="absolute top-2 right-2 z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors duration-200 disabled:opacity-50"
            >
                <Heart
                    onClick={handleFavoriteClick}
                    size={20}
                    className={`transition-colors duration-200 ${isFavoriteMovie ? "text-red-500 fill-red-500" : "text-white hover:text-red-300"
                        }`}
                />
            </button>

            <Link key={movie.id} href={`/moviesdetails/${movie.id}`}>
                <div className="aspect-[3/4] bg-gray-200 flex items-center justify-center">
                    <Image
                        src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                        alt={movie.title}
                        width={200}
                        height={220}
                        className="object-cover w-full h-full"
                    />
                </div>
            </Link>
            <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 truncate">{movie.title}</h3>
            </div>
        </div>
    );
};

export default MovieCard;
