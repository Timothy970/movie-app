export interface WatchItem {
    id: number;
    mediaType: 'movie' | 'tv';
    title: string;
    posterPath?: string | null;
    backdropPath?: string | null;
    season?: number;
    episode?: number;
    voteAverage?: number;
    overview?: string;
    lastWatchedAt: number; // timestamp
}

const STORAGE_KEY = 'movierecs_watch_history';

export const getWatchHistory = (): WatchItem[] => {
    if (typeof window === 'undefined') return [];
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Failed to read watch history', e);
        return [];
    }
};

export const saveWatchItem = (item: Omit<WatchItem, 'lastWatchedAt'>) => {
    if (typeof window === 'undefined') return;
    try {
        const history = getWatchHistory();
        // Filter out existing entry for same media
        const filtered = history.filter(
            (h) => !(h.id === item.id && h.mediaType === item.mediaType)
        );
        const newItem: WatchItem = {
            ...item,
            lastWatchedAt: Date.now(),
        };
        // Prepend new item and cap at 30 items
        const updated = [newItem, ...filtered].slice(0, 30);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('watchHistoryUpdated'));
    } catch (e) {
        console.error('Failed to save watch item', e);
    }
};

export const removeWatchItem = (id: number, mediaType: 'movie' | 'tv') => {
    if (typeof window === 'undefined') return;
    try {
        const history = getWatchHistory();
        const updated = history.filter(
            (h) => !(h.id === id && h.mediaType === mediaType)
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('watchHistoryUpdated'));
    } catch (e) {
        console.error('Failed to remove watch item', e);
    }
};

export const clearWatchHistory = () => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(STORAGE_KEY);
        window.dispatchEvent(new Event('watchHistoryUpdated'));
    } catch (e) {
        console.error('Failed to clear watch history', e);
    }
};
