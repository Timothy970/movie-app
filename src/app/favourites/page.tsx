'use client'
import React, { useState, useMemo } from "react";
import Header from "@/components/header";
import MovieCard from "@/components/moviecard";
import { Movie } from "@/types/Movies";
import ProtectedRoute from "@/components/protectroute";
import MovieCardShimmer from "@/components/shimmeringcard";
import ErrorPage from "@/components/errorpage";
import { useQuery } from "@tanstack/react-query";
import { getUserfavourites } from "@/lib/favourites"; // <-- adjust path if needed
import { useAuth } from "@/context/AuthContext"; // <-- your auth context/hook
import Pagination from "@/components/pagination";
import { BackButton } from "@/components/backbutton";
import { useRouter } from "next/navigation";
const FavouritesPage: React.FC = () => {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12; // movies per page
    const router = useRouter()
    const {
        data: favourites = [],
        isLoading,
        error,
    } = useQuery<Movie[]>({
        queryKey: ["favourites", user?.uid],
        queryFn: () => getUserfavourites(user!.uid),
        enabled: !!user?.uid,
        staleTime: 1000 * 60 * 5,
    });

    // Filter by search query
    const filteredMovies = useMemo(() => {
        if (!searchQuery) return favourites;
        return favourites.filter((movie) =>
            movie.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [favourites, searchQuery]);

    // Pagination
    const totalPages = Math.ceil(filteredMovies.length / pageSize);
    const paginatedMovies = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredMovies.slice(start, start + pageSize);
    }, [filteredMovies, currentPage]);

    if (error) {
        return <ErrorPage />;
    }
    const handleBackClick = () => {
        router.back()
    };
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <Header
                    searchQuery={searchQuery}
                    onSearchChange={(val) => {
                        setSearchQuery(val);
                        setCurrentPage(1); // reset to page 1 on new search
                    }}
                    showSearchBar={true}
                />

                <main className="max-w-7xl mx-auto px-6 py-8">
                    <BackButton onClick={handleBackClick} className="mb-6" />
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            My Favourite Movies
                        </h1>
                    </div>

                    {isLoading ? (
                        <MovieCardShimmer />
                    ) : filteredMovies.length === 0 ? (
                        <p className="text-gray-600">
                            {searchQuery
                                ? "No favourites match your search."
                                : "You have no favourite movies yet."}
                        </p>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                                {paginatedMovies.map((movie) => (
                                    <MovieCard key={movie.id} movie={movie} />
                                ))}
                            </div>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                className="mt-8"
                            />
                        </>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
};

export default FavouritesPage;
