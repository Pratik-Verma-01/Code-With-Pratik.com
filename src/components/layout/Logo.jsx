import React from 'react';
import { cn } from '@utils/cn';
import { motion } from 'framer-motion';

const Logo = ({ size = 'md', className, animated = false }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: "spring", duration: 1.5, bounce: 0 },
        opacity: { duration: 0.01 }
      }
    }
  };

  return (
    <div className={cn("relative flex items-center justify-center", sizes[size], className)}>
      <motion.svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        initial={animated ? "hidden" : "visible"}
        animate="visible"
      >
        <defs>
          <linearGradient id="logo-gradient" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#00D4FF" />
            <stop offset="50%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
        
        {/* Hexagon Shape */}
        <motion.path
          d="M50 5 L93.3 30 V70 L50 95 L6.7 70 V30 Z"
          stroke="url(#logo-gradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
        />
        
        {/* Code Brackets */}
        <motion.path
          d="M35 40 L25 50 L35 60 M65 40 L75 50 L65 60"
          stroke="url(#logo-gradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
        />
        
        {/* Slash */}
        <motion.path
          d="M45 65 L55 35"
          stroke="url(#logo-gradient)"
          strokeWidth="6"
          strokeLinecap="round"
          variants={pathVariants}
        />
      </motion.svg>
      
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-neon-blue/20 blur-xl rounded-full -z-10" />
    </div>
  );
};

export default Logo;
