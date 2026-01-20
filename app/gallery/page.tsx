'use client';
import { useState, useEffect } from 'react';
import { fetchImages } from '@/lib/firebaseUtils';
import { ImageItem } from '@/lib/types/images';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import styles from './Gallery.module.css';

const IMAGES_PER_PAGE = 12;

export default function GalleryPage() {
    const [images, setImages] = useState<ImageItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        loadImages();
    }, []);

    const loadImages = async (loadMore: boolean = false) => {
        if (loadMore) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }
        
        const result = await fetchImages('gallery', IMAGES_PER_PAGE, loadMore ? lastDoc : null);
        
        if (loadMore) {
            setImages(prev => [...prev, ...result.images]);
        } else {
            setImages(result.images);
        }
        
        setLastDoc(result.lastDoc);
        setHasMore(result.hasMore);
        setLoading(false);
        setLoadingMore(false);
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1>Event Gallery</h1>
                <p>Relive the moments from our amazing events</p>
            </header>

            <div className={styles.container}>
                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Loading gallery...</p>
                    </div>
                ) : images.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>📸</div>
                        <h2>No Images Yet</h2>
                        <p>Gallery images will appear here once they are uploaded.</p>
                    </div>
                ) : (
                    <div className={styles.gallery}>
                        {images.map((img) => (
                            <div 
                                key={img.id || img.name} 
                                className={styles.galleryItem}
                                onClick={() => setSelectedImage(img.url)}
                            >
                                <img src={img.url} alt="Event" className={styles.galleryImage} />
                                <div className={styles.overlay}>
                                    <span>Click to enlarge</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {hasMore && !loading && (
                    <div className={styles.loadMoreWrapper}>
                        <button 
                            className={styles.loadMoreButton}
                            onClick={() => loadImages(true)}
                            disabled={loadingMore}
                        >
                            {loadingMore ? 'Loading...' : 'Load More Images'}
                        </button>
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {selectedImage && (
                <div className={styles.lightbox} onClick={() => setSelectedImage(null)}>
                    <div className={styles.lightboxContent}>
                        <button className={styles.closeButton} onClick={() => setSelectedImage(null)}>
                            ✕
                        </button>
                        <img src={selectedImage} alt="Enlarged" className={styles.lightboxImage} />
                    </div>
                </div>
            )}
        </div>
    );
}
