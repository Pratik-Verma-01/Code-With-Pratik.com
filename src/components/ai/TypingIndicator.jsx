import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-3 p-4 bg-dark-800/30 rounded-2xl w-fit">
      <div className="w-6 h-6 rounded-full bg-dark-800 border border-neon-blue/20 flex items-center justify-center">
        <img src="/ai-nova-avatar.png" alt="AI" className="w-4 h-4 opacity-50" />
      </div>
      <div className="flex gap-1">
        <Dot delay={0} />
        <Dot delay={0.2} />
        <Dot delay={0.4} />
      </div>
    </div>
  );
};

const Dot = ({ delay }) => (
  <motion.div
    className="w-1.5 h-1.5 rounded-full bg-neon-blue/50"
    animate={{
      y: [0, -5, 0],
      opacity: [0.4, 1, 0.4]
    }}
    transition={{
      duration: 0.8,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  />
);

export default TypingIndicator;
