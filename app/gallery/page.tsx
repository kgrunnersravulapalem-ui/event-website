'use client';
import { useState, useEffect } from 'react';
import { fetchImages } from '@/lib/firebaseUtils';
import { ImageItem } from '@/lib/types/images';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import styles from './Gallery.module.css';
import Image from 'next/image';

const IMAGES_PER_PAGE = 12;
const CACHE_KEY = 'gallery_images_cache';
const CACHE_TIMESTAMP_KEY = 'gallery_cache_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface CachedData {
    images: ImageItem[];
    timestamp: number;
}

export default function GalleryPage() {
    const [images, setImages] = useState<ImageItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
    const [hasMore, setHasMore] = useState(false);
    const [imageLoadStates, setImageLoadStates] = useState<Record<string, boolean>>({});

    useEffect(() => {
        loadImagesWithCache();
    }, []);

    const loadImagesWithCache = async () => {
        // Try to load from cache first
        const cachedData = getCachedImages();
        
        if (cachedData) {
            setImages(cachedData);
            setLoading(false);
            // Still fetch in background to update cache
            fetchAndUpdateCache();
        } else {
            await loadImages();
        }
    };

    const getCachedImages = (): ImageItem[] | null => {
        if (typeof window === 'undefined') return null;
        
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
            
            if (cached && timestamp) {
                const cacheAge = Date.now() - parseInt(timestamp);
                
                if (cacheAge < CACHE_DURATION) {
                    return JSON.parse(cached);
                } else {
                    // Cache expired, clear it
                    localStorage.removeItem(CACHE_KEY);
                    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
                }
            }
        } catch (error) {
            console.error('Error reading cache:', error);
        }
        
        return null;
    };

    const setCachedImages = (images: ImageItem[]) => {
        if (typeof window === 'undefined') return;
        
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(images));
            localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
        } catch (error) {
            console.error('Error setting cache:', error);
        }
    };

    const fetchAndUpdateCache = async () => {
        try {
            const result = await fetchImages('gallery', IMAGES_PER_PAGE, null);
            setImages(result.images);
            setLastDoc(result.lastDoc);
            setHasMore(result.hasMore);
            setCachedImages(result.images);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    const loadImages = async (loadMore: boolean = false) => {
        if (loadMore) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }
        
        try {
            const result = await fetchImages('gallery', IMAGES_PER_PAGE, loadMore ? lastDoc : null);
            
            if (loadMore) {
                const newImages = [...images, ...result.images];
                setImages(newImages);
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
    };

    const handleImageLoad = (imageId: string) => {
        setImageLoadStates(prev => ({ ...prev, [imageId]: true }));
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1>Event Gallery</h1>
                <p>Relive the moments from our amazing events</p>
            </header>

            <div className={styles.container}>
                {loading ? (
                    <div className={styles.gallery}>
                        {Array.from({ length: 12 }).map((_, index) => (
                            <div key={index} className={styles.skeletonItem}>
                                <div className={styles.skeletonShimmer}></div>
                            </div>
                        ))}
                    </div>
                ) : images.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>📸</div>
                        <h2>No Images Yet</h2>
                        <p>Gallery images will appear here once they are uploaded.</p>
                    </div>
                ) : (
                    <div className={styles.gallery}>
                        {images.map((img) => {
                            const imageId = img.id || img.name;
                            const isLoaded = imageLoadStates[imageId];
                            
                            return (
                                <div 
                                    key={imageId} 
                                    className={styles.galleryItem}
                                    onClick={() => setSelectedImage(img.url)}
                                >
                                    {!isLoaded && (
                                        <div className={styles.imagePlaceholder}>
                                            <div className={styles.skeletonShimmer}></div>
                                        </div>
                                    )}
                                    <Image
                                        src={img.url}
                                        alt="Event"
                                        fill
                                        className={`${styles.galleryImage} ${isLoaded ? styles.imageLoaded : styles.imageLoading}`}
                                        onLoad={() => handleImageLoad(imageId)}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        quality={85}
                                    />
                                    <div className={styles.overlay}>
                                        <span>Click to enlarge</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                
                {hasMore && !loading && (
                    <div className={styles.loadMoreWrapper}>
                        <button 
                            className={styles.loadMoreButton}
                            onClick={() => loadImages(true)}
                            disabled={loadingMore}
                        >
                            {loadingMore ? (
                                <>
                                    <span className={styles.buttonSpinner}></span>
                                    Loading...
                                </>
                            ) : (
                                'Load More Images'
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {selectedImage && (
                <div className={styles.lightbox} onClick={() => setSelectedImage(null)}>
                    <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={() => setSelectedImage(null)}>
                            ✕
                        </button>
                        <Image
                            src={selectedImage}
                            alt="Enlarged"
                            fill
                            className={styles.lightboxImage}
                            sizes="90vw"
                            quality={95}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
