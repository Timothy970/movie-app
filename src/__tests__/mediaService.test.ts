import api from "@/lib/axios";
import {
    getMoviesByCategory,
    getTVShowsByCategory,
    getKidsContent,
    searchMulti,
    getTVDetails,
} from "@/services/mediaService";

jest.mock("@/lib/axios");

describe("Media service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("fetches popular movies by category", async () => {
        (api.get as jest.Mock).mockResolvedValue({
            data: { results: [{ id: 101, title: "Inception" }], total_pages: 5 },
        });

        const res = await getMoviesByCategory("popular", 1);
        expect(api.get).toHaveBeenCalledWith("/movie/popular", { params: { page: 1 } });
        expect(res.results).toEqual([{ id: 101, title: "Inception", media_type: "movie" }]);
        expect(res.total_pages).toBe(5);
    });

    it("fetches popular TV shows by category", async () => {
        (api.get as jest.Mock).mockResolvedValue({
            data: { results: [{ id: 202, name: "Stranger Things" }], total_pages: 10 },
        });

        const res = await getTVShowsByCategory("popular", 1);
        expect(api.get).toHaveBeenCalledWith("/tv/popular", { params: { page: 1 } });
        expect(res.results).toEqual([{ id: 202, name: "Stranger Things", media_type: "tv" }]);
    });

    it("fetches kids content", async () => {
        (api.get as jest.Mock).mockResolvedValue({
            data: { results: [{ id: 303, title: "Toy Story" }], total_pages: 3 },
        });

        const res = await getKidsContent(1);
        expect(api.get).toHaveBeenCalledWith("/discover/movie", {
            params: { page: 1, with_genres: "16,10751", sort_by: "popularity.desc" },
        });
        expect(res.results[0].title).toBe("Toy Story");
    });

    it("performs multi search for movies and tv shows", async () => {
        (api.get as jest.Mock).mockResolvedValue({
            data: {
                results: [
                    { id: 1, title: "Batman", media_type: "movie" },
                    { id: 2, name: "Batman Animated", media_type: "tv" },
                    { id: 3, name: "Person", media_type: "person" },
                ],
                total_pages: 1,
            },
        });

        const res = await searchMulti("Batman", 1);
        expect(api.get).toHaveBeenCalledWith("/search/multi", {
            params: { query: "Batman", page: 1 },
        });
        expect(res.results.length).toBe(2);
    });

    it("fetches TV show details", async () => {
        (api.get as jest.Mock).mockResolvedValue({
            data: { id: 202, name: "Stranger Things", number_of_seasons: 4 },
        });

        const details = await getTVDetails("202");
        expect(api.get).toHaveBeenCalledWith("/tv/202");
        expect(details.name).toBe("Stranger Things");
    });
});
