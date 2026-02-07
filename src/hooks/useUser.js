/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 useUser Hook
 * 
 * Fetches and manages user profile data.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@services/users.service';
import { useAuth } from './useAuth';
import { useToast } from './useNotification';
import { queryKeys } from '@lib/queryClient';

/**
 * Fetch user by ID
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @returns {Object} Query result
 */
export function useUser(userId, options = {}) {
  const { enabled = true } = options;

  const query = useQuery({
    queryKey: queryKeys.users.single(userId),
    queryFn: () => usersService.getUserById(userId),
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch user public profile by username
 * @param {string} username - Username
 * @param {Object} options - Query options
 * @returns {Object} Query result
 */
export function useUserProfile(username, options = {}) {
  const { enabled = true } = options;

  const query = useQuery({
    queryKey: queryKeys.users.profile(username),
    queryFn: () => usersService.getPublicProfile(username),
    enabled: enabled && !!username,
    staleTime: 5 * 60 * 1000,
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch user statistics
 * @param {string} userId - User ID
 * @returns {Object} Query result
 */
export function useUserStats(userId) {
  const query = useQuery({
    queryKey: queryKeys.users.stats(userId),
    queryFn: () => usersService.getUserStats(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    stats: query.data || {
      projectsCount: 0,
      totalViews: 0,
      totalDownloads: 0,
      totalPoints: 0,
    },
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

/**
 * Check username availability
 * @param {string} username - Username to check
 * @param {Object} options - Query options
 * @returns {Object} Query result
 */
export function useUsernameAvailability(username, options = {}) {
  const { enabled = true, debounceMs = 300 } = options;

  const query = useQuery({
    queryKey: ['username-check', username],
    queryFn: () => usersService.isUsernameAvailable(username),
    enabled: enabled && username?.length >= 3,
    staleTime: 30 * 1000, // 30 seconds
  });

  return {
    isAvailable: query.data,
    isChecking: query.isLoading || query.isFetching,
    isError: query.isError,
  };
}

/**
 * Hook for profile mutations
 * @returns {Object} Mutation methods
 */
export function useProfileMutations() {
  const queryClient = useQueryClient();
  const { userId, refreshUserData } = useAuth();
  const { success, error } = useToast();

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (profileData) => usersService.updateProfile(userId, profileData),
    onSuccess: async () => {
      await refreshUserData();
      queryClient.invalidateQueries({ queryKey: queryKeys.users.single(userId) });
      success('Profile updated successfully!');
    },
    onError: (err) => {
      error(err.message || 'Failed to update profile');
    },
  });

  // Update avatar mutation
  const updateAvatarMutation = useMutation({
    mutationFn: (file) => usersService.updateAvatar(userId, file),
    onSuccess: async () => {
      await refreshUserData();
      queryClient.invalidateQueries({ queryKey: queryKeys.users.single(userId) });
      success('Avatar updated successfully!');
    },
    onError: (err) => {
      error(err.message || 'Failed to update avatar');
    },
  });

  return {
    updateProfile: updateProfileMutation.mutateAsync,
    updateAvatar: updateAvatarMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    isUpdatingAvatar: updateAvatarMutation.isPending,
    isLoading: updateProfileMutation.isPending || updateAvatarMutation.isPending,
  };
}

export default useUser;
