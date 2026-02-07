/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 Constants
 * 
 * Application-wide constants and enums.
 */

// ===================
// Programming Languages
// ===================

export const PROGRAMMING_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', color: '#F7DF1E', icon: 'js' },
  { value: 'typescript', label: 'TypeScript', color: '#3178C6', icon: 'ts' },
  { value: 'python', label: 'Python', color: '#3776AB', icon: 'py' },
  { value: 'java', label: 'Java', color: '#007396', icon: 'java' },
  { value: 'csharp', label: 'C#', color: '#239120', icon: 'cs' },
  { value: 'cpp', label: 'C++', color: '#00599C', icon: 'cpp' },
  { value: 'c', label: 'C', color: '#A8B9CC', icon: 'c' },
  { value: 'go', label: 'Go', color: '#00ADD8', icon: 'go' },
  { value: 'rust', label: 'Rust', color: '#DEA584', icon: 'rs' },
  { value: 'swift', label: 'Swift', color: '#FA7343', icon: 'swift' },
  { value: 'kotlin', label: 'Kotlin', color: '#7F52FF', icon: 'kt' },
  { value: 'ruby', label: 'Ruby', color: '#CC342D', icon: 'rb' },
  { value: 'php', label: 'PHP', color: '#777BB4', icon: 'php' },
  { value: 'html', label: 'HTML', color: '#E34F26', icon: 'html' },
  { value: 'css', label: 'CSS', color: '#1572B6', icon: 'css' },
  { value: 'react', label: 'React', color: '#61DAFB', icon: 'react' },
  { value: 'vue', label: 'Vue.js', color: '#4FC08D', icon: 'vue' },
  { value: 'angular', label: 'Angular', color: '#DD0031', icon: 'angular' },
  { value: 'svelte', label: 'Svelte', color: '#FF3E00', icon: 'svelte' },
  { value: 'nextjs', label: 'Next.js', color: '#000000', icon: 'next' },
  { value: 'nodejs', label: 'Node.js', color: '#339933', icon: 'node' },
  { value: 'dart', label: 'Dart', color: '#0175C2', icon: 'dart' },
  { value: 'flutter', label: 'Flutter', color: '#02569B', icon: 'flutter' },
  { value: 'sql', label: 'SQL', color: '#336791', icon: 'sql' },
  { value: 'graphql', label: 'GraphQL', color: '#E10098', icon: 'graphql' },
  { value: 'shell', label: 'Shell/Bash', color: '#4EAA25', icon: 'sh' },
  { value: 'other', label: 'Other', color: '#718096', icon: 'code' },
];

/**
 * Get language by value
 * @param {string} value - Language value
 * @returns {Object|undefined}
 */
export const getLanguageByValue = (value) => {
  return PROGRAMMING_LANGUAGES.find((lang) => lang.value === value);
};

/**
 * Get language color
 * @param {string} value - Language value
 * @returns {string}
 */
export const getLanguageColor = (value) => {
  const language = getLanguageByValue(value);
  return language?.color || '#718096';
};

// ===================
// Project Categories
// ===================

export const PROJECT_CATEGORIES = [
  { value: 'web-app', label: 'Web Application' },
  { value: 'mobile-app', label: 'Mobile Application' },
  { value: 'api', label: 'API / Backend' },
  { value: 'library', label: 'Library / Package' },
  { value: 'cli', label: 'CLI Tool' },
  { value: 'game', label: 'Game' },
  { value: 'ml-ai', label: 'Machine Learning / AI' },
  { value: 'devops', label: 'DevOps / Infrastructure' },
  { value: 'tutorial', label: 'Tutorial / Learning' },
  { value: 'template', label: 'Template / Boilerplate' },
  { value: 'other', label: 'Other' },
];

// ===================
// Project Visibility
// ===================

export const VISIBILITY_OPTIONS = [
  {
    value: 'public',
    label: 'Public',
    description: 'Anyone can see this project',
    icon: 'Globe',
  },
  {
    value: 'private',
    label: 'Private',
    description: 'Only you can see this project',
    icon: 'Lock',
  },
];

// ===================
// Sort Options
// ===================

export const SORT_OPTIONS = [
  { value: 'created_at', label: 'Newest First', order: 'desc' },
  { value: 'created_at', label: 'Oldest First', order: 'asc' },
  { value: 'title', label: 'Title (A-Z)', order: 'asc' },
  { value: 'title', label: 'Title (Z-A)', order: 'desc' },
  { value: 'view_count', label: 'Most Viewed', order: 'desc' },
  { value: 'download_count', label: 'Most Downloaded', order: 'desc' },
];

// ===================
// Reward Types
// ===================

export const REWARD_TYPES = {
  SIGNUP_BONUS: {
    type: 'signup_bonus',
    label: 'Welcome Bonus',
    points: 100,
    icon: '🎉',
    description: 'Thanks for joining CODE-With-PRATIK!',
  },
  PROJECT_UPLOAD: {
    type: 'project_upload',
    label: 'Project Upload',
    points: 50,
    icon: '📁',
    description: 'Shared a new project',
  },
  FIRST_PROJECT: {
    type: 'first_project',
    label: 'First Project',
    points: 100,
    icon: '🏆',
    description: 'Uploaded your first project!',
  },
  DAILY_LOGIN: {
    type: 'daily_login',
    label: 'Daily Login',
    points: 5,
    icon: '📅',
    description: 'Daily login bonus',
  },
  PROFILE_COMPLETE: {
    type: 'profile_complete',
    label: 'Profile Complete',
    points: 25,
    icon: '👤',
    description: 'Completed your profile',
  },
  MILESTONE_10_PROJECTS: {
    type: 'ten_projects',
    label: '10 Projects',
    points: 200,
    icon: '🎯',
    description: 'Reached 10 projects milestone',
  },
  MILESTONE_100_VIEWS: {
    type: 'hundred_views',
    label: '100 Views',
    points: 50,
    icon: '👀',
    description: 'Projects reached 100 views',
  },
};

// ===================
// User Levels
// ===================

export const USER_LEVELS = [
  { name: 'Novice', minPoints: 0, color: '#718096', icon: '🌱' },
  { name: 'Beginner', minPoints: 100, color: '#48BB78', icon: '🌿' },
  { name: 'Intermediate', minPoints: 500, color: '#4299E1', icon: '⭐' },
  { name: 'Advanced', minPoints: 1500, color: '#9F7AEA', icon: '🌟' },
  { name: 'Expert', minPoints: 5000, color: '#ED8936', icon: '💫' },
  { name: 'Master', minPoints: 15000, color: '#F56565', icon: '🔥' },
  { name: 'Legend', minPoints: 50000, color: '#00D4FF', icon: '👑' },
];

/**
 * Get user level by points
 * @param {number} points - User's total points
 * @returns {Object}
 */
export const getUserLevel = (points) => {
  let currentLevel = USER_LEVELS[0];
  
  for (const level of USER_LEVELS) {
    if (points >= level.minPoints) {
      currentLevel = level;
    } else {
      break;
    }
  }
  
  return currentLevel;
};

// ===================
// Notification Types
// ===================

export const NOTIFICATION_TYPES = {
  SYSTEM: 'system',
  REWARD: 'reward',
  PROJECT: 'project',
  MILESTONE: 'milestone',
  WELCOME: 'welcome',
};

export const NOTIFICATION_ICONS = {
  [NOTIFICATION_TYPES.SYSTEM]: '🔔',
  [NOTIFICATION_TYPES.REWARD]: '⭐',
  [NOTIFICATION_TYPES.PROJECT]: '📁',
  [NOTIFICATION_TYPES.MILESTONE]: '🎯',
  [NOTIFICATION_TYPES.WELCOME]: '👋',
};

// ===================
// Social Share Platforms
// ===================

export const SOCIAL_PLATFORMS = [
  {
    name: 'twitter',
    label: 'Twitter',
    icon: 'Twitter',
    color: '#1DA1F2',
    shareUrl: (url, text) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    name: 'facebook',
    label: 'Facebook',
    icon: 'Facebook',
    color: '#4267B2',
    shareUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: 'linkedin',
    label: 'LinkedIn',
    icon: 'Linkedin',
    color: '#0A66C2',
    shareUrl: (url, text) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: 'whatsapp',
    label: 'WhatsApp',
    icon: 'MessageCircle',
    color: '#25D366',
    shareUrl: (url, text) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`,
  },
  {
    name: 'telegram',
    label: 'Telegram',
    icon: 'Send',
    color: '#0088CC',
    shareUrl: (url, text) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    name: 'reddit',
    label: 'Reddit',
    icon: 'MessageSquare',
    color: '#FF4500',
    shareUrl: (url, title) =>
      `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  },
];

// ===================
// Keyboard Shortcuts
// ===================

export const KEYBOARD_SHORTCUTS = {
  SEARCH: { key: 'k', modifier: 'meta', label: '⌘K' },
  NEW_PROJECT: { key: 'n', modifier: 'meta', label: '⌘N' },
  TOGGLE_THEME: { key: 'd', modifier: 'meta+shift', label: '⌘⇧D' },
  TOGGLE_AI: { key: 'a', modifier: 'meta', label: '⌘A' },
  ESCAPE: { key: 'Escape', label: 'ESC' },
};

// ===================
// HTTP Status Codes
// ===================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

// ===================
// Regex Patterns
// ===================

export const REGEX_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  USERNAME: /^[a-zA-Z0-9_]+$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  PHONE: /^\+?[\d\s-()]+$/,
};

// ===================
// Time Constants
// ===================

export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000,
};

// ===================
// Default Values
// ===================

export const DEFAULTS = {
  AVATAR_URL: '/default-avatar.png',
  PROJECT_THUMBNAIL: '/default-project-thumbnail.png',
  PAGE_SIZE: 12,
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 4000,
};

export default {
  PROGRAMMING_LANGUAGES,
  PROJECT_CATEGORIES,
  VISIBILITY_OPTIONS,
  SORT_OPTIONS,
  REWARD_TYPES,
  USER_LEVELS,
  NOTIFICATION_TYPES,
  SOCIAL_PLATFORMS,
  KEYBOARD_SHORTCUTS,
  HTTP_STATUS,
  REGEX_PATTERNS,
  TIME,
  DEFAULTS,
  getLanguageByValue,
  getLanguageColor,
  getUserLevel,
};
