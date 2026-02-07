/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 Combined Context Providers
 * 
 * Exports all context providers and a combined wrapper.
 */

import React from 'react';

// Import all providers
import { AuthProvider, useAuthContext } from './AuthContext';
import { ThemeProvider, useThemeContext, THEMES } from './ThemeContext';
import { NotificationProvider, useNotificationContext } from './NotificationContext';
import { ProjectProvider, useProjectContext, PROJECT_QUERY_KEYS } from './ProjectContext';
import { AIProvider, useAIContext } from './AIContext';

/**
 * Combined App Providers
 * Wraps the app with all necessary context providers in correct order.
 * 
 * Order matters:
 * 1. ThemeProvider - No dependencies
 * 2. AuthProvider - No dependencies
 * 3. NotificationProvider - Depends on AuthProvider
 * 4. ProjectProvider - Depends on Auth & Notification
 * 5. AIProvider - Depends on Auth & Notification
 */
export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <ProjectProvider>
            <AIProvider>
              {children}
            </AIProvider>
          </ProjectProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Re-export all providers
export {
  // Providers
  AuthProvider,
  ThemeProvider,
  NotificationProvider,
  ProjectProvider,
  AIProvider,
  
  // Hooks
  useAuthContext,
  useThemeContext,
  useNotificationContext,
  useProjectContext,
  useAIContext,
  
  // Constants
  THEMES,
  PROJECT_QUERY_KEYS,
};

// Default export
export default AppProviders;
