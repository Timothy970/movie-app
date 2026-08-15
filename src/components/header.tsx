import React from 'react';
import Logo from './logo';
import SearchBar from './searchbar';
import UserAvatar from './useravatar';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';

export type MainCategoryTab = 'home' | 'movies' | 'series' | 'kids';

interface HeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    className?: string;
    showSearchBar?: boolean;
    activeTab?: MainCategoryTab;
    onTabChange?: (tab: MainCategoryTab) => void;
}

const Header: React.FC<HeaderProps> = ({
    searchQuery,
    onSearchChange,
    className = '',
    showSearchBar = true,
    activeTab = 'home',
    onTabChange,
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useAuth();

    const isDashboard = pathname === '/';

    const goToSignIn = () => {
        router.push('/auth/signin');
    };

    const handleTabClick = (tab: MainCategoryTab) => {
        if (!isDashboard) {
            router.push('/');
            if (onTabChange) {
                onTabChange(tab);
            }
            return;
        }

        if (onTabChange) {
            onTabChange(tab);
        } else {
            router.push('/');
        }
    };

    const navTabs: { id: MainCategoryTab; label: string; icon?: React.ReactNode }[] = [
        { id: 'home', label: 'Home' },
        { id: 'movies', label: 'Movies' },
        { id: 'series', label: 'Series' },
        { id: 'kids', label: 'Kids' },
    ];

    return (
        <header className={`sticky top-0 z-40 w-full glass-nav transition-all duration-300 ${className}`}>
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">

                {/* Left side: Brand Logo & Navigation */}
                <div className="flex items-center gap-10">
                    <div onClick={() => handleTabClick('home')} className="cursor-pointer">
                        <Logo />
                    </div>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navTabs.map((tab) => {
                            const isActive = isDashboard && activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabClick(tab.id)}
                                    className={`relative text-sm font-medium transition-colors duration-200 py-1 ${isActive ? 'text-white font-semibold' : 'text-gray-400 hover:text-gray-200'
                                        }`}
                                >
                                    {tab.label}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full animate-fade-in shadow-sm shadow-white"></span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Right side: Search Bar, Notifications, Profile / Login */}
                <div className="flex items-center gap-4">
                    {showSearchBar && (
                        <div className="relative">
                            <SearchBar
                                value={searchQuery}
                                onChange={onSearchChange}
                                className="w-48 sm:w-64 md:w-80"
                            />
                        </div>
                    )}

                    {/* Notification Bell */}
                    <button
                        className="p-2.5 rounded-full glass-pill text-gray-300 hover:text-white transition-colors relative hidden sm:flex"
                        aria-label="Notifications"
                    >
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500"></span>
                    </button>

                    {/* User Profile / Login Button */}
                    {user ? (
                        <UserAvatar email={user?.email} />
                    ) : (
                        <button
                            onClick={goToSignIn}
                            className="px-5 py-2 rounded-full bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-all duration-200 shadow-md shadow-white/10"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Tab Navigation */}
            <div className="flex md:hidden items-center justify-around py-2.5 px-4 border-t border-white/5 bg-black/40 text-xs">
                {navTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`px-3 py-1.5 rounded-full transition-colors ${isDashboard && activeTab === tab.id
                                ? 'bg-white/15 text-white font-semibold'
                                : 'text-gray-400 hover:text-gray-200'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </header>
    );
};

export default Header;
