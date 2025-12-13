'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import styles from './Admin.module.css';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import { uploadImage, fetchImages } from '@/lib/firebaseUtils';

interface ImageItem {
    name: string;
    url: string;
}

export default function AdminPage() {
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState<ImageItem[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [feedback, setFeedback] = useState<string>('');

    useEffect(() => {
        loadImages();
    }, []);

    const loadImages = async () => {
        const imgs = await fetchImages();
        setImages(imgs);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setFeedback('Uploading...');

        // Attempt upload - currently mocked if config is empty, but logic is sound
        // Note: If env vars are missing, this might fail or hang in a real app, 
        // but code structure is correct.
        const result = await uploadImage(selectedFile);

        if (result.success) {
            setFeedback('Upload successful!');
            setSelectedFile(null);
            loadImages();
            // Reset file input value manually or just rely on state
            const fileInput = document.getElementById('file-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        } else {
            setFeedback('Upload failed. Check console/config.');
        }

        setUploading(false);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Admin Dashboard</h1>
                <p>Manage website content and assets</p>
            </header>

            <div className={styles.content}>
                <section className={styles.uploadSection}>
                    <h2>Upload New Image</h2>
                    <div className={styles.uploadControls}>
                        <div className={styles.fileInputWrapper}>
                            <Input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <Button
                            onClick={handleUpload}
                            disabled={!selectedFile || uploading}
                        >
                            {uploading ? 'Uploading...' : 'Upload Image'}
                        </Button>
                    </div>
                    {feedback && <p className={styles.feedback}>{feedback}</p>}
                </section>

                <section className={styles.gallerySection}>
                    <h2>Media Library</h2>
                    {images.length === 0 ? (
                        <div className={styles.emptyState}>
                            No images found. Upload some to get started.
                            <br />
                            <small>(Make sure Firebase Storage rules allow read/write)</small>
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {images.map((img) => (
                                <div key={img.name} className={styles.card}>
                                    <div className={styles.imageWrapper}>
                                        {/* Standard img for simplicity in admin, could use Next Image */}
                                        <img src={img.url} alt={img.name} className={styles.image} />
                                    </div>
                                    <div className={styles.cardFooter}>
                                        <span className={styles.imageName} title={img.name}>{img.name}</span>
                                        <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(img.url)}>
                                            Copy URL
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
