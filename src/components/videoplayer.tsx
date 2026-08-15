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

export type PlayerServer = 'vidapi' | 'vaplayer' | 'vidsrc' | 'autoembed' | '2embed';

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
    // popupToast: shown briefly when focus-guard snaps user back from a popup
    const [popupToast, setPopupToast] = useState(false);
    const toastTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const idToUse = useImdb && imdbId ? imdbId : mediaId;
    const customVidApiBase = process.env.NEXT_PUBLIC_VIDAPI_EMBED_URL || 'https://vidapi.ru/embed';

    const getEmbedUrl = (): string => {
        switch (selectedServer) {
            case 'vidsrc':
                return mediaType === 'movie'
                    ? `https://vidsrc.to/embed/movie/${idToUse}`
                    : `https://vidsrc.to/embed/tv/${idToUse}/${season}/${episode}`;
            case 'vidapi':
                return mediaType === 'movie'
                    ? `${customVidApiBase}/movie/${idToUse}`
                    : `${customVidApiBase}/tv/${idToUse}/${season}/${episode}`;
            case 'vaplayer':
                return mediaType === 'movie'
                    ? `https://vaplayer.ru/embed/movie/${idToUse}`
                    : `https://vaplayer.ru/embed/tv/${idToUse}/${season}/${episode}`;
            case 'autoembed':
                return mediaType === 'movie'
                    ? `https://player.autoembed.cc/embed/movie/${idToUse}`
                    : `https://player.autoembed.cc/embed/tv/${idToUse}/${season}/${episode}`;
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
        console.log(
            `%c[VideoPlayer LOG] NOTE: No sandbox attribute is set on the iframe.`,
            'color: #f59e0b;',
            'Sandbox would block VidAPI & other players. Popup blocking is handled by your browser.'
        );

        setIsLoading(true);
        setHasError(false);

        // Timeout safety check: if iframe doesn't load after 12s, log warning
        const timer = setTimeout(() => {
            console.warn(`[VideoPlayer LOG] Server ${selectedServer} taking longer than 12s to respond for URL: ${embedUrl}`);
        }, 12000);

        return () => clearTimeout(timer);
    }, [embedUrl, selectedServer, mediaId, mediaType, imdbId, useImdb, season, episode, iframeActive]);

    // ── FOCUS GUARD ──
    // When the player is active, listen for blur events. If the page loses focus
    // (e.g. a popup/ad tab opened by the embed), snap back immediately and show
    // a toast so the user knows what happened.
    useEffect(() => {
        if (!iframeActive) return;

        const handleBlur = () => {
            // Small delay so the new tab has time to open, then snap back
            setTimeout(() => {
                window.focus();
                console.log('%c[VideoPlayer LOG] Focus-Guard: Popup detected, returned focus to stream.', 'color: #10b981; font-weight: bold;');
                // Show toast
                setPopupToast(true);
                if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
                toastTimerRef.current = setTimeout(() => setPopupToast(false), 3500);
            }, 80);
        };

        window.addEventListener('blur', handleBlur);
        return () => {
            window.removeEventListener('blur', handleBlur);
            if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
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
        setIframeActive(false); // reset so user triggers again after server switch
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
                        <Server className="w-3.5 h-3.5 text-gray-400 ml-1.5 hidden sm:inline" />
                        {(['vidapi', 'vaplayer', 'vidsrc', 'autoembed', '2embed'] as PlayerServer[]).map((srv) => (
                            <button
                                key={srv}
                                onClick={() => handleServerChange(srv)}
                                className={`px-2 py-1 rounded-md capitalize font-medium transition-all ${selectedServer === srv
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {srv}
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

                {/* ── PRE-PLAY OVERLAY: shown until user clicks play ── */}
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
                            Server: <span className="text-blue-400 font-medium uppercase">{selectedServer}</span>
                        </p>
                    </div>
                )}

                {/* ── LOADING SPINNER: shown while iframe is loading ── */}
                {iframeActive && isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 text-white z-10 p-4 text-center">
                        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-3"></div>
                        <p className="text-sm text-gray-300 font-medium">Connecting to {selectedServer.toUpperCase()} Server...</p>
                    </div>
                )}

                {/* ── ERROR STATE ── */}
                {iframeActive && hasError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/95 text-white z-20 p-6 text-center">
                        <AlertTriangle className="w-10 h-10 text-yellow-400 mb-3" />
                        <h4 className="text-base font-bold text-white mb-1">Server Connection Issue</h4>
                        <p className="text-xs text-gray-400 max-w-md mb-4">
                            Server &quot;{selectedServer}&quot; is currently unreachable or blocking requests. Please select another server above.
                        </p>
                        <div className="flex gap-2 flex-wrap justify-center">
                            {(['vidapi', 'vaplayer', 'vidsrc', 'autoembed', '2embed'] as PlayerServer[]).filter(s => s !== selectedServer).map(srv => (
                                <button
                                    key={srv}
                                    onClick={() => handleServerChange(srv)}
                                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold uppercase"
                                >
                                    Try {srv}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── IFRAME: only renders after user triggers play, NO sandbox attr ── */}
                {iframeActive && (
                    <iframe
                        key={embedUrl}
                        src={embedUrl}
                        className="w-full h-full border-0"
                        allowFullScreen
                        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                        // NOTE: sandbox attribute intentionally omitted.
                        // Adding sandbox (even with allow-scripts) causes VidAPI and many
                        // other embed players to display "Playback blocked" errors.
                        // Browser's native popup blocker handles unwanted tabs instead.
                        onLoad={handleIframeLoad}
                        onError={handleIframeError}
                        title={title || 'Video Stream'}
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
