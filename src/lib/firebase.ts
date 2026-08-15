import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    UserCredential,
    signOut
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDummyApiKeyForBuild123456789',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo-app.firebaseapp.com',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-app',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-app.appspot.com',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:1234567890:web:abcdef123456'
};

// Initialize Firebase
let app: FirebaseApp;

if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();


export const signInWithGoogle = async (): Promise<UserCredential> => {
    return signInWithPopup(auth, googleProvider);
};

export const signInWithGitHub = async (): Promise<UserCredential> => {
    return signInWithPopup(auth, githubProvider);
};
export const logout = async (): Promise<void> => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
};
export default app;