/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 Validators
 * 
 * Input validation functions for forms and data.
 */

import { AUTH_CONFIG, PROJECT_CONFIG, UPLOAD_CONFIG } from '@config/app.config';

// ===================
// Email Validation
// ===================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  return emailRegex.test(email.trim().toLowerCase());
};

/**
 * Get email validation error message
 * @param {string} email - Email to validate
 * @returns {string|null} Error message or null if valid
 */
export const getEmailError = (email) => {
  if (!email || email.trim() === '') {
    return 'Email is required';
  }
  
  if (!isValidEmail(email)) {
    return 'Please enter a valid email address';
  }
  
  return null;
};

// ===================
// Password Validation
// ===================

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with details
 */
export const validatePassword = (password) => {
  const { minLength, requireUppercase, requireLowercase, requireNumber, requireSpecialChar } = AUTH_CONFIG.password;
  
  const checks = {
    minLength: password.length >= minLength,
    hasUppercase: !requireUppercase || /[A-Z]/.test(password),
    hasLowercase: !requireLowercase || /[a-z]/.test(password),
    hasNumber: !requireNumber || /\d/.test(password),
    hasSpecialChar: !requireSpecialChar || /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  
  const isValid = Object.values(checks).every(Boolean);
  
  return {
    isValid,
    checks,
    score: Object.values(checks).filter(Boolean).length,
    maxScore: Object.keys(checks).length,
  };
};

/**
 * Get password strength label
 * @param {string} password - Password to check
 * @returns {Object} Strength info
 */
export const getPasswordStrength = (password) => {
  if (!password) {
    return { label: 'None', color: 'gray', percent: 0 };
  }
  
  const { score, maxScore } = validatePassword(password);
  const percent = (score / maxScore) * 100;
  
  if (percent <= 20) return { label: 'Very Weak', color: 'red', percent };
  if (percent <= 40) return { label: 'Weak', color: 'orange', percent };
  if (percent <= 60) return { label: 'Fair', color: 'yellow', percent };
  if (percent <= 80) return { label: 'Strong', color: 'blue', percent };
  return { label: 'Very Strong', color: 'green', percent };
};

/**
 * Get password validation error message
 * @param {string} password - Password to validate
 * @returns {string|null} Error message or null if valid
 */
export const getPasswordError = (password) => {
  if (!password || password === '') {
    return 'Password is required';
  }
  
  const { minLength } = AUTH_CONFIG.password;
  
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters`;
  }
  
  const { isValid, checks } = validatePassword(password);
  
  if (!isValid) {
    if (!checks.hasUppercase) return 'Password must contain an uppercase letter';
    if (!checks.hasLowercase) return 'Password must contain a lowercase letter';
    if (!checks.hasNumber) return 'Password must contain a number';
    if (!checks.hasSpecialChar) return 'Password must contain a special character';
  }
  
  return null;
};

/**
 * Check if passwords match
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {boolean}
 */
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

// ===================
// Username Validation
// ===================

/**
 * Validate username format
 * @param {string} username - Username to validate
 * @returns {Object} Validation result
 */
export const validateUsername = (username) => {
  const { minLength, maxLength, pattern, reserved } = AUTH_CONFIG.username;
  
  const checks = {
    notEmpty: username && username.trim() !== '',
    minLength: username.length >= minLength,
    maxLength: username.length <= maxLength,
    validFormat: pattern.test(username),
    notReserved: !reserved.includes(username.toLowerCase()),
  };
  
  const isValid = Object.values(checks).every(Boolean);
  
  return { isValid, checks };
};

/**
 * Get username validation error message
 * @param {string} username - Username to validate
 * @returns {string|null} Error message or null if valid
 */
export const getUsernameError = (username) => {
  if (!username || username.trim() === '') {
    return 'Username is required';
  }
  
  const { minLength, maxLength } = AUTH_CONFIG.username;
  const { checks } = validateUsername(username);
  
  if (!checks.minLength) {
    return `Username must be at least ${minLength} characters`;
  }
  
  if (!checks.maxLength) {
    return `Username must be less than ${maxLength} characters`;
  }
  
  if (!checks.validFormat) {
    return 'Username can only contain letters, numbers, and underscores';
  }
  
  if (!checks.notReserved) {
    return 'This username is reserved';
  }
  
  return null;
};

// ===================
// Name Validation
// ===================

/**
 * Validate full name
 * @param {string} name - Name to validate
 * @returns {boolean}
 */
export const isValidName = (name) => {
  if (!name || typeof name !== 'string') return false;
  
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 100;
};

/**
 * Get name validation error
 * @param {string} name - Name to validate
 * @returns {string|null}
 */
export const getNameError = (name) => {
  if (!name || name.trim() === '') {
    return 'Name is required';
  }
  
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters';
  }
  
  if (name.trim().length > 100) {
    return 'Name must be less than 100 characters';
  }
  
  return null;
};

// ===================
// URL Validation
// ===================

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean}
 */
export const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate GitHub URL
 * @param {string} url - URL to validate
 * @returns {boolean}
 */
export const isValidGitHubUrl = (url) => {
  if (!isValidUrl(url)) return false;
  
  try {
    const parsed = new URL(url);
    return parsed.hostname === 'github.com' || parsed.hostname === 'www.github.com';
  } catch {
    return false;
  }
};

/**
 * Validate Git repository URL
 * @param {string} url - URL to validate
 * @returns {boolean}
 */
export const isValidGitRepoUrl = (url) => {
  if (!url) return true; // Optional field
  
  // Check for common git hosting platforms
  const gitPatterns = [
    /^https?:\/\/(www\.)?github\.com\/.+\/.+/i,
    /^https?:\/\/(www\.)?gitlab\.com\/.+\/.+/i,
    /^https?:\/\/(www\.)?bitbucket\.org\/.+\/.+/i,
    /^git@github\.com:.+\/.+\.git$/i,
    /^git@gitlab\.com:.+\/.+\.git$/i,
  ];
  
  return gitPatterns.some(pattern => pattern.test(url));
};

// ===================
// Project Validation
// ===================

/**
 * Validate project title
 * @param {string} title - Title to validate
 * @returns {string|null} Error message or null
 */
export const getProjectTitleError = (title) => {
  const { minLength, maxLength } = PROJECT_CONFIG.title;
  
  if (!title || title.trim() === '') {
    return 'Project title is required';
  }
  
  if (title.trim().length < minLength) {
    return `Title must be at least ${minLength} characters`;
  }
  
  if (title.trim().length > maxLength) {
    return `Title must be less than ${maxLength} characters`;
  }
  
  return null;
};

/**
 * Validate project short description
 * @param {string} description - Description to validate
 * @returns {string|null} Error message or null
 */
export const getShortDescriptionError = (description) => {
  const { minLength, maxLength } = PROJECT_CONFIG.shortDescription;
  
  if (!description || description.trim() === '') {
    return 'Short description is required';
  }
  
  if (description.trim().length < minLength) {
    return `Description must be at least ${minLength} characters`;
  }
  
  if (description.trim().length > maxLength) {
    return `Description must be less than ${maxLength} characters`;
  }
  
  return null;
};

/**
 * Validate project long description
 * @param {string} description - Description to validate
 * @returns {string|null} Error message or null
 */
export const getLongDescriptionError = (description) => {
  const { maxLength } = PROJECT_CONFIG.longDescription;
  
  // Long description is optional
  if (!description) return null;
  
  if (description.length > maxLength) {
    return `Description must be less than ${maxLength} characters`;
  }
  
  return null;
};

// ===================
// File Validation
// ===================

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSize - Maximum size in bytes
 * @returns {boolean}
 */
export const isValidFileSize = (file, maxSize) => {
  return file && file.size <= maxSize;
};

/**
 * Validate file type
 * @param {File} file - File to validate
 * @param {Array<string>} acceptedTypes - Accepted MIME types or extensions
 * @returns {boolean}
 */
export const isValidFileType = (file, acceptedTypes) => {
  if (!file || !acceptedTypes || acceptedTypes.length === 0) return false;
  
  const fileType = file.type;
  const fileName = file.name.toLowerCase();
  
  return acceptedTypes.some(type => {
    if (type.startsWith('.')) {
      // Extension check
      return fileName.endsWith(type.toLowerCase());
    }
    // MIME type check
    return fileType === type || fileType.startsWith(type.replace('*', ''));
  });
};

/**
 * Validate image file
 * @param {File} file - File to validate
 * @returns {Object} Validation result
 */
export const validateImageFile = (file) => {
  const { maxSize, acceptedTypes } = UPLOAD_CONFIG.thumbnail;
  
  const errors = [];
  
  if (!file) {
    return { isValid: false, errors: ['No file provided'] };
  }
  
  if (!isValidFileType(file, acceptedTypes)) {
    errors.push('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.');
  }
  
  if (!isValidFileSize(file, maxSize)) {
    errors.push(`File size must be less than ${maxSize / 1024 / 1024}MB`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate code archive file
 * @param {File} file - File to validate
 * @returns {Object} Validation result
 */
export const validateCodeArchive = (file) => {
  const { maxSize, acceptedTypes } = UPLOAD_CONFIG.codeArchive;
  
  const errors = [];
  
  if (!file) {
    return { isValid: true, errors: [] }; // Optional field
  }
  
  if (!isValidFileType(file, acceptedTypes)) {
    errors.push('Invalid file type. Please upload a ZIP, RAR, or TAR.GZ archive.');
  }
  
  if (!isValidFileSize(file, maxSize)) {
    errors.push(`File size must be less than ${maxSize / 1024 / 1024}MB`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ===================
// General Validators
// ===================

/**
 * Check if value is empty
 * @param {any} value - Value to check
 * @returns {boolean}
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Check if value is a valid UUID
 * @param {string} value - Value to check
 * @returns {boolean}
 */
export const isValidUUID = (value) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
};

/**
 * Check if value is a valid slug
 * @param {string} value - Value to check
 * @returns {boolean}
 */
export const isValidSlug = (value) => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(value);
};

/**
 * Sanitize string input
 * @param {string} input - Input to sanitize
 * @returns {string}
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

export default {
  isValidEmail,
  getEmailError,
  validatePassword,
  getPasswordStrength,
  getPasswordError,
  passwordsMatch,
  validateUsername,
  getUsernameError,
  isValidName,
  getNameError,
  isValidUrl,
  isValidGitHubUrl,
  isValidGitRepoUrl,
  getProjectTitleError,
  getShortDescriptionError,
  getLongDescriptionError,
  isValidFileSize,
  isValidFileType,
  validateImageFile,
  validateCodeArchive,
  isEmpty,
  isValidUUID,
  isValidSlug,
  sanitizeInput,
};
