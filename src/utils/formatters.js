/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 Formatters
 * 
 * Date, time, number, and text formatting utilities.
 */

import {
  format,
  formatDistanceToNow,
  formatRelative,
  isToday,
  isYesterday,
  isThisWeek,
  isThisYear,
  parseISO,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from 'date-fns';

// ===================
// Date Formatters
// ===================

/**
 * Parse date string or Date object
 * @param {string|Date} date - Date to parse
 * @returns {Date}
 */
const parseDate = (date) => {
  if (!date) return new Date();
  if (date instanceof Date) return date;
  return parseISO(date);
};

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Format string
 * @returns {string}
 */
export const formatDate = (date, formatStr = 'MMM d, yyyy') => {
  try {
    return format(parseDate(date), formatStr);
  } catch {
    return 'Invalid date';
  }
};

/**
 * Format date with time
 * @param {string|Date} date - Date to format
 * @returns {string}
 */
export const formatDateTime = (date) => {
  return formatDate(date, 'MMM d, yyyy h:mm a');
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @param {Object} options - Formatting options
 * @returns {string}
 */
export const formatRelativeTime = (date, options = {}) => {
  try {
    const { addSuffix = true } = options;
    return formatDistanceToNow(parseDate(date), { addSuffix });
  } catch {
    return 'Invalid date';
  }
};

/**
 * Format date smartly based on how recent it is
 * @param {string|Date} date - Date to format
 * @returns {string}
 */
export const formatSmartDate = (date) => {
  try {
    const parsed = parseDate(date);
    const now = new Date();
    
    const minutesAgo = differenceInMinutes(now, parsed);
    const hoursAgo = differenceInHours(now, parsed);
    const daysAgo = differenceInDays(now, parsed);
    
    // Less than 1 minute ago
    if (minutesAgo < 1) {
      return 'Just now';
    }
    
    // Less than 1 hour ago
    if (minutesAgo < 60) {
      return `${minutesAgo}m ago`;
    }
    
    // Less than 24 hours ago
    if (hoursAgo < 24) {
      return `${hoursAgo}h ago`;
    }
    
    // Yesterday
    if (isYesterday(parsed)) {
      return `Yesterday at ${format(parsed, 'h:mm a')}`;
    }
    
    // This week
    if (isThisWeek(parsed)) {
      return format(parsed, 'EEEE');
    }
    
    // This year
    if (isThisYear(parsed)) {
      return format(parsed, 'MMM d');
    }
    
    // Older
    return format(parsed, 'MMM d, yyyy');
  } catch {
    return 'Invalid date';
  }
};

/**
 * Format date for display in project cards
 * @param {string|Date} date - Date to format
 * @returns {string}
 */
export const formatProjectDate = (date) => {
  try {
    const parsed = parseDate(date);
    
    if (isToday(parsed)) {
      return 'Today';
    }
    
    if (isYesterday(parsed)) {
      return 'Yesterday';
    }
    
    if (isThisWeek(parsed)) {
      return formatDistanceToNow(parsed, { addSuffix: true });
    }
    
    if (isThisYear(parsed)) {
      return format(parsed, 'MMM d');
    }
    
    return format(parsed, 'MMM d, yyyy');
  } catch {
    return '';
  }
};

// ===================
// Number Formatters
// ===================

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string}
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return num.toLocaleString('en-US');
};

/**
 * Format number compactly (e.g., 1.2K, 3.4M)
 * @param {number} num - Number to format
 * @param {number} decimals - Decimal places
 * @returns {string}
 */
export const formatCompactNumber = (num, decimals = 1) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  
  const absNum = Math.abs(num);
  
  if (absNum >= 1e9) {
    return (num / 1e9).toFixed(decimals).replace(/\.0+$/, '') + 'B';
  }
  
  if (absNum >= 1e6) {
    return (num / 1e6).toFixed(decimals).replace(/\.0+$/, '') + 'M';
  }
  
  if (absNum >= 1e3) {
    return (num / 1e3).toFixed(decimals).replace(/\.0+$/, '') + 'K';
  }
  
  return num.toString();
};

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Decimal places
 * @returns {string}
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  if (!bytes || isNaN(bytes)) return 'Unknown';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

/**
 * Format percentage
 * @param {number} value - Value
 * @param {number} total - Total
 * @param {number} decimals - Decimal places
 * @returns {string}
 */
export const formatPercentage = (value, total, decimals = 0) => {
  if (!total || total === 0) return '0%';
  const percent = (value / total) * 100;
  return percent.toFixed(decimals) + '%';
};

/**
 * Format currency
 * @param {number} amount - Amount
 * @param {string} currency - Currency code
 * @returns {string}
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format points display
 * @param {number} points - Points value
 * @returns {string}
 */
export const formatPoints = (points) => {
  if (points === null || points === undefined) return '0';
  return formatCompactNumber(points);
};

// ===================
// Text Formatters
// ===================

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string}
 */
export const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Capitalize each word
 * @param {string} str - String to capitalize
 * @returns {string}
 */
export const capitalizeWords = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add
 * @returns {string}
 */
export const truncate = (text, maxLength = 100, suffix = '...') => {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length).trim() + suffix;
};

/**
 * Truncate text by words
 * @param {string} text - Text to truncate
 * @param {number} maxWords - Maximum words
 * @returns {string}
 */
export const truncateWords = (text, maxWords = 20) => {
  if (!text || typeof text !== 'string') return '';
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
};

/**
 * Convert camelCase to Title Case
 * @param {string} str - String to convert
 * @returns {string}
 */
export const camelToTitle = (str) => {
  if (!str) return '';
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
};

/**
 * Convert snake_case to Title Case
 * @param {string} str - String to convert
 * @returns {string}
 */
export const snakeToTitle = (str) => {
  if (!str) return '';
  return str
    .split('_')
    .map(capitalize)
    .join(' ');
};

/**
 * Convert kebab-case to Title Case
 * @param {string} str - String to convert
 * @returns {string}
 */
export const kebabToTitle = (str) => {
  if (!str) return '';
  return str
    .split('-')
    .map(capitalize)
    .join(' ');
};

/**
 * Pluralize word
 * @param {number} count - Count
 * @param {string} singular - Singular form
 * @param {string} plural - Plural form (optional)
 * @returns {string}
 */
export const pluralize = (count, singular, plural = null) => {
  const pluralForm = plural || singular + 's';
  return count === 1 ? singular : pluralForm;
};

/**
 * Format count with label
 * @param {number} count - Count
 * @param {string} singular - Singular label
 * @param {string} plural - Plural label (optional)
 * @returns {string}
 */
export const formatCount = (count, singular, plural = null) => {
  return `${formatCompactNumber(count)} ${pluralize(count, singular, plural)}`;
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @param {number} maxChars - Maximum characters
 * @returns {string}
 */
export const getInitials = (name, maxChars = 2) => {
  if (!name || typeof name !== 'string') return '';
  
  return name
    .split(/\s+/)
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, maxChars)
    .join('')
    .toUpperCase();
};

/**
 * Strip HTML tags from string
 * @param {string} html - HTML string
 * @returns {string}
 */
export const stripHtml = (html) => {
  if (!html || typeof html !== 'string') return '';
  return html.replace(/<[^>]*>/g, '');
};

/**
 * Highlight search term in text
 * @param {string} text - Text to search in
 * @param {string} term - Term to highlight
 * @returns {string} HTML string with highlighted terms
 */
export const highlightText = (text, term) => {
  if (!text || !term) return text;
  
  const regex = new RegExp(`(${term})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

// ===================
// URL Formatters
// ===================

/**
 * Format URL for display (remove protocol)
 * @param {string} url - URL to format
 * @returns {string}
 */
export const formatUrlForDisplay = (url) => {
  if (!url) return '';
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
};

/**
 * Ensure URL has protocol
 * @param {string} url - URL to format
 * @returns {string}
 */
export const ensureProtocol = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return 'https://' + url;
};

export default {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatSmartDate,
  formatProjectDate,
  formatNumber,
  formatCompactNumber,
  formatFileSize,
  formatPercentage,
  formatCurrency,
  formatPoints,
  capitalize,
  capitalizeWords,
  truncate,
  truncateWords,
  camelToTitle,
  snakeToTitle,
  kebabToTitle,
  pluralize,
  formatCount,
  getInitials,
  stripHtml,
  highlightText,
  formatUrlForDisplay,
  ensureProtocol,
};
