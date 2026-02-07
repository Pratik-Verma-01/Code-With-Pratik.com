/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 Firebase Configuration
 * 
 * Firebase is used ONLY for Authentication.
 * All database and storage operations use Supabase.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate configuration
const validateConfig = () => {
  const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
  const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);
  
  if (missingKeys.length > 0) {
    console.error(`Missing Firebase config keys: ${missingKeys.join(', ')}`);
    throw new Error('Firebase configuration is incomplete. Check your environment variables.');
  }
};

// Initialize Firebase (singleton pattern)
let app;
let auth;

try {
  validateConfig();
  
  // Check if already initialized
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  
  auth = getAuth(app);
  
  // Set persistence to local (survives browser restarts)
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error('Error setting auth persistence:', error);
  });
  
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// ===================
// Auth Exports
// ===================
export {
  app,
  auth,
  googleProvider,
  // Firebase Auth methods
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
};

// ===================
// Helper Functions
// ===================

/**
 * Get current authenticated user
 * @returns {User|null}
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Wait for auth state to be determined
 * @returns {Promise<User|null>}
 */
export const waitForAuth = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

/**
 * Get user ID token for API authentication
 * @param {boolean} forceRefresh - Force refresh the token
 * @returns {Promise<string|null>}
 */
export const getIdToken = async (forceRefresh = false) => {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    return await user.getIdToken(forceRefresh);
  } catch (error) {
    console.error('Error getting ID token:', error);
    return null;
  }
};

/**
 * Check if user email is verified
 * @returns {boolean}
 */
export const isEmailVerified = () => {
  const user = auth.currentUser;
  return user?.emailVerified ?? false;
};

/**
 * Get user provider data
 * @returns {Array}
 */
export const getProviderData = () => {
  const user = auth.currentUser;
  return user?.providerData ?? [];
};

/**
 * Check if user signed in with specific provider
 * @param {string} providerId - e.g., 'google.com', 'password'
 * @returns {boolean}
 */
export const hasProvider = (providerId) => {
  const providerData = getProviderData();
  return providerData.some(provider => provider.providerId === providerId);
};

export default { app, auth, googleProvider };
