import React from "react";
import { Movie } from "../types/Movies";
import Image from "next/image";
import Link from "next/link";

interface MovieCardProps {
    movie: Movie;
    onClick?: (movie: Movie) => void;
    className?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, className = "" }) => (
    <div
        className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer ${className}`}
        onClick={() => onClick?.(movie)}
    >
        <Link key={movie.id} href={`/moviesdetails/${movie.id}`}>

            <div className="aspect-[3/4] bg-gray-200 flex items-center justify-center">
                {/* <Link key={movie.id} href={`/moviesdetails/${movie.id}`}> */}
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

export default MovieCard;
