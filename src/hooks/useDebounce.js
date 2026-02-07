/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 useDebounce Hook
 * 
 * Debounces a value or callback function.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Debounce a value
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {any} Debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Debounce a callback function
 * @param {Function} callback - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @param {Array} deps - Dependencies array
 * @returns {Function} Debounced function
 */
export function useDebouncedCallback(callback, delay = 300, deps = []) {
  const timeoutRef = useRef(null);
  const callbackRef = useRef(callback);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedCallback = useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay, ...deps]
  );

  // Cancel function
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  // Flush function (execute immediately)
  const flush = useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      callbackRef.current(...args);
    },
    []
  );

  return { debouncedCallback, cancel, flush };
}

/**
 * Debounce state with setter
 * @param {any} initialValue - Initial value
 * @param {number} delay - Delay in milliseconds
 * @returns {Array} [debouncedValue, setValue, immediateValue]
 */
export function useDebouncedState(initialValue, delay = 300) {
  const [immediateValue, setImmediateValue] = useState(initialValue);
  const debouncedValue = useDebounce(immediateValue, delay);

  return [debouncedValue, setImmediateValue, immediateValue];
}

export default useDebounce;
