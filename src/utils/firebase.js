import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

// Helper to get config from localStorage or env
export function getStoredFirebaseConfig() {
  try {
    const fromStorage = localStorage.getItem('ds_roulette_firebase_config');
    if (fromStorage) {
      const parsed = JSON.parse(fromStorage);
      if (parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch (_) {}

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBrujZ_VlX-tJcDyXEsrslaM1tsogwyFpE",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ds-roulette-shivam.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ds-roulette-shivam",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ds-roulette-shivam.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "613838981080",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:613838981080:web:97124c1c003545e00c94ad"
  };
}

export function saveFirebaseConfig(config) {
  try {
    localStorage.setItem('ds_roulette_firebase_config', JSON.stringify(config));
    window.location.reload();
  } catch (_) {}
}

const firebaseConfig = getStoredFirebaseConfig();

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "" && 
  firebaseConfig.projectId
);

let app = null;
let auth = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  } catch (err) {
    console.warn("Firebase initialization error:", err);
  }
}

export { app, auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged };
