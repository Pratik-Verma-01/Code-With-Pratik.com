import React from 'react';
import { CheckCheck, Trash2 } from 'lucide-react';
import PageContainer from '@components/layout/PageContainer';
import PageHeader from '@components/layout/PageHeader';
import NotificationList from '@components/notifications/NotificationList';
import Button from '@components/ui/Button';
import { useNotifications, useNotificationMutations } from '@hooks/useNotifications';

const Notifications = () => {
  const { notifications, isLoading, hasUnread } = useNotifications();
  const { markAllAsRead, clearAll, isMarkingAllRead, isClearing } = useNotificationMutations();

  return (
    <PageContainer maxWidth="max-w-4xl">
      <PageHeader
        title="Notifications"
        description="Stay updated with your activities and alerts."
        actions={
          <div className="flex gap-2">
            {hasUnread && (
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<CheckCheck size={16} />}
                onClick={markAllAsRead}
                isLoading={isMarkingAllRead}
              >
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Trash2 size={16} />}
                onClick={clearAll}
                isLoading={isClearing}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                Clear all
              </Button>
            )}
          </div>
        }
      />

      <div className="bg-dark-900/50 border border-white/5 rounded-2xl overflow-hidden min-h-[400px]">
        <NotificationList 
          notifications={notifications} 
          isLoading={isLoading} 
        />
      </div>
    </PageContainer>
  );
};

export default Notifications;
