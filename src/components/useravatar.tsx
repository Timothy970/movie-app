import React from "react";
import { User } from "lucide-react";
import Image from "next/image";

interface UserAvatarProps {
    src?: string;
    alt?: string;
    className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
    src,
    alt = "User Avatar",
    className = "",
}) => (
    <div className={`flex items-center ${className}`}>
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            {src ? (
                <Image
                    src={src}
                    alt={alt}
                    width={200}
                    height={250}
                    className="object-cover w-full h-full"
                />
            ) : (
                <User className="w-5 h-5 text-gray-600" />
            )}
        </div>
    </div>
);

export default UserAvatar;
