import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "../app/page";
import api from "@/lib/axios";

jest.mock("@/lib/axios");

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

jest.mock("next/image", () => ({
    __esModule: true,
    default: (props: React.ComponentProps<'img'>) => {
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        return <img {...props} src={typeof props.src === 'string' ? props.src : 'mock-img'} />;
    },
}));

jest.mock("@/context/AuthContext", () => ({
    useAuth: () => ({
        user: null,
        loading: false,
    }),
}));

const renderWithClient = (ui: React.ReactElement) => {
    const client = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return render(
        <QueryClientProvider client={client}>{ui}</QueryClientProvider>
    );
};

describe("HomePage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("shows shimmer while loading grid items", async () => {
        (api.get as jest.Mock).mockReturnValue(new Promise(() => { })); // never resolves
        renderWithClient(<HomePage />);
        expect(screen.getAllByTestId("shimmer").length).toBeGreaterThan(0);
    });

    it("renders movies when API succeeds", async () => {
        (api.get as jest.Mock).mockImplementation((url: string) => {
            if (url.includes("/trending")) {
                return Promise.resolve({ data: { results: [] } });
            }
            return Promise.resolve({
                data: { results: [{ id: 1, title: "Inception", media_type: "movie", vote_average: 8.8 }], total_pages: 10 },
            });
        });

        renderWithClient(<HomePage />);
        const items = await screen.findAllByText("Inception");
        expect(items.length).toBeGreaterThan(0);
    });

    it("renders error page on failure", async () => {
        (api.get as jest.Mock).mockRejectedValue(new Error("API error"));

        renderWithClient(<HomePage />);
        expect(await screen.findByText(/sorry/i)).toBeInTheDocument();
    });

    it("updates movies when searching", async () => {
        (api.get as jest.Mock).mockImplementation((url: string) => {
            if (url.includes("/trending")) {
                return Promise.resolve({ data: { results: [] } });
            }
            if (url.includes("/search/multi")) {
                return Promise.resolve({
                    data: { results: [{ id: 2, title: "Matrix", media_type: "movie", vote_average: 8.7 }], total_pages: 1 },
                });
            }
            return Promise.resolve({
                data: { results: [{ id: 1, title: "Inception", media_type: "movie", vote_average: 8.8 }], total_pages: 10 },
            });
        });

        renderWithClient(<HomePage />);

        const searchInput = screen.getByPlaceholderText(/search/i);
        fireEvent.change(searchInput, {
            target: { value: "Matrix" },
        });

        expect(await screen.findByText("Matrix")).toBeInTheDocument();
    });
});
