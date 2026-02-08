import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { useAIChat } from '@hooks/useAIChat';

const ChatWindow = ({ messages }) => {
  const scrollRef = useRef(null);
  const { isLoading, isStreaming } = useAIChat();

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isStreaming]);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6 scroll-smooth"
    >
      {messages.map((msg, index) => (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <MessageBubble message={msg} />
        </motion.div>
      ))}

      {isLoading && !isStreaming && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-start"
        >
          <TypingIndicator />
        </motion.div>
      )}
      
      <div className="h-4" /> {/* Bottom spacer */}
    </div>
  );
};

export default ChatWindow;
