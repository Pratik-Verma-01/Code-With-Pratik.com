import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@utils/cn';

const ProjectSearch = ({ value, onChange, placeholder = "Search for projects...", className }) => {
  return (
    <div className={cn("relative group max-w-xl w-full", className)}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-dark-400 group-focus-within:text-neon-blue transition-colors" />
      </div>
      <input
        type="text"
        className="block w-full pl-11 pr-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl leading-5 text-white placeholder-dark-500 focus:outline-none focus:bg-dark-800 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all duration-200 shadow-glass"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      
      {/* Keyboard shortcut hint */}
      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
        <kbd className="hidden sm:inline-block border border-white/10 rounded px-2 py-0.5 text-xs font-mono text-dark-500">
          ⌘K
        </kbd>
      </div>
    </div>
  );
};

export default ProjectSearch;
