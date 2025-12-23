'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import styles from './Admin.module.css';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import { uploadImage, fetchImages, deleteImage } from '@/lib/firebaseUtils';

interface ImageItem {
    name: string;
    url: string;
}

// Dummy credentials - Replace with proper authentication later
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'kgrunners2026'
};

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState<ImageItem[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [feedback, setFeedback] = useState<string>('');

    useEffect(() => {
        // Check if user is already authenticated in session
        const authStatus = sessionStorage.getItem('adminAuth');
        if (authStatus === 'true') {
            setIsAuthenticated(true);
            loadImages();
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            loadImages();
        }
    }, [isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            setIsAuthenticated(true);
            sessionStorage.setItem('adminAuth', 'true');
        } else {
            setLoginError('Invalid username or password');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('adminAuth');
        setUsername('');
        setPassword('');
    };

    const loadImages = async () => {
        const imgs = await fetchImages();
        setImages(imgs);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const compressImage = (file: File): Promise<File> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1920;
                    const MAX_HEIGHT = 1080;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        if (blob) {
                            const compressedFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            resolve(compressedFile);
                        } else {
                            resolve(file);
                        }
                    }, 'image/jpeg', 0.85);
                };
            };
        });
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setFeedback('Compressing and uploading...');

        try {
            // Compress image before uploading
            const compressedFile = await compressImage(selectedFile);
            const result = await uploadImage(compressedFile, 'gallery');

            if (result.success) {
                setFeedback('Upload successful!');
                setSelectedFile(null);
                loadImages();
                const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
            } else {
                setFeedback('Upload failed. Check console/config.');
            }
        } catch (error) {
            console.error('Upload error:', error);
            setFeedback('Upload failed.');
        }

        setUploading(false);
    };

    const handleDelete = async (imageName: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        setFeedback('Deleting...');
        const result = await deleteImage(imageName, 'gallery');

        if (result.success) {
            setFeedback('Image deleted successfully!');
            loadImages();
        } else {
            setFeedback('Failed to delete image.');
        }
    };

    // Login page
    if (!isAuthenticated) {
        return (
            <div className={styles.loginContainer}>
                <div className={styles.loginBox}>
                    <h1>Admin Login</h1>
                    <p>Please enter your credentials to access the admin dashboard</p>
                    <form onSubmit={handleLogin} className={styles.loginForm}>
                        <Input
                            label="Username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                        {loginError && (
                            <div className={styles.loginError}>{loginError}</div>
                        )}
                        <Button type="submit" fullWidth>
                            Login
                        </Button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>Manage website content and assets</p>
                </div>
                <Button onClick={handleLogout} variant="outline">
                    Logout
                </Button>
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
                            {selectedFile && (
                                <p className={styles.fileName}>Selected: {selectedFile.name}</p>
                            )}
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
                    <h2>Media Library ({images.length} images)</h2>
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
                                        <img src={img.url} alt={img.name} className={styles.image} />
                                    </div>
                                    <div className={styles.cardFooter}>
                                        <span className={styles.imageName} title={img.name}>{img.name}</span>
                                        <div className={styles.cardActions}>
                                            <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(img.url)}>
                                                Copy URL
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => handleDelete(img.name)}>
                                                Delete
                                            </Button>
                                        </div>
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
