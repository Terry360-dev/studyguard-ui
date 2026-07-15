import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyD7XNJxJ6LIClOuN7zw79WmMw-AWbcOQWA',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'project-9cb3a329-4f3d-4cb5-9f5.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'project-9cb3a329-4f3d-4cb5-9f5',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'project-9cb3a329-4f3d-4cb5-9f5.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '699538138514',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:699538138514:web:8a8a424ca06884f6ddcd4b',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-YKZ5ZC4YCK',
};

const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
