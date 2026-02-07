import React from 'react';
import { cn } from '@utils/cn';

const variants = {
  default: 'bg-dark-700 text-white border-dark-600',
  primary: 'bg-neon-blue/10 text-neon-blue border-neon-blue/20',
  secondary: 'bg-neon-purple/10 text-neon-purple border-neon-purple/20',
  success: 'bg-green-500/10 text-green-400 border-green-500/20',
  warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  danger: 'bg-red-500/10 text-red-400 border-red-500/20',
  outline: 'bg-transparent border-white/20 text-dark-300',
  glass: 'bg-white/5 backdrop-blur-md border-white/10 text-white',
};

const sizes = {
  sm: 'text-[10px] px-1.5 py-0.5',
  md: 'text-xs px-2.5 py-0.5',
  lg: 'text-sm px-3 py-1',
};

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  icon,
  onClick,
  ...props
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-full border transition-colors",
        variants[variant],
        sizes[size],
        onClick && "cursor-pointer hover:bg-opacity-20",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {icon && <span className="mr-1.5 -ml-0.5">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
