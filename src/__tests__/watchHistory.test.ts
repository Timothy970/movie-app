import {
    getWatchHistory,
    saveWatchItem,
    removeWatchItem,
    clearWatchHistory,
} from "@/lib/watchHistory";

describe("Watch History Utility", () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    it("saves and retrieves a watch item", () => {
        saveWatchItem({
            id: 101,
            mediaType: "movie",
            title: "Inception",
            posterPath: "/inception.jpg",
        });

        const history = getWatchHistory();
        expect(history.length).toBe(1);
        expect(history[0].id).toBe(101);
        expect(history[0].title).toBe("Inception");
    });

    it("removes a specific watch item", () => {
        saveWatchItem({
            id: 101,
            mediaType: "movie",
            title: "Inception",
        });
        saveWatchItem({
            id: 202,
            mediaType: "tv",
            title: "Breaking Bad",
            season: 1,
            episode: 1,
        });

        removeWatchItem(101, "movie");
        const history = getWatchHistory();
        expect(history.length).toBe(1);
        expect(history[0].id).toBe(202);
    });

    it("clears all watch history", () => {
        saveWatchItem({
            id: 101,
            mediaType: "movie",
            title: "Inception",
        });
        clearWatchHistory();
        expect(getWatchHistory()).toEqual([]);
    });
});
