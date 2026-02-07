/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 Notifications Service
 * 
 * Handles user notifications operations.
 */

import { supabase, TABLES, subscribeToUserChanges } from '@lib/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Notification types
 */
const NOTIFICATION_TYPES = {
  SYSTEM: 'system',
  REWARD: 'reward',
  PROJECT: 'project',
  MILESTONE: 'milestone',
  WELCOME: 'welcome',
};

/**
 * Notifications Service
 */
export const notificationsService = {
  /**
   * Create a notification
   * @param {Object} notificationData
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async createNotification(notificationData) {
    try {
      const notification = {
        id: uuidv4(),
        user_id: notificationData.userId,
        type: notificationData.type || NOTIFICATION_TYPES.SYSTEM,
        title: notificationData.title,
        message: notificationData.message,
        icon: notificationData.icon || null,
        action_url: notificationData.actionUrl || null,
        metadata: notificationData.metadata || {},
        is_read: false,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .insert(notification)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Create notification error:', error);
      return { data: null, error };
    }
  },

  /**
   * Get user's notifications
   * @param {string} userId
   * @param {Object} options
   * @returns {Promise<{data: Array, unreadCount: number, error: Error|null}>}
   */
  async getUserNotifications(userId, options = {}) {
    try {
      const { page = 1, pageSize = 20, unreadOnly = false } = options;
      const offset = (page - 1) * pageSize;

      let query = supabase
        .from(TABLES.NOTIFICATIONS)
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1);

      if (unreadOnly) {
        query = query.eq('is_read', false);
      }

      const { data, count, error } = await query;

      if (error) throw error;

      // Get unread count
      const { count: unreadCount } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      return {
        data: data || [],
        total: count || 0,
        unreadCount: unreadCount || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
        error: null,
      };
    } catch (error) {
      console.error('Get user notifications error:', error);
      return { data: [], total: 0, unreadCount: 0, page: 1, pageSize: 20, totalPages: 0, error };
    }
  },

  /**
   * Get unread notification count
   * @param {string} userId
   * @returns {Promise<number>}
   */
  async getUnreadCount(userId) {
    try {
      const { count, error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;

      return count || 0;
    } catch (error) {
      console.error('Get unread count error:', error);
      return 0;
    }
  },

  /**
   * Mark notification as read
   * @param {string} notificationId
   * @param {string} userId
   * @returns {Promise<{error: Error|null}>}
   */
  async markAsRead(notificationId, userId) {
    try {
      const { error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Mark as read error:', error);
      return { error };
    }
  },

  /**
   * Mark all notifications as read
   * @param {string} userId
   * @returns {Promise<{error: Error|null}>}
   */
  async markAllAsRead(userId) {
    try {
      const { error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Mark all as read error:', error);
      return { error };
    }
  },

  /**
   * Delete notification
   * @param {string} notificationId
   * @param {string} userId
   * @returns {Promise<{error: Error|null}>}
   */
  async deleteNotification(notificationId, userId) {
    try {
      const { error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Delete notification error:', error);
      return { error };
    }
  },

  /**
   * Delete all notifications for user
   * @param {string} userId
   * @returns {Promise<{error: Error|null}>}
   */
  async deleteAllNotifications(userId) {
    try {
      const { error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Delete all notifications error:', error);
      return { error };
    }
  },

  /**
   * Subscribe to user's notifications in realtime
   * @param {string} userId
   * @param {Function} callback
   * @returns {Function} Unsubscribe function
   */
  subscribeToNotifications(userId, callback) {
    return subscribeToUserChanges(userId, TABLES.NOTIFICATIONS, (payload) => {
      callback(payload);
    });
  },

  /**
   * Send welcome notification
   * @param {string} userId
   * @param {string} fullName
   */
  async sendWelcomeNotification(userId, fullName) {
    await this.createNotification({
      userId,
      type: NOTIFICATION_TYPES.WELCOME,
      title: 'Welcome to CODE-With-PRATIK! 🎉',
      message: `Hey ${fullName || 'there'}! We're excited to have you. Start by uploading your first project or exploring what others have shared.`,
      icon: '👋',
      actionUrl: '/dashboard/upload',
    });
  },

  /**
   * Send reward notification
   * @param {string} userId
   * @param {string} rewardLabel
   * @param {number} points
   */
  async sendRewardNotification(userId, rewardLabel, points) {
    await this.createNotification({
      userId,
      type: NOTIFICATION_TYPES.REWARD,
      title: `You earned ${points} points! 🏆`,
      message: `Congratulations! You received "${rewardLabel}" reward.`,
      icon: '⭐',
      actionUrl: '/dashboard/rewards',
      metadata: { points, rewardLabel },
    });
  },

  /**
   * Send project notification
   * @param {string} userId
   * @param {string} action
   * @param {Object} projectData
   */
  async sendProjectNotification(userId, action, projectData) {
    const messages = {
      created: `Your project "${projectData.title}" has been published successfully!`,
      updated: `Your project "${projectData.title}" has been updated.`,
      milestone_views: `Your project "${projectData.title}" reached ${projectData.views} views! 🎊`,
    };

    await this.createNotification({
      userId,
      type: NOTIFICATION_TYPES.PROJECT,
      title: action === 'milestone_views' ? 'Project Milestone! 🎯' : 'Project Update',
      message: messages[action] || `Update on "${projectData.title}"`,
      icon: '📁',
      actionUrl: `/dashboard/project/${projectData.slug}`,
      metadata: { projectId: projectData.id, action },
    });
  },

  // Export notification types
  NOTIFICATION_TYPES,
};

export default notificationsService;
