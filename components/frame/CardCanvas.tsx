'use client';

import { useEffect, useRef, type CSSProperties, type PointerEvent, type RefObject } from 'react';
import { getPhotoPlacement } from '@/lib/raceFrame/canvas.js';
import { renderCard } from '@/lib/raceFrame/designs/index.js';
import type { CardAssets, CardDesign, CardLayout, CardTheme, PhotoState, PhotoUpdater, RaceFrameEvent } from '@/lib/raceFrame/types';
import styles from './RaceFrame.module.css';

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 4;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

type Point = { x: number; y: number };

type CardCanvasProps = {
    ref: RefObject<HTMLCanvasElement | null>;
    design: CardDesign;
    layout: CardLayout;
    theme: CardTheme;
    event: RaceFrameEvent;
    photo: PhotoState | null;
    name: string;
    distance: string;
    headline: string;
    assets: CardAssets;
    fontsReady: boolean;
    onPhotoChange: PhotoUpdater;
};

/**
 * Full-size live preview of the card. Once a photo is added it can be dragged
 * to move it, and pinched or scrolled to zoom.
 */
export default function CardCanvas({
    ref: canvasRef, design, layout, theme, event, photo, name, distance, headline, assets, fontsReady, onPhotoChange,
}: CardCanvasProps) {
    const pointers = useRef(new Map<number, Point>());
    const pinch = useRef<{ dist: number; zoom: number } | null>(null);

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!fontsReady || !ctx) return;
        renderCard(ctx, design, layout, theme, { photo, name, distance, headline, assets, event });
    }, [canvasRef, design, layout, theme, event, photo, name, distance, headline, assets, fontsReady]);

    // Wheel zoom needs a non-passive listener so the page doesn't scroll.
    const hasPhoto = Boolean(photo);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!hasPhoto || !canvas) return undefined;
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            onPhotoChange((p) => ({ ...p, zoom: clamp(p.zoom * Math.exp(-e.deltaY * 0.0015), MIN_ZOOM, MAX_ZOOM) }));
        };
        canvas.addEventListener('wheel', onWheel, { passive: false });
        return () => canvas.removeEventListener('wheel', onWheel);
    }, [canvasRef, hasPhoto, onPhotoChange]);

    const toCanvasScale = (canvas: HTMLCanvasElement) => canvas.width / canvas.getBoundingClientRect().width;

    const pinchDistance = () => {
        const [a, b] = [...pointers.current.values()];
        return Math.hypot(a.x - b.x, a.y - b.y);
    };

    const handlePointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
        if (!photo) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pointers.current.size === 2) pinch.current = { dist: pinchDistance(), zoom: photo.zoom };
    };

    const handlePointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
        const prev = pointers.current.get(e.pointerId);
        if (!prev) return;
        const next = { x: e.clientX, y: e.clientY };
        pointers.current.set(e.pointerId, next);

        if (pointers.current.size === 2 && pinch.current) {
            const zoom = clamp((pinch.current.zoom * pinchDistance()) / pinch.current.dist, MIN_ZOOM, MAX_ZOOM);
            onPhotoChange((p) => ({ ...p, zoom }));
            return;
        }

        const scale = toCanvasScale(e.currentTarget);
        const dx = (next.x - prev.x) * scale;
        const dy = (next.y - prev.y) * scale;
        onPhotoChange((p) => {
            const place = getPhotoPlacement(design.photoFrame(layout), p.image, p.zoom, p.panX, p.panY);
            return {
                ...p,
                panX: place.overflowX > 0 ? clamp(p.panX - dx / place.overflowX, 0, 1) : p.panX,
                panY: place.overflowY > 0 ? clamp(p.panY - dy / place.overflowY, 0, 1) : p.panY,
            };
        });
    };

    const handlePointerUp = (e: PointerEvent<HTMLCanvasElement>) => {
        pointers.current.delete(e.pointerId);
        if (pointers.current.size < 2) pinch.current = null;
    };

    return (
        <canvas
            ref={canvasRef}
            className={`${styles.cardCanvas}${photo ? ` ${styles.isDraggable}` : ''}`}
            width={layout.width}
            height={layout.height}
            // The preview's width depends on the card's shape.
            style={{ '--ratio': layout.width / layout.height } as CSSProperties}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            aria-label="Preview of your race card"
            role="img"
        />
    );
}
