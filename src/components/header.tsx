// src/components/Header.tsx
import React from "react";
import Logo from "./logo";
import SearchBar from "./searchbar";
import UserAvatar from "./useravatar";
import { useAuth } from "@/context/AuthContext";
import LoadingBubbles from "./loadingbubbles";
import { useRouter } from 'next/navigation'

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
    const router = useRouter()
    const { user, loading } = useAuth();
    const goToSignIn = () => {
        router.push("/auth/signin")
    }
    if (loading) return <LoadingBubbles />;
    console.log("user kwa header::", user)
    return (
        <header className={`bg-white border-b border-gray-200 px-6 py-4 ${className}`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Logo />
                <SearchBar value={searchQuery} onChange={onSearchChange} className={`flex-1 max-w-lg mx-8 ${showSearchBar ? '' : 'hidden'}`} />
                {user ? (
                    <UserAvatar email={user?.email} />
                ) : (
                    <button onClick={goToSignIn}
                        className="bg-blue-600 rounded p-2"
                    >Login</button>
                )}
            </div>
        </header>
    )
};

export default Header;
