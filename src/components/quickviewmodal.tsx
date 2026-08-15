'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Star, Info, Calendar, Film, Tv } from 'lucide-react';
import { VideoPlayer } from '@/components/videoplayer';
import { MediaItem } from '@/types/Media';

interface QuickViewModalProps {
    media: MediaItem;
    imdbId?: string | null;
    onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ media, imdbId, onClose }) => {
    const isTV = media.media_type === 'tv' || (!media.title && !!media.name);
    const title = media.title || media.name || 'Untitled';
    const year = (media.release_date || media.first_air_date || '').slice(0, 4);
    const rating = media.vote_average ? media.vote_average.toFixed(1) : 'N/A';
    const detailsLink = isTV ? `/tvdetails/${media.id}` : `/moviesdetails/${media.id}`;

    const posterUrl = media.poster_path
        ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
        : null;

    // Lock body scroll while modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    // Close on backdrop click
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xl"
            style={{ animation: 'fadeIn 0.25s ease forwards' }}
            onClick={handleBackdropClick}
        >
            <div
                className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0e1017] border border-white/10 shadow-2xl shadow-black/60"
                style={{ animation: 'fadeInUp 0.3s ease forwards' }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all duration-200 hover:rotate-90"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col lg:flex-row gap-0">

                    {/* ── LEFT: Poster + meta ── */}
                    <div className="flex-shrink-0 lg:w-72 xl:w-80">
                        {/* Poster */}
                        <div className="relative w-full aspect-[2/3] lg:rounded-tl-3xl lg:rounded-bl-3xl overflow-hidden bg-gray-900">
                            {posterUrl ? (
                                <Image
                                    src={posterUrl}
                                    alt={title}
                                    fill
                                    sizes="320px"
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                                    <Film className="w-16 h-16" />
                                </div>
                            )}
                            {/* Gradient fade to the right side on desktop */}
                            <div className="hidden lg:block absolute inset-y-0 right-0 w-12 bg-gradient-to-r from-transparent to-[#0e1017]" />
                            {/* Type badge */}
                            <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold tracking-widest text-white border border-white/10 uppercase">
                                {isTV ? 'Series' : 'Movie'}
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: Info + Player ── */}
                    <div className="flex-1 flex flex-col p-6 md:p-8 min-w-0">

                        {/* Title */}
                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2 pr-8">
                            {title}
                        </h2>

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-3 mb-5">
                            {year && (
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-medium">
                                    <Calendar className="w-3 h-3 text-blue-400" />
                                    {year}
                                </span>
                            )}
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold">
                                <Star className="w-3 h-3 fill-yellow-400" />
                                {rating}
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/20 text-blue-300 text-xs font-medium">
                                {isTV ? <Tv className="w-3 h-3" /> : <Film className="w-3 h-3" />}
                                {isTV ? 'TV Series' : 'Movie'}
                            </span>
                        </div>

                        {/* Overview */}
                        {media.overview && (
                            <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-4">
                                {media.overview}
                            </p>
                        )}

                        {/* Details page link */}
                        <Link
                            href={detailsLink}
                            onClick={onClose}
                            className="self-start flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors mb-6 font-medium"
                        >
                            <Info className="w-3.5 h-3.5" />
                            Full details, cast & more
                        </Link>

                        {/* Divider */}
                        <div className="border-t border-white/8 mb-6" />

                        {/* Video Player — user must click play inside the player */}
                        <div className="w-full">
                            <VideoPlayer
                                mediaId={media.id}
                                mediaType={isTV ? 'tv' : 'movie'}
                                imdbId={imdbId}
                                title={title}
                                posterPath={media.poster_path}
                                inline={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
