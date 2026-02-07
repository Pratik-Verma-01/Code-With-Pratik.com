import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@utils/cn';
import { useScrollLock } from '@hooks/useScrollLock';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const drawerVariants = {
  right: {
    hidden: { x: '100%' },
    visible: { x: 0 },
    exit: { x: '100%' },
  },
  left: {
    hidden: { x: '-100%' },
    visible: { x: 0 },
    exit: { x: '-100%' },
  },
  bottom: {
    hidden: { y: '100%' },
    visible: { y: 0 },
    exit: { y: '100%' },
  },
};

const Drawer = ({
  isOpen,
  onClose,
  children,
  position = 'right', // left, right, bottom
  size = 'md', // sm, md, lg, xl, full
  title,
  className,
  showClose = true,
}) => {
  useScrollLock(isOpen);

  const sizes = {
    sm: position === 'bottom' ? 'h-[30vh]' : 'w-64',
    md: position === 'bottom' ? 'h-[50vh]' : 'w-80',
    lg: position === 'bottom' ? 'h-[70vh]' : 'w-96',
    xl: position === 'bottom' ? 'h-[85vh]' : 'w-[30rem]',
    full: position === 'bottom' ? 'h-screen' : 'w-screen',
  };

  const positions = {
    right: 'right-0 top-0 h-full border-l',
    left: 'left-0 top-0 h-full border-r',
    bottom: 'bottom-0 left-0 w-full border-t rounded-t-2xl',
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex overflow-hidden">
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            variants={drawerVariants[position]}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "absolute bg-dark-900 border-white/10 shadow-2xl flex flex-col",
              positions[position],
              sizes[size],
              className
            )}
          >
            {(title || showClose) && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                {title && (
                  <h2 className="text-lg font-display font-semibold text-white">
                    {title}
                  </h2>
                )}
                {showClose && (
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-white/10 transition-colors ml-auto"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            )}
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Drawer;
