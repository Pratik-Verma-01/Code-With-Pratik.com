/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 Theme Context
 * 
 * Manages light/dark mode with system preference detection
 * and localStorage persistence.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { STORAGE_KEYS } from '@config/app.config';

// Theme types
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Create Theme Context
const ThemeContext = createContext(null);

// Get initial theme from localStorage or system preference
const getInitialTheme = () => {
  // Check localStorage first
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
    
    if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
      return savedTheme;
    }
  }
  
  // Default to system preference
  return THEMES.SYSTEM;
};

// Get effective theme (resolves 'system' to actual theme)
const getEffectiveTheme = (theme) => {
  if (theme === THEMES.SYSTEM) {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? THEMES.DARK
        : THEMES.LIGHT;
    }
    return THEMES.DARK; // Default fallback
  }
  return theme;
};

// Theme Provider Component
export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);
  const [effectiveTheme, setEffectiveTheme] = useState(() => getEffectiveTheme(getInitialTheme()));

  /**
   * Apply theme to document
   */
  const applyTheme = useCallback((newEffectiveTheme) => {
    const root = document.documentElement;
    
    if (newEffectiveTheme === THEMES.DARK) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        newEffectiveTheme === THEMES.DARK ? '#0f172a' : '#ffffff'
      );
    }
  }, []);

  /**
   * Set theme
   */
  const setTheme = useCallback((newTheme) => {
    if (!Object.values(THEMES).includes(newTheme)) {
      console.warn(`Invalid theme: ${newTheme}`);
      return;
    }

    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEYS.theme, newTheme);

    const newEffectiveTheme = getEffectiveTheme(newTheme);
    setEffectiveTheme(newEffectiveTheme);
    applyTheme(newEffectiveTheme);
  }, [applyTheme]);

  /**
   * Toggle between light and dark
   */
  const toggleTheme = useCallback(() => {
    const newTheme = effectiveTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    setTheme(newTheme);
  }, [effectiveTheme, setTheme]);

  /**
   * Set to system preference
   */
  const setSystemTheme = useCallback(() => {
    setTheme(THEMES.SYSTEM);
  }, [setTheme]);

  /**
   * Listen for system theme changes
   */
  useEffect(() => {
    if (theme !== THEMES.SYSTEM) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      const newEffectiveTheme = e.matches ? THEMES.DARK : THEMES.LIGHT;
      setEffectiveTheme(newEffectiveTheme);
      applyTheme(newEffectiveTheme);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Legacy support
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [theme, applyTheme]);

  /**
   * Apply theme on mount
   */
  useEffect(() => {
    applyTheme(effectiveTheme);
  }, [effectiveTheme, applyTheme]);

  // Memoized context value
  const contextValue = useMemo(() => ({
    // State
    theme,
    effectiveTheme,
    
    // Computed
    isDark: effectiveTheme === THEMES.DARK,
    isLight: effectiveTheme === THEMES.LIGHT,
    isSystem: theme === THEMES.SYSTEM,
    
    // Actions
    setTheme,
    toggleTheme,
    setSystemTheme,
    setDarkTheme: () => setTheme(THEMES.DARK),
    setLightTheme: () => setTheme(THEMES.LIGHT),
    
    // Constants
    THEMES,
  }), [theme, effectiveTheme, setTheme, toggleTheme, setSystemTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Custom hook to use theme context
 */
export function useThemeContext() {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  
  return context;
}

// Export themes constant
export { THEMES };

export default ThemeContext;
