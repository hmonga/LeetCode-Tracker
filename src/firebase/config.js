import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore, persistentLocalCache } from 'firebase/firestore';

import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZFA15f9nrzNFotLuDJ9XVcB9fmWpM0cs",
  authDomain: "leetcodetracker-d8036.firebaseapp.com",
  projectId: "leetcodetracker-d8036",
  storageBucket: "leetcodetracker-d8036.firebasestorage.app",
  messagingSenderId: "467721819207",
  appId: "1:467721819207:web:3dd36f3a7993144e7d4d62",
  measurementId: "G-1QSD9RZ9XF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore with persistent cache (new method)
let db;
if (typeof window !== 'undefined') {
  try {
    db = initializeFirestore(app, {
      localCache: persistentLocalCache()
    });
  } catch (error) {
    // Fallback to regular Firestore if persistence fails
    console.warn('Failed to initialize Firestore with persistence, using default:', error);
    db = getFirestore(app);
  }
} else {
  db = getFirestore(app);
}

export { db };

// Initialize Analytics (only in browser environment)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;

