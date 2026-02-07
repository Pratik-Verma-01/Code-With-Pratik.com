/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 Hooks Barrel Export
 * 
 * Central export for all custom hooks.
 */

// Auth hooks
export { useAuth, useIsAuthenticated, useCurrentUser, useAuthLoading, useAuthError } from './useAuth';

// Theme hooks
export { useTheme, useIsDarkMode, useToggleTheme, useEffectiveTheme, THEMES } from './useTheme';

// Notification hooks
export { useNotification, useToast, useInAppNotifications } from './useNotification';

// Project hooks
export {
  useProjects,
  useInfiniteProjects,
  useTrendingProjects,
  useRecentProjects,
  useSearchProjects,
} from './useProjects';

export {
  useProject,
  useProjectById,
  useProjectMutations,
  useProjectActions,
} from './useProject';

export {
  useUserProjects,
  useUserProjectCount,
  useProjectsByUser,
} from './useUserProjects';

// User hooks
export {
  useUser,
  useUserProfile,
  useUserStats,
  useUsernameAvailability,
  useProfileMutations,
} from './useUser';

// AI hooks
export {
  useAIChat,
  useSendMessage,
  useAIMessages,
  useAISidebar,
  useAIProjectContext,
  useAISuggestions,
} from './useAIChat';

// Rewards hooks
export {
  useRewards,
  useTotalPoints,
  useUserLevel,
  useLeaderboard,
  useRewardsData,
} from './useRewards';

// Notifications hooks
export {
  useNotifications,
  useUnreadCount,
  useNotificationMutations,
} from './useNotifications';

// Utility hooks
export {
  useDebounce,
  useDebouncedCallback,
  useDebouncedState,
} from './useDebounce';

export {
  useMediaQuery,
  useBreakpoint,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  usePrefersReducedMotion,
  usePrefersDarkMode,
  useResponsiveValue,
  useResponsive,
} from './useMediaQuery';

export {
  useLocalStorage,
  useSessionStorage,
} from './useLocalStorage';

export {
  useClickOutside,
  useClickOutsideMultiple,
} from './useClickOutside';

export {
  useScrollLock,
  useScrollLockControls,
} from './useScrollLock';

export {
  useCopyToClipboard,
  useCopy,
} from './useCopyToClipboard';

export {
  useOnlineStatus,
  useNetworkStatus,
  useConnectivity,
} from './useOnlineStatus';

export {
  useInfiniteScroll,
  useScrollInfinite,
  useContainerInfiniteScroll,
  useInfinitePagination,
} from './useInfiniteScroll';
