// import { getMovies, searchMovies } from "@/services/movieservice";
import api from "@/lib/axios";
import { getMovies, searchMovies } from "@/services/movieservice";

jest.mock("@/lib/axios");

describe("Movie service", () => {
    it("fetches popular movies", async () => {
        (api.get as jest.Mock).mockResolvedValue({
            data: { results: [{ id: 1, title: "Inception" }] },
        });

        const movies = await getMovies(1);
        expect(api.get).toHaveBeenCalledWith("/movie/popular", { params: { page: 1 } });
        expect(movies).toEqual([{ id: 1, title: "Inception" }]);
    });

    it("fetches searched movies", async () => {
        (api.get as jest.Mock).mockResolvedValue({
            data: { results: [{ id: 2, title: "Matrix" }] },
        });

        const movies = await searchMovies("Matrix", 1);
        expect(api.get).toHaveBeenCalledWith("/search/movie", {
            params: { query: "Matrix", page: 1 },
        });
        expect(movies).toEqual([{ id: 2, title: "Matrix" }]);
    });
});
