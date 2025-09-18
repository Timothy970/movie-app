'use client'
import React, { useEffect, useState } from "react";
import Header from "../components/header";
import MovieCard from "../components/moviecard";
import Pagination from "../components/pagination";
import { Movie } from "../types/Movies";
import { MockMovies } from "@/data/mockdata";
import ProtectedRoute from "@/components/protectroute";
import MovieCardShimmer from "@/components/shimmeringcard";
import api from "@/lib/axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const MovieRecsPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 500;

    // Explicitly typed return value
    const getMovies = async (page: number): Promise<Movie[]> => {
        const res = await api.get("/popular", { params: { page } });
        return res.data.results;
    };

    // Provide generic type to useQuery
    const { data: movies, isLoading, error, isFetching } = useQuery<Movie[]>({
        queryKey: ["movies", currentPage],
        queryFn: () => getMovies(currentPage),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
    });
    if (error) {
        console.log(error)
    }
    if (isFetching) {
        console.log("fetching")
    }
    return (
        <ProtectedRoute>
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

                    {isLoading && movies ? (
                        <MovieCardShimmer />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                            {movies.map((movie) => (
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
        </ProtectedRoute>
    );
};

export default MovieRecsPage;
