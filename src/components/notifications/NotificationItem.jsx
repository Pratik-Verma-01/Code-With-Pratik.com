import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@utils/cn';
import { formatRelativeTime } from '@utils/formatters';
import { useNotificationMutations } from '@hooks/useNotifications';
import { NOTIFICATION_ICONS } from '@config/app.config';
import { Trash2 } from 'lucide-react';

const NotificationItem = ({ notification, compact = false, onClick }) => {
  const { markAsRead, deleteNotification } = useNotificationMutations();
  const { id, title, message, type, is_read, created_at, action_url } = notification;

  const icon = NOTIFICATION_ICONS[type] || '🔔';

  const handleClick = () => {
    if (!is_read) {
      markAsRead(id);
    }
    if (onClick) onClick();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    deleteNotification(id);
  };

  const Content = (
    <div className="flex items-start gap-3 w-full">
      <div className="text-xl flex-shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <p className={cn(
            "text-sm font-medium truncate pr-4",
            is_read ? "text-dark-300" : "text-white"
          )}>
            {title}
          </p>
          {!is_read && (
            <span className="w-2 h-2 rounded-full bg-neon-blue flex-shrink-0 mt-1.5" />
          )}
        </div>
        <p className={cn(
          "text-xs mt-0.5 line-clamp-2",
          is_read ? "text-dark-500" : "text-dark-300"
        )}>
          {message}
        </p>
        <span className="text-[10px] text-dark-500 mt-1.5 block">
          {formatRelativeTime(created_at)}
        </span>
      </div>
    </div>
  );

  const Wrapper = action_url ? Link : 'div';
  const wrapperProps = action_url ? { to: action_url } : {};

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn(
        "group relative border-b border-white/5 transition-colors cursor-pointer",
        compact ? "p-3" : "p-4",
        !is_read ? "bg-white/[0.02]" : "hover:bg-white/[0.01]"
      )}
      onClick={handleClick}
    >
      <Wrapper {...wrapperProps} className="block">
        {Content}
      </Wrapper>

      <button
        onClick={handleDelete}
        className="absolute top-3 right-3 p-1.5 text-dark-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
        title="Delete"
      >
        <Trash2 size={14} />
      </button>
    </motion.div>
  );
};

export default NotificationItem;
