import Image from "next/image";

interface MovieBackdropProps {
    backdrop: string;
    title: string;
}

export default function MovieBackdrop({ backdrop, title }: MovieBackdropProps) {
    return (
        <div className="relative w-full h-64">
            <Image
                src={backdrop}
                alt={`${title} backdrop`}
                fill
                priority
                className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
        </div>
    );
}
