/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 useUserProjects Hook
 * 
 * Fetches current user's projects.
 */

import { useQuery } from '@tanstack/react-query';
import { projectsService } from '@services/projects.service';
import { PROJECT_QUERY_KEYS } from '@contexts/ProjectContext';
import { useAuth } from './useAuth';

/**
 * Fetch current user's projects
 * @param {Object} options - Query options
 * @returns {Object} Query result
 */
export function useUserProjects(options = {}) {
  const { userId, isAuthenticated } = useAuth();
  const {
    visibility = null,
    sortBy = 'created_at',
    sortOrder = 'desc',
    enabled = true,
  } = options;

  const query = useQuery({
    queryKey: [...PROJECT_QUERY_KEYS.user(userId), { visibility, sortBy, sortOrder }],
    queryFn: () => projectsService.getUserProjects(userId, { visibility, sortBy, sortOrder }),
    enabled: enabled && isAuthenticated && !!userId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    projects: query.data?.data || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isEmpty: !query.isLoading && (!query.data?.data || query.data.data.length === 0),
  };
}

/**
 * Fetch user's project count
 * @returns {Object} Query result
 */
export function useUserProjectCount() {
  const { userId, isAuthenticated } = useAuth();

  const query = useQuery({
    queryKey: ['projects', 'count', userId],
    queryFn: () => projectsService.getUserProjectCount(userId),
    enabled: isAuthenticated && !!userId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    count: query.data || 0,
    isLoading: query.isLoading,
  };
}

/**
 * Fetch projects for a specific user (not current user)
 * @param {string} targetUserId - Target user ID
 * @param {Object} options - Query options
 * @returns {Object} Query result
 */
export function useProjectsByUser(targetUserId, options = {}) {
  const { sortBy = 'created_at', sortOrder = 'desc', enabled = true } = options;

  const query = useQuery({
    queryKey: [...PROJECT_QUERY_KEYS.user(targetUserId), { visibility: 'public', sortBy, sortOrder }],
    queryFn: () =>
      projectsService.getUserProjects(targetUserId, {
        visibility: 'public',
        sortBy,
        sortOrder,
      }),
    enabled: enabled && !!targetUserId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    projects: query.data?.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export default useUserProjects;
