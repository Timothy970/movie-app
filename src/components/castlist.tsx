import Image from "next/image";
import { Actor } from "@/types/Movies";

interface CastListProps {
    cast: Actor[];
}

export default function CastList({ cast }: CastListProps) {
    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">Cast</h3>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {cast.map((actor) => (
                    <div
                        key={actor.id}
                        className="flex-shrink-0 w-32 bg-gray-800 rounded-lg p-2 text-center"
                    >
                        <div className="relative w-full h-40 mb-2">
                            <Image
                                src={actor.picture}
                                alt={actor.name}
                                fill
                                className="object-cover rounded-md"
                            />
                        </div>
                        <p className="text-sm font-semibold">{actor.name}</p>
                        <p className="text-xs text-gray-400">{actor.character}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
