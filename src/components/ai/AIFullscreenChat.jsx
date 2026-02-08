import React from 'react';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';
import SuggestedPrompts from './SuggestedPrompts';
import { useAIChat } from '@hooks/useAIChat';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@config/routes.config';

const AIFullscreenChat = () => {
  const { messages, sendMessage, isLoading, clearChat } = useAIChat();
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-screen bg-dark-950">
      <ChatHeader onClose={handleClose} isFullscreen />
      
      <div className="flex-1 overflow-hidden relative flex flex-col max-w-4xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-neon-blue/10 flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 bg-neon-blue/20 blur-xl rounded-full" />
              <img 
                src="/ai-nova-avatar.png" 
                alt="Nova" 
                className="w-20 h-20 rounded-full relative z-10"
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-display text-white mb-3">
              How can I help you today?
            </h1>
            <p className="text-dark-400 max-w-md mb-10 text-lg">
              I can explain code, help you debug issues, or generate new snippets for your project.
            </p>
            <SuggestedPrompts onSelect={sendMessage} />
          </div>
        ) : (
          <ChatWindow messages={messages} />
        )}
      </div>

      <div className="p-4 border-t border-white/5 bg-dark-900/50 backdrop-blur-md pb-20 lg:pb-4">
        <div className="max-w-4xl mx-auto w-full">
          <ChatInput onSend={sendMessage} isLoading={isLoading} />
          <div className="text-center mt-2">
            <button 
              onClick={clearChat}
              className="text-xs text-dark-500 hover:text-red-400 transition-colors"
            >
              Clear conversation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIFullscreenChat;
