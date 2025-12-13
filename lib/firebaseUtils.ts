import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "./firebase";

export const uploadImage = async (file: File, folder: string = 'uploads') => {
    if (!storage) {
        return { success: false, error: "Firebase storage not initialized (missing config?)" };
    }
    try {
        const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return { success: true, url: downloadURL, name: snapshot.ref.name };
    } catch (error) {
        console.error("Error uploading image: ", error);
        return { success: false, error };
    }
};

export const fetchImages = async (folder: string = 'uploads') => {
    if (!storage) return [];

    try {
        const listRef = ref(storage, folder);
        const res = await listAll(listRef);
        const images = await Promise.all(
            res.items.map(async (itemRef) => {
                const url = await getDownloadURL(itemRef);
                return { name: itemRef.name, url };
            })
        );
        return images;
    } catch (error) {
        console.error("Error fetching images: ", error);
        return [];
    }
};
