/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 useRewards Hook
 * 
 * Fetches and manages rewards and points data.
 */

import { useQuery } from '@tanstack/react-query';
import { rewardsService } from '@services/rewards.service';
import { useAuth } from './useAuth';
import { queryKeys } from '@lib/queryClient';

/**
 * Fetch user's rewards history
 * @param {Object} options - Query options
 * @returns {Object} Query result
 */
export function useRewards(options = {}) {
  const { userId, isAuthenticated } = useAuth();
  const { page = 1, pageSize = 20, enabled = true } = options;

  const query = useQuery({
    queryKey: [...queryKeys.rewards.history(userId), { page, pageSize }],
    queryFn: () => rewardsService.getUserRewards(userId, { page, pageSize }),
    enabled: enabled && isAuthenticated && !!userId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    rewards: query.data?.data || [],
    total: query.data?.total || 0,
    totalPages: query.data?.totalPages || 0,
    currentPage: query.data?.page || page,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch user's total points
 * @returns {Object} Query result
 */
export function useTotalPoints() {
  const { userId, isAuthenticated, totalPoints: contextPoints } = useAuth();

  const query = useQuery({
    queryKey: queryKeys.rewards.user(userId),
    queryFn: () => rewardsService.getUserTotalPoints(userId),
    enabled: isAuthenticated && !!userId,
    staleTime: 5 * 60 * 1000,
    initialData: contextPoints,
  });

  return {
    points: query.data || contextPoints || 0,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}

/**
 * Get user's current level
 * @param {number} points - User's total points
 * @returns {Object} Level information
 */
export function useUserLevel(points = 0) {
  const level = rewardsService.getUserLevel(points);

  return {
    name: level.name,
    color: level.color,
    nextLevel: level.nextLevel,
    progressPercent: level.progressPercent,
    pointsToNextLevel: level.pointsToNextLevel,
  };
}

/**
 * Fetch leaderboard
 * @param {number} limit - Number of entries
 * @returns {Object} Query result
 */
export function useLeaderboard(limit = 10) {
  const query = useQuery({
    queryKey: queryKeys.rewards.leaderboard,
    queryFn: () => rewardsService.getLeaderboard(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    leaderboard: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

/**
 * Combined rewards hook
 * @returns {Object} All rewards data
 */
export function useRewardsData() {
  const { points, isLoading: isLoadingPoints } = useTotalPoints();
  const level = useUserLevel(points);
  const { rewards, isLoading: isLoadingRewards } = useRewards();

  return {
    points,
    level,
    rewards,
    isLoading: isLoadingPoints || isLoadingRewards,
  };
}

export default useRewards;
