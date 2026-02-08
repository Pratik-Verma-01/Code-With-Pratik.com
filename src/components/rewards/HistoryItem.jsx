import React from 'react';
import { formatRelativeTime } from '@utils/formatters';
import { REWARD_TYPES } from '@config/app.config';
import { cn } from '@utils/cn';

const HistoryItem = ({ item }) => {
  const rewardType = Object.values(REWARD_TYPES).find(t => t.type === item.type) || {};
  const icon = rewardType.icon || '🎁';
  const label = item.label || rewardType.label || 'Points Earned';

  return (
    <div className="flex items-center justify-between p-4 bg-dark-800/30 border border-white/5 rounded-xl hover:bg-white/5 transition-colors group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-dark-800 border border-white/10 flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div>
          <p className="font-semibold text-white text-sm">{label}</p>
          <p className="text-xs text-dark-400">
            {formatRelativeTime(item.created_at)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <span className="text-neon-blue font-bold">+{item.points}</span>
        <span className="text-xs text-dark-500">XP</span>
      </div>
    </div>
  );
};

export default HistoryItem;
