import Image from "next/image";

interface MoviePosterProps {
    poster: string;
    title: string;
}

export default function MoviePoster({ poster, title }: MoviePosterProps) {
    return (
        <div className="relative w-full h-[450px]">
            <Image
                src={poster}
                alt={title}
                fill
                className="object-cover rounded-lg shadow-lg"
            />
        </div>
    );
}
