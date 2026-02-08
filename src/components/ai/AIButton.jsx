import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '@utils/cn';

const AIButton = ({ onClick, isOpen, className }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-neon-lg transition-all duration-300 flex items-center justify-center",
        isOpen 
          ? "bg-dark-800 text-dark-400 hover:text-white border border-white/10" 
          : "bg-gradient-to-r from-neon-blue to-neon-purple text-white",
        className
      )}
      aria-label="Toggle AI Chat"
    >
      <Sparkles 
        size={24} 
        className={cn(
          "transition-transform duration-300",
          isOpen ? "rotate-45" : "animate-pulse-slow"
        )} 
      />
    </motion.button>
  );
};

export default AIButton;
