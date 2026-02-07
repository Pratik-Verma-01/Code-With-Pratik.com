/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 useProjects Hook
 * 
 * Fetches and manages public projects with filtering and pagination.
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { projectsService } from '@services/projects.service';
import { PROJECT_QUERY_KEYS } from '@contexts/ProjectContext';

/**
 * Fetch public projects with filtering
 * @param {Object} options - Query options
 * @returns {Object} Query result with projects data
 */
export function useProjects(options = {}) {
  const {
    page = 1,
    pageSize = 12,
    language = null,
    search = '',
    sortBy = 'created_at',
    sortOrder = 'desc',
    enabled = true,
  } = options;

  const queryKey = [
    ...PROJECT_QUERY_KEYS.public,
    { page, pageSize, language, search, sortBy, sortOrder },
  ];

  const query = useQuery({
    queryKey,
    queryFn: () =>
      projectsService.getPublicProjects({
        page,
        pageSize,
        language,
        search,
        sortBy,
        sortOrder,
      }),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true,
  });

  return {
    projects: query.data?.data || [],
    total: query.data?.total || 0,
    totalPages: query.data?.totalPages || 0,
    currentPage: query.data?.page || page,
    hasMore: query.data?.page < query.data?.totalPages,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch public projects with infinite scroll
 * @param {Object} options - Query options
 * @returns {Object} Infinite query result
 */
export function useInfiniteProjects(options = {}) {
  const {
    pageSize = 12,
    language = null,
    search = '',
    sortBy = 'created_at',
    sortOrder = 'desc',
    enabled = true,
  } = options;

  const query = useInfiniteQuery({
    queryKey: [...PROJECT_QUERY_KEYS.public, 'infinite', { language, search, sortBy, sortOrder }],
    queryFn: ({ pageParam = 1 }) =>
      projectsService.getPublicProjects({
        page: pageParam,
        pageSize,
        language,
        search,
        sortBy,
        sortOrder,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });

  // Flatten pages into single array
  const projects = query.data?.pages.flatMap((page) => page.data) || [];

  return {
    projects,
    total: query.data?.pages[0]?.total || 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isFetchingNextPage: query.isFetchingNextPage,
    isError: query.isError,
    error: query.error,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
  };
}

/**
 * Fetch trending projects
 * @param {number} limit - Number of projects to fetch
 * @returns {Object} Query result
 */
export function useTrendingProjects(limit = 6) {
  const query = useQuery({
    queryKey: PROJECT_QUERY_KEYS.trending,
    queryFn: () => projectsService.getTrendingProjects(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    projects: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Fetch recent projects
 * @param {number} limit - Number of projects to fetch
 * @returns {Object} Query result
 */
export function useRecentProjects(limit = 6) {
  const query = useQuery({
    queryKey: PROJECT_QUERY_KEYS.recent,
    queryFn: () => projectsService.getRecentProjects(limit),
    staleTime: 5 * 60 * 1000,
  });

  return {
    projects: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Search projects
 * @param {string} searchQuery - Search query
 * @param {Object} options - Additional options
 * @returns {Object} Query result
 */
export function useSearchProjects(searchQuery, options = {}) {
  const { limit = 20, language = null, enabled = true } = options;

  const query = useQuery({
    queryKey: [...PROJECT_QUERY_KEYS.search(searchQuery), { limit, language }],
    queryFn: () => projectsService.searchProjects(searchQuery, { limit, language }),
    enabled: enabled && searchQuery.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    projects: query.data || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
  };
}

export default useProjects;
