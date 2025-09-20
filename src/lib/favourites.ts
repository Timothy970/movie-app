import { createClient } from "@supabase/supabase-js";
import { Movie } from "../types/Movies";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const addFavorite = async (userId: string, movie: Movie) => {
    const { error } = await supabase.from("favourites").insert({
        user_id: userId,
        movie_id: movie.id,
        movie,
    });
    if (error) throw error;
};

export const removeFavorite = async (userId: string, movieId: number) => {
    const { error } = await supabase
        .from("favourites")
        .delete()
        .match({ user_id: userId, movie_id: movieId });
    if (error) throw error;
};

export const isFavorite = async (userId: string, movieId: number) => {
    const { data, error } = await supabase
        .from("favourites")
        .select("id")
        .match({ user_id: userId, movie_id: movieId })
        .single();

    if (error && error.code !== "PGRST116") throw error; // not found error
    return !!data;
};

export const getUserfavourites = async (userId: string) => {
    const { data, error } = await supabase
        .from("favourites")
        .select("movie")
        .match({ user_id: userId });
    if (error) throw error;

    return data.map((row) => row.movie as Movie);
};
