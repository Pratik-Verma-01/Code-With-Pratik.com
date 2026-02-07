import React from 'react';
import { cn } from '@utils/cn';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const Checkbox = React.forwardRef(({
  className,
  label,
  checked,
  onChange,
  disabled = false,
  error,
  id,
  ...props
}, ref) => {
  const generatedId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn("flex items-start", className)}>
      <div className="relative flex items-center h-5">
        <input
          type="checkbox"
          id={generatedId}
          ref={ref}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <div 
          className={cn(
            "w-5 h-5 rounded border flex items-center justify-center transition-all duration-200 cursor-pointer",
            checked 
              ? "bg-gradient-to-r from-neon-blue to-neon-purple border-transparent" 
              : "bg-dark-800 border-white/20 hover:border-white/40",
            disabled && "opacity-50 cursor-not-allowed",
            error && "border-red-500"
          )}
          onClick={() => !disabled && onChange({ target: { checked: !checked } })}
        >
          {checked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Check size={12} className="text-white stroke-[3px]" />
            </motion.div>
          )}
        </div>
      </div>
      
      {label && (
        <label 
          htmlFor={generatedId} 
          className={cn(
            "ml-3 text-sm cursor-pointer select-none",
            disabled ? "text-dark-500" : "text-dark-200",
            error && "text-red-500"
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
