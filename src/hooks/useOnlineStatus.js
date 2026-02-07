/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 useOnlineStatus Hook
 * 
 * Detects network connectivity status.
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Get initial online status
 * @returns {boolean}
 */
const getOnlineStatus = () => {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine;
};

/**
 * Custom hook for online/offline status
 * @returns {boolean} Online status
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(getOnlineStatus);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

/**
 * Hook with callbacks for online/offline events
 * @param {Object} options - Callback options
 * @returns {Object} Online status and info
 */
export function useNetworkStatus(options = {}) {
  const { onOnline, onOffline } = options;
  
  const [isOnline, setIsOnline] = useState(getOnlineStatus);
  const [wasOffline, setWasOffline] = useState(false);
  const [lastOnlineAt, setLastOnlineAt] = useState(null);
  const [lastOfflineAt, setLastOfflineAt] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setIsOnline(true);
      setLastOnlineAt(new Date());
      onOnline?.();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      setLastOfflineAt(new Date());
      onOffline?.();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onOnline, onOffline]);

  return {
    isOnline,
    isOffline: !isOnline,
    wasOffline,
    lastOnlineAt,
    lastOfflineAt,
  };
}

/**
 * Hook to check actual connectivity (not just browser status)
 * @param {string} pingUrl - URL to ping for connectivity check
 * @param {number} interval - Check interval in ms
 * @returns {Object} Connectivity status
 */
export function useConnectivity(pingUrl = '/api/health', interval = 30000) {
  const [isConnected, setIsConnected] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const browserOnline = useOnlineStatus();

  const checkConnectivity = useCallback(async () => {
    if (!browserOnline) {
      setIsConnected(false);
      return false;
    }

    setIsChecking(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(pingUrl, {
        method: 'HEAD',
        cache: 'no-store',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      setIsConnected(response.ok);
      return response.ok;
    } catch {
      setIsConnected(false);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, [browserOnline, pingUrl]);

  // Check periodically
  useEffect(() => {
    checkConnectivity();
    
    const intervalId = setInterval(checkConnectivity, interval);
    
    return () => clearInterval(intervalId);
  }, [checkConnectivity, interval]);

  // Check when browser comes online
  useEffect(() => {
    if (browserOnline) {
      checkConnectivity();
    }
  }, [browserOnline, checkConnectivity]);

  return {
    isConnected,
    isChecking,
    browserOnline,
    check: checkConnectivity,
  };
}

export default useOnlineStatus;
