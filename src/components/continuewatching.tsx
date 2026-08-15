'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Trash2, Clock, History, X } from 'lucide-react';
import { getWatchHistory, removeWatchItem, clearWatchHistory, WatchItem } from '@/lib/watchHistory';
import { MediaItem } from '@/types/Media';

interface ContinueWatchingProps {
    onWatchNow?: (media: MediaItem) => void;
    onDetails?: (media: MediaItem) => void;
}

export const ContinueWatching: React.FC<ContinueWatchingProps> = ({ onWatchNow, onDetails }) => {
    const [items, setItems] = useState<WatchItem[]>([]);

    const loadHistory = () => {
        setItems(getWatchHistory());
    };

    useEffect(() => {
        loadHistory();
        const handleUpdate = () => loadHistory();
        window.addEventListener('watchHistoryUpdated', handleUpdate);
        return () => window.removeEventListener('watchHistoryUpdated', handleUpdate);
    }, []);

    const handleRemove = (e: React.MouseEvent, item: WatchItem) => {
        e.preventDefault();
        e.stopPropagation();
        removeWatchItem(item.id, item.mediaType);
    };

    const handleClearAll = () => {
        clearWatchHistory();
    };

    const handleItemClick = (item: WatchItem) => {
        const media: MediaItem = {
            id: item.id,
            title: item.title,
            name: item.title,
            poster_path: item.posterPath ?? null,
            backdrop_path: item.backdropPath ?? null,
            media_type: item.mediaType,
            vote_average: item.voteAverage ?? 0,
            overview: item.overview ?? '',
            vote_count: 0,
            popularity: 0,
        };

        if (onWatchNow) {
            onWatchNow(media);
        } else if (onDetails) {
            onDetails(media);
        }
    };

    // If no watch history, display nothing
    if (items.length === 0) {
        return null;
    }

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-blue-400" />
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                        Continue Watching ({items.length})
                    </h2>
                </div>
                <button
                    onClick={handleClearAll}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 text-gray-400 hover:text-red-400 text-xs font-medium transition-all"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear History</span>
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {items.map((item) => {
                    const posterUrl = item.posterPath
                        ? `https://image.tmdb.org/t/p/w500${item.posterPath}`
                        : '/placeholder-poster.jpg';
                    const isTV = item.mediaType === 'tv';
                    const targetLink = isTV ? `/tvdetails/${item.id}` : `/moviesdetails/${item.id}`;

                    return (
                        <div
                            key={`${item.mediaType}-${item.id}`}
                            className="group relative rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-blue-500/40 transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer flex flex-col"
                            onClick={() => handleItemClick(item)}
                        >
                            {/* Remove button (X icon) */}
                            <button
                                onClick={(e) => handleRemove(e, item)}
                                className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-black/70 backdrop-blur-md text-gray-400 hover:text-white hover:bg-red-500/80 opacity-0 group-hover:opacity-100 transition-all duration-200 border border-white/10"
                                title="Remove from watch history"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>

                            {/* Badge */}
                            <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-gray-200 border border-white/10 uppercase">
                                {isTV && item.season && item.episode ? `S${item.season} E${item.episode}` : isTV ? 'Series' : 'Movie'}
                            </div>

                            {/* Poster container */}
                            <div className="relative aspect-[2/3] w-full bg-gray-900 overflow-hidden">
                                <Image
                                    src={posterUrl}
                                    alt={item.title}
                                    fill
                                    sizes="(max-width: 640px) 100vw, 25vw"
                                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                />

                                {/* Play Overlay */}
                                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-xl shadow-blue-600/40">
                                        <Play className="w-5 h-5 fill-white ml-0.5" />
                                    </div>
                                </div>

                                {/* Simulated Progress Bar at bottom of poster */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/60">
                                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 w-3/4 rounded-r-full shadow-sm"></div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-3.5 bg-gradient-to-b from-[#12141f]/90 to-[#0c0e17] flex-1 flex flex-col justify-between">
                                <h3 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors mb-1">
                                    {item.title}
                                </h3>
                                <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium">
                                    <span className="flex items-center gap-1 text-blue-300">
                                        <Clock className="w-3 h-3" />
                                        Resume
                                    </span>
                                    <Link
                                        href={targetLink}
                                        onClick={(e) => e.stopPropagation()}
                                        className="hover:underline text-gray-400 hover:text-white"
                                    >
                                        Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
