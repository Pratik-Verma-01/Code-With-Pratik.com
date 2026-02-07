/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 Application Configuration
 * 
 * Central configuration file for all app-wide settings.
 * Environment variables are accessed here and exported as constants.
 */

// ===================
// App Metadata
// ===================
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || '〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄',
  shortName: 'CODE-With-PRATIK',
  description: import.meta.env.VITE_APP_DESCRIPTION || 'A futuristic code sharing platform with AI assistance',
  url: import.meta.env.VITE_APP_URL || 'http://localhost:3000',
  author: 'Pratik',
  version: '1.0.0',
  
  // Social links
  social: {
    github: 'https://github.com/pratik',
    twitter: 'https://twitter.com/pratik',
    linkedin: 'https://linkedin.com/in/pratik',
    youtube: 'https://youtube.com/@pratik',
  },
  
  // Contact
  contact: {
    email: 'contact@codewithpratik.com',
    supportEmail: 'support@codewithpratik.com',
  },
};

// ===================
// Feature Flags
// ===================
export const FEATURES = {
  enableAIChat: import.meta.env.VITE_ENABLE_AI_CHAT !== 'false',
  enableRewards: import.meta.env.VITE_ENABLE_REWARDS !== 'false',
  enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== 'false',
  maintenanceMode: import.meta.env.VITE_MAINTENANCE_MODE === 'true',
};

// ===================
// API Configuration
// ===================
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_APP_URL || '',
  endpoints: {
    aiRespond: '/api/openrouter/respond',
    health: '/api/health',
    validateUsername: '/api/validate-username',
    validateEmail: '/api/validate-email',
    syncUser: '/api/sync-user',
  },
  timeout: 30000, // 30 seconds
  retries: 3,
};

// ===================
// AI Configuration (Nova)
// ===================
export const AI_CONFIG = {
  name: 'Nova',
  description: 'Your AI coding assistant powered by Claude 3.5 Sonnet',
  avatar: '/ai-nova-avatar.png',
  model: 'anthropic/claude-3.5-sonnet',
  maxTokens: 4096,
  temperature: 0.7,
  
  // System prompt
  systemPrompt: `You are Nova, an expert AI coding assistant for the CODE-With-PRATIK platform. 
You help developers understand code, debug issues, suggest improvements, and explain programming concepts.

Guidelines:
- Be helpful, concise, and technically accurate
- Format code with proper syntax highlighting using markdown code blocks
- When explaining code, break it down step by step
- Suggest best practices and modern patterns
- If you're unsure about something, say so
- Be friendly but professional

You have context about the current project when available.`,
  
  // Rate limiting
  rateLimits: {
    maxMessagesPerMinute: 10,
    maxMessagesPerHour: 100,
    maxMessagesPerDay: 500,
  },
  
  // Suggested prompts
  suggestedPrompts: [
    'Explain this code to me',
    'How can I improve this code?',
    'Help me debug this error',
    'What are the best practices for this?',
    'Convert this to TypeScript',
    'Add error handling to this function',
  ],
};

// ===================
// Auth Configuration
// ===================
export const AUTH_CONFIG = {
  // Password requirements
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: false,
  },
  
  // Username requirements
  username: {
    minLength: 3,
    maxLength: 30,
    pattern: /^[a-zA-Z0-9_]+$/,
    reserved: ['admin', 'root', 'system', 'api', 'www', 'mail', 'support', 'help'],
  },
  
  // Session
  session: {
    persistKey: 'auth-session',
    rememberMeDays: 30,
  },
};

// ===================
// Upload Configuration
// ===================
export const UPLOAD_CONFIG = {
  // Thumbnail
  thumbnail: {
    maxSize: 5 * 1024 * 1024, // 5MB
    acceptedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    dimensions: {
      minWidth: 200,
      minHeight: 150,
      maxWidth: 2000,
      maxHeight: 1500,
    },
  },
  
  // Code archive
  codeArchive: {
    maxSize: 50 * 1024 * 1024, // 50MB
    acceptedTypes: ['.zip', '.tar.gz', '.rar'],
  },
  
  // Avatar
  avatar: {
    maxSize: 2 * 1024 * 1024, // 2MB
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    dimensions: {
      minSize: 100,
      maxSize: 1000,
    },
  },
};

// ===================
// Project Configuration
// ===================
export const PROJECT_CONFIG = {
  // Field limits
  title: {
    minLength: 5,
    maxLength: 100,
  },
  shortDescription: {
    minLength: 10,
    maxLength: 160,
  },
  longDescription: {
    minLength: 50,
    maxLength: 10000,
  },
  
  // Pagination
  pagination: {
    defaultPageSize: 12,
    maxPageSize: 50,
  },
  
  // Visibility options
  visibility: {
    PUBLIC: 'public',
    PRIVATE: 'private',
  },
};

// ===================
// Programming Languages
// ===================
export const PROGRAMMING_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', color: '#F7DF1E' },
  { value: 'typescript', label: 'TypeScript', color: '#3178C6' },
  { value: 'python', label: 'Python', color: '#3776AB' },
  { value: 'java', label: 'Java', color: '#007396' },
  { value: 'csharp', label: 'C#', color: '#239120' },
  { value: 'cpp', label: 'C++', color: '#00599C' },
  { value: 'c', label: 'C', color: '#A8B9CC' },
  { value: 'go', label: 'Go', color: '#00ADD8' },
  { value: 'rust', label: 'Rust', color: '#DEA584' },
  { value: 'swift', label: 'Swift', color: '#FA7343' },
  { value: 'kotlin', label: 'Kotlin', color: '#7F52FF' },
  { value: 'ruby', label: 'Ruby', color: '#CC342D' },
  { value: 'php', label: 'PHP', color: '#777BB4' },
  { value: 'html', label: 'HTML', color: '#E34F26' },
  { value: 'css', label: 'CSS', color: '#1572B6' },
  { value: 'react', label: 'React', color: '#61DAFB' },
  { value: 'vue', label: 'Vue.js', color: '#4FC08D' },
  { value: 'angular', label: 'Angular', color: '#DD0031' },
  { value: 'nextjs', label: 'Next.js', color: '#000000' },
  { value: 'nodejs', label: 'Node.js', color: '#339933' },
  { value: 'dart', label: 'Dart', color: '#0175C2' },
  { value: 'flutter', label: 'Flutter', color: '#02569B' },
  { value: 'sql', label: 'SQL', color: '#336791' },
  { value: 'graphql', label: 'GraphQL', color: '#E10098' },
  { value: 'other', label: 'Other', color: '#718096' },
];

// ===================
// Rewards Configuration
// ===================
export const REWARDS_CONFIG = {
  points: {
    projectUpload: 50,
    firstProject: 100,
    dailyLogin: 5,
    profileComplete: 25,
    tenProjects: 200,
    hundredProjects: 1000,
  },
  
  // Level thresholds
  levels: [
    { name: 'Novice', minPoints: 0, color: '#718096' },
    { name: 'Beginner', minPoints: 100, color: '#48BB78' },
    { name: 'Intermediate', minPoints: 500, color: '#4299E1' },
    { name: 'Advanced', minPoints: 1500, color: '#9F7AEA' },
    { name: 'Expert', minPoints: 5000, color: '#ED8936' },
    { name: 'Master', minPoints: 15000, color: '#F56565' },
    { name: 'Legend', minPoints: 50000, color: '#00D4FF' },
  ],
};

// ===================
// UI Configuration
// ===================
export const UI_CONFIG = {
  // Animation durations (ms)
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  
  // Toast durations (ms)
  toast: {
    success: 3000,
    error: 5000,
    info: 4000,
    loading: 0, // Indefinite
  },
  
  // Debounce delays (ms)
  debounce: {
    search: 300,
    input: 150,
    resize: 100,
  },
  
  // Breakpoints
  breakpoints: {
    xs: 475,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
  
  // Layout
  layout: {
    sidebarWidth: 280,
    navbarHeight: 64,
    mobileNavHeight: 72,
    maxContentWidth: 1280,
  },
};

// ===================
// SEO Configuration
// ===================
export const SEO_CONFIG = {
  defaultTitle: '〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄',
  titleTemplate: '%s | 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄',
  defaultDescription: 'A futuristic web platform for sharing coding projects with AI-powered assistance.',
  siteUrl: APP_CONFIG.url,
  ogImage: '/og-image.png',
  twitterHandle: '@pratik',
  locale: 'en_US',
};

// ===================
// Storage Keys
// ===================
export const STORAGE_KEYS = {
  theme: 'cwp-theme',
  authToken: 'cwp-auth-token',
  user: 'cwp-user',
  preferences: 'cwp-preferences',
  recentProjects: 'cwp-recent-projects',
  aiChatHistory: 'cwp-ai-chat-history',
};

// ===================
// Error Messages
// ===================
export const ERROR_MESSAGES = {
  // Auth
  'auth/email-already-in-use': 'This email is already registered. Try logging in instead.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/user-disabled': 'This account has been disabled. Contact support for help.',
  'auth/user-not-found': 'No account found with this email. Please sign up first.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
  'auth/weak-password': 'Password is too weak. Use at least 8 characters.',
  'auth/popup-closed-by-user': 'Sign-in was cancelled. Please try again.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
  
  // Generic
  default: 'Something went wrong. Please try again.',
  networkError: 'Network error. Please check your connection.',
  serverError: 'Server error. Please try again later.',
  unauthorized: 'Please log in to continue.',
  forbidden: 'You do not have permission to perform this action.',
  notFound: 'The requested resource was not found.',
  validationError: 'Please check your input and try again.',
  rateLimited: 'Too many requests. Please slow down.',
};

// Export all configurations
export default {
  APP_CONFIG,
  FEATURES,
  API_CONFIG,
  AI_CONFIG,
  AUTH_CONFIG,
  UPLOAD_CONFIG,
  PROJECT_CONFIG,
  PROGRAMMING_LANGUAGES,
  REWARDS_CONFIG,
  UI_CONFIG,
  SEO_CONFIG,
  STORAGE_KEYS,
  ERROR_MESSAGES,
};
