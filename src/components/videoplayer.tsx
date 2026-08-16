'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, X, Server, AlertTriangle, Play } from 'lucide-react';
import { saveWatchItem } from '@/lib/watchHistory';

interface VideoPlayerProps {
    mediaId: number | string;
    mediaType: 'movie' | 'tv';
    imdbId?: string | null;
    season?: number;
    episode?: number;
    title?: string;
    posterPath?: string | null;
    onClose?: () => void;
    inline?: boolean;
}

export type PlayerServer = 'vidsrc' | '2embed';

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
    mediaId,
    mediaType,
    imdbId,
    season = 1,
    episode = 1,
    title = '',
    posterPath,
    onClose,
    inline = false,
}) => {
    const [selectedServer, setSelectedServer] = useState<PlayerServer>('vidsrc');
    const [useImdb, setUseImdb] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    // iframeActive: true = user has clicked play and iframe should load
    const [iframeActive, setIframeActive] = useState(false);
    const toastTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const idToUse = useImdb && imdbId ? imdbId : mediaId;

    const getEmbedUrl = (): string => {
        switch (selectedServer) {
            case 'vidsrc':
                return mediaType === 'movie'
                    ? `https://vidsrc.to/embed/movie/${idToUse}`
                    : `https://vidsrc.to/embed/tv/${idToUse}/${season}/${episode}`;
            case '2embed':
                return mediaType === 'movie'
                    ? `https://www.2embed.cc/embed/${idToUse}`
                    : `https://www.2embed.cc/embedtv/${idToUse}&s=${season}&e=${episode}`;
            default:
                return mediaType === 'movie'
                    ? `https://vidsrc.to/embed/movie/${idToUse}`
                    : `https://vidsrc.to/embed/tv/${idToUse}/${season}/${episode}`;
        }
    };

    const embedUrl = getEmbedUrl();

    // Log embed details to console for debugging
    useEffect(() => {
        if (!iframeActive) return;
        console.log(`%c[VideoPlayer LOG] Initializing Stream`, 'color: #3b82f6; font-weight: bold;', {
            server: selectedServer,
            embedUrl,
            mediaId,
            mediaType,
            imdbId: imdbId || 'None',
            idType: useImdb ? 'IMDb' : 'TMDB',
            season: mediaType === 'tv' ? season : undefined,
            episode: mediaType === 'tv' ? episode : undefined,
        });

        setIsLoading(true);
        setHasError(false);

        // Timeout safety check: if iframe doesn't load after 12s, log warning
        const timer = setTimeout(() => {
            console.warn(`[VideoPlayer LOG] Server ${selectedServer} taking longer than 12s to respond for URL: ${embedUrl}`);
        }, 12000);

        return () => clearTimeout(timer);
    }, [embedUrl, selectedServer, mediaId, mediaType, imdbId, useImdb, season, episode, iframeActive]);

    // ── FOCUS GUARD & NAVIGATION REDIRECT PROTECTOR ──
    useEffect(() => {
        if (!iframeActive) return;

        // Override window.open in main page context to prevent top-level popups
        const originalOpen = window.open;
        window.open = function () {
            console.log('%c[VideoPlayer LOG] Intercepted window.open popup attempt.', 'color: #10b981;');
            return null;
        };

        // Prevent top-level page redirection initiated by iframe clicks
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            console.log('%c[VideoPlayer LOG] Prevented iframe top-level page redirection.', 'color: #10b981; font-weight: bold;');
            e.preventDefault();
            e.returnValue = '';
            return '';
        };

        const handleBlur = () => {
            window.focus();
            setTimeout(() => window.focus(), 0);
            setTimeout(() => window.focus(), 40);
            console.log('%c[VideoPlayer LOG] Focus-Guard: Instantly retained focus on movie tab.', 'color: #10b981; font-weight: bold;');
        };

        const timerRef = toastTimerRef.current;
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('blur', handleBlur);
        return () => {
            window.open = originalOpen;
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('blur', handleBlur);
            if (timerRef) clearTimeout(timerRef);
        };
    }, [iframeActive]);

    const handleIframeLoad = () => {
        console.log(`%c[VideoPlayer LOG] Iframe Loaded Successfully: ${embedUrl}`, 'color: #22c55e; font-weight: bold;');
        setIsLoading(false);
    };

    const handleIframeError = () => {
        console.error(`[VideoPlayer LOG] Failed to load stream from server: ${selectedServer}`, { embedUrl });
        setIsLoading(false);
        setHasError(true);
    };

    const handleServerChange = (server: PlayerServer) => {
        console.log(`[VideoPlayer LOG] Switching server to: ${server}`);
        setIsLoading(true);
        setHasError(false);
        setIframeActive(false);
        setSelectedServer(server);
    };

    const handleActivatePlayer = () => {
        console.log(`%c[VideoPlayer LOG] User triggered playback for server: ${selectedServer}`, 'color: #a855f7; font-weight: bold;', { embedUrl });
        setIframeActive(true);
        setIsLoading(true);
        setHasError(false);

        // Save to Watch History
        saveWatchItem({
            id: typeof mediaId === 'string' ? parseInt(mediaId, 10) : mediaId,
            mediaType,
            title: title || 'Untitled',
            posterPath,
            season: mediaType === 'tv' ? season : undefined,
            episode: mediaType === 'tv' ? episode : undefined,
        });
    };

    const toggleIdSource = () => {
        console.log(`[VideoPlayer LOG] Toggling ID source. Current: ${useImdb ? 'IMDb' : 'TMDB'}`);
        setIsLoading(true);
        setHasError(false);
        setIframeActive(false);
        setUseImdb(!useImdb);
    };

    const content = (
        <div className="relative w-full rounded-2xl overflow-hidden glass-panel border border-white/10 shadow-2xl bg-black/90">
            {/* Header control bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-black/80 border-b border-white/10 text-white text-sm">
                <div className="flex items-center gap-2 font-medium truncate max-w-md">
                    <span className={`w-2.5 h-2.5 rounded-full ${iframeActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'}`}></span>
                    <span className="text-gray-300 hidden sm:inline">{iframeActive ? 'Streaming:' : 'Ready:'}</span>
                    <span className="text-white font-semibold truncate">{title}</span>
                    {mediaType === 'tv' && (
                        <span className="px-2 py-0.5 rounded bg-blue-600/30 text-blue-400 text-xs border border-blue-500/30 whitespace-nowrap">
                            S{season} E{episode}
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Server selector */}
                    <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-0.5 text-xs">
                        <Server className="w-3.5 h-3.5 text-gray-400 ml-1.5 hidden sm:inline flex-shrink-0" />
                        {(['vidsrc', '2embed'] as PlayerServer[]).map((srv, index) => (
                            <button
                                key={srv}
                                onClick={() => handleServerChange(srv)}
                                className={`px-2.5 py-1 rounded-md font-medium transition-all text-xs whitespace-nowrap ${selectedServer === srv
                                        ? 'bg-blue-600 text-white shadow-sm font-semibold'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {`Server ${index + 1}`}
                            </button>
                        ))}
                    </div>


                    {/* ID Source Toggle */}
                    {imdbId && (
                        <button
                            onClick={toggleIdSource}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-white/10 hover:bg-white/20 text-gray-200 transition-colors"
                            title="Switch between TMDB and IMDb ID stream sources"
                        >
                            <RefreshCw className="w-3 h-3" />
                            <span>{useImdb ? 'IMDb' : 'TMDB'}</span>
                        </button>
                    )}

                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-1 rounded-lg hover:bg-white/15 text-gray-400 hover:text-white transition-colors ml-1"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Video container */}
            <div className="relative aspect-video w-full bg-black">

                {/* ── PRE-PLAY OVERLAY ── */}
                {!iframeActive && (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-gray-950 text-white">
                        {/* Glowing play button */}
                        <button
                            onClick={handleActivatePlayer}
                            className="group relative w-24 h-24 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center mb-6 hover:bg-white/20 hover:border-white/60 transition-all duration-300 hover:scale-110"
                            aria-label="Start streaming"
                        >
                            <span className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"></span>
                            <Play className="w-10 h-10 fill-white text-white ml-1 group-hover:scale-110 transition-transform" />
                        </button>
                        <p className="text-base font-semibold text-white mb-1">Click to Stream</p>
                        <p className="text-xs text-gray-400 text-center max-w-xs px-4">
                            Server: <span className="text-blue-400 font-medium uppercase">{selectedServer === 'vidsrc' ? 'SERVER 1' : 'SERVER 2'}</span>
                        </p>
                    </div>
                )}

                {/* ── LOADING SPINNER ── */}
                {iframeActive && isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#08090d]/95 backdrop-blur-md text-white z-10 p-4 text-center">
                        <div className="relative flex items-center justify-center w-16 h-16 mb-4">
                            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-indigo-500 border-b-purple-500/30 animate-spin"></div>
                            <div className="absolute inset-1.5 rounded-full border-2 border-transparent border-t-purple-500 border-l-blue-400/40 animate-[spin_1.5s_linear_infinite_reverse]"></div>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 border border-white/20 animate-pulse">
                                <span className="text-base font-black text-white tracking-tighter">M</span>
                            </div>
                        </div>
                        <p className="text-sm font-semibold tracking-wide bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent uppercase">
                            Connecting to {selectedServer === 'vidsrc' ? 'Server 1' : 'Server 2'}...
                        </p>
                    </div>
                )}

                {/* ── ERROR STATE ── */}
                {iframeActive && hasError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/95 text-white z-20 p-6 text-center">
                        <AlertTriangle className="w-10 h-10 text-yellow-400 mb-3" />
                        <h4 className="text-base font-bold text-white mb-1">Server Connection Issue</h4>
                        <p className="text-xs text-gray-400 max-w-md mb-4">
                            {selectedServer === 'vidsrc' ? 'Server 1' : 'Server 2'} is currently unreachable. Please select another server above.
                        </p>
                        <div className="flex gap-2 flex-wrap justify-center">
                            {(['vidsrc', '2embed'] as PlayerServer[]).filter(s => s !== selectedServer).map(srv => (
                                <button
                                    key={srv}
                                    onClick={() => handleServerChange(srv)}
                                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold uppercase"
                                >
                                    Try {srv === 'vidsrc' ? 'Server 1' : 'Server 2'}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── IFRAME ── */}
                {iframeActive && (
                    <iframe
                        key={embedUrl}
                        src={embedUrl}
                        className="w-full h-full border-0"
                        allowFullScreen
                        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                        onLoad={handleIframeLoad}
                        onError={handleIframeError}
                    />
                )}

            </div>
        </div>
    );

    if (inline) {
        return (
            <>
                {content}
            </>
        );
    }

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in">
                <div className="w-full max-w-5xl">
                    {content}
                </div>
            </div>
        </>
    );
};
