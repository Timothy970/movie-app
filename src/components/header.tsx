// src/components/Header.tsx
import React from "react";
import Logo from "./logo";
import SearchBar from "./searchbar";
import UserAvatar from "./useravatar";

interface HeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    userAvatar?: string;
    className?: string;
}

const Header: React.FC<HeaderProps> = ({
    searchQuery,
    onSearchChange,
    userAvatar,
    className = "",
}) => (
    <header className={`bg-white border-b border-gray-200 px-6 py-4 ${className}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Logo />
            <SearchBar value={searchQuery} onChange={onSearchChange} className="flex-1 max-w-lg mx-8" />
            <UserAvatar src={userAvatar} />
        </div>
    </header>
);

export default Header;
