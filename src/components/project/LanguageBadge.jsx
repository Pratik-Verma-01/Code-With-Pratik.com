import React from 'react';
import { cn } from '@utils/cn';
import { getLanguageByValue } from '@config/app.config';

const LanguageBadge = ({ language, size = 'md', className }) => {
  const langConfig = getLanguageByValue(language);
  
  if (!langConfig) return null;

  const color = langConfig.color;
  
  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium border shadow-sm backdrop-blur-md",
        sizes[size],
        className
      )}
      style={{
        backgroundColor: `${color}15`, // 15% opacity hex
        borderColor: `${color}30`,    // 30% opacity hex
        color: color,
      }}
    >
      <span 
        className="w-2 h-2 rounded-full" 
        style={{ backgroundColor: color }}
      />
      {langConfig.label}
    </span>
  );
};

export default LanguageBadge;
