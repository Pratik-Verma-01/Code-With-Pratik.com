/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 Error Handler
 * 
 * Error parsing and user-friendly message generation.
 */

import { ERROR_MESSAGES } from '@config/app.config';

/**
 * Firebase Auth error codes
 */
const FIREBASE_AUTH_ERRORS = {
  'auth/email-already-in-use': 'This email is already registered. Try logging in instead.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled.',
  'auth/weak-password': 'Password is too weak. Use at least 8 characters.',
  'auth/user-disabled': 'This account has been disabled. Contact support.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-credential': 'Invalid credentials. Please check and try again.',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
  'auth/popup-closed-by-user': 'Sign-in was cancelled. Please try again.',
  'auth/popup-blocked': 'Pop-up was blocked. Please allow pop-ups and try again.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
  'auth/requires-recent-login': 'Please log in again to complete this action.',
  'auth/credential-already-in-use': 'This credential is already associated with another account.',
  'auth/account-exists-with-different-credential': 'An account already exists with the same email.',
};

/**
 * Supabase error codes
 */
const SUPABASE_ERRORS = {
  '23505': 'This record already exists.',
  '23503': 'Referenced record not found.',
  '42501': 'You do not have permission to perform this action.',
  '42P01': 'The requested resource was not found.',
  'PGRST116': 'No results found.',
  'PGRST301': 'Connection timeout. Please try again.',
};

/**
 * HTTP status code messages
 */
const HTTP_STATUS_ERRORS = {
  400: 'Invalid request. Please check your input.',
  401: 'Please log in to continue.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  409: 'This action conflicts with existing data.',
  422: 'Invalid data provided.',
  429: 'Too many requests. Please slow down.',
  500: 'Server error. Please try again later.',
  502: 'Service temporarily unavailable.',
  503: 'Service is under maintenance.',
};

/**
 * Error types
 */
export const ErrorTypes = {
  VALIDATION: 'validation',
  AUTH: 'auth',
  NETWORK: 'network',
  SERVER: 'server',
  NOT_FOUND: 'not_found',
  PERMISSION: 'permission',
  UNKNOWN: 'unknown',
};

/**
 * Parse error and return user-friendly message
 * @param {Error|string|Object} error - Error to parse
 * @returns {Object} Parsed error with message and type
 */
export function parseError(error) {
  // Handle string errors
  if (typeof error === 'string') {
    return {
      message: error,
      type: ErrorTypes.UNKNOWN,
      original: error,
    };
  }
  
  // Handle null/undefined
  if (!error) {
    return {
      message: ERROR_MESSAGES.default,
      type: ErrorTypes.UNKNOWN,
      original: null,
    };
  }
  
  // Firebase Auth errors
  if (error.code && error.code.startsWith('auth/')) {
    const message = FIREBASE_AUTH_ERRORS[error.code] || error.message || ERROR_MESSAGES.default;
    return {
      message,
      type: ErrorTypes.AUTH,
      code: error.code,
      original: error,
    };
  }
  
  // Supabase errors
  if (error.code && SUPABASE_ERRORS[error.code]) {
    return {
      message: SUPABASE_ERRORS[error.code],
      type: ErrorTypes.SERVER,
      code: error.code,
      original: error,
    };
  }
  
  // HTTP status errors (from API responses)
  if (error.status && HTTP_STATUS_ERRORS[error.status]) {
    let type = ErrorTypes.SERVER;
    if (error.status === 401) type = ErrorTypes.AUTH;
    if (error.status === 403) type = ErrorTypes.PERMISSION;
    if (error.status === 404) type = ErrorTypes.NOT_FOUND;
    if (error.status === 422) type = ErrorTypes.VALIDATION;
    
    return {
      message: error.message || HTTP_STATUS_ERRORS[error.status],
      type,
      status: error.status,
      original: error,
    };
  }
  
  // Network errors
  if (
    error.name === 'TypeError' && error.message?.includes('fetch') ||
    error.message?.includes('network') ||
    error.message?.includes('Network') ||
    error.code === 'ECONNREFUSED'
  ) {
    return {
      message: ERROR_MESSAGES.networkError,
      type: ErrorTypes.NETWORK,
      original: error,
    };
  }
  
  // Timeout errors
  if (error.name === 'AbortError' || error.message?.includes('timeout')) {
    return {
      message: 'Request timed out. Please try again.',
      type: ErrorTypes.NETWORK,
      original: error,
    };
  }
  
  // Generic error with message
  if (error.message) {
    return {
      message: error.message,
      type: ErrorTypes.UNKNOWN,
      original: error,
    };
  }
  
  // Fallback
  return {
    message: ERROR_MESSAGES.default,
    type: ErrorTypes.UNKNOWN,
    original: error,
  };
}

/**
 * Get user-friendly error message
 * @param {Error|string|Object} error - Error to parse
 * @returns {string} User-friendly message
 */
export function getErrorMessage(error) {
  return parseError(error).message;
}

/**
 * Check if error is of specific type
 * @param {Error|Object} error - Error to check
 * @param {string} type - Error type from ErrorTypes
 * @returns {boolean}
 */
export function isErrorType(error, type) {
  return parseError(error).type === type;
}

/**
 * Check if error is auth-related
 * @param {Error|Object} error - Error to check
 * @returns {boolean}
 */
export function isAuthError(error) {
  return isErrorType(error, ErrorTypes.AUTH);
}

/**
 * Check if error is network-related
 * @param {Error|Object} error - Error to check
 * @returns {boolean}
 */
export function isNetworkError(error) {
  return isErrorType(error, ErrorTypes.NETWORK);
}

/**
 * Check if error is permission-related
 * @param {Error|Object} error - Error to check
 * @returns {boolean}
 */
export function isPermissionError(error) {
  return isErrorType(error, ErrorTypes.PERMISSION);
}

/**
 * Log error with context
 * @param {Error|Object} error - Error to log
 * @param {string} context - Context where error occurred
 * @param {Object} metadata - Additional metadata
 */
export function logError(error, context = '', metadata = {}) {
  const parsed = parseError(error);
  
  const errorLog = {
    timestamp: new Date().toISOString(),
    context,
    message: parsed.message,
    type: parsed.type,
    code: parsed.code || null,
    status: parsed.status || null,
    metadata,
    stack: error?.stack || null,
  };
  
  // In development, log to console
  if (import.meta.env.DEV) {
    console.error('[Error]', errorLog);
  }
  
  // In production, you might want to send to an error tracking service
  // e.g., Sentry, LogRocket, etc.
  
  return errorLog;
}

/**
 * Create error response object
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 * @param {Object} details - Additional details
 * @returns {Object}
 */
export function createErrorResponse(message, status = 500, details = null) {
  return {
    error: true,
    message,
    status,
    details,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Error boundary fallback props generator
 * @param {Error} error - Error that was caught
 * @param {Function} resetErrorBoundary - Reset function
 * @returns {Object}
 */
export function getErrorBoundaryProps(error, resetErrorBoundary) {
  const parsed = parseError(error);
  
  return {
    title: 'Something went wrong',
    message: parsed.message,
    type: parsed.type,
    canRetry: parsed.type !== ErrorTypes.PERMISSION,
    onRetry: resetErrorBoundary,
  };
}

export default {
  parseError,
  getErrorMessage,
  isErrorType,
  isAuthError,
  isNetworkError,
  isPermissionError,
  logError,
  createErrorResponse,
  getErrorBoundaryProps,
  ErrorTypes,
};
