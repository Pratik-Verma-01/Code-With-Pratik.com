import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Input = forwardRef(({ label, error, className, ...props }, ref) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-400 ml-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all",
          error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-400 ml-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
