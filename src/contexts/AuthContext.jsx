/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 Authentication Context
 * 
 * Manages authentication state, user data, and auth operations.
 * Syncs Firebase Auth with Supabase user data.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { auth, onAuthStateChanged } from '@lib/firebase';
import { authService } from '@services/auth.service';
import { usersService } from '@services/users.service';
import { rewardsService } from '@services/rewards.service';
import { notificationsService } from '@services/notifications.service';
import { STORAGE_KEYS } from '@config/app.config';

// Create Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export function AuthProvider({ children }) {
  // State
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [authError, setAuthError] = useState(null);

  /**
   * Fetch user data from Supabase
   */
  const fetchUserData = useCallback(async (firebaseUser) => {
    try {
      const data = await usersService.getUserById(firebaseUser.uid);
      
      if (data) {
        setUserData(data);
        setIsBlocked(data.is_blocked || false);
        
        // Award daily login bonus
        await rewardsService.awardDailyLogin(firebaseUser.uid);
        
        return data;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }, []);

  /**
   * Handle auth state changes
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      setAuthError(null);

      try {
        if (firebaseUser) {
          // User is signed in
          setUser(firebaseUser);
          setIsAuthenticated(true);
          setIsEmailVerified(firebaseUser.emailVerified);

          // Fetch additional user data from Supabase
          const data = await fetchUserData(firebaseUser);
          
          if (data?.is_blocked) {
            // User is blocked - sign out
            await authService.signOut();
            setUser(null);
            setUserData(null);
            setIsAuthenticated(false);
            setIsBlocked(true);
            setAuthError('Your account has been blocked. Contact support.');
          }

          // Store minimal auth state in localStorage
          localStorage.setItem(STORAGE_KEYS.user, JSON.stringify({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
          }));
        } else {
          // User is signed out
          setUser(null);
          setUserData(null);
          setIsAuthenticated(false);
          setIsEmailVerified(false);
          setIsBlocked(false);
          
          // Clear localStorage
          localStorage.removeItem(STORAGE_KEYS.user);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setAuthError(error.message);
      } finally {
        setIsLoading(false);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [fetchUserData]);

  /**
   * Sign up with email and password
   */
  const signUp = useCallback(async ({ email, password, fullName, username }) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const result = await authService.signUpWithEmail({
        email,
        password,
        fullName,
        username,
      });

      if (result.error) {
        setAuthError(result.error);
        return { success: false, error: result.error };
      }

      // Send welcome notification
      await notificationsService.sendWelcomeNotification(result.user.uid, fullName);

      return { success: true, user: result.user };
    } catch (error) {
      const errorMessage = error.message || 'Sign up failed';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Sign in with email/username and password
   */
  const signIn = useCallback(async ({ emailOrUsername, password }) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const result = await authService.signInWithEmail({
        emailOrUsername,
        password,
      });

      if (result.error) {
        setAuthError(result.error);
        return { success: false, error: result.error };
      }

      return { success: true, user: result.user };
    } catch (error) {
      const errorMessage = error.message || 'Sign in failed';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Sign in with Google
   */
  const signInWithGoogle = useCallback(async () => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const result = await authService.signInWithGoogle();

      if (result.error) {
        setAuthError(result.error);
        return { success: false, error: result.error };
      }

      // Send welcome notification for new users
      if (result.isNewUser) {
        await notificationsService.sendWelcomeNotification(
          result.user.uid,
          result.user.displayName
        );
      }

      return { success: true, user: result.user, isNewUser: result.isNewUser };
    } catch (error) {
      const errorMessage = error.message || 'Google sign in failed';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Sign out
   */
  const signOut = useCallback(async () => {
    setIsLoading(true);

    try {
      await authService.signOut();
      setUser(null);
      setUserData(null);
      setIsAuthenticated(false);
      setAuthError(null);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Sign out failed';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Reset password
   */
  const resetPassword = useCallback(async (email) => {
    setAuthError(null);

    try {
      const result = await authService.resetPassword(email);

      if (result.error) {
        setAuthError(result.error);
        return { success: false, error: result.error };
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Password reset failed';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Resend verification email
   */
  const resendVerificationEmail = useCallback(async () => {
    try {
      const result = await authService.resendVerificationEmail();

      if (result.error) {
        return { success: false, error: result.error };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Update profile
   */
  const updateProfile = useCallback(async (profileData) => {
    try {
      // Update Firebase profile
      if (profileData.fullName || profileData.photoURL) {
        await authService.updateProfile({
          displayName: profileData.fullName,
          photoURL: profileData.photoURL,
        });
      }

      // Update Supabase user data
      const result = await usersService.updateProfile(user.uid, {
        full_name: profileData.fullName,
        username: profileData.username,
        bio: profileData.bio,
        website: profileData.website,
        github_url: profileData.githubUrl,
        twitter_url: profileData.twitterUrl,
      });

      if (result.error) {
        return { success: false, error: result.error.message };
      }

      // Refresh user data
      await fetchUserData(user);

      // Check milestones
      await rewardsService.checkMilestones(user.uid);

      return { success: true, data: result.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [user, fetchUserData]);

  /**
   * Update avatar
   */
  const updateAvatar = useCallback(async (file) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      const result = await usersService.updateAvatar(user.uid, file);

      if (result.error) {
        return { success: false, error: result.error.message };
      }

      // Update Firebase profile
      await authService.updateProfile({ photoURL: result.url });

      // Refresh user data
      await fetchUserData(user);

      return { success: true, url: result.url };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [user, fetchUserData]);

  /**
   * Update email
   */
  const updateEmail = useCallback(async (newEmail, password) => {
    try {
      const result = await authService.updateEmail(newEmail, password);

      if (result.error) {
        return { success: false, error: result.error };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Update password
   */
  const updatePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      const result = await authService.updatePassword(currentPassword, newPassword);

      if (result.error) {
        return { success: false, error: result.error };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Refresh user data
   */
  const refreshUserData = useCallback(async () => {
    if (user) {
      await fetchUserData(user);
    }
  }, [user, fetchUserData]);

  /**
   * Get auth token for API calls
   */
  const getAuthToken = useCallback(async () => {
    return authService.getAuthToken();
  }, []);

  /**
   * Clear auth error
   */
  const clearError = useCallback(() => {
    setAuthError(null);
  }, []);

  // Memoized context value
  const contextValue = useMemo(() => ({
    // State
    user,
    userData,
    isLoading,
    isAuthenticated,
    isEmailVerified,
    isBlocked,
    authError,

    // Computed
    displayName: userData?.full_name || user?.displayName || '',
    username: userData?.username || '',
    email: user?.email || '',
    photoURL: userData?.photo_url || user?.photoURL || '',
    userId: user?.uid || null,
    totalPoints: userData?.total_points || 0,
    provider: userData?.provider || 'email',

    // Actions
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    resendVerificationEmail,
    updateProfile,
    updateAvatar,
    updateEmail,
    updatePassword,
    refreshUserData,
    getAuthToken,
    clearError,
  }), [
    user,
    userData,
    isLoading,
    isAuthenticated,
    isEmailVerified,
    isBlocked,
    authError,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    resendVerificationEmail,
    updateProfile,
    updateAvatar,
    updateEmail,
    updatePassword,
    refreshUserData,
    getAuthToken,
    clearError,
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use auth context
 */
export function useAuthContext() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
}

export default AuthContext;
