/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 AI Context
 * 
 * Manages AI chat state, history, and interaction with Nova AI.
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import { useAuthContext } from './AuthContext';
import { useNotificationContext } from './NotificationContext';
import { AI_CONFIG, STORAGE_KEYS } from '@config/app.config';
import { v4 as uuidv4 } from 'uuid';

// Create AI Context
const AIContext = createContext(null);

// Message types
const MESSAGE_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
};

// Initial state for chat
const getInitialChatHistory = () => {
  if (typeof window === 'undefined') return [];
  
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.aiChatHistory);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// AI Provider Component
export function AIProvider({ children }) {
  const { userId, isAuthenticated, getAuthToken } = useAuthContext();
  const { showError } = useNotificationContext();

  // State
  const [messages, setMessages] = useState(getInitialChatHistory);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentProjectContext, setCurrentProjectContext] = useState(null);

  // Refs
  const abortControllerRef = useRef(null);
  const streamingMessageRef = useRef('');

  /**
   * Save chat history to localStorage
   */
  const saveChatHistory = useCallback((newMessages) => {
    try {
      // Keep only last 100 messages to prevent localStorage overflow
      const messagesToSave = newMessages.slice(-100);
      localStorage.setItem(STORAGE_KEYS.aiChatHistory, JSON.stringify(messagesToSave));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }, []);

  /**
   * Add a message to chat
   */
  const addMessage = useCallback((role, content, metadata = {}) => {
    const message = {
      id: uuidv4(),
      role,
      content,
      timestamp: new Date().toISOString(),
      ...metadata,
    };

    setMessages((prev) => {
      const newMessages = [...prev, message];
      saveChatHistory(newMessages);
      return newMessages;
    });

    return message;
  }, [saveChatHistory]);

  /**
   * Update a specific message
   */
  const updateMessage = useCallback((messageId, updates) => {
    setMessages((prev) => {
      const newMessages = prev.map((msg) =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      );
      saveChatHistory(newMessages);
      return newMessages;
    });
  }, [saveChatHistory]);

  /**
   * Send message to AI
   */
  const sendMessage = useCallback(async (userInput, projectSlug = null) => {
    if (!userInput.trim()) return;
    
    if (!isAuthenticated) {
      showError('Please log in to chat with Nova AI');
      return;
    }

    // Add user message
    const userMessage = addMessage(MESSAGE_ROLES.USER, userInput.trim());

    // Create placeholder for AI response
    const aiMessageId = uuidv4();
    const aiMessage = {
      id: aiMessageId,
      role: MESSAGE_ROLES.ASSISTANT,
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(true);
    setIsStreaming(true);
    setError(null);
    streamingMessageRef.current = '';

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    try {
      const token = await getAuthToken();
      
      const response = await fetch('/api/openrouter/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_input: userInput.trim(),
          project_slug: projectSlug || currentProjectContext?.slug,
          project_context: currentProjectContext ? {
            title: currentProjectContext.title,
            description: currentProjectContext.short_description,
            language: currentProjectContext.primary_language,
          } : null,
          chat_history: messages.slice(-10).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              
              if (content) {
                fullContent += content;
                streamingMessageRef.current = fullContent;

                // Update message in state
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === aiMessageId
                      ? { ...msg, content: fullContent }
                      : msg
                  )
                );
              }
            } catch (e) {
              // Not valid JSON, might be partial data
              if (data.trim()) {
                fullContent += data;
                streamingMessageRef.current = fullContent;
                
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === aiMessageId
                      ? { ...msg, content: fullContent }
                      : msg
                  )
                );
              }
            }
          }
        }
      }

      // Finalize message
      setMessages((prev) => {
        const newMessages = prev.map((msg) =>
          msg.id === aiMessageId
            ? { ...msg, content: fullContent || streamingMessageRef.current, isStreaming: false }
            : msg
        );
        saveChatHistory(newMessages);
        return newMessages;
      });

    } catch (error) {
      if (error.name === 'AbortError') {
        // Request was cancelled
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? { ...msg, content: streamingMessageRef.current || 'Response cancelled.', isStreaming: false, cancelled: true }
              : msg
          )
        );
      } else {
        console.error('AI chat error:', error);
        setError(error.message);
        
        // Update AI message with error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? { ...msg, content: 'Sorry, I encountered an error. Please try again.', isStreaming: false, error: true }
              : msg
          )
        );
        
        showError(error.message || 'Failed to get AI response');
      }
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, [
    isAuthenticated,
    messages,
    currentProjectContext,
    getAuthToken,
    addMessage,
    saveChatHistory,
    showError,
  ]);

  /**
   * Cancel ongoing request
   */
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  /**
   * Clear chat history
   */
  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEYS.aiChatHistory);
    setError(null);
  }, []);

  /**
   * Delete a specific message
   */
  const deleteMessage = useCallback((messageId) => {
    setMessages((prev) => {
      const newMessages = prev.filter((msg) => msg.id !== messageId);
      saveChatHistory(newMessages);
      return newMessages;
    });
  }, [saveChatHistory]);

  /**
   * Retry last message
   */
  const retryLastMessage = useCallback(() => {
    // Find last user message
    const lastUserMessage = [...messages].reverse().find((m) => m.role === MESSAGE_ROLES.USER);
    
    if (lastUserMessage) {
      // Remove last AI response if it exists
      setMessages((prev) => {
        const lastIndex = prev.length - 1;
        if (prev[lastIndex]?.role === MESSAGE_ROLES.ASSISTANT) {
          return prev.slice(0, -1);
        }
        return prev;
      });
      
      // Resend
      sendMessage(lastUserMessage.content);
    }
  }, [messages, sendMessage]);

  /**
   * Set project context for AI
   */
  const setProjectContext = useCallback((project) => {
    setCurrentProjectContext(project);
  }, []);

  /**
   * Clear project context
   */
  const clearProjectContext = useCallback(() => {
    setCurrentProjectContext(null);
  }, []);

  /**
   * Toggle sidebar
   */
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  /**
   * Open sidebar
   */
  const openSidebar = useCallback(() => {
    setIsSidebarOpen(true);
  }, []);

  /**
   * Close sidebar
   */
  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  // Memoized context value
  const contextValue = useMemo(() => ({
    // AI Config
    aiName: AI_CONFIG.name,
    aiDescription: AI_CONFIG.description,
    suggestedPrompts: AI_CONFIG.suggestedPrompts,
    
    // State
    messages,
    isLoading,
    isStreaming,
    error,
    isSidebarOpen,
    currentProjectContext,
    
    // Computed
    hasMessages: messages.length > 0,
    lastMessage: messages[messages.length - 1] || null,
    messageCount: messages.length,
    
    // Actions
    sendMessage,
    cancelRequest,
    clearChat,
    deleteMessage,
    retryLastMessage,
    addMessage,
    updateMessage,
    setProjectContext,
    clearProjectContext,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    
    // Constants
    MESSAGE_ROLES,
  }), [
    messages,
    isLoading,
    isStreaming,
    error,
    isSidebarOpen,
    currentProjectContext,
    sendMessage,
    cancelRequest,
    clearChat,
    deleteMessage,
    retryLastMessage,
    addMessage,
    updateMessage,
    setProjectContext,
    clearProjectContext,
    toggleSidebar,
    openSidebar,
    closeSidebar,
  ]);

  return (
    <AIContext.Provider value={contextValue}>
      {children}
    </AIContext.Provider>
  );
}

/**
 * Custom hook to use AI context
 */
export function useAIContext() {
  const context = useContext(AIContext);
  
  if (!context) {
    throw new Error('useAIContext must be used within an AIProvider');
  }
  
  return context;
}

export default AIContext;
