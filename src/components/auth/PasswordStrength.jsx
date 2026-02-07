import React from 'react';
import { getPasswordStrength } from '@utils/validators';
import { cn } from '@utils/cn';
import { motion } from 'framer-motion';

const PasswordStrength = ({ password }) => {
  if (!password) return null;

  const { score, label, color, percent } = getPasswordStrength(password);

  const colors = {
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    gray: 'bg-gray-500',
  };

  const textColors = {
    red: 'text-red-500',
    orange: 'text-orange-500',
    yellow: 'text-yellow-500',
    blue: 'text-blue-500',
    green: 'text-green-500',
    gray: 'text-gray-500',
  };

  return (
    <div className="mt-2 space-y-1">
      <div className="flex justify-between items-center text-xs">
        <span className="text-dark-400">Strength</span>
        <span className={cn("font-medium", textColors[color])}>
          {label}
        </span>
      </div>
      
      <div className="h-1.5 w-full bg-dark-800 rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full transition-colors", colors[color])}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(5, percent)}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-1 text-[10px] text-dark-400 mt-1">
        <div className={cn(password.length >= 8 ? "text-green-500" : "")}>
          • 8+ chars
        </div>
        <div className={cn(/[A-Z]/.test(password) ? "text-green-500" : "")}>
          • Uppercase
        </div>
        <div className={cn(/[0-9]/.test(password) ? "text-green-500" : "")}>
          • Number
        </div>
        <div className={cn(/[!@#$%^&*]/.test(password) ? "text-green-500" : "")}>
          • Special char
        </div>
      </div>
    </div>
  );
};

export default PasswordStrength;
