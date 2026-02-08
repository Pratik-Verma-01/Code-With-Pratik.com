import React from 'react';
import { Sparkles, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@utils/cn';
import MarkdownMessage from './MarkdownMessage';
import { motion } from 'framer-motion';

const AIMessage = ({ content, timestamp, isStreaming }) => {
  return (
    <div className="flex items-start gap-3 group">
      <div className="flex-shrink-0 mt-1 relative">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border border-neon-blue/30 bg-dark-800",
          isStreaming && "animate-pulse ring-2 ring-neon-blue/20"
        )}>
          <img src="/ai-nova-avatar.png" alt="Nova" className="w-full h-full object-cover" />
        </div>
        {isStreaming && (
          <div className="absolute -bottom-1 -right-1">
            <Sparkles size={12} className="text-neon-blue animate-spin-slow" />
          </div>
        )}
      </div>
      
      <div className="flex flex-col items-start max-w-[90%]">
        <div className="bg-dark-800/50 backdrop-blur-sm text-dark-100 px-4 py-3 rounded-2xl rounded-tl-sm border border-white/5 shadow-sm w-full overflow-hidden">
          <MarkdownMessage content={content} />
          
          {isStreaming && (
            <span className="inline-block w-1.5 h-4 bg-neon-blue ml-1 animate-blink align-middle" />
          )}
        </div>
        
        <div className="flex items-center gap-3 mt-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] text-dark-500">
            {timestamp && new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          
          {!isStreaming && (
            <div className="flex items-center gap-2">
              <ActionButton icon={<Copy size={12} />} label="Copy" onClick={() => navigator.clipboard.writeText(content)} />
              <div className="w-px h-3 bg-dark-700" />
              <ActionButton icon={<ThumbsUp size={12} />} />
              <ActionButton icon={<ThumbsDown size={12} />} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="p-1 text-dark-400 hover:text-white hover:bg-white/5 rounded transition-colors flex items-center gap-1"
    title={label}
  >
    {icon}
    {label && <span className="text-[10px]">{label}</span>}
  </button>
);

export default AIMessage;
