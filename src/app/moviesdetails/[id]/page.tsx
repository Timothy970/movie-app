"use client";

import React, { use } from "react";
import Header from "@/components/header";
import { BackButton } from "@/components/backbutton";
import { CastCarousel } from "@/components/castcarousel";
import { CastMember, MovieDetail } from "@/types/Movies";
import { BackdropImage } from "@/components/backdropimage";
import { MovieInfo } from "@/components/movieinfo";
import ProtectedRoute from "@/components/protectroute";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import LoadingBubbles from "@/components/loadingbubbles";
import ErrorPage from "@/components/errorpage";

// --- API functions ---
async function getMovieDetails(id: string): Promise<MovieDetail> {
    const res = await api.get(`/${id}`);
    return res.data;
}

async function getMovieCastDetails(id: string): Promise<CastMember[]> {
    const res = await api.get(`/movie/${id}/credits`);
    return res.data.cast;
}

// --- Page component ---
export default function MovieDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);

    // Queries
    const {
        data: movie,
        isLoading: movieLoading,
        error: movieError,
    } = useQuery<MovieDetail>({
        queryKey: ["movie", id],
        queryFn: () => getMovieDetails(id),
        enabled: !!id,
    });

    const {
        data: cast = [],
        isLoading: castLoading,
        error: castError,
    } = useQuery<CastMember[]>({
        queryKey: ["movie", id, "cast"],
        queryFn: () => getMovieCastDetails(id),
        enabled: !!id,
    });

    const handleBackClick = () => {
        console.log("Navigate back to movie list");
        // e.g. router.back() if using next/navigation
    };

    if (movieLoading) return <LoadingBubbles />;
    if (movieError) return <ErrorPage />;
    if (!movie) return <ErrorPage />;

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <Header searchQuery={""} onSearchChange={() => { }} showSearchBar={false} />

                <main className="max-w-7xl mx-auto px-6 py-8">
                    <BackButton onClick={handleBackClick} className="mb-6" />

                    <BackdropImage
                        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                        alt={`${movie.title} backdrop`}
                        className="mb-8"
                    />

                    <MovieInfo movie={movie} className="mb-12" />

                    {castLoading ? (
                        <div className="text-white">...</div>
                    ) : castError ? (
                        <div></div>
                    ) : (
                        <CastCarousel cast={cast} />
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}
