import React from 'react';
import { Copy, Check } from 'lucide-react';
import { useCopyToClipboard } from '@hooks/useCopyToClipboard';
import { cn } from '@utils/cn';

const CopyButton = ({ code, className }) => {
  const { copy, copied } = useCopyToClipboard();

  return (
    <button
      onClick={() => copy(code)}
      className={cn(
        "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all",
        copied 
          ? "bg-green-500/10 text-green-400" 
          : "text-dark-400 hover:text-white hover:bg-white/10",
        className
      )}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      <span>{copied ? 'Copied!' : 'Copy Code'}</span>
    </button>
  );
};

export default CopyButton;
