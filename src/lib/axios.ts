import axios from "axios";

const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY

const api = axios.create({
    baseURL: "https://api.themoviedb.org/3/movie",
    params: {
        api_key: apiKey,
        language: "en-US",
    },
});

export default api;
