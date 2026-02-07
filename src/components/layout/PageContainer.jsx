import React from 'react';
import { cn } from '@utils/cn';
import { motion } from 'framer-motion';

const PageContainer = ({
  children,
  className,
  maxWidth = "max-w-7xl",
  padding = "px-4 sm:px-6 lg:px-8 py-8",
  animate = true,
}) => {
  const content = (
    <div className={cn("w-full mx-auto", maxWidth, padding, className)}>
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full"
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default PageContainer;
