import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MovieRecsPage from "../app/page";
import api from "@/lib/axios";

// mock axios
jest.mock("@/lib/axios");

// 👇 inline mock for next/navigation
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        prefetch: jest.fn(),
        back: jest.fn(),
    }),
    usePathname: () => "/",
    useSearchParams: () => new URLSearchParams(),
}));

const renderWithClient = (ui: React.ReactElement) => {
    const client = new QueryClient();
    return render(
        <QueryClientProvider client={client}>{ui}</QueryClientProvider>
    );
};

describe("MovieRecsPage", () => {
    it("shows shimmer while loading", async () => {
        (api.get as jest.Mock).mockReturnValue(new Promise(() => { })); // never resolves
        renderWithClient(<MovieRecsPage />);
        expect(screen.getByTestId("shimmer")).toBeInTheDocument();
    });

    it("renders movies when API succeeds", async () => {
        (api.get as jest.Mock).mockResolvedValue({
            data: { results: [{ id: 1, title: "Inception" }], total_pages: 500 },
        });

        renderWithClient(<MovieRecsPage />);
        expect(await screen.findByText("Inception")).toBeInTheDocument();
    });

    it("renders error page on failure", async () => {
        (api.get as jest.Mock).mockRejectedValue(new Error("API error"));

        renderWithClient(<MovieRecsPage />);
        expect(await screen.findByText(/sorry/i)).toBeInTheDocument();
    });

    it("updates movies when searching", async () => {
        (api.get as jest.Mock).mockResolvedValueOnce({
            data: { results: [{ id: 1, title: "Inception" }], total_pages: 500 },
        });

        (api.get as jest.Mock).mockResolvedValueOnce({
            data: { results: [{ id: 2, title: "Matrix" }], total_pages: 500 },
        });

        renderWithClient(<MovieRecsPage />);

        fireEvent.change(screen.getByPlaceholderText(/search/i), {
            target: { value: "Matrix" },
        });

        expect(await screen.findByText("Matrix")).toBeInTheDocument();
    });
});
