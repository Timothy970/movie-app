
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { CastCarouselProps } from '@/types/Movies';
import { CastCard } from './castcard';

export const CastCarousel: React.FC<CastCarouselProps> = ({ cast, className = '' }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200;
            const newScrollLeft = scrollContainerRef.current.scrollLeft +
                (direction === 'left' ? -scrollAmount : scrollAmount);

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className={className}>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Cast</h3>

            <div className="relative">
                {/* Left Arrow */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-50 transition-colors duration-200"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>

                {/* Cast Cards Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide px-8"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {cast.map((member) => (
                        <CastCard key={member.id} castMember={member} />
                    ))}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-50 transition-colors duration-200"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
            </div>
        </div>
    );
};