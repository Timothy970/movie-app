'use client'
import React, { useState } from "react";
import Header from "../components/header";
import MovieCard from "../components/moviecard";
import Pagination from "../components/pagination";
import { Movie } from "../types/Movies";
import MovieCardShimmer from "@/components/shimmeringcard";
import api from "@/lib/axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ErrorPage from "@/components/errorpage";

const MovieRecsPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    let totalPages = 500;

    // Popular movies
    const getMovies = async (page: number): Promise<Movie[]> => {
        const res = await api.get("/movie/popular", { params: { page } });
        return res.data.results;
    };

    // Search movies
    const searchMovies = async (query: string, page: number): Promise<Movie[]> => {
        const res = await api.get("/search/movie", {
            params: { query, page },
        });
        totalPages = res.data.total_pages
        return res.data.results;
    };

    // React Query handles caching + refetch
    const { data: movies = [], isLoading, error, isFetching } = useQuery<Movie[]>({
        queryKey: ["movies", searchQuery, currentPage], // refetches when either changes
        queryFn: () =>
            searchQuery
                ? searchMovies(searchQuery, currentPage)
                : getMovies(currentPage),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
    });

    if (error) {
        return <ErrorPage />
    }
    if (movies.length == 0) {
        return <ErrorPage />
    }
    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                showSearchBar={true}
            />

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Popular Movies</h1>
                </div>

                {isLoading || isFetching ? (
                    <MovieCardShimmer />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                        {movies?.map((movie) => (
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                            // onClick={handleMovieClick}
                            />
                        ))}
                    </div>
                )}

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    className="mt-8"
                />
            </main>
        </div>
    );
};

export default MovieRecsPage;
