import React from 'react';
import { BellOff } from 'lucide-react';
import { cn } from '@utils/cn';

const EmptyNotifications = ({ compact }) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center text-dark-400",
      compact ? "p-8" : "p-12"
    )}>
      <div className="w-12 h-12 rounded-full bg-dark-800 flex items-center justify-center mb-3">
        <BellOff size={20} />
      </div>
      <p className="text-sm font-medium text-white mb-1">No notifications</p>
      <p className="text-xs max-w-[200px]">
        You're all caught up! Check back later for updates.
      </p>
    </div>
  );
};

export default EmptyNotifications;
