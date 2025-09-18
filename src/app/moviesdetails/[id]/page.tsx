"use client"
import React, { use, useState } from 'react';
import Header from '@/components/header';
import { BackButton } from '@/components/backbutton';
import { CastCarousel } from '@/components/castcarousel';
import { CastMember, MovieDetail } from '@/types/Movies';
import { BackdropImage } from '@/components/backdropimage';
import { MovieInfo } from '@/components/movieinfo';
import { useEffect } from 'react';
import { OneMovieData } from '@/data/mockdata';
import { CastData } from '@/data/mockdata';
import ProtectedRoute from '@/components/protectroute';
import api from '@/lib/axios';
// Mock movie data
async function getMovieDetails(id: string): Promise<MovieDetail> {
    console.log(id)
    const res = await api.get(`/${id}`);
    console.log("individual movie data****", res.data)
    return res.data
}
async function getMovieCastDetails(id: string): Promise<CastMember[]> {
    console.log(id)
    const res = await api.get(`/${id}/credits`);
    console.log("individual movie cast****", res.data.cast)
    return res.data.cast
}
// Main MovieDetail Page Component
export default function MovieDetailPageMovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [mockMovie, setMovie] = useState<MovieDetail | null>(null);
    const [mockCast, setCast] = useState<CastMember[] | []>([]);

    useEffect(() => {
        getMovieDetails(id).then(setMovie);
        getMovieCastDetails(id).then(setCast);
    }, [id]);

    const [searchQuery, setSearchQuery] = useState('');

    const handleBackClick = () => {
        console.log('Navigate back to movie list');
        // Handle navigation back to movie list
    };
    if (!mockMovie) return <div className="text-white p-6">Loading...</div>;

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <Header
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    showSearchBar={false}
                />

                <main className="max-w-7xl mx-auto px-6 py-8">
                    <BackButton onClick={handleBackClick} className="mb-6" />

                    <BackdropImage
                        src={`https://image.tmdb.org/t/p/original${mockMovie.backdrop_path}`}
                        alt={`${mockMovie.title} backdrop`}
                        className="mb-8"
                    />

                    <MovieInfo movie={mockMovie} className="mb-12" />

                    <CastCarousel cast={mockCast} />
                </main>
            </div>
        </ProtectedRoute>
    );
};
