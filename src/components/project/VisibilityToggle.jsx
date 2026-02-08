import React from 'react';
import { Globe, Lock } from 'lucide-react';
import { cn } from '@utils/cn';

const VisibilityToggle = ({ value, onChange }) => {
  return (
    <div className="flex bg-dark-800/50 p-1 rounded-xl border border-white/10">
      <button
        type="button"
        onClick={() => onChange('public')}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all",
          value === 'public' 
            ? "bg-neon-blue/10 text-neon-blue shadow-sm" 
            : "text-dark-400 hover:text-white"
        )}
      >
        <Globe size={16} />
        Public
      </button>
      <button
        type="button"
        onClick={() => onChange('private')}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all",
          value === 'private' 
            ? "bg-neon-purple/10 text-neon-purple shadow-sm" 
            : "text-dark-400 hover:text-white"
        )}
      >
        <Lock size={16} />
        Private
      </button>
    </div>
  );
};

export default VisibilityToggle;
