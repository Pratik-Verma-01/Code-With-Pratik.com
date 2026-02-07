/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 useClickOutside Hook
 * 
 * Detects clicks outside a referenced element.
 */

import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook to detect clicks outside an element
 * @param {Function} handler - Callback function when clicking outside
 * @param {boolean} enabled - Whether the listener is enabled
 * @returns {Object} Ref to attach to element
 */
export function useClickOutside(handler, enabled = true) {
  const ref = useRef(null);
  const handlerRef = useRef(handler);

  // Update handler ref when handler changes
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handlerRef.current(event);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handlerRef.current(event);
      }
    };

    // Use mousedown for immediate response
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled]);

  return ref;
}

/**
 * Hook with multiple refs support
 * @param {Function} handler - Callback function
 * @param {boolean} enabled - Whether enabled
 * @returns {Object} Object with addRef function
 */
export function useClickOutsideMultiple(handler, enabled = true) {
  const refs = useRef([]);
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  const addRef = useCallback((element) => {
    if (element && !refs.current.includes(element)) {
      refs.current.push(element);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleClick = (event) => {
      const isOutside = refs.current.every(
        (ref) => !ref || !ref.contains(event.target)
      );

      if (isOutside) {
        handlerRef.current(event);
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [enabled]);

  // Clear refs on unmount
  useEffect(() => {
    return () => {
      refs.current = [];
    };
  }, []);

  return { addRef, refs };
}

export default useClickOutside;
