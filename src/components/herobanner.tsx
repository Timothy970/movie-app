'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Info, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaItem } from '@/types/Media';

interface HeroBannerProps {
    items: MediaItem[];
    onWatchNow: (media: MediaItem) => void;
    onDetails: (media: MediaItem) => void;
    autoPlayInterval?: number; // In milliseconds (default: 6000ms)
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
    items,
    onWatchNow,
    onDetails,
    autoPlayInterval = 6000,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Limit hero banners to top 6 trending items
    const heroItems = items.slice(0, 6);

    // Auto-switch slide interval
    useEffect(() => {
        if (!heroItems.length || isHovered) return;

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % heroItems.length);
        }, autoPlayInterval);

        return () => clearInterval(timer);
    }, [heroItems.length, autoPlayInterval, isHovered]);

    if (!heroItems.length) return null;

    const currentMedia = heroItems[currentIndex] || heroItems[0];
    const title = currentMedia.title || currentMedia.name || 'Featured Title';
    const backdropUrl = currentMedia.backdrop_path
        ? `https://image.tmdb.org/t/p/original${currentMedia.backdrop_path}`
        : currentMedia.poster_path
            ? `https://image.tmdb.org/t/p/original${currentMedia.poster_path}`
            : '/placeholder-backdrop.jpg';

    const year = (currentMedia.release_date || currentMedia.first_air_date || '').slice(0, 4);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? heroItems.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % heroItems.length);
    };

    return (
        <div
            className="relative w-full h-[68vh] min-h-[460px] max-h-[680px] rounded-3xl overflow-hidden mb-10 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Backdrop Image with Smooth Key Fade */}
            <div key={currentMedia.id} className="absolute inset-0 w-full h-full transition-opacity duration-700 animate-fade-in">
                <Image
                    src={backdropUrl}
                    alt={title}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                />
            </div>

            {/* Gradient Overlays for Cinematic Dark Look */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-[#08090d]/50 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#08090d] via-[#08090d]/70 to-transparent w-full md:w-3/4"></div>

            {/* Banner Metadata & Content */}
            <div key={`content-${currentMedia.id}`} className="absolute bottom-0 left-0 p-8 md:p-14 max-w-2xl z-10 animate-fade-in">
                {/* Floating Rating Badge */}
                <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-semibold border border-yellow-500/30 backdrop-blur-md">
                        <Star className="w-3.5 h-3.5 fill-yellow-400" />
                        {currentMedia.vote_average ? currentMedia.vote_average.toFixed(1) : 'N/A'}
                    </span>
                    {year && (
                        <span className="px-3 py-1 rounded-full bg-white/10 text-gray-300 text-xs font-medium border border-white/10 backdrop-blur-md">
                            {year}
                        </span>
                    )}
                    <span className="px-3 py-1 rounded-full bg-blue-600/30 text-blue-300 text-xs font-medium border border-blue-500/30 backdrop-blur-md uppercase">
                        {currentMedia.media_type === 'tv' ? 'Series' : 'Movie'}
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-md">
                    {title}
                </h1>

                {/* Description */}
                <p className="text-gray-300 text-sm md:text-base line-clamp-3 mb-8 leading-relaxed font-normal">
                    {currentMedia.overview || 'Experience the thrilling story and exciting adventures in this featured release.'}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4">
                    <button
                        onClick={() => onWatchNow(currentMedia)}
                        className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-white/20"
                    >
                        <Play className="w-4 h-4 fill-black" />
                        <span>Watch Now</span>
                    </button>

                    <button
                        onClick={() => onDetails(currentMedia)}
                        className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 text-white font-medium text-sm border border-white/20 backdrop-blur-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                    >
                        <span>Details</span>
                        <Info className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Slider Navigation Controls (Left & Right Arrows) */}
            <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/10 opacity-0 group-hover:opacity-100 hover:bg-white hover:text-black transition-all duration-300"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/10 opacity-0 group-hover:opacity-100 hover:bg-white hover:text-black transition-all duration-300"
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Indicator Dots */}
            <div className="absolute bottom-6 right-8 z-20 flex items-center gap-2">
                {heroItems.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                ? 'w-8 bg-white shadow-lg shadow-white/40'
                                : 'w-2 bg-white/30 hover:bg-white/60'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};
