import React from 'react';
import NotificationItem from './NotificationItem';
import EmptyNotifications from './EmptyNotifications';
import Loader from '@components/ui/Loader';

const NotificationList = ({ 
  notifications = [], 
  isLoading = false, 
  compact = false,
  onItemClick 
}) => {
  if (isLoading && notifications.length === 0) {
    return (
      <div className="flex justify-center p-8">
        <Loader size="sm" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return <EmptyNotifications compact={compact} />;
  }

  return (
    <div className="divide-y divide-white/5">
      {notifications.map((notification) => (
        <NotificationItem 
          key={notification.id} 
          notification={notification} 
          compact={compact}
          onClick={onItemClick}
        />
      ))}
    </div>
  );
};

export default NotificationList;
