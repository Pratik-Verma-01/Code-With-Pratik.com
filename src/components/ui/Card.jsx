import React from 'react';
import { cn } from '@utils/cn';
import { motion } from 'framer-motion';

const Card = React.forwardRef(({
  className,
  children,
  hover = false,
  glass = true,
  padding = "p-6",
  onClick,
  ...props
}, ref) => {
  const Component = hover ? motion.div : 'div';
  
  return (
    <Component
      ref={ref}
      className={cn(
        "rounded-2xl border transition-all duration-300 relative overflow-hidden",
        glass 
          ? "bg-white/5 backdrop-blur-xl border-white/10 shadow-glass" 
          : "bg-dark-800 border-dark-700",
        hover && "cursor-pointer hover:border-neon-blue/30 hover:shadow-neon-sm",
        padding,
        className
      )}
      onClick={onClick}
      whileHover={hover ? { y: -5 } : undefined}
      {...props}
    >
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </Component>
  );
});

Card.displayName = 'Card';

export const CardHeader = ({ className, children, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 mb-4", className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className, children, ...props }) => (
  <h3 className={cn("text-xl font-semibold leading-none tracking-tight text-white", className)} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ className, children, ...props }) => (
  <p className={cn("text-sm text-dark-400", className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ className, children, ...props }) => (
  <div className={cn("", className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className, children, ...props }) => (
  <div className={cn("flex items-center pt-4 mt-4 border-t border-white/5", className)} {...props}>
    {children}
  </div>
);

export default Card;
