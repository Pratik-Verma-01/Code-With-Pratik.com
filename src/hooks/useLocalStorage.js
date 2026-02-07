/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 useLocalStorage Hook
 * 
 * Persistent state management with localStorage.
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Get value from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} Stored or default value
 */
const getStoredValue = (key, defaultValue) => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Store value in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
const setStoredValue = (key, value) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    
    // Dispatch custom event for cross-tab sync
    window.dispatchEvent(new StorageEvent('storage', {
      key,
      newValue: JSON.stringify(value),
    }));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
};

/**
 * Remove value from localStorage
 * @param {string} key - Storage key
 */
const removeStoredValue = (key) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
};

/**
 * Custom hook for localStorage state
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value
 * @returns {Array} [value, setValue, removeValue]
 */
export function useLocalStorage(key, defaultValue) {
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => getStoredValue(key, defaultValue));

  // Set value handler
  const setValue = useCallback(
    (value) => {
      try {
        // Allow value to be a function (like useState)
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        // Save to state
        setStoredValue(valueToStore);
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove value handler
  const removeValue = useCallback(() => {
    try {
      setStoredValue(defaultValue);
      
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, defaultValue]);

  // Listen for changes in other tabs
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (event) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setStoredValue(JSON.parse(event.newValue));
        } catch {
          setStoredValue(event.newValue);
        }
      } else if (event.key === key && event.newValue === null) {
        setStoredValue(defaultValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, defaultValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * Custom hook for sessionStorage state
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value
 * @returns {Array} [value, setValue, removeValue]
 */
export function useSessionStorage(key, defaultValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(defaultValue);
      
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, defaultValue]);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
