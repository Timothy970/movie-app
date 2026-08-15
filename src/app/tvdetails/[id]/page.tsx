'use client';

import React, { use, useState } from "react";
import Header from "@/components/header";
import { BackButton } from "@/components/backbutton";
import { CastCarousel } from "@/components/castcarousel";
import { CastMember } from "@/types/Movies";
import { SeasonDetail, TVShowDetail } from "@/types/Media";
import { VideoPlayer } from "@/components/videoplayer";
import {
    getTVDetails,
    getTVCastDetails,
    getSeasonDetails,
    getExternalIds,
} from "@/services/mediaService";
import { useQuery } from "@tanstack/react-query";
import LoadingBubbles from "@/components/loadingbubbles";
import ErrorPage from "@/components/errorpage";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, Film, Star, Tv, Play } from "lucide-react";

export default function TVDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();

    const [selectedSeason, setSelectedSeason] = useState<number>(1);
    const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
    // Default to false so player does NOT play immediately on page load
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    // Fetch TV Show Details
    const {
        data: show,
        isLoading: showLoading,
        error: showError,
    } = useQuery<TVShowDetail>({
        queryKey: ["tv", id],
        queryFn: () => getTVDetails(id),
        enabled: !!id,
    });

    // Fetch Cast Details
    const { data: cast = [] } = useQuery<CastMember[]>({
        queryKey: ["tv", id, "cast"],
        queryFn: () => getTVCastDetails(id),
        enabled: !!id,
    });

    // Fetch Season details for episodes list
    const { data: seasonData } = useQuery<SeasonDetail>({
        queryKey: ["tv", id, "season", selectedSeason],
        queryFn: () => getSeasonDetails(id, selectedSeason),
        enabled: !!id,
    });

    // Fetch IMDb ID for VidAPI fallback
    const { data: imdbId } = useQuery<string | null>({
        queryKey: ["tv", id, "imdbId"],
        queryFn: () => getExternalIds(id, "tv"),
        enabled: !!id,
    });

    const handleBackClick = () => {
        router.back();
    };

    if (showLoading) return <LoadingBubbles />;
    if (showError || !show) return <ErrorPage />;

    const episodes = seasonData?.episodes || [];
    const backdropUrl = show.backdrop_path
        ? `https://image.tmdb.org/t/p/original${show.backdrop_path}`
        : show.poster_path
            ? `https://image.tmdb.org/t/p/original${show.poster_path}`
            : '/placeholder-backdrop.jpg';

    const handleEpisodeClick = (epNum: number) => {
        setSelectedEpisode(epNum);
        setIsPlaying(true);
    };

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

                {/* Video Player Stream or Hero Backdrop */}
                {isPlaying ? (
                    <div className="mb-8 animate-fade-in">
                        <VideoPlayer
                            mediaId={show.id}
                            mediaType="tv"
                            imdbId={imdbId}
                            season={selectedSeason}
                            episode={selectedEpisode}
                            title={`${show.name} - Season ${selectedSeason} Episode ${selectedEpisode}`}
                            inline={true}
                        />
                    </div>
                ) : (
                    <div className="relative w-full h-[52vh] min-h-[380px] max-h-[580px] rounded-3xl overflow-hidden mb-8 group border border-white/10 shadow-2xl">
                        <Image
                            src={backdropUrl}
                            alt={show.name}
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
                            <h2 className="text-2xl md:text-3xl font-black text-white drop-shadow-md mb-2">{show.name}</h2>
                            <p className="text-xs md:text-sm text-gray-300 max-w-xl line-clamp-2">Select a season and episode below to start streaming.</p>
                        </div>
                    </div>
                )}

                {/* Season & Episode Selector Bar */}
                <div className="glass-panel rounded-3xl p-6 mb-8 border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Tv className="w-5 h-5 text-blue-400" />
                        <span>Select Season & Episode</span>
                    </h3>

                    {/* Season Selector Tabs */}
                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar mb-6 pb-2">
                        {show.seasons?.filter(s => s.season_number > 0).map((season) => {
                            const isSelected = selectedSeason === season.season_number;
                            return (
                                <button
                                    key={season.id}
                                    onClick={() => {
                                        setSelectedSeason(season.season_number);
                                        setSelectedEpisode(1);
                                    }}
                                    className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${isSelected
                                            ? 'bg-white text-black shadow-lg shadow-white/20 scale-105'
                                            : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/15'
                                        }`}
                                >
                                    Season {season.season_number}
                                </button>
                            );
                        })}
                    </div>

                    {/* Episode Selector Buttons */}
                    {episodes.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                            {episodes.map((ep) => {
                                const isEpSelected = selectedEpisode === ep.episode_number;
                                return (
                                    <button
                                        key={ep.id}
                                        onClick={() => handleEpisodeClick(ep.episode_number)}
                                        className={`p-3 rounded-xl text-left border transition-all duration-200 ${isEpSelected
                                                ? 'bg-blue-600/30 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                                                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="text-xs font-bold text-gray-400">Ep {ep.episode_number}</div>
                                        <div className="text-xs font-semibold text-white truncate mt-0.5">{ep.name}</div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">Loading episode list...</p>
                    )}
                </div>

                {/* Details & Overview Card */}
                <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 mb-10">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Poster */}
                        <div className="flex-shrink-0 mx-auto md:mx-0">
                            <div className="relative w-56 h-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                                <Image
                                    src={show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : '/placeholder-poster.jpg'}
                                    alt={show.name}
                                    fill
                                    sizes="224px"
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Details Info */}
                        <div className="flex-1">
                            <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight mb-2">
                                {show.name} <span className="text-gray-400 font-normal">({(show.first_air_date || '').slice(0, 4)})</span>
                            </h1>

                            {/* Genres */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {show.genres?.map((genre) => (
                                    <span
                                        key={genre.id}
                                        className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-medium"
                                    >
                                        {genre.name}
                                    </span>
                                ))}
                            </div>

                            {/* Metadata Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 mb-6 text-sm">
                                <div>
                                    <span className="text-gray-400 text-xs flex items-center gap-1 mb-1">
                                        <Tv className="w-3.5 h-3.5 text-blue-400" /> Seasons
                                    </span>
                                    <span className="text-white font-semibold">{show.number_of_seasons}</span>
                                </div>

                                <div>
                                    <span className="text-gray-400 text-xs flex items-center gap-1 mb-1">
                                        <Film className="w-3.5 h-3.5 text-blue-400" /> Episodes
                                    </span>
                                    <span className="text-white font-semibold">{show.number_of_episodes}</span>
                                </div>

                                <div>
                                    <span className="text-gray-400 text-xs flex items-center gap-1 mb-1">
                                        <Calendar className="w-3.5 h-3.5 text-blue-400" /> First Air Date
                                    </span>
                                    <span className="text-white font-semibold">{show.first_air_date || 'N/A'}</span>
                                </div>

                                <div>
                                    <span className="text-gray-400 text-xs mb-1 block">Rating</span>
                                    <div className="flex items-center gap-1 text-yellow-400 font-bold">
                                        <Star className="w-4 h-4 fill-yellow-400" />
                                        <span>{show.vote_average ? show.vote_average.toFixed(1) : 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Overview */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">Description</h3>
                                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                                    {show.overview || 'No description available for this series.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cast Carousel */}
                {cast.length > 0 && (
                    <CastCarousel cast={cast} className="mb-10" />
                )}
            </main>
        </div>
    );
}
