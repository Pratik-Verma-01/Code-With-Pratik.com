import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@utils/cn';

const SearchInput = React.forwardRef(({
  value,
  onChange,
  onClear,
  placeholder = "Search...",
  className,
  ...props
}, ref) => {
  return (
    <div className={cn("relative group", className)}>
      <Search 
        size={18} 
        className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 group-focus-within:text-neon-blue transition-colors" 
      />
      
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-dark-800/50 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-white placeholder:text-dark-500 outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 transition-all duration-200"
        {...props}
      />
      
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
});

SearchInput.displayName = 'SearchInput';

export default SearchInput;
