/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 useAuth Hook
 * 
 * Convenient wrapper around AuthContext for authentication operations.
 */

import { useAuthContext } from '@contexts/AuthContext';

/**
 * Custom hook for authentication
 * @returns {Object} Auth state and methods
 */
export function useAuth() {
  const auth = useAuthContext();
  return auth;
}

/**
 * Hook to check if user is authenticated
 * @returns {boolean}
 */
export function useIsAuthenticated() {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated;
}

/**
 * Hook to get current user
 * @returns {Object|null}
 */
export function useCurrentUser() {
  const { user, userData, userId, displayName, username, email, photoURL } = useAuthContext();
  
  return {
    firebaseUser: user,
    userData,
    userId,
    displayName,
    username,
    email,
    photoURL,
  };
}

/**
 * Hook to check authentication loading state
 * @returns {boolean}
 */
export function useAuthLoading() {
  const { isLoading } = useAuthContext();
  return isLoading;
}

/**
 * Hook to get auth error
 * @returns {string|null}
 */
export function useAuthError() {
  const { authError, clearError } = useAuthContext();
  return { error: authError, clearError };
}

export default useAuth;
