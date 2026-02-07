/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 Notification Context
 * 
 * Manages toast notifications and in-app notification state.
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuthContext } from './AuthContext';
import { notificationsService } from '@services/notifications.service';

// Create Notification Context
const NotificationContext = createContext(null);

// Toast configuration presets
const toastConfig = {
  success: {
    duration: 3000,
    icon: '✅',
  },
  error: {
    duration: 5000,
    icon: '❌',
  },
  warning: {
    duration: 4000,
    icon: '⚠️',
  },
  info: {
    duration: 4000,
    icon: 'ℹ️',
  },
  loading: {
    duration: Infinity,
  },
};

// Notification Provider Component
export function NotificationProvider({ children }) {
  const { userId, isAuthenticated } = useAuthContext();
  
  // In-app notifications state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  /**
   * Show success toast
   */
  const showSuccess = useCallback((message, options = {}) => {
    return toast.success(message, {
      ...toastConfig.success,
      ...options,
    });
  }, []);

  /**
   * Show error toast
   */
  const showError = useCallback((message, options = {}) => {
    return toast.error(message, {
      ...toastConfig.error,
      ...options,
    });
  }, []);

  /**
   * Show warning toast
   */
  const showWarning = useCallback((message, options = {}) => {
    return toast(message, {
      ...toastConfig.warning,
      icon: toastConfig.warning.icon,
      ...options,
      style: {
        borderLeft: '4px solid #F59E0B',
        ...options.style,
      },
    });
  }, []);

  /**
   * Show info toast
   */
  const showInfo = useCallback((message, options = {}) => {
    return toast(message, {
      ...toastConfig.info,
      icon: toastConfig.info.icon,
      ...options,
      style: {
        borderLeft: '4px solid #3B82F6',
        ...options.style,
      },
    });
  }, []);

  /**
   * Show loading toast (returns toast ID for dismissal)
   */
  const showLoading = useCallback((message = 'Loading...', options = {}) => {
    return toast.loading(message, {
      ...toastConfig.loading,
      ...options,
    });
  }, []);

  /**
   * Dismiss a specific toast
   */
  const dismissToast = useCallback((toastId) => {
    toast.dismiss(toastId);
  }, []);

  /**
   * Dismiss all toasts
   */
  const dismissAllToasts = useCallback(() => {
    toast.dismiss();
  }, []);

  /**
   * Show promise toast (handles loading, success, error states)
   */
  const showPromise = useCallback((promise, messages, options = {}) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading || 'Loading...',
        success: messages.success || 'Success!',
        error: messages.error || 'Something went wrong',
      },
      options
    );
  }, []);

  /**
   * Show custom toast
   */
  const showCustom = useCallback((content, options = {}) => {
    return toast.custom(content, options);
  }, []);

  /**
   * Fetch user notifications
   */
  const fetchNotifications = useCallback(async (options = {}) => {
    if (!userId) return;

    setIsLoadingNotifications(true);

    try {
      const result = await notificationsService.getUserNotifications(userId, options);
      
      if (!result.error) {
        setNotifications(result.data);
        setUnreadCount(result.unreadCount);
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return { data: [], unreadCount: 0, error };
    } finally {
      setIsLoadingNotifications(false);
    }
  }, [userId]);

  /**
   * Mark notification as read
   */
  const markAsRead = useCallback(async (notificationId) => {
    if (!userId) return;

    try {
      await notificationsService.markAsRead(notificationId, userId);
      
      // Update local state
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [userId]);

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async () => {
    if (!userId) return;

    try {
      await notificationsService.markAllAsRead(userId);
      
      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
      
      showSuccess('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      showError('Failed to mark notifications as read');
    }
  }, [userId, showSuccess, showError]);

  /**
   * Delete notification
   */
  const deleteNotification = useCallback(async (notificationId) => {
    if (!userId) return;

    try {
      await notificationsService.deleteNotification(notificationId, userId);
      
      // Update local state
      const notification = notifications.find((n) => n.id === notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      
      if (notification && !notification.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      showError('Failed to delete notification');
    }
  }, [userId, notifications, showError]);

  /**
   * Clear all notifications
   */
  const clearAllNotifications = useCallback(async () => {
    if (!userId) return;

    try {
      await notificationsService.deleteAllNotifications(userId);
      setNotifications([]);
      setUnreadCount(0);
      showSuccess('All notifications cleared');
    } catch (error) {
      console.error('Error clearing notifications:', error);
      showError('Failed to clear notifications');
    }
  }, [userId, showSuccess, showError]);

  /**
   * Refresh unread count
   */
  const refreshUnreadCount = useCallback(async () => {
    if (!userId) return;

    try {
      const count = await notificationsService.getUnreadCount(userId);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error refreshing unread count:', error);
    }
  }, [userId]);

  /**
   * Subscribe to realtime notifications
   */
  useEffect(() => {
    if (!userId || !isAuthenticated) return;

    // Initial fetch
    fetchNotifications({ pageSize: 10 });

    // Subscribe to realtime updates
    const unsubscribe = notificationsService.subscribeToNotifications(
      userId,
      (payload) => {
        if (payload.eventType === 'INSERT') {
          // New notification
          setNotifications((prev) => [payload.new, ...prev]);
          setUnreadCount((prev) => prev + 1);
          
          // Show toast for new notification
          showInfo(payload.new.title, {
            icon: payload.new.icon || '🔔',
          });
        } else if (payload.eventType === 'DELETE') {
          // Notification deleted
          setNotifications((prev) => prev.filter((n) => n.id !== payload.old.id));
          if (!payload.old.is_read) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
          }
        } else if (payload.eventType === 'UPDATE') {
          // Notification updated
          setNotifications((prev) =>
            prev.map((n) => (n.id === payload.new.id ? payload.new : n))
          );
        }
      }
    );

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userId, isAuthenticated, fetchNotifications, showInfo]);

  // Memoized context value
  const contextValue = useMemo(() => ({
    // Toast methods
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    showPromise,
    showCustom,
    dismissToast,
    dismissAllToasts,
    
    // Shorthand aliases
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
    loading: showLoading,
    promise: showPromise,
    dismiss: dismissToast,
    
    // In-app notifications
    notifications,
    unreadCount,
    isLoadingNotifications,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    refreshUnreadCount,
    hasUnread: unreadCount > 0,
  }), [
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    showPromise,
    showCustom,
    dismissToast,
    dismissAllToasts,
    notifications,
    unreadCount,
    isLoadingNotifications,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    refreshUnreadCount,
  ]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

/**
 * Custom hook to use notification context
 */
export function useNotificationContext() {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  
  return context;
}

export default NotificationContext;
