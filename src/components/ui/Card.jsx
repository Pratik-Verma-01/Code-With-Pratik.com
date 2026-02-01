import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function Card({ children, className, hover = false }) {
  return (
    <motion.div
      whileHover={hover ? { y: -5 } : {}}
      className={cn(
        "glass-panel rounded-2xl p-6 overflow-hidden relative",
        className
      )}
    >
      {/* Decorative gradient blob */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
