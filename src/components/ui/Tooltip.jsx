import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@utils/cn';

const Tooltip = ({
  children,
  content,
  position = 'top', // top, bottom, left, right
  delay = 0.3,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delay * 1000);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const animations = {
    top: { initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 } },
    bottom: { initial: { opacity: 0, y: -5 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: 5 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: -5 }, animate: { opacity: 1, x: 0 } },
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && content && (
          <motion.div
            initial={animations[position].initial}
            animate={animations[position].animate}
            exit={animations[position].initial}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-50 px-2.5 py-1.5 text-xs font-medium text-white bg-dark-800 border border-white/10 rounded-lg shadow-lg whitespace-nowrap pointer-events-none",
              positions[position],
              className
            )}
          >
            {content}
            {/* Arrow */}
            <div 
              className={cn(
                "absolute w-2 h-2 bg-dark-800 border-white/10 rotate-45",
                position === 'top' && "bottom-[-5px] left-1/2 -translate-x-1/2 border-b border-r",
                position === 'bottom' && "top-[-5px] left-1/2 -translate-x-1/2 border-t border-l",
                position === 'left' && "right-[-5px] top-1/2 -translate-y-1/2 border-t border-r",
                position === 'right' && "left-[-5px] top-1/2 -translate-y-1/2 border-b border-l"
              )} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
