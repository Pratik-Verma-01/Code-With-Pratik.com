import React, { useState, useRef } from 'react';
import { ChevronDown, AlertCircle, Check } from 'lucide-react';
import { cn } from '@utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickOutside } from '@hooks/useClickOutside';

const Select = React.forwardRef(({
  label,
  error,
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  className,
  helperText,
  name,
  id,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  
  useClickOutside(() => setIsOpen(false), containerRef);

  const handleSelect = (option) => {
    if (disabled) return;
    onChange(option.value);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);
  const generatedId = id || name || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full relative" ref={containerRef}>
      {label && (
        <label 
          htmlFor={generatedId}
          className={cn(
            "block text-sm font-medium mb-1.5 transition-colors duration-200",
            error ? "text-red-500" : isOpen ? "text-neon-blue" : "text-dark-300"
          )}
        >
          {label}
        </label>
      )}
      
      <div
        className={cn(
          "w-full bg-dark-800/50 border rounded-xl px-4 py-2.5 text-white cursor-pointer flex items-center justify-between transition-all duration-200",
          error 
            ? "border-red-500 focus:ring-2 focus:ring-red-500/20" 
            : isOpen 
              ? "border-neon-blue ring-2 ring-neon-blue/20" 
              : "border-white/10 hover:border-white/20",
          disabled && "opacity-50 cursor-not-allowed bg-dark-900",
          className
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        tabIndex={0}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={cn(!selectedOption && "text-dark-500")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          size={18} 
          className={cn(
            "text-dark-400 transition-transform duration-200",
            isOpen && "rotate-180 text-neon-blue"
          )} 
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-dark-800 border border-white/10 rounded-xl shadow-glass-lg overflow-hidden max-h-60 overflow-y-auto scrollbar-thin"
          >
            {options.length > 0 ? (
              options.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "px-4 py-2.5 cursor-pointer flex items-center justify-between transition-colors",
                    value === option.value 
                      ? "bg-neon-blue/10 text-neon-blue" 
                      : "text-dark-200 hover:bg-white/5 hover:text-white"
                  )}
                  onClick={() => handleSelect(option)}
                >
                  <span>{option.label}</span>
                  {value === option.value && <Check size={16} />}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-dark-400 text-center text-sm">
                No options available
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {error ? (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center mt-1.5 text-xs text-red-500"
          >
            <AlertCircle size={14} className="mr-1" />
            {error}
          </motion.div>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-dark-400">{helperText}</p>
        ) : null}
      </AnimatePresence>
      
      {/* Hidden input for form submission */}
      <input 
        type="hidden" 
        name={name} 
        value={value || ''} 
        ref={ref}
        {...props}
      />
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
