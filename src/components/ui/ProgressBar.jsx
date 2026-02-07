import React from 'react';
import { cn } from '@utils/cn';
import { motion } from 'framer-motion';

const ProgressBar = ({
  value = 0,
  max = 100,
  label,
  showValue = false,
  size = 'md', // sm, md, lg
  color = 'neon', // neon, blue, green, purple
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colors = {
    neon: 'from-neon-blue to-neon-purple',
    blue: 'from-blue-500 to-blue-400',
    green: 'from-green-500 to-green-400',
    purple: 'from-purple-500 to-purple-400',
    yellow: 'from-yellow-500 to-orange-500',
  };

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5 text-sm">
          {label && <span className="font-medium text-dark-200">{label}</span>}
          {showValue && <span className="text-dark-400">{Math.round(percentage)}%</span>}
        </div>
      )}
      
      <div className={cn("w-full bg-dark-800 rounded-full overflow-hidden", sizes[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full bg-gradient-to-r shadow-[0_0_10px_rgba(0,212,255,0.3)]",
            colors[color]
          )}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
