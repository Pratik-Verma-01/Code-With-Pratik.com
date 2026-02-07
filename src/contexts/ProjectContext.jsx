/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 Project Context
 * 
 * Manages project state, caching, and project-related operations.
 */

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { projectsService } from '@services/projects.service';
import { useAuthContext } from './AuthContext';
import { useNotificationContext } from './NotificationContext';

// Query keys for cache management
export const PROJECT_QUERY_KEYS = {
  all: ['projects'],
  public: ['projects', 'public'],
  user: (userId) => ['projects', 'user', userId],
  single: (slug) => ['projects', 'single', slug],
  trending: ['projects', 'trending'],
  recent: ['projects', 'recent'],
  search: (query) => ['projects', 'search', query],
};

// Create Project Context
const ProjectContext = createContext(null);

// Project Provider Component
export function ProjectProvider({ children }) {
  const queryClient = useQueryClient();
  const { userId } = useAuthContext();
  const { showSuccess, showError, showLoading, dismissToast } = useNotificationContext();

  // State
  const [currentProject, setCurrentProject] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Filters state
  const [filters, setFilters] = useState({
    language: null,
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  /**
   * Create a new project
   */
  const createProject = useCallback(async (projectData) => {
    if (!userId) {
      showError('Please log in to create a project');
      return { success: false, error: 'Not authenticated' };
    }

    setIsCreating(true);
    const loadingToast = showLoading('Creating project...');

    try {
      const result = await projectsService.createProject(projectData, userId);

      if (result.error) {
        dismissToast(loadingToast);
        showError(result.error.message || 'Failed to create project');
        return { success: false, error: result.error };
      }

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEYS.user(userId) });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEYS.recent });

      dismissToast(loadingToast);
      showSuccess('Project created successfully! 🎉');

      return { success: true, data: result.data };
    } catch (error) {
      dismissToast(loadingToast);
      showError(error.message || 'Failed to create project');
      return { success: false, error };
    } finally {
      setIsCreating(false);
    }
  }, [userId, queryClient, showSuccess, showError, showLoading, dismissToast]);

  /**
   * Update a project
   */
  const updateProject = useCallback(async (projectId, projectData) => {
    if (!userId) {
      showError('Please log in to update a project');
      return { success: false, error: 'Not authenticated' };
    }

    setIsUpdating(true);
    const loadingToast = showLoading('Updating project...');

    try {
      const result = await projectsService.updateProject(projectId, projectData, userId);

      if (result.error) {
        dismissToast(loadingToast);
        showError(result.error.message || 'Failed to update project');
        return { success: false, error: result.error };
      }

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEYS.user(userId) });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEYS.single(result.data.slug) });

      // Update current project if it's the same
      if (currentProject?.id === projectId) {
        setCurrentProject(result.data);
      }

      dismissToast(loadingToast);
      showSuccess('Project updated successfully!');

      return { success: true, data: result.data };
    } catch (error) {
      dismissToast(loadingToast);
      showError(error.message || 'Failed to update project');
      return { success: false, error };
    } finally {
      setIsUpdating(false);
    }
  }, [userId, currentProject, queryClient, showSuccess, showError, showLoading, dismissToast]);

  /**
   * Delete a project
   */
  const deleteProject = useCallback(async (projectId) => {
    if (!userId) {
      showError('Please log in to delete a project');
      return { success: false, error: 'Not authenticated' };
    }

    setIsDeleting(true);
    const loadingToast = showLoading('Deleting project...');

    try {
      const result = await projectsService.deleteProject(projectId, userId);

      if (result.error) {
        dismissToast(loadingToast);
        showError(result.error.message || 'Failed to delete project');
        return { success: false, error: result.error };
      }

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEYS.user(userId) });

      // Clear current project if it's the deleted one
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
      }

      dismissToast(loadingToast);
      showSuccess('Project deleted successfully');

      return { success: true };
    } catch (error) {
      dismissToast(loadingToast);
      showError(error.message || 'Failed to delete project');
      return { success: false, error };
    } finally {
      setIsDeleting(false);
    }
  }, [userId, currentProject, queryClient, showSuccess, showError, showLoading, dismissToast]);

  /**
   * Get project by slug
   */
  const getProjectBySlug = useCallback(async (slug) => {
    try {
      const project = await projectsService.getProjectBySlug(slug);
      
      if (project) {
        setCurrentProject(project);
        
        // Track view (if not owner)
        if (project.user_id !== userId) {
          projectsService.incrementViewCount(project.id, userId);
        }
      }
      
      return project;
    } catch (error) {
      console.error('Error getting project:', error);
      return null;
    }
  }, [userId]);

  /**
   * Update filters
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Reset filters
   */
  const resetFilters = useCallback(() => {
    setFilters({
      language: null,
      search: '',
      sortBy: 'created_at',
      sortOrder: 'desc',
    });
  }, []);

  /**
   * Prefetch project
   */
  const prefetchProject = useCallback(async (slug) => {
    await queryClient.prefetchQuery({
      queryKey: PROJECT_QUERY_KEYS.single(slug),
      queryFn: () => projectsService.getProjectBySlug(slug),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  }, [queryClient]);

  /**
   * Invalidate project cache
   */
  const invalidateProjectCache = useCallback((slug) => {
    if (slug) {
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEYS.single(slug) });
    } else {
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEYS.all });
    }
  }, [queryClient]);

  /**
   * Track download
   */
  const trackDownload = useCallback(async (projectId) => {
    try {
      await projectsService.incrementDownloadCount(projectId);
    } catch (error) {
      console.error('Error tracking download:', error);
    }
  }, []);

  // Memoized context value
  const contextValue = useMemo(() => ({
    // State
    currentProject,
    setCurrentProject,
    isCreating,
    isUpdating,
    isDeleting,
    filters,
    
    // Computed
    isLoading: isCreating || isUpdating || isDeleting,
    
    // Actions
    createProject,
    updateProject,
    deleteProject,
    getProjectBySlug,
    updateFilters,
    resetFilters,
    prefetchProject,
    invalidateProjectCache,
    trackDownload,
    
    // Query keys for external use
    QUERY_KEYS: PROJECT_QUERY_KEYS,
  }), [
    currentProject,
    isCreating,
    isUpdating,
    isDeleting,
    filters,
    createProject,
    updateProject,
    deleteProject,
    getProjectBySlug,
    updateFilters,
    resetFilters,
    prefetchProject,
    invalidateProjectCache,
    trackDownload,
  ]);

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
}

/**
 * Custom hook to use project context
 */
export function useProjectContext() {
  const context = useContext(ProjectContext);
  
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  
  return context;
}

export default ProjectContext;
