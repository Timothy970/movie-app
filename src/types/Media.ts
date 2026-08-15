export type MediaType = 'movie' | 'tv';

export interface Genre {
    id: number;
    name: string;
}

export interface MediaItem {
    id: number;
    title?: string;          // For Movies
    name?: string;           // For TV Shows
    original_title?: string;
    original_name?: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    media_type?: MediaType;
    genre_ids?: number[];
    release_date?: string;   // For Movies
    first_air_date?: string; // For TV Shows
    vote_average: number;
    vote_count: number;
    popularity: number;
    adult?: boolean;
}

export interface TVShowDetail {
    id: number;
    name: string;
    original_name: string;
    overview: string;
    backdrop_path: string | null;
    poster_path: string | null;
    first_air_date: string;
    last_air_date?: string;
    genres: Genre[];
    homepage: string | null;
    in_production: boolean;
    languages: string[];
    number_of_episodes: number;
    number_of_seasons: number;
    origin_country: string[];
    original_language: string;
    popularity: number;
    status: string;
    tagline: string | null;
    vote_average: number;
    vote_count: number;
    seasons: {
        id: number;
        name: string;
        overview: string;
        poster_path: string | null;
        season_number: number;
        episode_count: number;
        air_date?: string;
    }[];
}

export interface Episode {
    id: number;
    name: string;
    overview: string;
    episode_number: number;
    season_number: number;
    still_path: string | null;
    air_date: string;
    vote_average: number;
    runtime?: number;
}

export interface SeasonDetail {
    _id: string;
    air_date: string;
    episodes: Episode[];
    name: string;
    overview: string;
    id: number;
    poster_path: string | null;
    season_number: number;
}
