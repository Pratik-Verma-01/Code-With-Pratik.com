import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';
import { cn } from '@utils/cn';
import { formatCompactNumber } from '@utils/formatters';
import Skeleton from '@components/ui/Skeleton';

const PointsDisplay = ({ points, level, isLoading, size = 'lg' }) => {
  if (isLoading) {
    return <Skeleton className="w-full h-32 rounded-2xl" />;
  }

  const sizes = {
    sm: { container: 'p-4', icon: 24, title: 'text-2xl', label: 'text-sm' },
    md: { container: 'p-6', icon: 32, title: 'text-3xl', label: 'text-base' },
    lg: { container: 'p-8', icon: 48, title: 'text-5xl', label: 'text-lg' },
  };

  const config = sizes[size];

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl border border-white/10 bg-dark-800/50 backdrop-blur-xl group",
      config.container
    )}>
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/20 blur-[60px] rounded-full pointer-events-none group-hover:bg-neon-purple/20 transition-colors duration-500" />
      
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className={cn("font-medium text-dark-400 mb-1", config.label)}>Total Points</p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("font-bold font-display text-white", config.title)}
          >
            {formatCompactNumber(points)}
            <span className="text-neon-blue ml-1">XP</span>
          </motion.h2>
          
          <div className="flex items-center gap-2 mt-3">
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5">
              <Star size={12} className="text-yellow-400 fill-current" />
              {level?.name || 'Novice'}
            </span>
            <span className="text-xs text-dark-400">
              Rank Top 10%
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-neon-blue/20 blur-xl rounded-full" />
          <div className="relative w-16 h-16 bg-gradient-to-br from-neon-blue to-neon-purple rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 group-hover:rotate-6 transition-transform duration-300">
            <Trophy size={32} className="text-white drop-shadow-md" />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-dark-400">Progress to {level?.nextLevel?.name || 'Max Level'}</span>
          <span className="text-white font-medium">{level?.progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${level?.progressPercent || 0}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-neon-blue to-neon-purple shadow-[0_0_10px_rgba(0,212,255,0.5)]"
          />
        </div>
      </div>
    </div>
  );
};

export default PointsDisplay;
