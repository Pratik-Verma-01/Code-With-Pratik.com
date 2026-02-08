import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Sparkles } from 'lucide-react';
import { useAIChat } from '@hooks/useAIChat';
import { cn } from '@utils/cn';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';
import SuggestedPrompts from './SuggestedPrompts';

const AISidebar = () => {
  const { isSidebarOpen, closeSidebar, messages, sendMessage, isLoading } = useAIChat();

  return (
    <>
      {/* Toggle Button (Visible when closed) */}
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={closeSidebar} // Actually opens it via context toggle logic in layout
            className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple shadow-neon-lg text-white hover:scale-110 transition-transform hidden lg:flex items-center justify-center group"
          >
            <Sparkles size={24} className="animate-pulse-slow" />
            <span className="absolute right-full mr-3 px-3 py-1 bg-dark-800 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 pointer-events-none">
              Ask Nova AI
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sidebar Panel */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-16 right-0 bottom-0 w-96 bg-dark-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl z-30 flex flex-col hidden lg:flex"
          >
            <ChatHeader onClose={closeSidebar} />

            <div className="flex-1 overflow-hidden relative flex flex-col">
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-neon-blue/10 flex items-center justify-center mb-4 relative">
                    <div className="absolute inset-0 bg-neon-blue/20 blur-xl rounded-full" />
                    <img 
                      src="/ai-nova-avatar.png" 
                      alt="Nova" 
                      className="w-16 h-16 rounded-full relative z-10"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Hi, I'm Nova! 👋
                  </h3>
                  <p className="text-dark-400 text-sm mb-8">
                    I'm your AI coding assistant. Ask me anything about your project, debugging, or code generation.
                  </p>
                  <SuggestedPrompts onSelect={sendMessage} />
                </div>
              ) : (
                <ChatWindow messages={messages} />
              )}
            </div>

            <div className="p-4 border-t border-white/5 bg-dark-900">
              <ChatInput onSend={sendMessage} isLoading={isLoading} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AISidebar;
