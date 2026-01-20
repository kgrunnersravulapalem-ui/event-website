'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import styles from './Admin.module.css';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import { uploadImage, fetchImages, deleteImage, fetchCategories, batchUpdateImageOrder, PaginatedResult } from '@/lib/firebaseUtils';
import { ImageItem, DEFAULT_CATEGORIES } from '@/lib/types/images';
import { QueryDocumentSnapshot } from 'firebase/firestore';

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
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [feedback, setFeedback] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('gallery');
    const [customCategory, setCustomCategory] = useState<string>('');
    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [allCategories, setAllCategories] = useState<string[]>([...DEFAULT_CATEGORIES]);
    const [description, setDescription] = useState<string>('');
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
    const [reorderMode, setReorderMode] = useState<boolean>(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [isSavingOrder, setIsSavingOrder] = useState<boolean>(false);
    const IMAGES_PER_PAGE = 12;

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
            loadCategories();
            loadImages(filterCategory);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            setLastDoc(null); // Reset pagination when filter changes
            loadImages(filterCategory);
        }
    }, [filterCategory]);

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

    const loadImages = async (category?: string, loadMore: boolean = false) => {
        if (loadMore) {
            setLoadingMore(true);
        }
        
        const result = await fetchImages(
            category === 'all' ? undefined : category,
            IMAGES_PER_PAGE,
            loadMore ? lastDoc : null
        );
        
        if (loadMore) {
            setImages(prev => [...prev, ...result.images]);
        } else {
            setImages(result.images);
        }
        
        setLastDoc(result.lastDoc);
        setHasMore(result.hasMore);
        setTotalCount(result.totalCount);
        setLoadingMore(false);
    };

    const handleLoadMore = () => {
        loadImages(filterCategory, true);
    };

    const loadCategories = async () => {
        const cats = await fetchCategories();
        const uniqueCategories = Array.from(new Set([...DEFAULT_CATEGORIES, ...cats]));
        setAllCategories(uniqueCategories);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const removeSelectedFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
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
        if (selectedFiles.length === 0) return;

        const categoryToUse = isCustomCategory ? customCategory.trim().toLowerCase() : selectedCategory;
        
        if (!categoryToUse) {
            setFeedback('Please select or enter a category');
            return;
        }

        setUploading(true);
        setUploadProgress({ current: 0, total: selectedFiles.length });
        
        let successCount = 0;
        let failCount = 0;

        try {
            for (let i = 0; i < selectedFiles.length; i++) {
                setUploadProgress({ current: i + 1, total: selectedFiles.length });
                setFeedback(`Compressing and uploading image ${i + 1} of ${selectedFiles.length}...`);
                
                // Compress image before uploading
                const compressedFile = await compressImage(selectedFiles[i]);
                const result = await uploadImage(
                    compressedFile, 
                    categoryToUse,
                    description || undefined
                );

                if (result.success) {
                    successCount++;
                } else {
                    failCount++;
                }
            }

            if (failCount === 0) {
                setFeedback(`✅ All ${successCount} images uploaded successfully to "${categoryToUse}"!`);
            } else {
                setFeedback(`⚠️ ${successCount} uploaded, ${failCount} failed. Check console for errors.`);
            }
            
            setSelectedFiles([]);
            setDescription('');
            setCustomCategory('');
            setLastDoc(null); // Reset pagination
            loadImages(filterCategory);
            loadCategories();
            const fileInput = document.getElementById('file-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        } catch (error) {
            console.error('Upload error:', error);
            setFeedback('Upload failed.');
        }

        setUploading(false);
        setUploadProgress(null);
    };

    const handleDelete = async (imageId: string, imageName: string, category: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        setFeedback('Deleting...');
        const result = await deleteImage(imageId, imageName, category);

        if (result.success) {
            setFeedback('Image deleted successfully!');
            setLastDoc(null); // Reset pagination
            loadImages(filterCategory);
            loadCategories();
        } else {
            setFeedback('Failed to delete image.');
        }
    };

    // Drag and Drop Handlers
    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index.toString());
        // Add a slight delay to show the dragging state
        setTimeout(() => {
            const target = e.target as HTMLElement;
            target.style.opacity = '0.5';
        }, 0);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        const target = e.target as HTMLElement;
        target.style.opacity = '1';
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (draggedIndex !== null && draggedIndex !== index) {
            setDragOverIndex(index);
        }
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        
        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }

        // Reorder images locally first for instant feedback
        const newImages = [...images];
        const [draggedItem] = newImages.splice(draggedIndex, 1);
        newImages.splice(dropIndex, 0, draggedItem);
        setImages(newImages);
        
        setDraggedIndex(null);
        setDragOverIndex(null);
        setFeedback('Saving new order...');
        setIsSavingOrder(true);

        // Update order values for all affected images
        const imageOrders = newImages.map((img, idx) => ({
            id: img.id!,
            order: idx + 1
        }));

        const result = await batchUpdateImageOrder(imageOrders);
        
        setIsSavingOrder(false);
        if (result.success) {
            setFeedback('✓ Order saved!');
            setTimeout(() => setFeedback(''), 2000);
        } else {
            setFeedback('Failed to save order. Please try again.');
            // Reload images to restore correct order
            loadImages(filterCategory);
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
                    <div className={styles.uploadForm}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="category-select">Category</label>
                                <select
                                    id="category-select"
                                    value={isCustomCategory ? 'custom' : selectedCategory}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === 'custom') {
                                            setIsCustomCategory(true);
                                        } else {
                                            setIsCustomCategory(false);
                                            setSelectedCategory(value);
                                        }
                                    }}
                                    className={styles.selectInput}
                                >
                                    {allCategories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                    <option value="custom">+ Custom Category</option>
                                </select>
                            </div>
                            
                            {isCustomCategory && (
                                <div className={styles.formGroup}>
                                    <label htmlFor="custom-category">Custom Category Name</label>
                                    <Input
                                        id="custom-category"
                                        type="text"
                                        value={customCategory}
                                        onChange={(e) => setCustomCategory(e.target.value)}
                                        placeholder="e.g., team-photos"
                                    />
                                </div>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="description">Description (Optional - applies to all)</label>
                            <Input
                                id="description"
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add a description for these images"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="file-upload">Select Images (Multiple allowed)</label>
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                className={styles.fileInput}
                            />
                            {selectedFiles.length > 0 && (
                                <div className={styles.selectedFiles}>
                                    <p className={styles.fileCount}>{selectedFiles.length} file(s) selected</p>
                                    <div className={styles.fileList}>
                                        {selectedFiles.map((file, index) => (
                                            <div key={index} className={styles.fileItem}>
                                                <span>{file.name}</span>
                                                <button 
                                                    type="button"
                                                    onClick={() => removeSelectedFile(index)}
                                                    className={styles.removeFileBtn}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {uploadProgress && (
                            <div className={styles.progressBar}>
                                <div 
                                    className={styles.progressFill}
                                    style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                                />
                                <span className={styles.progressText}>
                                    {uploadProgress.current} / {uploadProgress.total}
                                </span>
                            </div>
                        )}

                        <Button
                            onClick={handleUpload}
                            disabled={selectedFiles.length === 0 || uploading}
                            fullWidth
                        >
                            {uploading 
                                ? `Uploading ${uploadProgress?.current || 0}/${uploadProgress?.total || 0}...` 
                                : `Upload ${selectedFiles.length || ''} Image${selectedFiles.length !== 1 ? 's' : ''}`}
                        </Button>
                    </div>
                    {feedback && <p className={styles.feedback}>{feedback}</p>}
                </section>

                <section className={styles.gallerySection}>
                    <div className={styles.galleryHeader}>
                        <h2>Media Library ({images.length} of {totalCount} images)</h2>
                        <div className={styles.headerControls}>
                            <div className={styles.filterGroup}>
                                <label htmlFor="filter-category">Filter:</label>
                                <select
                                    id="filter-category"
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className={styles.selectInput}
                                    disabled={reorderMode}
                                >
                                    <option value="all">All Categories</option>
                                    {allCategories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {filterCategory !== 'all' && (
                                <Button 
                                    variant={reorderMode ? "primary" : "outline"} 
                                    size="sm"
                                    onClick={() => setReorderMode(!reorderMode)}
                                    disabled={isSavingOrder}
                                >
                                    {reorderMode ? '✓ Done' : '↕ Reorder'}
                                </Button>
                            )}
                        </div>
                    </div>
                    {reorderMode && (
                        <div className={styles.reorderHint}>
                            🖱️ Drag and drop images to reorder them. Changes are saved automatically.
                        </div>
                    )}
                    {images.length === 0 ? (
                        <div className={styles.emptyState}>
                            {filterCategory === 'all' 
                                ? 'No images found. Upload some to get started.'
                                : `No images found in "${filterCategory}" category.`}
                            <br />
                            <small>(Make sure Firebase Storage rules allow read/write)</small>
                        </div>
                    ) : (
                        <div className={`${styles.grid} ${reorderMode ? styles.reorderGrid : ''}`}>
                            {images.map((img, index) => (
                                <div 
                                    key={img.id || img.name} 
                                    className={`${styles.card} ${reorderMode ? styles.draggableCard : ''} ${dragOverIndex === index ? styles.dragOver : ''} ${draggedIndex === index ? styles.dragging : ''}`}
                                    draggable={reorderMode}
                                    onDragStart={(e) => reorderMode && handleDragStart(e, index)}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={(e) => reorderMode && handleDragOver(e, index)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => reorderMode && handleDrop(e, index)}
                                >
                                    {reorderMode && (
                                        <div className={styles.dragHandle}>
                                            <span className={styles.dragIcon}>⋮⋮</span>
                                            <span className={styles.orderNumber}>{index + 1}</span>
                                        </div>
                                    )}
                                    <div 
                                        className={styles.imageWrapper}
                                        onClick={() => {
                                            if (!reorderMode) {
                                                navigator.clipboard.writeText(img.url);
                                                setFeedback(`URL copied to clipboard!`);
                                                setTimeout(() => setFeedback(''), 2000);
                                            }
                                        }}
                                        title={reorderMode ? "Drag to reorder" : "Click to copy URL"}
                                    >
                                        <img src={img.url} alt={img.name} className={styles.image} />
                                        {!reorderMode && (
                                            <div className={styles.copyOverlay}>
                                                <span>📋 Click to copy URL</span>
                                            </div>
                                        )}
                                        {img.category && !reorderMode && (
                                            <span className={styles.categoryBadge}>
                                                {img.category}
                                            </span>
                                        )}
                                    </div>
                                    {!reorderMode && (
                                        <div className={styles.cardFooter}>
                                            <span className={styles.imageName} title={img.name}>{img.name}</span>
                                            <div className={styles.cardActions}>
                                                <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(img.url)}>
                                                    Copy URL
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => handleDelete(img.id!, img.name, img.category!)}>
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {hasMore && (
                        <div className={styles.loadMoreWrapper}>
                            <Button 
                                onClick={handleLoadMore} 
                                disabled={loadingMore}
                                variant="outline"
                            >
                                {loadingMore ? 'Loading...' : `Load More (${totalCount - images.length} remaining)`}
                            </Button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
