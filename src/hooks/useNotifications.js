/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 useNotifications Hook
 * 
 * Fetches and manages in-app notifications.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '@services/notifications.service';
import { useAuth } from './useAuth';
import { queryKeys } from '@lib/queryClient';

/**
 * Fetch user's notifications
 * @param {Object} options - Query options
 * @returns {Object} Query result
 */
export function useNotifications(options = {}) {
  const { userId, isAuthenticated } = useAuth();
  const { page = 1, pageSize = 20, unreadOnly = false, enabled = true } = options;

  const query = useQuery({
    queryKey: [...queryKeys.notifications.user(userId), { page, pageSize, unreadOnly }],
    queryFn: () =>
      notificationsService.getUserNotifications(userId, { page, pageSize, unreadOnly }),
    enabled: enabled && isAuthenticated && !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  return {
    notifications: query.data?.data || [],
    unreadCount: query.data?.unreadCount || 0,
    total: query.data?.total || 0,
    totalPages: query.data?.totalPages || 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
    hasUnread: (query.data?.unreadCount || 0) > 0,
  };
}

/**
 * Fetch unread notification count only
 * @returns {Object} Query result
 */
export function useUnreadCount() {
  const { userId, isAuthenticated } = useAuth();

  const query = useQuery({
    queryKey: queryKeys.notifications.unreadCount(userId),
    queryFn: () => notificationsService.getUnreadCount(userId),
    enabled: isAuthenticated && !!userId,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });

  return {
    count: query.data || 0,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}

/**
 * Hook for notification mutations
 * @returns {Object} Mutation methods
 */
export function useNotificationMutations() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId) => notificationsService.markAsRead(notificationId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.user(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount(userId) });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationsService.markAllAsRead(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.user(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount(userId) });
    },
  });

  // Delete notification mutation
  const deleteMutation = useMutation({
    mutationFn: (notificationId) => notificationsService.deleteNotification(notificationId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.user(userId) });
    },
  });

  // Clear all notifications mutation
  const clearAllMutation = useMutation({
    mutationFn: () => notificationsService.deleteAllNotifications(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.user(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount(userId) });
    },
  });

  return {
    markAsRead: markAsReadMutation.mutateAsync,
    markAllAsRead: markAllAsReadMutation.mutateAsync,
    deleteNotification: deleteMutation.mutateAsync,
    clearAll: clearAllMutation.mutateAsync,
    isMarkingRead: markAsReadMutation.isPending,
    isMarkingAllRead: markAllAsReadMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isClearing: clearAllMutation.isPending,
  };
}

export default useNotifications;
