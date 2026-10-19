'use client';

import Image from 'next/image';
import { useRef } from 'react';

/**
 * An image that opens full size in a dialog when tapped, with a download link.
 * The full-size view scrolls for tall images, and phones can pinch-zoom it.
 * Esc, the Close button or a tap outside the image closes it.
 */
export default function ImageLightbox({
    src,
    alt,
    width,
    height,
    downloadName,
    sizes = '(max-width: 900px) 100vw, 45vw',
}: {
    src: string;
    alt: string;
    width: number;
    height: number;
    /** File name for the download link. */
    downloadName: string;
    sizes?: string;
}) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const close = () => dialogRef.current?.close();

    return (
        <>
            <button type="button" className="lb-thumb" onClick={() => dialogRef.current?.showModal()} aria-haspopup="dialog">
                <Image src={src} alt={alt} width={width} height={height} sizes={sizes} />
                <span className="lb-hint mono" aria-hidden="true">Tap to enlarge</span>
            </button>
            <dialog
                ref={dialogRef}
                className="lb"
                aria-label={alt}
                // A tap on the dark backdrop (the dialog itself, not its contents) closes it.
                onClick={(e) => e.target === e.currentTarget && close()}
            >
                <div className="lb-bar">
                    <a className="btn btn-gold" href={src} download={downloadName}>Download</a>
                    <button type="button" className="btn btn-ghost" onClick={close} autoFocus>Close</button>
                </div>
                {/* Served as-is so every number stays sharp when zoomed. */}
                <Image className="lb-img" src={src} alt={alt} width={width} height={height} unoptimized />
            </dialog>
        </>
    );
}
