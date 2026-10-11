'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

// Minimal typings for the YouTube IFrame API we use.
type YTPlayer = {
    mute: () => void;
    unMute: () => void;
    isMuted: () => boolean;
    setVolume: (v: number) => void;
    playVideo: () => void;
    destroy: () => void;
};
type YTNamespace = {
    Player: new (
        el: HTMLElement,
        opts: {
            videoId: string;
            playerVars?: Record<string, string | number>;
            events?: { onReady?: (e: { target: YTPlayer }) => void };
        }
    ) => YTPlayer;
};
declare global {
    interface Window {
        YT?: YTNamespace;
        onYouTubeIframeAPIReady?: () => void;
    }
}

let apiPromise: Promise<YTNamespace> | null = null;
function loadYouTubeApi(): Promise<YTNamespace> {
    if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
    if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
    if (apiPromise) return apiPromise;
    apiPromise = new Promise((resolve) => {
        const prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
            prev?.();
            if (window.YT) resolve(window.YT);
        };
        const s = document.createElement('script');
        s.src = 'https://www.youtube.com/iframe_api';
        s.async = true;
        document.head.appendChild(s);
    });
    return apiPromise;
}

/**
 * Homepage film. Browsers only allow autoplay when muted, so the video starts
 * muted on load and the sound turns on with the visitor's first tap/click/key
 * anywhere on the page — or with the floating "Tap for sound" button.
 */
export default function FilmSection({ videoId }: { videoId: string }) {
    const host = useRef<HTMLDivElement>(null);
    const player = useRef<YTPlayer | null>(null);
    const [sound, setSound] = useState(false);

    useEffect(() => {
        let cancelled = false;
        loadYouTubeApi().then((YT) => {
            if (cancelled || !host.current) return;
            player.current = new YT.Player(host.current, {
                videoId,
                playerVars: { autoplay: 1, mute: 1, loop: 1, playlist: videoId, playsinline: 1, rel: 0, modestbranding: 1 },
                events: {
                    onReady: (e) => {
                        e.target.mute();
                        e.target.playVideo();
                    },
                },
            });
        });
        return () => {
            cancelled = true;
            player.current?.destroy();
            player.current = null;
        };
    }, [videoId]);

    const turnOn = useCallback(() => {
        const pl = player.current;
        if (!pl) return;
        pl.unMute();
        pl.setVolume(70);
        pl.playVideo();
        setSound(true);
    }, []);

    // First interaction anywhere on the page turns the song on.
    useEffect(() => {
        const first = (e: Event) => {
            const target = e.target as HTMLElement | null;
            if (target && target.closest('.sound')) return; // the pill handles itself
            turnOn();
            remove();
        };
        const remove = () => {
            window.removeEventListener('pointerdown', first);
            window.removeEventListener('keydown', first);
        };
        window.addEventListener('pointerdown', first);
        window.addEventListener('keydown', first);
        return remove;
    }, [turnOn]);

    const toggle = () => {
        const pl = player.current;
        if (!pl) return;
        if (sound) {
            pl.mute();
            setSound(false);
        } else {
            turnOn();
        }
    };

    return (
        <>
            <button
                type="button"
                className={`sound${sound ? ' on' : ''}`}
                aria-pressed={sound}
                aria-label="Toggle race film sound"
                onClick={toggle}
            >
                <span className="eq" aria-hidden="true"><i /><i /><i /><i /></span>
                <span className="mono">{sound ? 'Sound on' : 'Tap for sound'}</span>
            </button>

            <section className="film-sec light" id="film">
                <div className="wrap">
                    <div className="row-end rv">
                        <div className="stack" style={{ gap: 18 }}>
                            <div className="split mono">Watch · The Konaseema Run film</div>
                            <h2 className="disp" style={{ fontSize: 'clamp(36px,4.4vw,64px)' }}>Feel race morning.</h2>
                        </div>
                        <p className="lede" style={{ maxWidth: '40ch', color: '#3B4A36' }}>
                            Relive Edition 01 in Ravulapalem, then join us for the Half Marathon on 31 January 2027.
                        </p>
                    </div>
                    <div className="film rv">
                        <div className="yt" ref={host} />
                        <span className="live mono">Now playing</span>
                    </div>
                </div>
            </section>
        </>
    );
}
