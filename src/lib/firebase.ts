import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    UserCredential,
    signOut
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
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

// Helper function to store/update user data
export const storeUserData = async (user: any, provider: string = 'email') => {
    try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        const userData = {
            uid: user.uid,
            email: user.email,
            name: user.displayName || user.email?.split('@')[0],
            photoURL: user.photoURL,
            provider: provider,
            lastLogin: new Date().toISOString(),
            createdAt: userDoc.exists() ? userDoc.data().createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await setDoc(userRef, userData, { merge: true });
        return userData;
    } catch (error) {
        console.error('Error storing user data:', error);
        throw error;
    }
};

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