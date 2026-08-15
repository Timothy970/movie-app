'use client';

import React, { use, useState } from "react";
import Header from "@/components/header";
import { BackButton } from "@/components/backbutton";
import { CastCarousel } from "@/components/castcarousel";
import { CastMember, MovieDetail } from "@/types/Movies";
import { MovieInfo } from "@/components/movieinfo";
import { VideoPlayer } from "@/components/videoplayer";
import api from "@/lib/axios";
import { getExternalIds } from "@/services/mediaService";
import { useQuery } from "@tanstack/react-query";
import LoadingBubbles from "@/components/loadingbubbles";
import ErrorPage from "@/components/errorpage";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";
import Image from "next/image";

// --- API functions ---
async function getMovieDetails(id: string): Promise<MovieDetail> {
    const res = await api.get(`movie/${id}`);
    return res.data;
}

async function getMovieCastDetails(id: string): Promise<CastMember[]> {
    const res = await api.get(`/movie/${id}/credits`);
    return res.data.cast;
}

export default function MovieDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();
    // Default to false so player does NOT play immediately on page load
    const [isPlaying, setIsPlaying] = useState(false);

    // Fetch movie details
    const {
        data: movie,
        isLoading: movieLoading,
        error: movieError,
    } = useQuery<MovieDetail>({
        queryKey: ["movie", id],
        queryFn: () => getMovieDetails(id),
        enabled: !!id,
    });

    // Fetch cast details
    const {
        data: cast = [],
        isLoading: castLoading,
    } = useQuery<CastMember[]>({
        queryKey: ["movie", id, "cast"],
        queryFn: () => getMovieCastDetails(id),
        enabled: !!id,
    });

    // Fetch IMDb ID for VidAPI fallback
    const { data: imdbId } = useQuery<string | null>({
        queryKey: ["movie", id, "imdbId"],
        queryFn: () => getExternalIds(id, "movie"),
        enabled: !!id,
    });

    const handleBackClick = () => {
        router.back();
    };

    if (movieLoading) return <LoadingBubbles />;
    if (movieError || !movie) return <ErrorPage />;

    const backdropUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : movie.poster_path
            ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
            : '/placeholder-backdrop.jpg';

    return (
        <div className="min-h-screen bg-[#08090d] text-white flex flex-col">
            <Header searchQuery={""} onSearchChange={() => { }} showSearchBar={false} />

            <main className="max-w-7xl mx-auto px-6 py-6 w-full flex-1">
                {/* Back button */}
                <div className="mb-6 flex items-center justify-between">
                    <BackButton onClick={handleBackClick} />
                    {!isPlaying && (
                        <button
                            onClick={() => setIsPlaying(true)}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs hover:bg-gray-200 transition-all shadow-xl shadow-white/20 transform hover:-translate-y-0.5"
                        >
                            <Play className="w-4 h-4 fill-black" />
                            <span>Play Stream</span>
                        </button>
                    )}
                </div>

                {/* Video Player Stream or Hero Backdrop with Play Button */}
                {isPlaying ? (
                    <div className="mb-10 animate-fade-in">
                        <VideoPlayer
                            mediaId={movie.id}
                            mediaType="movie"
                            imdbId={imdbId}
                            title={movie.title}
                            posterPath={movie.poster_path}
                            inline={true}
                        />
                    </div>
                ) : (
                    <div className="relative w-full h-[52vh] min-h-[380px] max-h-[580px] rounded-3xl overflow-hidden mb-10 group border border-white/10 shadow-2xl">
                        <Image
                            src={backdropUrl}
                            alt={movie.title}
                            fill
                            priority
                            sizes="100vw"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        {/* Dark Vignette Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-black/40 to-transparent flex flex-col items-center justify-center p-6 text-center">
                            <button
                                onClick={() => setIsPlaying(true)}
                                className="w-20 h-20 rounded-full bg-white/90 text-black flex items-center justify-center shadow-2xl shadow-white/30 hover:scale-110 hover:bg-white transition-all duration-300 mb-4 group/btn"
                                aria-label="Play Stream"
                            >
                                <Play className="w-8 h-8 fill-black ml-1 group-hover/btn:scale-110 transition-transform" />
                            </button>
                            <h2 className="text-2xl md:text-3xl font-black text-white drop-shadow-md mb-2">{movie.title}</h2>
                            <p className="text-xs md:text-sm text-gray-300 max-w-xl line-clamp-2">Click to start streaming directly in your browser.</p>
                        </div>
                    </div>
                )}

                {/* Description & Overview Card */}
                <MovieInfo movie={movie} className="mb-10" />

                {/* Cast Carousel */}
                {!castLoading && cast.length > 0 && (
                    <CastCarousel cast={cast} className="mb-10" />
                )}
            </main>
        </div>
    );
}
