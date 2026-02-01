import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, // Google Popup
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase'; // firebase.js se import
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper: Profile Fetch & Block Check
  const fetchUserProfile = async (uid) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.isBlocked) {
          await signOut(auth);
          toast.error("Account blocked. Contact Admin.");
          return null;
        }
        return data;
      }
      return null;
    } catch (error) {
      console.error("Profile Error", error);
      return null;
    }
  };

  // 1. Email Signup
  const signup = async (email, password, username, fullName) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create Profile
    const userData = {
      uid: user.uid,
      email: user.email,
      username: username,
      fullName: fullName,
      photoURL: `https://ui-avatars.com/api/?name=${fullName}&background=00f3ff&color=fff`,
      createdAt: serverTimestamp(),
      isBlocked: false,
      points: 10,
      provider: 'email'
    };

    await setDoc(doc(db, 'users', user.uid), userData);
    setUserProfile(userData);
    return user;
  };

  // 2. Email Login
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // 3. GOOGLE LOGIN (Updated Logic)
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if profile exists in Firestore
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // New User -> Create Profile
        const userData = {
          uid: user.uid,
          email: user.email,
          username: user.email.split('@')[0], // Generate username from email
          fullName: user.displayName || 'User',
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          isBlocked: false,
          points: 10, // Signup Bonus
          provider: 'google'
        };
        await setDoc(docRef, userData);
        setUserProfile(userData);
        toast.success("Account created via Google!");
      } else {
        // Existing User -> Check if blocked
        const data = docSnap.data();
        if (data.isBlocked) {
          await signOut(auth);
          toast.error("Account blocked.");
          throw new Error("Blocked");
        }
        setUserProfile(data);
        toast.success("Welcome back!");
      }
      return user;
    } catch (error) {
      console.error("Google Auth Error:", error);
      throw error;
    }
  };

  // 4. Logout
  const logout = () => {
    setUserProfile(null);
    return signOut(auth);
  };

  // Session Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        const profile = await fetchUserProfile(user.uid);
        if (profile) {
          setCurrentUser(user);
          setUserProfile(profile);
        } else {
          setCurrentUser(null); 
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    loginWithGoogle,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
