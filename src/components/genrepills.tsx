'use client';

import React from 'react';

export interface GenreOption {
    id: number | string;
    name: string;
}

interface GenrePillsProps {
    genres: GenreOption[];
    selectedGenreId: number | string;
    onSelectGenre: (genreId: number | string) => void;
}

export const GenrePills: React.FC<GenrePillsProps> = ({
    genres,
    selectedGenreId,
    onSelectGenre,
}) => {
    return (
        <div className="w-full overflow-x-auto no-scrollbar py-2 mb-8">
            <div className="flex items-center gap-3 min-w-max">
                {genres.map((genre) => {
                    const isActive = selectedGenreId === genre.id;
                    return (
                        <button
                            key={genre.id}
                            onClick={() => onSelectGenre(genre.id)}
                            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${isActive
                                    ? 'bg-white text-black shadow-lg shadow-white/20 scale-105'
                                    : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/15 hover:border-white/20 hover:text-white'
                                }`}
                        >
                            {genre.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
