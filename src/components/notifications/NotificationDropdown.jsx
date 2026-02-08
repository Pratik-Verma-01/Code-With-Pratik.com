import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCheck, Settings } from 'lucide-react';
import { useNotifications, useNotificationMutations } from '@hooks/useNotifications';
import NotificationList from './NotificationList';
import { ROUTES } from '@config/routes.config';
import Button from '@components/ui/Button';

const NotificationDropdown = ({ onClose }) => {
  const { notifications, isLoading, hasUnread } = useNotifications({ pageSize: 5 });
  const { markAllAsRead } = useNotificationMutations();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 mt-3 w-80 sm:w-96 bg-dark-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 origin-top-right"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-dark-800/50">
        <h3 className="font-semibold text-white text-sm">Notifications</h3>
        <div className="flex items-center gap-2">
          {hasUnread && (
            <button
              onClick={() => markAllAsRead()}
              className="p-1.5 text-dark-400 hover:text-neon-blue hover:bg-white/5 rounded-lg transition-colors"
              title="Mark all as read"
            >
              <CheckCheck size={16} />
            </button>
          )}
          <Link to={ROUTES.SETTINGS}>
            <button className="p-1.5 text-dark-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <Settings size={16} />
            </button>
          </Link>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        <NotificationList 
          notifications={notifications} 
          isLoading={isLoading} 
          compact 
          onItemClick={onClose}
        />
      </div>

      <div className="p-2 border-t border-white/5 bg-dark-800/30">
        <Link to={ROUTES.NOTIFICATIONS}>
          <Button 
            variant="ghost" 
            fullWidth 
            size="sm"
            onClick={onClose}
            className="text-xs"
          >
            View All Notifications
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default NotificationDropdown;
