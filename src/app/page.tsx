'use client';

import React, { useState } from "react";
import Header, { MainCategoryTab } from "@/components/header";
import MovieCard from "@/components/moviecard";
import Pagination from "@/components/pagination";
import MovieCardShimmer from "@/components/shimmeringcard";
import ErrorPage from "@/components/errorpage";
import { HeroBanner } from "@/components/herobanner";
import { GenrePills, GenreOption } from "@/components/genrepills";
import { QuickViewModal } from "@/components/quickviewmodal";

import { MediaItem } from "@/types/Media";
import {
    getMoviesByCategory,
    getTVShowsByCategory,
    getKidsContent,
    getTrendingAll,
    getMediaByGenre,
    searchMulti,
    getExternalIds,
} from "@/services/mediaService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Sparkles, TrendingUp, Tv, Film } from "lucide-react";

// Default Genres list matching mockups
const DEFAULT_GENRES: GenreOption[] = [
    { id: 'all', name: 'All Popular' },
    { id: 28, name: 'Action' },
    { id: 16, name: 'Animation' },
    { id: 12, name: 'Adventure' },
    { id: 27, name: 'Horror' },
    { id: 878, name: 'Sci-Fi' },
    { id: 10749, name: 'Romance' },
    { id: 10751, name: 'Kids' },
    { id: 35, name: 'Comedy' },
];

export default function HomePage() {
    const router = useRouter();

    // State
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<MainCategoryTab>("home");
    const [selectedGenreId, setSelectedGenreId] = useState<number | string>("all");
    const [currentPage, setCurrentPage] = useState(1);

    // Video Player state
    const [playingMedia, setPlayingMedia] = useState<MediaItem | null>(null);
    const [imdbId, setImdbId] = useState<string | null>(null);

    // Fetch Trending Hero & Trending Now items
    const { data: trendingItems = [] } = useQuery({
        queryKey: ["trending", "all"],
        queryFn: () => getTrendingAll("day"),
        staleTime: 1000 * 60 * 15,
    });

    // Fetch Trending Shows for home carousel
    const { data: trendingShowsData } = useQuery({
        queryKey: ["trendingShows", "popular"],
        queryFn: () => getTVShowsByCategory("popular", 1),
        enabled: activeTab === "home" && !searchQuery,
        staleTime: 1000 * 60 * 15,
    });

    // Fetch Trending Movies for home carousel
    const { data: trendingMoviesData } = useQuery({
        queryKey: ["trendingMovies", "popular"],
        queryFn: () => getMoviesByCategory("popular", 1),
        enabled: activeTab === "home" && !searchQuery,
        staleTime: 1000 * 60 * 15,
    });

    const trendingShows = trendingShowsData?.results || [];
    const trendingMovies = trendingMoviesData?.results || [];

    // Fetch Main Grid Media depending on Active Tab, Genre, or Search
    const {
        data: mediaData = { results: [], total_pages: 1 },
        isLoading,
        error,
        isFetching,
    } = useQuery<{ results: MediaItem[]; total_pages: number }>({
        queryKey: ["mediaGrid", activeTab, selectedGenreId, searchQuery, currentPage],
        queryFn: async () => {
            if (searchQuery.trim()) {
                return searchMulti(searchQuery, currentPage);
            }

            if (selectedGenreId !== "all") {
                const mediaType = activeTab === "series" ? "tv" : "movie";
                return getMediaByGenre(Number(selectedGenreId), mediaType, currentPage);
            }

            if (activeTab === "movies") {
                return getMoviesByCategory("popular", currentPage);
            }

            if (activeTab === "series") {
                return getTVShowsByCategory("popular", currentPage);
            }

            if (activeTab === "kids") {
                return getKidsContent(currentPage);
            }

            // Home tab default: Popular Movies catalog
            return getMoviesByCategory("popular", currentPage);
        },
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
    });

    // Handle "Watch Now" click
    const handleWatchNow = async (media: MediaItem) => {
        setPlayingMedia(media);
        const mediaType = media.media_type || (media.title ? 'movie' : 'tv');
        const extId = await getExternalIds(media.id.toString(), mediaType);
        setImdbId(extId);
    };

    // Handle "Details" click
    const handleDetails = (media: MediaItem) => {
        const isTV = media.media_type === 'tv' || (!media.title && !!media.name);
        if (isTV) {
            router.push(`/tvdetails/${media.id}`);
        } else {
            router.push(`/moviesdetails/${media.id}`);
        }
    };

    // Handle main navigation tab switch
    const handleTabChange = (tab: MainCategoryTab) => {
        setActiveTab(tab);
        setSelectedGenreId("all");
        setCurrentPage(1);
    };

    if (error) {
        return <ErrorPage />;
    }

    const { results: items = [], total_pages: totalPages = 1 } = mediaData;

    return (
        <div className="min-h-screen bg-[#08090d] text-white flex flex-col selection:bg-blue-500 selection:text-white">
            {/* Glassmorphic Navigation Header */}
            <Header
                searchQuery={searchQuery}
                onSearchChange={(q) => {
                    setSearchQuery(q);
                    setCurrentPage(1);
                }}
                showSearchBar={true}
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />

            <main className="max-w-7xl mx-auto px-6 py-6 w-full flex-1">
                {/* Hero Showcase (only on Home or empty search) */}
                {!searchQuery && activeTab === 'home' && trendingItems.length > 0 && (
                    <HeroBanner
                        items={trendingItems}
                        onWatchNow={handleWatchNow}
                        onDetails={handleDetails}
                    />
                )}

                {/* 1. Trending Now Carousel */}
                {!searchQuery && activeTab === 'home' && trendingItems.length > 1 && (
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-400" />
                                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                                    Trending Now
                                </h2>
                            </div>
                        </div>

                        <div className="flex gap-5 overflow-x-auto no-scrollbar pb-4 pt-1">
                            {trendingItems.slice(1, 9).map((item) => (
                                <div key={item.id} className="w-44 flex-shrink-0">
                                    <MovieCard movie={item} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 2. Trending Shows Carousel */}
                {!searchQuery && activeTab === 'home' && trendingShows.length > 0 && (
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Tv className="w-5 h-5 text-purple-400" />
                                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                                    Trending Shows
                                </h2>
                            </div>
                        </div>

                        <div className="flex gap-5 overflow-x-auto no-scrollbar pb-4 pt-1">
                            {trendingShows.slice(0, 10).map((item) => (
                                <div key={item.id} className="w-44 flex-shrink-0">
                                    <MovieCard movie={item} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. Trending Movies Carousel */}
                {!searchQuery && activeTab === 'home' && trendingMovies.length > 0 && (
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Film className="w-5 h-5 text-indigo-400" />
                                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                                    Trending Movies
                                </h2>
                            </div>
                        </div>

                        <div className="flex gap-5 overflow-x-auto no-scrollbar pb-4 pt-1">
                            {trendingMovies.slice(0, 10).map((item) => (
                                <div key={item.id} className="w-44 flex-shrink-0">
                                    <MovieCard movie={item} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. Explore Catalog Header & Genre Filter Pills */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl md:text-2xl font-bold text-white capitalize tracking-tight flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-400" />
                            {searchQuery
                                ? `Results for "${searchQuery}"`
                                : activeTab === 'series'
                                    ? 'Popular Series Catalog'
                                    : activeTab === 'kids'
                                        ? 'Kids Animation & Movies'
                                        : activeTab === 'movies'
                                            ? 'Popular Movies Catalog'
                                            : 'Explore Catalog'}
                        </h2>
                    </div>

                    {!searchQuery && (
                        <GenrePills
                            genres={DEFAULT_GENRES}
                            selectedGenreId={selectedGenreId}
                            onSelectGenre={(genreId) => {
                                setSelectedGenreId(genreId);
                                setCurrentPage(1);
                            }}
                        />
                    )}
                </div>

                {/* Main Media Grid */}
                {isLoading || isFetching ? (
                    <MovieCardShimmer />
                ) : items.length === 0 ? (
                    <div className="text-center py-20 glass-panel rounded-3xl border border-white/10">
                        <p className="text-gray-400 text-lg">No media titles found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
                        {items.map((item) => (
                            <MovieCard key={item.id} movie={item} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {items.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        className="mt-10 mb-8"
                    />
                )}
            </main>

            {/* Quick View Modal: shows details + player when Watch Now is clicked */}
            {playingMedia && (
                <QuickViewModal
                    media={playingMedia}
                    imdbId={imdbId}
                    onClose={() => setPlayingMedia(null)}
                />
            )}
        </div>
    );
}
