import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@utils/cn';

const Toggle = ({
  checked,
  onChange,
  disabled = false,
  size = 'md', // sm, md, lg
  label,
  className,
}) => {
  const sizes = {
    sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 16 },
    md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 20 },
    lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 28 },
  };

  const config = sizes[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue",
          config.track,
          checked 
            ? "bg-gradient-to-r from-neon-blue to-neon-purple" 
            : "bg-dark-700",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span className="sr-only">{label || 'Toggle'}</span>
        <motion.span
          layout
          className={cn(
            "pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            config.thumb,
            "mt-[1px] ml-[1px]"
          )}
          animate={{ x: checked ? config.translate : 0 }}
        />
      </button>
      
      {label && (
        <span 
          className={cn(
            "text-sm font-medium", 
            disabled ? "text-dark-500" : "text-dark-200"
          )}
          onClick={() => !disabled && onChange(!checked)}
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default Toggle;
