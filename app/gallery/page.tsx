'use client';
import { useState, useEffect } from 'react';
import { fetchImages } from '@/lib/firebaseUtils';
import styles from './Gallery.module.css';

interface ImageItem {
    name: string;
    url: string;
}

export default function GalleryPage() {
    const [images, setImages] = useState<ImageItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        loadImages();
    }, []);

    const loadImages = async () => {
        setLoading(true);
        const imgs = await fetchImages('gallery');
        setImages(imgs);
        setLoading(false);
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
                                key={img.name} 
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
