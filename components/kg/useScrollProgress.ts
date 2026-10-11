'use client';
import { useEffect, useRef, useState } from 'react';

export type ScrollState = { p: number; dir: 1 | -1; moving: boolean };

// Page scroll progress (0 → 1), scroll direction and whether the page is moving.
export function useScrollProgress(): ScrollState {
    const [state, setState] = useState<ScrollState>({ p: 0, dir: 1, moving: false });
    const last = useRef<number | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        let frame = 0;
        const read = () => {
            frame = 0;
            const se = document.scrollingElement || document.documentElement;
            const top = se.scrollTop || window.scrollY || 0;
            const max = se.scrollHeight - window.innerHeight;
            const p = max > 0 ? Math.min(1, Math.max(0, top / max)) : 0;
            const dy = last.current == null ? 0 : top - last.current;
            last.current = top;
            setState((prev) => ({
                p,
                dir: dy < 0 ? -1 : dy > 0 ? 1 : prev.dir,
                moving: Math.abs(dy) > 1,
            }));
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(() => setState((prev) => ({ ...prev, moving: false })), 200);
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(read);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        read();
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (frame) cancelAnimationFrame(frame);
            if (timer.current) clearTimeout(timer.current);
        };
    }, []);

    return state;
}
