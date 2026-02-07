/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 Users Service
 * 
 * Handles all user-related database operations.
 */

import { supabase, TABLES } from '@lib/supabase';
import { storageService } from './storage.service';

/**
 * Users Service
 */
export const usersService = {
  /**
   * Create a new user
   * @param {Object} userData
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async createUser(userData) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .insert({
          id: userData.uid,
          email: userData.email,
          username: userData.username?.toLowerCase(),
          full_name: userData.full_name || '',
          photo_url: userData.photo_url || null,
          provider: userData.provider || 'email',
          email_verified: userData.email_verified || false,
          is_blocked: false,
          total_points: 0,
          projects_count: 0,
          bio: null,
          website: null,
          github_url: null,
          twitter_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Create user error:', error);
      return { data: null, error };
    }
  },

  /**
   * Get user by ID
   * @param {string} userId
   * @returns {Promise<Object|null>}
   */
  async getUserById(userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Get user by ID error:', error);
      return null;
    }
  },

  /**
   * Get user by username
   * @param {string} username
   * @returns {Promise<Object|null>}
   */
  async getUserByUsername(username) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('username', username.toLowerCase())
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Get user by username error:', error);
      return null;
    }
  },

  /**
   * Get user by email
   * @param {string} email
   * @returns {Promise<Object|null>}
   */
  async getUserByEmail(email) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Get user by email error:', error);
      return null;
    }
  },

  /**
   * Check if username is available
   * @param {string} username
   * @returns {Promise<boolean>}
   */
  async isUsernameAvailable(username) {
    const user = await this.getUserByUsername(username);
    return user === null;
  },

  /**
   * Check if email is available
   * @param {string} email
   * @returns {Promise<boolean>}
   */
  async isEmailAvailable(email) {
    const user = await this.getUserByEmail(email);
    return user === null;
  },

  /**
   * Update user
   * @param {string} userId
   * @param {Object} updates
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async updateUser(userId, updates) {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      // Handle username update
      if (updates.username) {
        updateData.username = updates.username.toLowerCase();
      }

      const { data, error } = await supabase
        .from(TABLES.USERS)
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Update user error:', error);
      return { data: null, error };
    }
  },

  /**
   * Update user avatar
   * @param {string} userId
   * @param {File} file
   * @returns {Promise<{url: string, error: Error|null}>}
   */
  async updateAvatar(userId, file) {
    try {
      const result = await storageService.uploadAvatar(userId, file);

      await this.updateUser(userId, { photo_url: result.url });

      return { url: result.url, error: null };
    } catch (error) {
      console.error('Update avatar error:', error);
      return { url: null, error };
    }
  },

  /**
   * Update user profile
   * @param {string} userId
   * @param {Object} profileData
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async updateProfile(userId, profileData) {
    try {
      const updates = {};

      // Only include allowed fields
      const allowedFields = [
        'full_name',
        'username',
        'bio',
        'website',
        'github_url',
        'twitter_url',
      ];

      allowedFields.forEach((field) => {
        if (profileData[field] !== undefined) {
          updates[field] = profileData[field];
        }
      });

      // Validate username if being updated
      if (updates.username) {
        const existingUser = await this.getUserByUsername(updates.username);
        if (existingUser && existingUser.id !== userId) {
          return { data: null, error: new Error('Username is already taken') };
        }
      }

      return this.updateUser(userId, updates);
    } catch (error) {
      console.error('Update profile error:', error);
      return { data: null, error };
    }
  },

  /**
   * Get user stats
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getUserStats(userId) {
    try {
      // Get project count
      const { count: projectsCount } = await supabase
        .from(TABLES.PROJECTS)
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get total views
      const { data: viewsData } = await supabase
        .from(TABLES.PROJECTS)
        .select('view_count')
        .eq('user_id', userId);

      const totalViews = viewsData?.reduce((sum, p) => sum + (p.view_count || 0), 0) || 0;

      // Get total downloads
      const { data: downloadsData } = await supabase
        .from(TABLES.PROJECTS)
        .select('download_count')
        .eq('user_id', userId);

      const totalDownloads = downloadsData?.reduce((sum, p) => sum + (p.download_count || 0), 0) || 0;

      // Get total points
      const { data: userData } = await supabase
        .from(TABLES.USERS)
        .select('total_points')
        .eq('id', userId)
        .single();

      return {
        projectsCount: projectsCount || 0,
        totalViews,
        totalDownloads,
        totalPoints: userData?.total_points || 0,
      };
    } catch (error) {
      console.error('Get user stats error:', error);
      return {
        projectsCount: 0,
        totalViews: 0,
        totalDownloads: 0,
        totalPoints: 0,
      };
    }
  },

  /**
   * Get user's public profile
   * @param {string} username
   * @returns {Promise<Object|null>}
   */
  async getPublicProfile(username) {
    try {
      const { data: user, error } = await supabase
        .from(TABLES.USERS)
        .select(`
          id,
          username,
          full_name,
          photo_url,
          bio,
          website,
          github_url,
          twitter_url,
          total_points,
          created_at
        `)
        .eq('username', username.toLowerCase())
        .eq('is_blocked', false)
        .single();

      if (error) return null;

      // Get public projects
      const { data: projects } = await supabase
        .from(TABLES.PROJECTS)
        .select('id, title, slug, short_description, thumbnail_url, primary_language, view_count, created_at')
        .eq('user_id', user.id)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(10);

      // Get stats
      const stats = await this.getUserStats(user.id);

      return {
        ...user,
        projects: projects || [],
        stats,
      };
    } catch (error) {
      console.error('Get public profile error:', error);
      return null;
    }
  },

  /**
   * Block/Unblock user (admin only)
   * @param {string} userId
   * @param {boolean} isBlocked
   * @returns {Promise<{error: Error|null}>}
   */
  async setUserBlocked(userId, isBlocked) {
    return this.updateUser(userId, { is_blocked: isBlocked });
  },

  /**
   * Delete user account
   * @param {string} userId
   * @returns {Promise<{error: Error|null}>}
   */
  async deleteUser(userId) {
    try {
      // Delete user's projects and files
      const { data: projects } = await supabase
        .from(TABLES.PROJECTS)
        .select('id')
        .eq('user_id', userId);

      if (projects) {
        for (const project of projects) {
          await storageService.deleteProjectFiles(project.id);
        }
      }

      // Delete projects
      await supabase.from(TABLES.PROJECTS).delete().eq('user_id', userId);

      // Delete avatar
      await storageService.deleteUserAvatars(userId);

      // Delete rewards
      await supabase.from(TABLES.REWARDS).delete().eq('user_id', userId);

      // Delete notifications
      await supabase.from(TABLES.NOTIFICATIONS).delete().eq('user_id', userId);

      // Delete user
      const { error } = await supabase.from(TABLES.USERS).delete().eq('id', userId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Delete user error:', error);
      return { error };
    }
  },
};

export default usersService;
