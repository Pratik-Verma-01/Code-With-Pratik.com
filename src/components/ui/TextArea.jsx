import React, { useState } from 'react';
import { cn } from '@utils/cn';
import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TextArea = React.forwardRef(({
  className,
  label,
  error,
  placeholder,
  helperText,
  id,
  name,
  disabled,
  rows = 4,
  maxLength,
  value,
  onChange,
  showCount = false,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(value?.length || 0);
  
  const generatedId = id || name || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  const handleChange = (e) => {
    setCharCount(e.target.value.length);
    if (onChange) onChange(e);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        {label && (
          <label 
            htmlFor={generatedId} 
            className={cn(
              "text-sm font-medium transition-colors duration-200",
              error ? "text-red-500" : isFocused ? "text-neon-blue" : "text-dark-300"
            )}
          >
            {label}
          </label>
        )}
        
        {showCount && maxLength && (
          <span className={cn(
            "text-xs transition-colors",
            charCount > maxLength ? "text-red-500" : "text-dark-400"
          )}>
            {charCount}/{maxLength}
          </span>
        )}
      </div>
      
      <textarea
        ref={ref}
        id={generatedId}
        name={name}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        value={value}
        onChange={handleChange}
        className={cn(
          "w-full bg-dark-800/50 border rounded-xl px-4 py-3 text-white placeholder:text-dark-500 transition-all duration-200 outline-none resize-y min-h-[100px]",
          error 
            ? "border-red-500 focus:ring-2 focus:ring-red-500/20" 
            : "border-white/10 hover:border-white/20 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20",
          disabled && "opacity-50 cursor-not-allowed bg-dark-900",
          className
        )}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      
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
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
