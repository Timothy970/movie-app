import api from "@/lib/axios";
import { Genre, MediaItem, SeasonDetail, TVShowDetail } from "@/types/Media";
import { CastMember } from "@/types/Movies";

// Fetch Movies by category/endpoint
export const getMoviesByCategory = async (
    category: "popular" | "top_rated" | "now_playing" | "upcoming" = "popular",
    page: number = 1
): Promise<{ results: MediaItem[]; total_pages: number }> => {
    const res = await api.get(`/movie/${category}`, { params: { page } });
    return {
        results: res.data.results.map((item: MediaItem) => ({ ...item, media_type: "movie" as const })),
        total_pages: res.data.total_pages || 1,
    };
};

// Fetch TV Shows / Series by category
export const getTVShowsByCategory = async (
    category: "popular" | "top_rated" | "on_the_air" | "airing_today" = "popular",
    page: number = 1
): Promise<{ results: MediaItem[]; total_pages: number }> => {
    const res = await api.get(`/tv/${category}`, { params: { page } });
    return {
        results: res.data.results.map((item: MediaItem) => ({ ...item, media_type: "tv" as const })),
        total_pages: res.data.total_pages || 1,
    };
};

// Fetch Kids Content
export const getKidsContent = async (page: number = 1): Promise<{ results: MediaItem[]; total_pages: number }> => {
    const res = await api.get(`/discover/movie`, {
        params: {
            page,
            with_genres: "16,10751", // Animation, Family
            sort_by: "popularity.desc",
        },
    });
    return {
        results: res.data.results.map((item: MediaItem) => ({ ...item, media_type: "movie" as const })),
        total_pages: res.data.total_pages || 1,
    };
};

// Fetch Trending All (Movies & TV Shows)
export const getTrendingAll = async (timeWindow: "day" | "week" = "day"): Promise<MediaItem[]> => {
    const res = await api.get(`/trending/all/${timeWindow}`);
    return res.data.results;
};

// Fetch Genres
export const getGenres = async (mediaType: "movie" | "tv" = "movie"): Promise<Genre[]> => {
    const res = await api.get(`/genre/${mediaType}/list`);
    return res.data.genres;
};

// Discover Media by Genre
export const getMediaByGenre = async (
    genreId: number,
    mediaType: "movie" | "tv" = "movie",
    page: number = 1
): Promise<{ results: MediaItem[]; total_pages: number }> => {
    const res = await api.get(`/discover/${mediaType}`, {
        params: {
            with_genres: genreId,
            page,
            sort_by: "popularity.desc",
        },
    });
    return {
        results: res.data.results.map((item: MediaItem) => ({ ...item, media_type: mediaType })),
        total_pages: res.data.total_pages || 1,
    };
};

// Multi Search (Movies & TV Shows)
export const searchMulti = async (query: string, page: number = 1): Promise<{ results: MediaItem[]; total_pages: number }> => {
    if (!query.trim()) return { results: [], total_pages: 1 };
    const res = await api.get(`/search/multi`, { params: { query, page } });
    const filteredResults = res.data.results.filter(
        (item: MediaItem) => item.media_type === "movie" || item.media_type === "tv"
    );
    return {
        results: filteredResults,
        total_pages: res.data.total_pages || 1,
    };
};

// Get TV Show Details
export const getTVDetails = async (id: string): Promise<TVShowDetail> => {
    const res = await api.get(`/tv/${id}`);
    return res.data;
};

// Get TV Show Cast / Credits
export const getTVCastDetails = async (id: string): Promise<CastMember[]> => {
    const res = await api.get(`/tv/${id}/credits`);
    return res.data.cast;
};

// Get Season Details (Episodes list)
export const getSeasonDetails = async (tvId: string, seasonNumber: number): Promise<SeasonDetail> => {
    const res = await api.get(`/tv/${tvId}/season/${seasonNumber}`);
    return res.data;
};

// Fetch IMDb ID for Movies or TV Shows
export const getExternalIds = async (id: string, mediaType: "movie" | "tv"): Promise<string | null> => {
    try {
        const res = await api.get(`/${mediaType}/${id}/external_ids`);
        return res.data.imdb_id || null;
    } catch {
        return null;
    }
};
