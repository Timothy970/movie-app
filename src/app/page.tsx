'use client'
import React, { useState } from "react";
import Header from "../components/header";
import MovieCard from "../components/moviecard";
import Pagination from "../components/pagination";
import { Movie } from "../types/Movies";
import { MockMovies } from "@/data/mockdata";
import ProtectedRoute from "@/components/protectroute";

const MovieRecsPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10;

    const handleMovieClick = (movie: Movie) => {
        console.log("Movie clicked:", movie);
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} showSearchBar={true} />

                <main className="max-w-7xl mx-auto px-6 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Popular Movies</h1>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                        {MockMovies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} onClick={handleMovieClick} />
                        ))}
                    </div>

                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} className="mt-8" />
                </main>
            </div>
        </ProtectedRoute>
    );
};

export default MovieRecsPage;
