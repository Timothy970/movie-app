import React, { useState, useRef, useEffect } from "react";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/firebase";

interface UserAvatarProps {
    email?: string | null;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ email }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getRandomColor = (char: string) => {
        const colors = [
            "bg-blue-500", "bg-green-500", "bg-red-500", "bg-purple-500",
            "bg-orange-500", "bg-pink-500", "bg-teal-500", "bg-cyan-500",
            "bg-amber-500", "bg-indigo-500"
        ];
        const charCode = char.charCodeAt(0);
        return colors[charCode % colors.length];
    };

    const getFirstCharacter = () => {
        if (email) {
            return email.charAt(0).toUpperCase();
        }
        return "U";
    };

    const getBackgroundColor = () => {
        const firstChar = getFirstCharacter();
        return getRandomColor(firstChar);
    };

    const handleLogout = async () => {
        await logout();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Avatar */}
            <div
                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border-2 border-white shadow-md ${getBackgroundColor()}`}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <span className="text-white font-semibold text-lg">
                    {getFirstCharacter()}
                </span>
            </div>

            {/* Dropdown */}
            {isOpen && email && (
                <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-gray-200 min-w-64 z-50">
                    {/* User info */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center ${getBackgroundColor()}`}
                            >
                                <span className="text-white font-semibold text-xl">
                                    {getFirstCharacter()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-500 truncate">
                                    {email || ""}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserAvatar;
