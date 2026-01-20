import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy, Timestamp, limit, startAfter, getCountFromServer, DocumentSnapshot, QueryDocumentSnapshot } from "firebase/firestore";
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
        
        // Save metadata to Firestore (filter out undefined values)
        const metadata: Record<string, unknown> = {
            fileName: snapshot.ref.name,
            url: downloadURL,
            category,
            uploadedAt: Timestamp.fromDate(new Date()),
            size: file.size,
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
        
        // Build paginated query
        let q;
        if (category) {
            if (lastDocument) {
                q = query(
                    imagesCollection,
                    where('category', '==', category),
                    orderBy('uploadedAt', 'desc'),
                    startAfter(lastDocument),
                    limit(pageSize)
                );
            } else {
                q = query(
                    imagesCollection,
                    where('category', '==', category),
                    orderBy('uploadedAt', 'desc'),
                    limit(pageSize)
                );
            }
        } else {
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
                uploadedAt: data.uploadedAt?.toDate()
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
