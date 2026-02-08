import React, { useState, useRef, useEffect } from 'react';
import { Send, StopCircle, CornerDownLeft } from 'lucide-react';
import { cn } from '@utils/cn';
import { motion } from 'framer-motion';

const ChatInput = ({ onSend, isLoading, placeholder = "Ask Nova something..." }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    onSend(input);
    setInput('');
    
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  return (
    <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
      <div className="relative flex-1 bg-dark-800/50 border border-white/10 rounded-xl overflow-hidden focus-within:border-neon-blue/50 focus-within:ring-1 focus-within:ring-neon-blue/20 transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="w-full bg-transparent text-white placeholder-dark-400 p-3 pr-10 resize-none outline-none max-h-[150px] custom-scrollbar text-sm"
          style={{ minHeight: '44px' }}
        />
        
        <div className="absolute bottom-2 right-2 hidden sm:block">
          <kbd className="text-[10px] text-dark-500 font-mono bg-dark-800 border border-white/10 rounded px-1 py-0.5 flex items-center gap-1">
            <CornerDownLeft size={8} /> Enter
          </kbd>
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={!input.trim() && !isLoading}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "p-3 rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg",
          input.trim() && !isLoading
            ? "bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-neon-sm hover:shadow-neon-md"
            : "bg-dark-800 text-dark-500 cursor-not-allowed border border-white/5"
        )}
      >
        {isLoading ? (
          <StopCircle size={20} className="animate-pulse text-red-400" />
        ) : (
          <Send size={20} className={cn(input.trim() && "ml-0.5")} />
        )}
      </motion.button>
    </form>
  );
};

export default ChatInput;
