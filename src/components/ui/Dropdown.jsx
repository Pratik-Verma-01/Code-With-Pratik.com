import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@utils/cn';
import { useClickOutside } from '@hooks/useClickOutside';

const Dropdown = ({
  trigger,
  children,
  align = 'right',
  width = 'w-56',
  className,
  closeOnSelect = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useClickOutside(() => setIsOpen(false), containerRef);

  const handleSelect = () => {
    if (closeOnSelect) setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.1 }}
            className={cn(
              "absolute z-50 mt-2 origin-top-right rounded-xl bg-dark-800 border border-white/10 shadow-glass-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden",
              align === 'right' ? 'right-0' : 'left-0',
              width,
              className
            )}
            onClick={handleSelect}
          >
            <div className="py-1">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const DropdownItem = ({ children, onClick, className, icon, danger, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group flex w-full items-center px-4 py-2.5 text-sm transition-colors",
        disabled 
          ? "text-dark-500 cursor-not-allowed" 
          : danger 
            ? "text-red-400 hover:bg-red-500/10 hover:text-red-300" 
            : "text-dark-200 hover:bg-white/5 hover:text-white",
        className
      )}
    >
      {icon && (
        <span className={cn(
          "mr-3 transition-colors",
          disabled ? "opacity-50" : danger ? "text-red-400" : "text-dark-400 group-hover:text-neon-blue"
        )}>
          {icon}
        </span>
      )}
      {children}
    </button>
  );
};

export const DropdownDivider = () => (
  <div className="my-1 h-px bg-white/5" />
);

export const DropdownHeader = ({ children }) => (
  <div className="px-4 py-2 text-xs font-semibold text-dark-400 uppercase tracking-wider">
    {children}
  </div>
);

export default Dropdown;
