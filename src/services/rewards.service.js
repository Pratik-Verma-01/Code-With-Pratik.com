/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 Rewards Service
 * 
 * Handles rewards and points system operations.
 */

import { supabase, TABLES } from '@lib/supabase';
import { REWARDS_CONFIG } from '@config/app.config';
import { v4 as uuidv4 } from 'uuid';

/**
 * Reward types and their point values
 */
const REWARD_TYPES = {
  signup_bonus: { points: 100, label: 'Welcome Bonus', description: 'Thanks for joining!' },
  project_upload: { points: 50, label: 'Project Upload', description: 'Shared a new project' },
  first_project: { points: 100, label: 'First Project', description: 'Uploaded your first project' },
  daily_login: { points: 5, label: 'Daily Login', description: 'Daily login bonus' },
  profile_complete: { points: 25, label: 'Profile Complete', description: 'Completed your profile' },
  ten_projects: { points: 200, label: 'Milestone: 10 Projects', description: 'Uploaded 10 projects' },
  hundred_views: { points: 50, label: 'Milestone: 100 Views', description: 'Projects reached 100 views' },
};

/**
 * Rewards Service
 */
export const rewardsService = {
  /**
   * Award points to user
   * @param {string} userId
   * @param {string} type - Reward type
   * @param {number} points - Points to award (overrides default)
   * @param {Object} metadata - Additional metadata
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async awardPoints(userId, type, points = null, metadata = {}) {
    try {
      const rewardConfig = REWARD_TYPES[type];
      const pointsToAward = points || rewardConfig?.points || 0;

      if (pointsToAward <= 0) {
        return { data: null, error: new Error('Invalid points value') };
      }

      // Check for duplicate rewards (prevent abuse)
      const isDuplicate = await this.checkDuplicateReward(userId, type, metadata);
      if (isDuplicate) {
        return { data: null, error: null }; // Silent skip
      }

      // Create reward record
      const reward = {
        id: uuidv4(),
        user_id: userId,
        type,
        points: pointsToAward,
        label: rewardConfig?.label || type,
        description: rewardConfig?.description || '',
        metadata,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from(TABLES.REWARDS)
        .insert(reward)
        .select()
        .single();

      if (error) throw error;

      // Update user's total points
      await this.updateUserTotalPoints(userId, pointsToAward);

      return { data, error: null };
    } catch (error) {
      console.error('Award points error:', error);
      return { data: null, error };
    }
  },

  /**
   * Check for duplicate reward to prevent abuse
   * @param {string} userId
   * @param {string} type
   * @param {Object} metadata
   * @returns {Promise<boolean>}
   */
  async checkDuplicateReward(userId, type, metadata) {
    try {
      // One-time rewards
      const oneTimeRewards = ['signup_bonus', 'first_project', 'profile_complete'];
      if (oneTimeRewards.includes(type)) {
        const { data } = await supabase
          .from(TABLES.REWARDS)
          .select('id')
          .eq('user_id', userId)
          .eq('type', type)
          .limit(1);

        return data && data.length > 0;
      }

      // Project-specific rewards
      if (type === 'project_upload' && metadata.project_id) {
        const { data } = await supabase
          .from(TABLES.REWARDS)
          .select('id')
          .eq('user_id', userId)
          .eq('type', type)
          .contains('metadata', { project_id: metadata.project_id })
          .limit(1);

        return data && data.length > 0;
      }

      // Daily rewards (only once per day)
      if (type === 'daily_login') {
        const today = new Date().toISOString().split('T')[0];
        const { data } = await supabase
          .from(TABLES.REWARDS)
          .select('id')
          .eq('user_id', userId)
          .eq('type', type)
          .gte('created_at', `${today}T00:00:00.000Z`)
          .lte('created_at', `${today}T23:59:59.999Z`)
          .limit(1);

        return data && data.length > 0;
      }

      return false;
    } catch (error) {
      console.error('Check duplicate reward error:', error);
      return false;
    }
  },

  /**
   * Update user's total points
   * @param {string} userId
   * @param {number} pointsDelta
   */
  async updateUserTotalPoints(userId, pointsDelta) {
    try {
      await supabase.rpc('increment_user_points', {
        user_id: userId,
        points_delta: pointsDelta,
      });
    } catch (error) {
      console.error('Update user total points error:', error);
    }
  },

  /**
   * Get user's rewards history
   * @param {string} userId
   * @param {Object} options
   * @returns {Promise<{data: Array, total: number, error: Error|null}>}
   */
  async getUserRewards(userId, options = {}) {
    try {
      const { page = 1, pageSize = 20 } = options;
      const offset = (page - 1) * pageSize;

      const { data, count, error } = await supabase
        .from(TABLES.REWARDS)
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1);

      if (error) throw error;

      return {
        data: data || [],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
        error: null,
      };
    } catch (error) {
      console.error('Get user rewards error:', error);
      return { data: [], total: 0, page: 1, pageSize: 20, totalPages: 0, error };
    }
  },

  /**
   * Get user's total points
   * @param {string} userId
   * @returns {Promise<number>}
   */
  async getUserTotalPoints(userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('total_points')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return data?.total_points || 0;
    } catch (error) {
      console.error('Get user total points error:', error);
      return 0;
    }
  },

  /**
   * Get user's level based on points
   * @param {number} points
   * @returns {Object}
   */
  getUserLevel(points) {
    const levels = REWARDS_CONFIG.levels;
    let currentLevel = levels[0];

    for (const level of levels) {
      if (points >= level.minPoints) {
        currentLevel = level;
      } else {
        break;
      }
    }

    // Find next level
    const currentIndex = levels.findIndex((l) => l.name === currentLevel.name);
    const nextLevel = levels[currentIndex + 1] || null;

    // Calculate progress to next level
    let progressPercent = 100;
    let pointsToNextLevel = 0;

    if (nextLevel) {
      const levelRange = nextLevel.minPoints - currentLevel.minPoints;
      const userProgress = points - currentLevel.minPoints;
      progressPercent = Math.min(100, Math.round((userProgress / levelRange) * 100));
      pointsToNextLevel = nextLevel.minPoints - points;
    }

    return {
      ...currentLevel,
      nextLevel,
      progressPercent,
      pointsToNextLevel,
    };
  },

  /**
   * Get leaderboard
   * @param {number} limit
   * @returns {Promise<Array>}
   */
  async getLeaderboard(limit = 10) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('id, username, full_name, photo_url, total_points')
        .eq('is_blocked', false)
        .order('total_points', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data?.map((user, index) => ({
        ...user,
        rank: index + 1,
        level: this.getUserLevel(user.total_points),
      })) || [];
    } catch (error) {
      console.error('Get leaderboard error:', error);
      return [];
    }
  },

  /**
   * Check and award milestone rewards
   * @param {string} userId
   */
  async checkMilestones(userId) {
    try {
      // Get user stats
      const { count: projectCount } = await supabase
        .from(TABLES.PROJECTS)
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // 10 projects milestone
      if (projectCount >= 10) {
        await this.awardPoints(userId, 'ten_projects');
      }

      // Check profile completion
      const { data: user } = await supabase
        .from(TABLES.USERS)
        .select('full_name, bio, photo_url')
        .eq('id', userId)
        .single();

      if (user?.full_name && user?.bio && user?.photo_url) {
        await this.awardPoints(userId, 'profile_complete');
      }
    } catch (error) {
      console.error('Check milestones error:', error);
    }
  },

  /**
   * Award daily login bonus
   * @param {string} userId
   */
  async awardDailyLogin(userId) {
    await this.awardPoints(userId, 'daily_login');
  },

  // Export reward types
  REWARD_TYPES,
};

export default rewardsService;
