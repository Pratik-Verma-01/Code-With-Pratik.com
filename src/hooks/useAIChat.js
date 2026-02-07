/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 useAIChat Hook
 * 
 * Convenient wrapper around AIContext for AI chat functionality.
 */

import { useCallback } from 'react';
import { useAIContext } from '@contexts/AIContext';

/**
 * Custom hook for AI chat
 * @returns {Object} AI chat state and methods
 */
export function useAIChat() {
  const ai = useAIContext();
  return ai;
}

/**
 * Hook for sending messages to AI
 * @returns {Object} Send message function and loading state
 */
export function useSendMessage() {
  const { sendMessage, isLoading, isStreaming, cancelRequest } = useAIContext();

  return {
    send: sendMessage,
    isLoading,
    isStreaming,
    cancel: cancelRequest,
  };
}

/**
 * Hook for AI chat messages
 * @returns {Object} Messages and related state
 */
export function useAIMessages() {
  const { messages, hasMessages, lastMessage, messageCount, clearChat, deleteMessage } =
    useAIContext();

  return {
    messages,
    hasMessages,
    lastMessage,
    count: messageCount,
    clear: clearChat,
    delete: deleteMessage,
  };
}

/**
 * Hook for AI sidebar state
 * @returns {Object} Sidebar state and controls
 */
export function useAISidebar() {
  const { isSidebarOpen, toggleSidebar, openSidebar, closeSidebar } = useAIContext();

  return {
    isOpen: isSidebarOpen,
    toggle: toggleSidebar,
    open: openSidebar,
    close: closeSidebar,
  };
}

/**
 * Hook to set project context for AI
 * @param {Object} project - Project object
 */
export function useAIProjectContext(project) {
  const { setProjectContext, clearProjectContext } = useAIContext();

  const setContext = useCallback(() => {
    if (project) {
      setProjectContext(project);
    }
  }, [project, setProjectContext]);

  const clearContext = useCallback(() => {
    clearProjectContext();
  }, [clearProjectContext]);

  return {
    setContext,
    clearContext,
  };
}

/**
 * Hook for AI suggested prompts
 * @returns {Object} Suggested prompts and send function
 */
export function useAISuggestions() {
  const { suggestedPrompts, sendMessage } = useAIContext();

  const sendSuggestion = useCallback(
    (prompt) => {
      sendMessage(prompt);
    },
    [sendMessage]
  );

  return {
    suggestions: suggestedPrompts,
    send: sendSuggestion,
  };
}

export default useAIChat;
