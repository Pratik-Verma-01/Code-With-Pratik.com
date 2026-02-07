/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 useTheme Hook
 * 
 * Convenient wrapper around ThemeContext for theme management.
 */

import { useThemeContext, THEMES } from '@contexts/ThemeContext';

/**
 * Custom hook for theme management
 * @returns {Object} Theme state and methods
 */
export function useTheme() {
  const theme = useThemeContext();
  return theme;
}

/**
 * Hook to check if dark mode is active
 * @returns {boolean}
 */
export function useIsDarkMode() {
  const { isDark } = useThemeContext();
  return isDark;
}

/**
 * Hook to toggle theme
 * @returns {Function}
 */
export function useToggleTheme() {
  const { toggleTheme } = useThemeContext();
  return toggleTheme;
}

/**
 * Hook to get current effective theme
 * @returns {string}
 */
export function useEffectiveTheme() {
  const { effectiveTheme } = useThemeContext();
  return effectiveTheme;
}

// Export THEMES constant
export { THEMES };

export default useTheme;
