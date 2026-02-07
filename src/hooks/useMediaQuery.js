/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 useMediaQuery Hook
 * 
 * Responsive breakpoint detection using CSS media queries.
 */

import { useState, useEffect, useCallback } from 'react';
import { UI_CONFIG } from '@config/app.config';

/**
 * Check if a media query matches
 * @param {string} query - CSS media query string
 * @returns {boolean} Whether the query matches
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    
    const handleChange = (event) => {
      setMatches(event.matches);
    };

    // Set initial value
    setMatches(mediaQuery.matches);

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Legacy browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [query]);

  return matches;
}

/**
 * Get current breakpoint name
 * @returns {string} Current breakpoint name
 */
export function useBreakpoint() {
  const { breakpoints } = UI_CONFIG;

  const is3xl = useMediaQuery(`(min-width: ${breakpoints['2xl']}px)`);
  const is2xl = useMediaQuery(`(min-width: ${breakpoints['2xl']}px)`);
  const isXl = useMediaQuery(`(min-width: ${breakpoints.xl}px)`);
  const isLg = useMediaQuery(`(min-width: ${breakpoints.lg}px)`);
  const isMd = useMediaQuery(`(min-width: ${breakpoints.md}px)`);
  const isSm = useMediaQuery(`(min-width: ${breakpoints.sm}px)`);
  const isXs = useMediaQuery(`(min-width: ${breakpoints.xs}px)`);

  if (is3xl) return '3xl';
  if (is2xl) return '2xl';
  if (isXl) return 'xl';
  if (isLg) return 'lg';
  if (isMd) return 'md';
  if (isSm) return 'sm';
  if (isXs) return 'xs';
  return 'base';
}

/**
 * Check if screen is mobile
 * @returns {boolean}
 */
export function useIsMobile() {
  return useMediaQuery(`(max-width: ${UI_CONFIG.breakpoints.md - 1}px)`);
}

/**
 * Check if screen is tablet
 * @returns {boolean}
 */
export function useIsTablet() {
  const isMd = useMediaQuery(`(min-width: ${UI_CONFIG.breakpoints.md}px)`);
  const isLg = useMediaQuery(`(min-width: ${UI_CONFIG.breakpoints.lg}px)`);
  return isMd && !isLg;
}

/**
 * Check if screen is desktop
 * @returns {boolean}
 */
export function useIsDesktop() {
  return useMediaQuery(`(min-width: ${UI_CONFIG.breakpoints.lg}px)`);
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean}
 */
export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/**
 * Check if user prefers dark color scheme
 * @returns {boolean}
 */
export function usePrefersDarkMode() {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

/**
 * Get responsive value based on breakpoint
 * @param {Object} values - Object with breakpoint keys and values
 * @param {any} defaultValue - Default value
 * @returns {any} Current value for breakpoint
 */
export function useResponsiveValue(values, defaultValue = null) {
  const breakpoint = useBreakpoint();
  
  const breakpointOrder = ['base', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
  const currentIndex = breakpointOrder.indexOf(breakpoint);

  // Find the closest defined value at or below current breakpoint
  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpointOrder[i];
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }

  return defaultValue;
}

/**
 * Combined responsive hooks
 * @returns {Object} Responsive state
 */
export function useResponsive() {
  const breakpoint = useBreakpoint();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  const prefersReducedMotion = usePrefersReducedMotion();
  const prefersDarkMode = usePrefersDarkMode();

  return {
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    prefersReducedMotion,
    prefersDarkMode,
  };
}

export default useMediaQuery;
