import { initializeApp, getApps, getApp } from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut as firebaseSignOut,
} from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
};

function assertConfig() {
    const required = ['apiKey', 'authDomain', 'projectId', 'appId'];
    const missing = required.filter((key) => !firebaseConfig[key]);

    if (missing.length > 0) {
        throw new Error(
            'Firebase is not configured. Add VITE_FIREBASE_* variables to your environment.',
        );
    }
}

export function getFirebaseApp() {
    assertConfig();

    return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth() {
    return getAuth(getFirebaseApp());
}

/**
 * Sign in with Google via Firebase popup and return the ID token.
 */
export async function signInWithGoogleIdToken() {
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();

    return { idToken, user: result.user };
}

/**
 * Clear Firebase client auth so it cannot silently recreate a Laravel session.
 */
export async function clearFirebaseClientAuth() {
    try {
        if (!import.meta.env.VITE_FIREBASE_API_KEY) {
            return;
        }

        await firebaseSignOut(getFirebaseAuth());
    } catch {
        // Ignore client cleanup failures; Laravel session is the source of truth.
    }
}

export function mapFirebaseAuthError(error) {
    const code = error?.code || '';

    switch (code) {
        case 'auth/popup-closed-by-user':
        case 'auth/cancelled-popup-request':
            return 'Google sign-in was cancelled.';
        case 'auth/popup-blocked':
            return 'Your browser blocked the Google sign-in popup. Allow popups and try again.';
        case 'auth/network-request-failed':
            return 'Network error while contacting Google. Check your connection and try again.';
        case 'auth/unauthorized-domain':
            return 'This domain is not authorized for Google sign-in. Contact the site administrator.';
        case 'auth/operation-not-allowed':
            return 'Google sign-in is not enabled for this application.';
        case 'auth/account-exists-with-different-credential':
            return 'An account already exists with this email using a different sign-in method.';
        default:
            if (error?.message?.includes('Firebase is not configured')) {
                return 'Google sign-in is not configured yet.';
            }

            return 'Google authentication failed. Please try again.';
    }
}
