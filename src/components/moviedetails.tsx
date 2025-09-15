interface MovieDetailsProps {
    title: string;
    year: number;
    rating: number;
    overview: string;
}

export default function MovieDetails({
    title,
    year,
    rating,
    overview,
}: MovieDetailsProps) {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">
                {title} ({year})
            </h1>
            <p className="text-yellow-400 font-semibold">Rating: ⭐ {rating} / 10</p>

            <div>
                <h3 className="text-xl font-semibold mb-2">Overview</h3>
                <p className="text-gray-300">{overview}</p>
            </div>
        </div>
    );
}
