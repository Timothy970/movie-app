import { BackdropImageProps } from "@/types/Movies";
import Image from "next/image";

export const BackdropImage: React.FC<BackdropImageProps> = ({ src, alt, className = '' }) => {
    return (
        <div
            className={`relative w-full h-64 md:h-80 lg:h-96 bg-gray-200 rounded-lg overflow-hidden ${className}`}
        >
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover"
            />
        </div>
    );
};
