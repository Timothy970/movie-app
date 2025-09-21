import api from "@/lib/axios";
import { Movie } from "@/types/Movies";

// Extract the functions to a separate file (recommended for easier testing)
// e.g., src/services/movieService.ts
export const getMovies = async (page: number): Promise<Movie[]> => {
    const res = await api.get("/movie/popular", { params: { page } });
    return res.data.results;
};

export const searchMovies = async (query: string, page: number): Promise<Movie[]> => {
    const res = await api.get("/search/movie", { params: { query, page } });
    return res.data.results;
};
