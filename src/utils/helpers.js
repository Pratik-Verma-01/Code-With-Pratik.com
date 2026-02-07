/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 Helper Functions
 * 
 * General utility helper functions.
 */

import { v4 as uuidv4 } from 'uuid';

// ===================
// Array Helpers
// ===================

/**
 * Group array items by a key
 * @param {Array} array - Array to group
 * @param {string|Function} key - Key to group by
 * @returns {Object}
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key];
    (result[groupKey] = result[groupKey] || []).push(item);
    return result;
  }, {});
};

/**
 * Remove duplicates from array
 * @param {Array} array - Array with duplicates
 * @param {string} key - Optional key for objects
 * @returns {Array}
 */
export const uniqueBy = (array, key = null) => {
  if (!key) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * Sort array of objects by key
 * @param {Array} array - Array to sort
 * @param {string} key - Key to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array}
 */
export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];
    
    if (valueA < valueB) return order === 'asc' ? -1 : 1;
    if (valueA > valueB) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Chunk array into smaller arrays
 * @param {Array} array - Array to chunk
 * @param {number} size - Chunk size
 * @returns {Array}
 */
export const chunk = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Shuffle array randomly
 * @param {Array} array - Array to shuffle
 * @returns {Array}
 */
export const shuffle = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Get random item from array
 * @param {Array} array - Array to pick from
 * @returns {any}
 */
export const randomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Find and update item in array
 * @param {Array} array - Array to update
 * @param {Function} predicate - Find predicate
 * @param {Object} updates - Updates to apply
 * @returns {Array}
 */
export const updateWhere = (array, predicate, updates) => {
  return array.map((item) => {
    if (predicate(item)) {
      return { ...item, ...updates };
    }
    return item;
  });
};

// ===================
// Object Helpers
// ===================

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object}
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(deepClone);
  }
  
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, deepClone(value)])
  );
};

/**
 * Deep merge objects
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object}
 */
export const deepMerge = (target, source) => {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  
  return output;
};

/**
 * Check if value is plain object
 * @param {any} value - Value to check
 * @returns {boolean}
 */
export const isObject = (value) => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

/**
 * Pick specific keys from object
 * @param {Object} obj - Source object
 * @param {Array} keys - Keys to pick
 * @returns {Object}
 */
export const pick = (obj, keys) => {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};

/**
 * Omit specific keys from object
 * @param {Object} obj - Source object
 * @param {Array} keys - Keys to omit
 * @returns {Object}
 */
export const omit = (obj, keys) => {
  const keysSet = new Set(keys);
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keysSet.has(key))
  );
};

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean}
 */
export const isEmptyObject = (obj) => {
  return obj && typeof obj === 'object' && Object.keys(obj).length === 0;
};

/**
 * Flatten nested object
 * @param {Object} obj - Object to flatten
 * @param {string} prefix - Key prefix
 * @returns {Object}
 */
export const flattenObject = (obj, prefix = '') => {
  return Object.keys(obj).reduce((result, key) => {
    const prefixedKey = prefix ? `${prefix}.${key}` : key;
    
    if (isObject(obj[key])) {
      Object.assign(result, flattenObject(obj[key], prefixedKey));
    } else {
      result[prefixedKey] = obj[key];
    }
    
    return result;
  }, {});
};

// ===================
// String Helpers
// ===================

/**
 * Generate random string
 * @param {number} length - String length
 * @returns {string}
 */
export const randomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generate UUID
 * @returns {string}
 */
export const generateId = () => {
  return uuidv4();
};

/**
 * Generate short ID
 * @param {number} length - ID length
 * @returns {string}
 */
export const generateShortId = (length = 8) => {
  return Math.random().toString(36).substring(2, 2 + length);
};

/**
 * Hash string (simple non-cryptographic)
 * @param {string} str - String to hash
 * @returns {number}
 */
export const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

/**
 * Convert string to color (for avatars, etc.)
 * @param {string} str - String to convert
 * @returns {string} Hex color
 */
export const stringToColor = (str) => {
  const hash = hashString(str);
  const color = `#${((hash & 0xffffff) << 0).toString(16).padStart(6, '0')}`;
  return color;
};

// ===================
// Number Helpers
// ===================

/**
 * Clamp number between min and max
 * @param {number} num - Number to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number}
 */
export const clamp = (num, min, max) => {
  return Math.min(Math.max(num, min), max);
};

/**
 * Generate random number in range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number}
 */
export const randomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Round to specific decimal places
 * @param {number} num - Number to round
 * @param {number} decimals - Decimal places
 * @returns {number}
 */
export const roundTo = (num, decimals = 2) => {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
};

// ===================
// Async Helpers
// ===================

/**
 * Sleep/delay for specified time
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise}
 */
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Retry async function
 * @param {Function} fn - Function to retry
 * @param {number} retries - Number of retries
 * @param {number} delay - Delay between retries
 * @returns {Promise}
 */
export const retry = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await sleep(delay * Math.pow(2, i)); // Exponential backoff
    }
  }
};

/**
 * Execute with timeout
 * @param {Promise} promise - Promise to execute
 * @param {number} timeout - Timeout in ms
 * @returns {Promise}
 */
export const withTimeout = (promise, timeout) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    ),
  ]);
};

// ===================
// DOM Helpers
// ===================

/**
 * Scroll to element
 * @param {string|Element} target - Target element or selector
 * @param {Object} options - Scroll options
 */
export const scrollToElement = (target, options = {}) => {
  const { offset = 0, behavior = 'smooth' } = options;
  
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  
  if (!element) return;
  
  const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
  
  window.scrollTo({ top, behavior });
};

/**
 * Scroll to top
 * @param {string} behavior - Scroll behavior
 */
export const scrollToTop = (behavior = 'smooth') => {
  window.scrollTo({ top: 0, behavior });
};

/**
 * Check if element is in viewport
 * @param {Element} element - Element to check
 * @returns {boolean}
 */
export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  );
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>}
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  }
};

// ===================
// URL Helpers
// ===================

/**
 * Get query params from URL
 * @param {string} url - URL string
 * @returns {Object}
 */
export const getQueryParams = (url = window.location.href) => {
  const params = new URL(url).searchParams;
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
};

/**
 * Build URL with query params
 * @param {string} baseUrl - Base URL
 * @param {Object} params - Query parameters
 * @returns {string}
 */
export const buildUrl = (baseUrl, params = {}) => {
  const url = new URL(baseUrl, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
};

/**
 * Download file from URL
 * @param {string} url - File URL
 * @param {string} filename - Download filename
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ===================
// Misc Helpers
// ===================

/**
 * Check if running on client side
 * @returns {boolean}
 */
export const isClient = () => {
  return typeof window !== 'undefined';
};

/**
 * Check if running on server side
 * @returns {boolean}
 */
export const isServer = () => {
  return typeof window === 'undefined';
};

/**
 * No-op function
 */
export const noop = () => {};

/**
 * Identity function
 * @param {any} x - Value to return
 * @returns {any}
 */
export const identity = (x) => x;

/**
 * Memoize function result
 * @param {Function} fn - Function to memoize
 * @returns {Function}
 */
export const memoize = (fn) => {
  const cache = new Map();
  
  return (...args) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

export default {
  groupBy,
  uniqueBy,
  sortBy,
  chunk,
  shuffle,
  randomItem,
  updateWhere,
  deepClone,
  deepMerge,
  isObject,
  pick,
  omit,
  isEmptyObject,
  flattenObject,
  randomString,
  generateId,
  generateShortId,
  hashString,
  stringToColor,
  clamp,
  randomInRange,
  roundTo,
  sleep,
  retry,
  withTimeout,
  scrollToElement,
  scrollToTop,
  isInViewport,
  copyToClipboard,
  getQueryParams,
  buildUrl,
  downloadFile,
  isClient,
  isServer,
  noop,
  identity,
  memoize,
};
