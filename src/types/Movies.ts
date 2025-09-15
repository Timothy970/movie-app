export interface Movie {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string
    popularity: number;
    poster_path: string
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export interface Actor {
    id: number;
    name: string;
    character: string;
    picture: string;
}

// export interface MovieDetail {
//     id: string;
//     title: string;
//     year: number;
//     rating: number;
//     overview: string;
//     backdrop: string;
//     poster: string;
//     cast: Actor[];
// }
export interface BackButtonProps {
    onClick: () => void;
    className?: string;
}
// CastCarousel Component
export interface CastCarouselProps {
    cast: CastMember[];
    className?: string;
}
// CastCard Component
export interface CastCardProps {
    castMember: CastMember;
    className?: string;
}

export interface MovieDetail {
    adult: boolean;
    backdrop_path: string | null;
    belongs_to_collection?: {
        id: number;
        name: string;
        poster_path: string | null;
        backdrop_path: string | null;
    };
    budget: number;
    genres: {
        id: number;
        name: string;
    }[];
    homepage: string | null;
    id: number;
    imdb_id: string | null;
    origin_country: string[];
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string | null;
    production_companies: {
        id: number;
        logo_path: string | null;
        name: string;
        origin_country: string;
    }[];
    production_countries: {
        iso_3166_1: string;
        name: string;
    }[];
    release_date: string;
    revenue: number;
    runtime: number;
    spoken_languages: {
        english_name: string;
        iso_639_1: string;
        name: string;
    }[];
    status: string;
    tagline: string | null;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}


export interface CastMember {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string;
    cast_id: number;
    character: string;
    credit_id: string;
    order: number;
}
// BackdropImage Component
export interface BackdropImageProps {
    src: string;
    alt: string;
    className?: string;
}
// StarRating Component
export interface StarRatingProps {
    rating: number;
    maxRating?: number;
    className?: string;
}
// MovieInfo Component
export interface MovieInfoProps {
    movie: MovieDetail;
    className?: string;
}