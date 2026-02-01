import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const variants = {
  primary: 'bg-gradient-to-r from-primary-dark to-primary text-black font-bold shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)]',
  secondary: 'bg-secondary text-white shadow-[0_0_20px_rgba(189,0,255,0.3)] hover:shadow-[0_0_30px_rgba(189,0,255,0.5)]',
  outline: 'border border-primary/50 text-primary hover:bg-primary/10',
  ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
  danger: 'bg-red-500/10 border border-red-500/50 text-red-500 hover:bg-red-500/20'
};

export default function Button({ 
  children, 
  variant = 'primary', 
  className, 
  isLoading, 
  type = 'button',
  onClick,
  disabled
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        'relative flex items-center justify-center gap-2 rounded-xl px-6 py-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        className
      )}
    >
      {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </motion.button>
  );
}
