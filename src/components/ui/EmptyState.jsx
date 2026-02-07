import React from 'react';
import { cn } from '@utils/cn';
import { motion } from 'framer-motion';
import Button from './Button';

const EmptyState = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center text-center p-12 rounded-2xl border border-dashed border-dark-700 bg-dark-800/30",
        className
      )}
    >
      {icon && (
        <div className="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center text-dark-400 mb-4 shadow-inner">
          {React.cloneElement(icon, { size: 32 })}
        </div>
      )}
      
      {title && (
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      )}
      
      {description && (
        <p className="text-dark-400 max-w-sm mb-6">{description}</p>
      )}
      
      {action && (
        <div>
          {action}
        </div>
      )}
    </motion.div>
  );
};

export default EmptyState;
