/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 TanStack Query Client Configuration
 * 
 * Configures the React Query client with optimal defaults
 * for caching, retrying, and error handling.
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Default query options
 */
const defaultQueryOptions = {
  queries: {
    // Time until data is considered stale (5 minutes)
    staleTime: 5 * 60 * 1000,
    
    // Time until inactive data is garbage collected (30 minutes)
    gcTime: 30 * 60 * 1000,
    
    // Retry configuration
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      if (error?.status >= 400 && error?.status < 500) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    
    // Exponential backoff for retries
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    
    // Don't refetch on window focus by default (can be enabled per query)
    refetchOnWindowFocus: false,
    
    // Refetch when network reconnects
    refetchOnReconnect: true,
    
    // Don't refetch on mount if data is fresh
    refetchOnMount: true,
    
    // Enable network mode for better offline support
    networkMode: 'online',
  },
  
  mutations: {
    // Retry mutations once
    retry: 1,
    
    // Network mode for mutations
    networkMode: 'online',
  },
};

/**
 * Create and configure QueryClient
 */
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: defaultQueryOptions,
  });
};

/**
 * Query key factory functions
 * Helps maintain consistent query keys across the app
 */
export const queryKeys = {
  // User queries
  users: {
    all: ['users'],
    single: (userId) => ['users', userId],
    profile: (username) => ['users', 'profile', username],
    stats: (userId) => ['users', 'stats', userId],
  },
  
  // Project queries
  projects: {
    all: ['projects'],
    public: (filters) => ['projects', 'public', filters],
    user: (userId) => ['projects', 'user', userId],
    single: (slug) => ['projects', 'single', slug],
    byId: (id) => ['projects', 'id', id],
    trending: ['projects', 'trending'],
    recent: ['projects', 'recent'],
    search: (query) => ['projects', 'search', query],
  },
  
  // Rewards queries
  rewards: {
    user: (userId) => ['rewards', userId],
    history: (userId) => ['rewards', 'history', userId],
    leaderboard: ['rewards', 'leaderboard'],
  },
  
  // Notifications queries
  notifications: {
    user: (userId) => ['notifications', userId],
    unreadCount: (userId) => ['notifications', 'unread', userId],
  },
  
  // AI chat queries
  aiChat: {
    history: (userId) => ['aiChat', 'history', userId],
    projectContext: (projectId) => ['aiChat', 'context', projectId],
  },
};

/**
 * Invalidation helpers
 */
export const invalidateQueries = {
  /**
   * Invalidate all user-related queries
   */
  user: (queryClient, userId) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.users.single(userId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.users.stats(userId) });
  },
  
  /**
   * Invalidate all project-related queries
   */
  projects: (queryClient) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
  },
  
  /**
   * Invalidate user's projects
   */
  userProjects: (queryClient, userId) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.projects.user(userId) });
  },
  
  /**
   * Invalidate single project
   */
  project: (queryClient, slug) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.projects.single(slug) });
  },
  
  /**
   * Invalidate rewards
   */
  rewards: (queryClient, userId) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.rewards.user(userId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.rewards.history(userId) });
  },
  
  /**
   * Invalidate notifications
   */
  notifications: (queryClient, userId) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications.user(userId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount(userId) });
  },
  
  /**
   * Invalidate everything (use sparingly)
   */
  all: (queryClient) => {
    queryClient.invalidateQueries();
  },
};

/**
 * Prefetch helpers
 */
export const prefetchQueries = {
  /**
   * Prefetch user profile
   */
  userProfile: async (queryClient, username, fetchFn) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.users.profile(username),
      queryFn: fetchFn,
      staleTime: 5 * 60 * 1000,
    });
  },
  
  /**
   * Prefetch project
   */
  project: async (queryClient, slug, fetchFn) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.projects.single(slug),
      queryFn: fetchFn,
      staleTime: 5 * 60 * 1000,
    });
  },
};

/**
 * Default query client instance
 */
const queryClient = createQueryClient();

export default queryClient;
