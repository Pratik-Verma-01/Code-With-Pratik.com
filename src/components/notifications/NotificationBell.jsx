import React, { useState, useRef } from 'react';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '@hooks/useNotifications';
import { useClickOutside } from '@hooks/useClickOutside';
import NotificationDropdown from './NotificationDropdown';
import { cn } from '@utils/cn';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const { unreadCount, hasUnread } = useNotifications();

  useClickOutside(() => setIsOpen(false), containerRef);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2 rounded-full transition-all duration-200",
          isOpen 
            ? "bg-white/10 text-white" 
            : "text-dark-400 hover:text-white hover:bg-white/5"
        )}
        aria-label="Notifications"
      >
        <Bell size={20} className={cn(hasUnread && "animate-swing")} />
        
        <AnimatePresence>
          {hasUnread && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-dark-900"
            />
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <NotificationDropdown onClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
