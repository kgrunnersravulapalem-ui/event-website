import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  // apiKey: "AIzaSyCrqHyb6-2gwTzl_SRHtJ7svSDM6zqU8Xs",
  // authDomain: "konaseema-run.firebaseapp.com",
  // projectId: "konaseema-run",
  // storageBucket: "konaseema-run.firebasestorage.app",
  // messagingSenderId: "866739988328",
  // appId: "1:866739988328:web:99f28290a4aba00e67d8dd",
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if config is valid (at least apiKey)
const isConfigValid = !!firebaseConfig.apiKey;

let app: FirebaseApp | undefined;
let storage: FirebaseStorage | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;

try {
  if (isConfigValid) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    storage = getStorage(app);
    db = getFirestore(app);
    auth = getAuth(app);
  } else {
    // During build or if keys missing, logging warning
    if (typeof window !== "undefined") {
      console.warn("Firebase config missing. Features disabled. Check .env variables.");
    }
  }
} catch (e) {
  console.error("Firebase init error:", e);
}

export { app, storage, db, auth };
