'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Film, Tv, Star } from 'lucide-react';
import { SearchSuggestionItem } from '@/services/mediaService';

interface SearchSuggestionsProps {
    suggestions: SearchSuggestionItem[];
    loading: boolean;
    isOpen: boolean;
    onSelectSuggestion: () => void;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
    suggestions,
    loading,
    isOpen,
    onSelectSuggestion,
}) => {
    if (!isOpen) return null;

    if (loading) {
        return (
            <div className="absolute left-0 right-0 top-full mt-2 bg-[#0c0d14]/95 border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-xl z-50 animate-fade-in">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span>Searching titles...</span>
                </div>
            </div>
        );
    }

    if (suggestions.length === 0) return null;

    return (
        <div className="absolute left-0 right-0 top-full mt-2 bg-[#0c0d14]/95 border border-white/15 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl z-50 animate-fade-in max-h-[380px] overflow-y-auto divide-y divide-white/5">
            <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-white/5 flex justify-between items-center">
                <span>Suggestions</span>
                <span className="text-blue-400 text-[9px] font-normal">Real-Time Autocomplete</span>
            </div>
            {suggestions.map((item) => {
                const detailsUrl = item.media_type === 'tv' ? `/tvdetails/${item.id}` : `/moviesdetails/${item.id}`;
                return (
                    <Link
                        key={`${item.media_type}-${item.id}`}
                        href={detailsUrl}
                        onClick={onSelectSuggestion}
                        className="flex items-center gap-3 p-2.5 hover:bg-white/10 transition-colors group"
                    >
                        {/* Poster Thumbnail */}
                        <div className="relative w-10 h-14 bg-gray-900 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                            {item.poster_path ? (
                                <Image
                                    src={item.poster_path}
                                    alt={item.title}
                                    fill
                                    sizes="40px"
                                    className="object-cover group-hover:scale-105 transition-transform"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600">
                                    <Film className="w-4 h-4" />
                                </div>
                            )}
                        </div>

                        {/* Title & Info */}
                        <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                                {item.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
                                <span className="flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold text-gray-300">
                                    {item.media_type === 'tv' ? <Tv className="w-3 h-3 text-purple-400" /> : <Film className="w-3 h-3 text-blue-400" />}
                                    {item.media_type}
                                </span>
                                {item.year && <span>{item.year}</span>}
                                {item.rating && (
                                    <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                                        <Star className="w-3 h-3 fill-amber-400" />
                                        {item.rating}
                                    </span>
                                )}
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};
