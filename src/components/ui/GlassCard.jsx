import React from 'react';
import { cn } from '@utils/cn';
import { motion } from 'framer-motion';

const GlassCard = React.forwardRef(({
  children,
  className,
  variant = 'medium', // light, medium, heavy
  hoverEffect = false,
  glowEffect = false,
  gradient = false,
  ...props
}, ref) => {
  const variants = {
    light: 'bg-white/5 border-white/10 backdrop-blur-sm',
    medium: 'bg-dark-900/40 border-white/10 backdrop-blur-md',
    heavy: 'bg-dark-900/70 border-white/5 backdrop-blur-xl',
  };

  const Component = hoverEffect ? motion.div : 'div';

  return (
    <Component
      ref={ref}
      className={cn(
        "relative rounded-2xl border overflow-hidden transition-all duration-300",
        variants[variant],
        hoverEffect && "hover:border-white/20 hover:shadow-lg hover:shadow-neon-blue/5",
        className
      )}
      whileHover={hoverEffect ? { y: -4, scale: 1.01 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      {/* Gradient Background */}
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 via-transparent to-neon-purple/5 opacity-50 pointer-events-none" />
      )}

      {/* Glow Effect */}
      {glowEffect && (
        <div className="absolute -inset-[100px] bg-neon-blue/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}

      {/* Noise Texture (Optional) */}
      {/* <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')] pointer-events-none mix-blend-overlay" /> */}

      <div className="relative z-10">
        {children}
      </div>
    </Component>
  );
});

GlassCard.displayName = 'GlassCard';

export default GlassCard;
