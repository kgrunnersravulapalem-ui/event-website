'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import { fetchImages } from '@/lib/firebaseUtils';
import { ImageItem } from '@/lib/types/images';
import PageHero from '@/components/kg/PageHero';
import RunnerFigure from '@/components/kg/RunnerFigure';

const IMAGES_PER_PAGE = 12;
const CACHE_KEY = 'gallery_images_cache';
const CACHE_TIMESTAMP_KEY = 'gallery_cache_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function getCachedImages(): ImageItem[] | null {
    if (typeof window === 'undefined') return null;
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
        if (cached && timestamp) {
            if (Date.now() - parseInt(timestamp) < CACHE_DURATION) return JSON.parse(cached);
            localStorage.removeItem(CACHE_KEY);
            localStorage.removeItem(CACHE_TIMESTAMP_KEY);
        }
    } catch (error) {
        console.error('Error reading cache:', error);
    }
    return null;
}

function setCachedImages(images: ImageItem[]) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(images));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
        console.error('Error setting cache:', error);
    }
}

export default function GalleryPage() {
    const [images, setImages] = useState<ImageItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
    const [hasMore, setHasMore] = useState(false);
    const [loaded, setLoaded] = useState<Record<string, boolean>>({});

    const loadImages = useCallback(async (more: boolean, after: QueryDocumentSnapshot | null) => {
        if (more) setLoadingMore(true);
        try {
            const result = await fetchImages('gallery', IMAGES_PER_PAGE, more ? after : null);
            if (more) {
                setImages((prev) => [...prev, ...result.images]);
            } else {
                setImages(result.images);
                setCachedImages(result.images);
            }
            setLastDoc(result.lastDoc);
            setHasMore(result.hasMore);
        } catch (error) {
            console.error('Error loading images:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        // Show cached images instantly, then refresh from Firebase in the background.
        const timer = setTimeout(() => {
            const cached = getCachedImages();
            if (cached) {
                setImages(cached);
                setLoading(false);
            }
            loadImages(false, null);
        }, 0);
        return () => clearTimeout(timer);
    }, [loadImages]);

    // Close the lightbox with Escape
    useEffect(() => {
        if (!selected) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [selected]);

    return (
        <main className="kg kg-main">
            <PageHero
                label="Gallery"
                title={<>Moments from<br /><span style={{ color: '#F4B400' }}>race morning.</span></>}
                lede="Sunrise starts, finish-line smiles and everything in between. Tap any photo to see it full size."
            />

            <section className="sec" style={{ paddingTop: 24, background: '#0E1A0D' }}>
                <div className="wrap">
                    {loading ? (
                        <div className="gal-grid" aria-busy="true">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <div key={i} className="gal-item" style={{ cursor: 'default' }}><span className="shimmer" /></div>
                            ))}
                        </div>
                    ) : images.length === 0 ? (
                        <div className="empty">
                            <div className="run"><RunnerFigure /></div>
                            <h2 className="disp" style={{ fontSize: 'clamp(28px,3vw,40px)' }}>Photos are on their way</h2>
                            <p className="lede" style={{ color: 'rgba(247,242,228,.75)' }}>Gallery images will appear here once they are uploaded.</p>
                            <Link className="btn btn-gold" href="/editions">Explore editions</Link>
                        </div>
                    ) : (
                        <div className="gal-grid">
                            {images.map((img) => {
                                const id = img.id || img.name;
                                const isLoaded = loaded[id];
                                return (
                                    <button key={id} type="button" className="gal-item" onClick={() => setSelected(img.url)} aria-label="View photo full size">
                                        {!isLoaded && <span className="shimmer" />}
                                        <Image
                                            src={img.url}
                                            alt="Konaseema Run moment"
                                            fill
                                            className={isLoaded ? 'img-loaded' : 'img-loading'}
                                            onLoad={() => setLoaded((prev) => ({ ...prev, [id]: true }))}
                                            sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                                            quality={85}
                                        />
                                        <span className="zoom mono">View</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {hasMore && !loading && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 36 }}>
                            <button type="button" className="btn btn-gold" onClick={() => loadImages(true, lastDoc)} disabled={loadingMore}>
                                {loadingMore ? (<><span className="spin" aria-hidden="true" /> Loading…</>) : 'Load more photos'}
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {selected && (
                <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo" onClick={() => setSelected(null)}>
                    <button type="button" className="btn btn-gold close" onClick={() => setSelected(null)} aria-label="Close photo">Close</button>
                    <div className="lightbox-frame" onClick={(e) => e.stopPropagation()}>
                        <Image src={selected} alt="Konaseema Run moment, full size" fill sizes="90vw" quality={95} />
                    </div>
                </div>
            )}
        </main>
    );
}
