import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@utils/cn';
import { buttonVariants } from '@utils/animations';

const variants = {
  primary: 'bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-neon-sm hover:shadow-neon-md',
  secondary: 'bg-dark-800 text-white border border-white/10 hover:bg-dark-700',
  outline: 'border-2 border-neon-blue text-neon-blue hover:bg-neon-blue/10',
  ghost: 'text-dark-300 hover:text-white hover:bg-white/5',
  danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
  glass: 'bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 shadow-glass',
  neon: 'bg-transparent text-neon-blue border border-neon-blue shadow-[0_0_10px_rgba(0,212,255,0.5)] hover:shadow-[0_0_20px_rgba(0,212,255,0.8)] hover:bg-neon-blue/10',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-3.5 text-lg',
  icon: 'p-2',
};

const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  leftIcon,
  rightIcon,
  children,
  onClick,
  type = 'button',
  fullWidth = false,
  animation = true,
  ...props
}, ref) => {
  const Component = animation ? motion.button : 'button';
  
  return (
    <Component
      ref={ref}
      type={type}
      className={cn(
        'relative inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className
      )}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      variants={animation ? buttonVariants : undefined}
      initial={animation ? 'initial' : undefined}
      whileHover={animation ? 'hover' : undefined}
      whileTap={animation ? 'tap' : undefined}
      {...props}
    >
      {isLoading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      
      {!isLoading && leftIcon && (
        <span className="mr-2">{leftIcon}</span>
      )}
      
      <span>{children}</span>
      
      {!isLoading && rightIcon && (
        <span className="ml-2">{rightIcon}</span>
      )}
      
      {/* Glow effect for neon variant */}
      {variant === 'neon' && (
        <div className="absolute inset-0 rounded-xl bg-neon-blue/20 blur-md -z-10" />
      )}
    </Component>
  );
});

Button.displayName = 'Button';

export default Button;
