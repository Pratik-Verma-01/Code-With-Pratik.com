import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper: Fetch extra user data (role, blocked status, points)
  const fetchUserProfile = async (uid) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // SECURITY: Blocked User Check
        if (data.isBlocked) {
          await signOut(auth);
          toast.error("Account blocked. Contact Admin.");
          return null;
        }
        return data;
      }
      return null;
    } catch (error) {
      console.error("Profile Fetch Error", error);
      return null;
    }
  };

  const signup = async (email, password, username, fullName) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create User Doc in Firestore
    const userData = {
      uid: user.uid,
      email: user.email,
      username: username,
      fullName: fullName,
      photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${fullName}&background=00f3ff&color=fff`,
      createdAt: serverTimestamp(),
      isBlocked: false,
      points: 10, // Signup bonus
      provider: 'email'
    };

    await setDoc(doc(db, 'users', user.uid), userData);
    await updateProfile(user, { displayName: fullName, photoURL: userData.photoURL });
    
    setUserProfile(userData);
    return user;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if new user
    const profile = await fetchUserProfile(user.uid);
    if (!profile) {
      // Create Doc for Google User
      const userData = {
        uid: user.uid,
        email: user.email,
        username: user.email.split('@')[0], // Temporary username
        fullName: user.displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        isBlocked: false,
        points: 10,
        provider: 'google'
      };
      await setDoc(doc(db, 'users', user.uid), userData);
      setUserProfile(userData);
    } else {
      setUserProfile(profile);
    }
    return user;
  };

  const logout = () => {
    setUserProfile(null);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        const profile = await fetchUserProfile(user.uid);
        if (profile) {
          setCurrentUser(user);
          setUserProfile(profile);
        } else {
          // If profile fetch failed (blocked or error), state is already handled in fetchUserProfile
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
