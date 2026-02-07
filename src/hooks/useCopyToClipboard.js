/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 useCopyToClipboard Hook
 * 
 * Copy text to clipboard with feedback.
 */

import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for clipboard operations
 * @param {Object} options - Options
 * @returns {Object} Clipboard state and methods
 */
export function useCopyToClipboard(options = {}) {
  const { resetDelay = 2000, onSuccess, onError } = options;
  
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  /**
   * Copy text to clipboard
   * @param {string} text - Text to copy
   * @returns {Promise<boolean>} Success status
   */
  const copy = useCallback(
    async (text) => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Reset state
      setCopied(false);
      setError(null);

      if (!text) {
        const err = new Error('No text to copy');
        setError(err);
        onError?.(err);
        return false;
      }

      try {
        // Modern clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          textArea.style.top = '-9999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();

          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);

          if (!successful) {
            throw new Error('Copy command failed');
          }
        }

        setCopied(true);
        onSuccess?.(text);

        // Reset after delay
        timeoutRef.current = setTimeout(() => {
          setCopied(false);
        }, resetDelay);

        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to copy');
        setError(error);
        onError?.(error);
        return false;
      }
    },
    [resetDelay, onSuccess, onError]
  );

  /**
   * Reset copy state
   */
  const reset = useCallback(() => {
    setCopied(false);
    setError(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    copy,
    copied,
    error,
    reset,
  };
}

/**
 * Simple copy hook without state management
 * @returns {Function} Copy function
 */
export function useCopy() {
  return useCallback(async (text) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      return successful;
    } catch {
      return false;
    }
  }, []);
}

export default useCopyToClipboard;
