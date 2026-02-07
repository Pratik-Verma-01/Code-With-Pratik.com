import React from 'react';
import { cn } from '@utils/cn';
import { motion } from 'framer-motion';

const Loader = ({ 
  size = 'md', // sm, md, lg
  color = 'neon', // neon, white, blue
  text,
  className 
}) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4',
  };

  const colors = {
    neon: 'border-white/10 border-t-neon-blue',
    white: 'border-white/20 border-t-white',
    blue: 'border-blue-200 border-t-blue-600',
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <motion.div
        className={cn(
          "rounded-full animate-spin",
          sizes[size],
          colors[color]
        )}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      
      {text && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-dark-400 font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export const Spinner = ({ className, size = 20 }) => (
  <svg 
    className={cn("animate-spin text-current", className)} 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle 
      className="opacity-25" 
      cx="12" 
      cy="12" 
      r="10" 
      stroke="currentColor" 
      strokeWidth="4" 
    />
    <path 
      className="opacity-75" 
      fill="currentColor" 
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
    />
  </svg>
);

export default Loader;
