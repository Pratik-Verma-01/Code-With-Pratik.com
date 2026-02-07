/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 Routes Configuration
 * 
 * Centralized route definitions for the entire application.
 * All paths are defined here to avoid hardcoding throughout the app.
 */

// ===================
// Route Paths
// ===================
export const ROUTES = {
  // Public routes
  HOME: '/',
  ABOUT: '/about',
  FEATURES: '/features',
  EXPLORE: '/explore',
  PUBLIC_PROJECT: '/project/:slug',
  
  // Auth routes
  AUTH: '/auth',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  
  // Dashboard routes (protected)
  DASHBOARD: '/dashboard',
  UPLOAD_PROJECT: '/dashboard/upload',
  MY_PROJECTS: '/dashboard/my-projects',
  EDIT_PROJECT: '/dashboard/projects/:slug/edit',
  PROJECT: '/dashboard/project/:slug',
  EXPLORE_AI: '/dashboard/ai',
  PROFILE: '/dashboard/profile',
  EDIT_PROFILE: '/dashboard/profile/edit',
  REWARDS: '/dashboard/rewards',
  NOTIFICATIONS: '/dashboard/notifications',
  SETTINGS: '/dashboard/settings',
  
  // Error routes
  NOT_FOUND: '/404',
  BLOCKED: '/blocked',
  MAINTENANCE: '/maintenance',
  SERVER_ERROR: '/500',
};

// ===================
// Route Helpers
// ===================

/**
 * Generate project view URL
 * @param {string} slug - Project slug
 * @param {boolean} isPublic - Whether to use public route
 * @returns {string} Project URL
 */
export const getProjectUrl = (slug, isPublic = false) => {
  if (isPublic) {
    return `/project/${slug}`;
  }
  return `/dashboard/project/${slug}`;
};

/**
 * Generate project edit URL
 * @param {string} slug - Project slug
 * @returns {string} Edit URL
 */
export const getEditProjectUrl = (slug) => {
  return `/dashboard/projects/${slug}/edit`;
};

/**
 * Generate user profile URL
 * @param {string} username - Username
 * @returns {string} Profile URL
 */
export const getUserProfileUrl = (username) => {
  return `/user/${username}`;
};

/**
 * Check if current path is a dashboard route
 * @param {string} pathname - Current pathname
 * @returns {boolean}
 */
export const isDashboardRoute = (pathname) => {
  return pathname.startsWith('/dashboard');
};

/**
 * Check if current path is an auth route
 * @param {string} pathname - Current pathname
 * @returns {boolean}
 */
export const isAuthRoute = (pathname) => {
  const authRoutes = ['/auth', '/login', '/signup', '/forgot-password', '/reset-password'];
  return authRoutes.some(route => pathname.startsWith(route));
};

/**
 * Check if current path is a public route
 * @param {string} pathname - Current pathname
 * @returns {boolean}
 */
export const isPublicRoute = (pathname) => {
  const publicRoutes = ['/', '/about', '/features', '/explore', '/project'];
  return publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));
};

// ===================
// Navigation Items
// ===================

/**
 * Main navigation items for public pages
 */
export const PUBLIC_NAV_ITEMS = [
  { label: 'Home', path: ROUTES.HOME },
  { label: 'Explore', path: ROUTES.EXPLORE },
  { label: 'Features', path: ROUTES.FEATURES },
  { label: 'About', path: ROUTES.ABOUT },
];

/**
 * Dashboard sidebar navigation items
 */
export const DASHBOARD_NAV_ITEMS = [
  {
    label: 'Home',
    path: ROUTES.DASHBOARD,
    icon: 'Home',
    description: 'View all public projects',
  },
  {
    label: 'Upload Project',
    path: ROUTES.UPLOAD_PROJECT,
    icon: 'Upload',
    description: 'Share a new project',
  },
  {
    label: 'My Projects',
    path: ROUTES.MY_PROJECTS,
    icon: 'Folder',
    description: 'Manage your projects',
  },
  {
    label: 'Explore AI',
    path: ROUTES.EXPLORE_AI,
    icon: 'Bot',
    description: 'Chat with Nova AI',
  },
  {
    label: 'Rewards',
    path: ROUTES.REWARDS,
    icon: 'Gift',
    description: 'View your points & rewards',
  },
];

/**
 * User dropdown menu items
 */
export const USER_MENU_ITEMS = [
  {
    label: 'Profile',
    path: ROUTES.PROFILE,
    icon: 'User',
  },
  {
    label: 'Settings',
    path: ROUTES.SETTINGS,
    icon: 'Settings',
  },
  {
    label: 'Notifications',
    path: ROUTES.NOTIFICATIONS,
    icon: 'Bell',
  },
];

/**
 * Mobile bottom navigation items
 */
export const MOBILE_NAV_ITEMS = [
  {
    label: 'Home',
    path: ROUTES.DASHBOARD,
    icon: 'Home',
  },
  {
    label: 'Explore',
    path: ROUTES.EXPLORE_AI,
    icon: 'Bot',
  },
  {
    label: 'Upload',
    path: ROUTES.UPLOAD_PROJECT,
    icon: 'Plus',
    highlight: true,
  },
  {
    label: 'Projects',
    path: ROUTES.MY_PROJECTS,
    icon: 'Folder',
  },
  {
    label: 'Profile',
    path: ROUTES.PROFILE,
    icon: 'User',
  },
];

// ===================
// Breadcrumb Configuration
// ===================

/**
 * Breadcrumb labels for routes
 */
export const BREADCRUMB_LABELS = {
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.UPLOAD_PROJECT]: 'Upload Project',
  [ROUTES.MY_PROJECTS]: 'My Projects',
  [ROUTES.EXPLORE_AI]: 'Explore AI',
  [ROUTES.PROFILE]: 'Profile',
  [ROUTES.EDIT_PROFILE]: 'Edit Profile',
  [ROUTES.REWARDS]: 'Rewards',
  [ROUTES.NOTIFICATIONS]: 'Notifications',
  [ROUTES.SETTINGS]: 'Settings',
};

/**
 * Generate breadcrumbs from pathname
 * @param {string} pathname - Current pathname
 * @returns {Array<{label: string, path: string}>}
 */
export const generateBreadcrumbs = (pathname) => {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs = [];
  let currentPath = '';
  
  paths.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Skip dynamic segments like project slugs
    if (segment.match(/^[a-f0-9-]{36}$/) || paths[index - 1] === 'project') {
      return;
    }
    
    const label = BREADCRUMB_LABELS[currentPath] || 
                  segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    
    breadcrumbs.push({
      label,
      path: currentPath,
      isLast: index === paths.length - 1,
    });
  });
  
  return breadcrumbs;
};

// ===================
// Protected Route Groups
// ===================

/**
 * Routes that require authentication
 */
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.UPLOAD_PROJECT,
  ROUTES.MY_PROJECTS,
  ROUTES.EDIT_PROJECT,
  ROUTES.PROJECT,
  ROUTES.EXPLORE_AI,
  ROUTES.PROFILE,
  ROUTES.EDIT_PROFILE,
  ROUTES.REWARDS,
  ROUTES.NOTIFICATIONS,
  ROUTES.SETTINGS,
];

/**
 * Routes that should redirect authenticated users
 */
export const AUTH_ONLY_ROUTES = [
  ROUTES.AUTH,
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
  ROUTES.FORGOT_PASSWORD,
];

/**
 * Routes that require email verification
 */
export const VERIFIED_ONLY_ROUTES = [
  ROUTES.UPLOAD_PROJECT,
  ROUTES.EDIT_PROJECT,
  ROUTES.EXPLORE_AI,
];

// Export default
export default {
  ROUTES,
  getProjectUrl,
  getEditProjectUrl,
  getUserProfileUrl,
  isDashboardRoute,
  isAuthRoute,
  isPublicRoute,
  PUBLIC_NAV_ITEMS,
  DASHBOARD_NAV_ITEMS,
  USER_MENU_ITEMS,
  MOBILE_NAV_ITEMS,
  BREADCRUMB_LABELS,
  generateBreadcrumbs,
  PROTECTED_ROUTES,
  AUTH_ONLY_ROUTES,
  VERIFIED_ONLY_ROUTES,
};
