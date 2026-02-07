import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@utils/cn';

export const AccordionItem = ({ 
  title, 
  children, 
  isOpen, 
  onClick,
  className 
}) => {
  return (
    <div className={cn("border-b border-white/5 last:border-0", className)}>
      <button
        className="w-full flex items-center justify-between py-4 text-left group"
        onClick={onClick}
      >
        <span className={cn(
          "font-medium transition-colors",
          isOpen ? "text-neon-blue" : "text-dark-200 group-hover:text-white"
        )}>
          {title}
        </span>
        <ChevronDown 
          size={18} 
          className={cn(
            "text-dark-400 transition-transform duration-300",
            isOpen ? "rotate-180 text-neon-blue" : "group-hover:text-white"
          )} 
        />
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-dark-300 text-sm leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Accordion = ({ items = [], allowMultiple = false, className }) => {
  const [openIndexes, setOpenIndexes] = useState(new Set([0]));

  const toggleItem = (index) => {
    if (allowMultiple) {
      const newIndexes = new Set(openIndexes);
      if (newIndexes.has(index)) {
        newIndexes.delete(index);
      } else {
        newIndexes.add(index);
      }
      setOpenIndexes(newIndexes);
    } else {
      setOpenIndexes(new Set(openIndexes.has(index) ? [] : [index]));
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          isOpen={openIndexes.has(index)}
          onClick={() => toggleItem(index)}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
};

export default Accordion;
