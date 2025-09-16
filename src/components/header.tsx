// src/components/Header.tsx
import React from "react";
import Logo from "./logo";
import SearchBar from "./searchbar";
import UserAvatar from "./useravatar";
import { useAuth } from "@/context/AuthContext";
interface HeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    className?: string;
    showSearchBar: boolean
}

const Header: React.FC<HeaderProps> = ({
    searchQuery,
    onSearchChange,
    className = "",
    showSearchBar,
}) => {
    const { user, loading } = useAuth();
    if (loading) return <p>Loading...</p>;
    console.log("user kwa header::", user)
    return (
        <header className={`bg-white border-b border-gray-200 px-6 py-4 ${className}`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Logo />
                <SearchBar value={searchQuery} onChange={onSearchChange} className={`flex-1 max-w-lg mx-8 ${showSearchBar ? '' : 'hidden'}`} />
                <UserAvatar email={user?.email} />
            </div>
        </header>
    )
};

export default Header;
