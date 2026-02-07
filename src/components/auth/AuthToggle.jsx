import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@utils/cn';

const AuthToggle = ({ mode, onToggle }) => {
  return (
    <div className="bg-dark-800/50 p-1 rounded-xl flex relative mb-6">
      {/* Background slider */}
      <motion.div
        className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg shadow-neon-sm"
        initial={false}
        animate={{
          x: mode === 'login' ? 0 : '100%',
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      <button
        type="button"
        onClick={() => mode !== 'login' && onToggle()}
        className={cn(
          "flex-1 py-2 text-sm font-semibold rounded-lg relative z-10 transition-colors duration-200",
          mode === 'login' ? "text-white" : "text-dark-400 hover:text-white"
        )}
      >
        Log In
      </button>

      <button
        type="button"
        onClick={() => mode !== 'signup' && onToggle()}
        className={cn(
          "flex-1 py-2 text-sm font-semibold rounded-lg relative z-10 transition-colors duration-200",
          mode === 'signup' ? "text-white" : "text-dark-400 hover:text-white"
        )}
      >
        Sign Up
      </button>
    </div>
  );
};

export default AuthToggle;
