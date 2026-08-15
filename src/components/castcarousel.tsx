'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { CastCarouselProps } from '@/types/Movies';
import { CastCard } from './castcard';

export const CastCarousel: React.FC<CastCarouselProps> = ({ cast, className = '' }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 240;
            const newScrollLeft = scrollContainerRef.current.scrollLeft +
                (direction === 'left' ? -scrollAmount : scrollAmount);

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    if (!cast || cast.length === 0) return null;

    return (
        <div className={className}>
            <h3 className="text-xl font-bold text-white mb-4 tracking-tight">Cast</h3>

            <div className="relative group">
                {/* Left Arrow */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/10 hover:bg-white hover:text-black transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-xl"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Cast Cards Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-4 overflow-x-auto no-scrollbar py-1"
                >
                    {cast.map((member) => (
                        <CastCard key={member.id} castMember={member} />
                    ))}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/10 hover:bg-white hover:text-black transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-xl"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};