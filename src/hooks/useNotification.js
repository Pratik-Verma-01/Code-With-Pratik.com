/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 useNotification Hook
 * 
 * Convenient wrapper for toast notifications.
 */

import { useNotificationContext } from '@contexts/NotificationContext';

/**
 * Custom hook for notifications/toasts
 * @returns {Object} Notification methods
 */
export function useNotification() {
  const notification = useNotificationContext();
  return notification;
}

/**
 * Hook for toast notifications only
 * @returns {Object} Toast methods
 */
export function useToast() {
  const {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    showPromise,
    dismissToast,
    dismissAllToasts,
  } = useNotificationContext();

  return {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
    loading: showLoading,
    promise: showPromise,
    dismiss: dismissToast,
    dismissAll: dismissAllToasts,
  };
}

/**
 * Hook for in-app notifications only
 * @returns {Object} In-app notification state and methods
 */
export function useInAppNotifications() {
  const {
    notifications,
    unreadCount,
    isLoadingNotifications,
    hasUnread,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotificationContext();

  return {
    notifications,
    unreadCount,
    isLoading: isLoadingNotifications,
    hasUnread,
    fetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
    delete: deleteNotification,
    clearAll: clearAllNotifications,
  };
}

export default useNotification;
