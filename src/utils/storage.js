/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 Storage Utilities
 * 
 * Local and session storage helpers with type safety.
 */

import { STORAGE_KEYS } from '@config/app.config';

/**
 * Check if storage is available
 * @param {string} type - 'localStorage' or 'sessionStorage'
 * @returns {boolean}
 */
function isStorageAvailable(type = 'localStorage') {
  try {
    const storage = window[type];
    const test = '__storage_test__';
    storage.setItem(test, test);
    storage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Local storage wrapper with type safety
 */
export const storage = {
  /**
   * Check if localStorage is available
   * @returns {boolean}
   */
  isAvailable() {
    return isStorageAvailable('localStorage');
  },

  /**
   * Get item from localStorage
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if key doesn't exist
   * @returns {any}
   */
  get(key, defaultValue = null) {
    if (!this.isAvailable()) return defaultValue;

    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch {
      return defaultValue;
    }
  },

  /**
   * Set item in localStorage
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @returns {boolean} Success status
   */
  set(key, value) {
    if (!this.isAvailable()) return false;

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  },

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  remove(key) {
    if (!this.isAvailable()) return false;

    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Clear all items from localStorage
   * @returns {boolean} Success status
   */
  clear() {
    if (!this.isAvailable()) return false;

    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Get all keys from localStorage
   * @returns {Array<string>}
   */
  keys() {
    if (!this.isAvailable()) return [];

    try {
      return Object.keys(localStorage);
    } catch {
      return [];
    }
  },

  /**
   * Check if key exists
   * @param {string} key - Storage key
   * @returns {boolean}
   */
  has(key) {
    if (!this.isAvailable()) return false;
    return localStorage.getItem(key) !== null;
  },

  /**
   * Get storage size in bytes
   * @returns {number}
   */
  size() {
    if (!this.isAvailable()) return 0;

    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += (localStorage[key].length + key.length) * 2;
      }
    }
    return total;
  },
};

/**
 * Session storage wrapper
 */
export const sessionStore = {
  /**
   * Check if sessionStorage is available
   * @returns {boolean}
   */
  isAvailable() {
    return isStorageAvailable('sessionStorage');
  },

  /**
   * Get item from sessionStorage
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value
   * @returns {any}
   */
  get(key, defaultValue = null) {
    if (!this.isAvailable()) return defaultValue;

    try {
      const item = sessionStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch {
      return defaultValue;
    }
  },

  /**
   * Set item in sessionStorage
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @returns {boolean}
   */
  set(key, value) {
    if (!this.isAvailable()) return false;

    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Remove item from sessionStorage
   * @param {string} key - Storage key
   *
