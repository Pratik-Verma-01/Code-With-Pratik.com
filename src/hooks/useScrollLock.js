/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 useScrollLock Hook
 * 
 * Locks body scroll when modals/drawers are open.
 */

import { useEffect, useCallback, useRef } from 'react';

/**
 * Lock body scroll
 * @param {boolean} lock - Whether to lock scroll
 */
export function useScrollLock(lock = false) {
  const scrollPositionRef = useRef(0);
  const originalStyleRef = useRef('');

  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (lock) {
      // Store current scroll position
      scrollPositionRef.current = window.scrollY;
      originalStyleRef.current = document.body.style.cssText;

      // Lock scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';

      // Add padding to prevent layout shift from scrollbar
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      // Restore original styles
      document.body.style.cssText = originalStyleRef.current;
      
      // Restore scroll position
      window.scrollTo(0, scrollPositionRef.current);
    }

    return () => {
      // Cleanup on unmount
      document.body.style.cssText = originalStyleRef.current;
      window.scrollTo(0, scrollPositionRef.current);
    };
  }, [lock]);
}

/**
 * Hook with manual lock/unlock control
 * @returns {Object} Lock controls
 */
export function useScrollLockControls() {
  const scrollPositionRef = useRef(0);
  const isLockedRef = useRef(false);

  const lock = useCallback(() => {
    if (typeof document === 'undefined' || isLockedRef.current) return;

    scrollPositionRef.current = window.scrollY;
    
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPositionRef.current}px`;
    document.body.style.width = '100%';

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    isLockedRef.current = true;
  }, []);

  const unlock = useCallback(() => {
    if (typeof document === 'undefined' || !isLockedRef.current) return;

    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.paddingRight = '';

    window.scrollTo(0, scrollPositionRef.current);

    isLockedRef.current = false;
  }, []);

  const toggle = useCallback(() => {
    if (isLockedRef.current) {
      unlock();
    } else {
      lock();
    }
  }, [lock, unlock]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isLockedRef.current) {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.paddingRight = '';
      }
    };
  }, []);

  return {
    lock,
    unlock,
    toggle,
    isLocked: isLockedRef.current,
  };
}

export default useScrollLock;
