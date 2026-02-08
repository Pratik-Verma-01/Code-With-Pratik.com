import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@utils/cn';

const RewardsCard = ({ title, value, icon, subtitle, color = 'blue', delay = 0 }) => {
  const colors = {
    blue: 'from-neon-blue to-blue-600',
    purple: 'from-neon-purple to-purple-600',
    pink: 'from-neon-pink to-pink-600',
    green: 'from-green-400 to-green-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="p-6 rounded-2xl bg-dark-800/50 border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors"
    >
      <div className={cn(
        "absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-10 blur-2xl rounded-full -mr-8 -mt-8 transition-opacity group-hover:opacity-20",
        colors[color]
      )} />

      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "p-3 rounded-xl bg-gradient-to-br text-white shadow-lg",
          colors[color]
        )}>
          {icon}
        </div>
        {subtitle && (
          <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
            {subtitle}
          </span>
        )}
      </div>

      <h3 className="text-2xl font-bold text-white mb-1 font-display">
        {value}
      </h3>
      <p className="text-sm text-dark-400 font-medium">
        {title}
      </p>
    </motion.div>
  );
};

export default RewardsCard;
