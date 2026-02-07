import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { cn } from '@utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

const Input = React.forwardRef(({
  className,
  label,
  error,
  type = 'text',
  placeholder,
  leftIcon,
  rightIcon,
  helperText,
  id,
  name,
  disabled,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputType = type === 'password' && showPassword ? 'text' : type;
  const isPassword = type === 'password';
  const generatedId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={generatedId} 
          className={cn(
            "block text-sm font-medium mb-1.5 transition-colors duration-200",
            error ? "text-red-500" : isFocused ? "text-neon-blue" : "text-dark-300"
          )}
        >
          {label}
        </label>
      )}
      
      <div className="relative group">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 group-focus-within:text-neon-blue transition-colors">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={generatedId}
          name={name}
          type={inputType}
          disabled={disabled}
          className={cn(
            "w-full bg-dark-800/50 border rounded-xl px-4 py-2.5 text-white placeholder:text-dark-500 transition-all duration-200 outline-none",
            leftIcon && "pl-10",
            (rightIcon || isPassword) && "pr-10",
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
        
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors focus:outline-none"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        ) : rightIcon ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400">
            {rightIcon}
          </div>
        ) : null}
      </div>
      
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

Input.displayName = 'Input';

export default Input;
