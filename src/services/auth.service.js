/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 Authentication Service
 * 
 * Handles all authentication operations using Firebase Auth.
 * User data is synced to Supabase after authentication.
 */

import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  updateEmail as firebaseUpdateEmail,
  updatePassword as firebaseUpdatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  getIdToken,
} from '@lib/firebase';
import { usersService } from './users.service';
import { rewardsService } from './rewards.service';
import { ERROR_MESSAGES } from '@config/app.config';

/**
 * Parse Firebase auth error to user-friendly message
 * @param {Error} error - Firebase error
 * @returns {string}
 */
const parseAuthError = (error) => {
  const code = error.code || error.message;
  return ERROR_MESSAGES[code] || ERROR_MESSAGES.default;
};

/**
 * Authentication Service
 */
export const authService = {
  /**
   * Sign up with email and password
   * @param {Object} params
   * @param {string} params.email
   * @param {string} params.password
   * @param {string} params.fullName
   * @param {string} params.username
   * @returns {Promise<{user: Object, error: string|null}>}
   */
  async signUpWithEmail({ email, password, fullName, username }) {
    try {
      // Check if username is available
      const isAvailable = await usersService.isUsernameAvailable(username);
      if (!isAvailable) {
        return { user: null, error: 'Username is already taken' };
      }

      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update display name
      await updateProfile(firebaseUser, {
        displayName: fullName,
      });

      // Send email verification
      await sendEmailVerification(firebaseUser);

      // Create user in Supabase
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        full_name: fullName,
        username: username.toLowerCase(),
        photo_url: firebaseUser.photoURL,
        provider: 'email',
        email_verified: false,
        is_blocked: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error: dbError } = await usersService.createUser(userData);
      if (dbError) {
        console.error('Error creating user in database:', dbError);
      }

      // Award signup bonus points
      await rewardsService.awardPoints(firebaseUser.uid, 'signup_bonus', 100);

      return { user: { ...firebaseUser, ...userData }, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { user: null, error: parseAuthError(error) };
    }
  },

  /**
   * Sign in with email and password
   * @param {Object} params
   * @param {string} params.emailOrUsername - Email or username
   * @param {string} params.password
   * @returns {Promise<{user: Object, error: string|null}>}
   */
  async signInWithEmail({ emailOrUsername, password }) {
    try {
      let email = emailOrUsername;

      // Check if input is username (no @ symbol)
      if (!emailOrUsername.includes('@')) {
        const user = await usersService.getUserByUsername(emailOrUsername);
        if (!user) {
          return { user: null, error: 'No account found with this username' };
        }
        email = user.email;
      }

      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Get user data from Supabase
      const userData = await usersService.getUserById(firebaseUser.uid);

      // Check if user is blocked
      if (userData?.is_blocked) {
        await firebaseSignOut(auth);
        return { user: null, error: 'Your account has been blocked. Contact support.' };
      }

      // Update last login
      await usersService.updateUser(firebaseUser.uid, {
        last_login_at: new Date().toISOString(),
        email_verified: firebaseUser.emailVerified,
      });

      return { user: { ...firebaseUser, ...userData }, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { user: null, error: parseAuthError(error) };
    }
  },

  /**
   * Sign in with Google
   * @returns {Promise<{user: Object, isNewUser: boolean, error: string|null}>}
   */
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // Check if user exists in database
      let userData = await usersService.getUserById(firebaseUser.uid);
      let isNewUser = false;

      if (!userData) {
        // New user - create in database
        isNewUser = true;
        
        // Generate unique username from email
        const baseUsername = firebaseUser.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        let username = baseUsername;
        let counter = 1;
        
        while (!(await usersService.isUsernameAvailable(username))) {
          username = `${baseUsername}${counter}`;
          counter++;
        }

        userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          full_name: firebaseUser.displayName || '',
          username,
          photo_url: firebaseUser.photoURL,
          provider: 'google',
          email_verified: firebaseUser.emailVerified,
          is_blocked: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        await usersService.createUser(userData);
        
        // Award signup bonus
        await rewardsService.awardPoints(firebaseUser.uid, 'signup_bonus', 100);
      } else {
        // Check if blocked
        if (userData.is_blocked) {
          await firebaseSignOut(auth);
          return { user: null, isNewUser: false, error: 'Your account has been blocked.' };
        }

        // Update last login
        await usersService.updateUser(firebaseUser.uid, {
          last_login_at: new Date().toISOString(),
          photo_url: firebaseUser.photoURL || userData.photo_url,
        });
      }

      return { user: { ...firebaseUser, ...userData }, isNewUser, error: null };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { user: null, isNewUser: false, error: parseAuthError(error) };
    }
  },

  /**
   * Sign out current user
   * @returns {Promise<{error: string|null}>}
   */
  async signOut() {
    try {
      await firebaseSignOut(auth);
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: parseAuthError(error) };
    }
  },

  /**
   * Send password reset email
   * @param {string} email
   * @returns {Promise<{error: string|null}>}
   */
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error) {
      console.error('Password reset error:', error);
      return { error: parseAuthError(error) };
    }
  },

  /**
   * Resend email verification
   * @returns {Promise<{error: string|null}>}
   */
  async resendVerificationEmail() {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { error: 'No user signed in' };
      }

      await sendEmailVerification(user);
      return { error: null };
    } catch (error) {
      console.error('Verification email error:', error);
      return { error: parseAuthError(error) };
    }
  },

  /**
   * Update user profile
   * @param {Object} data
   * @param {string} data.displayName
   * @param {string} data.photoURL
   * @returns {Promise<{error: string|null}>}
   */
  async updateProfile(data) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { error: 'No user signed in' };
      }

      await updateProfile(user, data);

      // Sync to Supabase
      await usersService.updateUser(user.uid, {
        full_name: data.displayName,
        photo_url: data.photoURL,
        updated_at: new Date().toISOString(),
      });

      return { error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error: parseAuthError(error) };
    }
  },

  /**
   * Update user email
   * @param {string} newEmail
   * @param {string} password - Current password for reauthentication
   * @returns {Promise<{error: string|null}>}
   */
  async updateEmail(newEmail, password) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { error: 'No user signed in' };
      }

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      // Update email
      await firebaseUpdateEmail(user, newEmail);

      // Send verification to new email
      await sendEmailVerification(user);

      // Sync to Supabase
      await usersService.updateUser(user.uid, {
        email: newEmail,
        email_verified: false,
        updated_at: new Date().toISOString(),
      });

      return { error: null };
    } catch (error) {
      console.error('Update email error:', error);
      return { error: parseAuthError(error) };
    }
  },

  /**
   * Update user password
   * @param {string} currentPassword
   * @param {string} newPassword
   * @returns {Promise<{error: string|null}>}
   */
  async updatePassword(currentPassword, newPassword) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { error: 'No user signed in' };
      }

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await firebaseUpdatePassword(user, newPassword);

      return { error: null };
    } catch (error) {
      console.error('Update password error:', error);
      return { error: parseAuthError(error) };
    }
  },

  /**
   * Get current auth token for API calls
   * @param {boolean} forceRefresh
   * @returns {Promise<string|null>}
   */
  async getAuthToken(forceRefresh = false) {
    return getIdToken(forceRefresh);
  },

  /**
   * Get current Firebase user
   * @returns {Object|null}
   */
  getCurrentUser() {
    return auth.currentUser;
  },

  /**
   * Check if email is verified
   * @returns {boolean}
   */
  isEmailVerified() {
    return auth.currentUser?.emailVerified ?? false;
  },
};

export default authService;
