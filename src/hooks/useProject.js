/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 useProject Hook
 * 
 * Fetches and manages a single project by slug or ID.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { projectsService } from '@services/projects.service';
import { PROJECT_QUERY_KEYS, useProjectContext } from '@contexts/ProjectContext';
import { useAuth } from './useAuth';
import { useToast } from './useNotification';

/**
 * Fetch project by slug
 * @param {string} slug - Project slug
 * @param {Object} options - Query options
 * @returns {Object} Query result with project data
 */
export function useProject(slug, options = {}) {
  const { enabled = true, trackView = true } = options;
  const { userId } = useAuth();

  const query = useQuery({
    queryKey: PROJECT_QUERY_KEYS.single(slug),
    queryFn: async () => {
      const project = await projectsService.getProjectBySlug(slug);
      
      // Track view if enabled and not owner
      if (trackView && project && project.user_id !== userId) {
        projectsService.incrementViewCount(project.id, userId);
      }
      
      return project;
    },
    enabled: enabled && !!slug,
    staleTime: 5 * 60 * 1000,
  });

  return {
    project: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isOwner: query.data?.user_id === userId,
  };
}

/**
 * Fetch project by ID
 * @param {string} projectId - Project ID
 * @param {Object} options - Query options
 * @returns {Object} Query result
 */
export function useProjectById(projectId, options = {}) {
  const { enabled = true } = options;

  const query = useQuery({
    queryKey: ['projects', 'id', projectId],
    queryFn: () => projectsService.getProjectById(projectId),
    enabled: enabled && !!projectId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    project: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Hook for project mutations (create, update, delete)
 * @returns {Object} Mutation methods
 */
export function useProjectMutations() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const { success, error } = useToast();

  // Create project mutation
  const createMutation = useMutation({
    mutationFn: (projectData) => projectsService.createProject(projectData, userId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEYS.user(userId) });
      success('Project created successfully! 🎉');
    },
    onError: (err) => {
      error(err.message || 'Failed to create project');
    },
  });

  // Update project mutation
  const updateMutation = useMutation({
    mutationFn: ({ projectId, data }) => projectsService.updateProject(projectId, data, userId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEYS.single(data.data.slug) });
      success('Project updated successfully!');
    },
    onError: (err) => {
      error(err.message || 'Failed to update project');
    },
  });

  // Delete project mutation
  const deleteMutation = useMutation({
    mutationFn: (projectId) => projectsService.deleteProject(projectId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEYS.user(userId) });
      success('Project deleted successfully');
    },
    onError: (err) => {
      error(err.message || 'Failed to delete project');
    },
  });

  return {
    createProject: createMutation.mutateAsync,
    updateProject: updateMutation.mutateAsync,
    deleteProject: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
}

/**
 * Hook for project actions (download tracking, etc.)
 * @param {string} projectId - Project ID
 * @returns {Object} Action methods
 */
export function useProjectActions(projectId) {
  const { trackDownload } = useProjectContext();

  const handleDownload = useCallback(async () => {
    if (projectId) {
      await trackDownload(projectId);
    }
  }, [projectId, trackDownload]);

  return {
    trackDownload: handleDownload,
  };
}

export default useProject;
