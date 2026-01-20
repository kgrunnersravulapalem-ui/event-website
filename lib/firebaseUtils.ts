import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy, Timestamp, limit, startAfter, getCountFromServer, DocumentSnapshot, QueryDocumentSnapshot, updateDoc, writeBatch } from "firebase/firestore";
import { storage, db } from "./firebase";
import { ImageMetadata, ImageItem } from "./types/images";

export interface PaginatedResult {
    images: ImageItem[];
    lastDoc: QueryDocumentSnapshot | null;
    hasMore: boolean;
    totalCount: number;
}

/**
 * Upload image to Firebase Storage and save metadata to Firestore
 */
export const uploadImage = async (
    file: File, 
    category: string = 'gallery',
    description?: string,
    tags?: string[]
) => {
    if (!storage || !db) {
        return { success: false, error: "Firebase not initialized (missing config?)" };
    }
    
    try {
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name}`;
        const storageRef = ref(storage, `images/${category}/${fileName}`);
        
        // Upload to storage
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        // Get current max order for category
        const orderQuery = query(
            collection(db, 'image_metadata'),
            where('category', '==', category),
            orderBy('order', 'desc'),
            limit(1)
        );
        const orderSnapshot = await getDocs(orderQuery);
        let maxOrder = 0;
        orderSnapshot.forEach((doc) => {
            const data = doc.data();
            maxOrder = data.order || 0;
        });
        
        // Save metadata to Firestore (filter out undefined values)
        const metadata: Record<string, unknown> = {
            fileName: snapshot.ref.name,
            url: downloadURL,
            category,
            uploadedAt: Timestamp.fromDate(new Date()),
            size: file.size,
            order: maxOrder + 1,
            tags: tags || []
        };
        
        // Only add description if it's defined and not empty
        if (description && description.trim()) {
            metadata.description = description.trim();
        }
        
        const docRef = await addDoc(collection(db, 'image_metadata'), metadata);
        
        return { 
            success: true, 
            url: downloadURL, 
            name: snapshot.ref.name,
            id: docRef.id 
        };
    } catch (error) {
        console.error("Error uploading image: ", error);
        return { success: false, error };
    }
};

/**
 * Fetch images by category from Firestore metadata with pagination
 */
export const fetchImages = async (
    category?: string,
    pageSize: number = 12,
    lastDocument?: QueryDocumentSnapshot | null
): Promise<PaginatedResult> => {
    if (!db) return { images: [], lastDoc: null, hasMore: false, totalCount: 0 };

    try {
        const imagesCollection = collection(db, 'image_metadata');
        
        // Build base query for counting
        let countQuery;
        if (category) {
            countQuery = query(
                imagesCollection,
                where('category', '==', category)
            );
        } else {
            countQuery = query(imagesCollection);
        }
        
        // Get total count
        const countSnapshot = await getCountFromServer(countQuery);
        const totalCount = countSnapshot.data().count;
        
        // Build paginated query - use order for category views, uploadedAt for all
        let q;
        if (category) {
            // For category views, sort by order (ascending)
            if (lastDocument) {
                q = query(
                    imagesCollection,
                    where('category', '==', category),
                    orderBy('order', 'asc'),
                    startAfter(lastDocument),
                    limit(pageSize)
                );
            } else {
                q = query(
                    imagesCollection,
                    where('category', '==', category),
                    orderBy('order', 'asc'),
                    limit(pageSize)
                );
            }
        } else {
            // For all images view, sort by upload date (newest first)
            if (lastDocument) {
                q = query(
                    imagesCollection,
                    orderBy('uploadedAt', 'desc'),
                    startAfter(lastDocument),
                    limit(pageSize)
                );
            } else {
                q = query(
                    imagesCollection,
                    orderBy('uploadedAt', 'desc'),
                    limit(pageSize)
                );
            }
        }
        
        const querySnapshot = await getDocs(q);
        const images: ImageItem[] = [];
        let lastDoc: QueryDocumentSnapshot | null = null;
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            images.push({
                id: doc.id,
                name: data.fileName,
                url: data.url,
                category: data.category,
                uploadedAt: data.uploadedAt?.toDate(),
                order: data.order || 0
            });
            lastDoc = doc;
        });
        
        return {
            images,
            lastDoc,
            hasMore: images.length === pageSize,
            totalCount
        };
    } catch (error) {
        console.error("Error fetching images: ", error);
        return { images: [], lastDoc: null, hasMore: false, totalCount: 0 };
    }
};

/**
 * Get all unique categories from Firestore
 */
export const fetchCategories = async (): Promise<string[]> => {
    if (!db) return [];

    try {
        const querySnapshot = await getDocs(collection(db, 'image_metadata'));
        const categoriesSet = new Set<string>();
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.category) {
                categoriesSet.add(data.category);
            }
        });
        
        return Array.from(categoriesSet).sort();
    } catch (error) {
        console.error("Error fetching categories: ", error);
        return [];
    }
};

/**
 * Delete image from both Storage and Firestore
 */
export const deleteImage = async (imageId: string, imageName: string, category: string) => {
    if (!storage || !db) {
        return { success: false, error: "Firebase not initialized" };
    }

    try {
        // Delete from storage
        const imageRef = ref(storage, `images/${category}/${imageName}`);
        await deleteObject(imageRef);
        
        // Delete metadata from Firestore
        await deleteDoc(doc(db, 'image_metadata', imageId));
        
        return { success: true };
    } catch (error) {
        console.error("Error deleting image: ", error);
        return { success: false, error };
    }
};

/**
 * Update image order - swap two images' positions
 */
export const swapImageOrder = async (
    imageId1: string, 
    order1: number, 
    imageId2: string, 
    order2: number
) => {
    if (!db) {
        return { success: false, error: "Firebase not initialized" };
    }

    try {
        const batch = writeBatch(db);
        
        batch.update(doc(db, 'image_metadata', imageId1), { order: order2 });
        batch.update(doc(db, 'image_metadata', imageId2), { order: order1 });
        
        await batch.commit();
        
        return { success: true };
    } catch (error) {
        console.error("Error swapping image order: ", error);
        return { success: false, error };
    }
};

/**
 * Batch update image orders after drag-and-drop reordering
 */
export const batchUpdateImageOrder = async (
    imageOrders: { id: string; order: number }[]
) => {
    if (!db) {
        return { success: false, error: "Firebase not initialized" };
    }

    try {
        const firestore = db; // Store reference for TypeScript narrowing
        const batch = writeBatch(firestore);
        
        imageOrders.forEach(({ id, order }) => {
            batch.update(doc(firestore, 'image_metadata', id), { order });
        });
        
        await batch.commit();
        
        return { success: true };
    } catch (error) {
        console.error("Error batch updating image order: ", error);
        return { success: false, error };
    }
};

/**
 * Move image to a specific position (reorder)
 */
export const updateImageOrder = async (imageId: string, newOrder: number) => {
    if (!db) {
        return { success: false, error: "Firebase not initialized" };
    }

    try {
        await updateDoc(doc(db, 'image_metadata', imageId), { order: newOrder });
        return { success: true };
    } catch (error) {
        console.error("Error updating image order: ", error);
        return { success: false, error };
    }
};
