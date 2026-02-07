/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 Projects Service
 * 
 * Handles all project-related database operations.
 */

import { supabase, TABLES } from '@lib/supabase';
import { databaseService } from './database.service';
import { storageService } from './storage.service';
import { rewardsService } from './rewards.service';
import { slugify } from '@utils/slugify';
import { v4 as uuidv4 } from 'uuid';

/**
 * Projects Service
 */
export const projectsService = {
  /**
   * Create a new project
   * @param {Object} projectData
   * @param {string} userId
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async createProject(projectData, userId) {
    try {
      const projectId = uuidv4();
      
      // Generate unique slug
      let slug = slugify(projectData.title);
      let slugExists = await this.slugExists(slug);
      let counter = 1;
      
      while (slugExists) {
        slug = `${slugify(projectData.title)}-${counter}`;
        slugExists = await this.slugExists(slug);
        counter++;
      }

      // Upload thumbnail if provided
      let thumbnailUrl = projectData.thumbnail_url || null;
      if (projectData.thumbnailFile) {
        const result = await storageService.uploadThumbnail(projectId, projectData.thumbnailFile);
        thumbnailUrl = result.url;
      }

      // Upload code archive if provided
      let codeArchiveUrl = null;
      let codeArchiveSize = null;
      if (projectData.codeArchiveFile) {
        const result = await storageService.uploadCodeArchive(projectId, projectData.codeArchiveFile);
        codeArchiveUrl = result.url;
        codeArchiveSize = result.size;
      }

      // Create project record
      const project = {
        id: projectId,
        user_id: userId,
        title: projectData.title,
        slug,
        short_description: projectData.short_description,
        long_description: projectData.long_description || '',
        primary_language: projectData.primary_language,
        thumbnail_url: thumbnailUrl,
        code_archive_url: codeArchiveUrl,
        code_archive_size: codeArchiveSize,
        git_repo_url: projectData.git_repo_url || null,
        visibility: projectData.visibility || 'public',
        ai_enabled: projectData.ai_enabled !== false,
        reward_points: projectData.reward_points || 0,
        view_count: 0,
        download_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .insert(project)
        .select()
        .single();

      if (error) throw error;

      // Award points for project upload
      await rewardsService.awardPoints(userId, 'project_upload', 50, {
        project_id: projectId,
        project_title: projectData.title,
      });

      // Check for first project bonus
      const userProjectCount = await this.getUserProjectCount(userId);
      if (userProjectCount === 1) {
        await rewardsService.awardPoints(userId, 'first_project', 100);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Create project error:', error);
      return { data: null, error };
    }
  },

  /**
   * Update a project
   * @param {string} projectId
   * @param {Object} projectData
   * @param {string} userId
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async updateProject(projectId, projectData, userId) {
    try {
      // Verify ownership
      const existingProject = await this.getProjectById(projectId);
      if (!existingProject || existingProject.user_id !== userId) {
        throw new Error('Project not found or access denied');
      }

      // Handle thumbnail update
      let thumbnailUrl = projectData.thumbnail_url ?? existingProject.thumbnail_url;
      if (projectData.thumbnailFile) {
        const result = await storageService.uploadThumbnail(projectId, projectData.thumbnailFile);
        thumbnailUrl = result.url;
      }

      // Handle code archive update
      let codeArchiveUrl = existingProject.code_archive_url;
      let codeArchiveSize = existingProject.code_archive_size;
      if (projectData.codeArchiveFile) {
        const result = await storageService.uploadCodeArchive(projectId, projectData.codeArchiveFile);
        codeArchiveUrl = result.url;
        codeArchiveSize = result.size;
      }

      // Update slug if title changed
      let slug = existingProject.slug;
      if (projectData.title && projectData.title !== existingProject.title) {
        slug = slugify(projectData.title);
        let slugExists = await this.slugExists(slug, projectId);
        let counter = 1;
        
        while (slugExists) {
          slug = `${slugify(projectData.title)}-${counter}`;
          slugExists = await this.slugExists(slug, projectId);
          counter++;
        }
      }

      const updateData = {
        title: projectData.title ?? existingProject.title,
        slug,
        short_description: projectData.short_description ?? existingProject.short_description,
        long_description: projectData.long_description ?? existingProject.long_description,
        primary_language: projectData.primary_language ?? existingProject.primary_language,
        thumbnail_url: thumbnailUrl,
        code_archive_url: codeArchiveUrl,
        code_archive_size: codeArchiveSize,
        git_repo_url: projectData.git_repo_url ?? existingProject.git_repo_url,
        visibility: projectData.visibility ?? existingProject.visibility,
        ai_enabled: projectData.ai_enabled ?? existingProject.ai_enabled,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .update(updateData)
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Update project error:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete a project
   * @param {string} projectId
   * @param {string} userId
   * @returns {Promise<{error: Error|null}>}
   */
  async deleteProject(projectId, userId) {
    try {
      // Verify ownership
      const existingProject = await this.getProjectById(projectId);
      if (!existingProject || existingProject.user_id !== userId) {
        throw new Error('Project not found or access denied');
      }

      // Delete storage files
      await storageService.deleteProjectFiles(projectId);

      // Delete project views
      await supabase.from(TABLES.PROJECT_VIEWS).delete().eq('project_id', projectId);

      // Delete project
      const { error } = await supabase
        .from(TABLES.PROJECTS)
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Delete project error:', error);
      return { error };
    }
  },

  /**
   * Get project by ID
   * @param {string} projectId
   * @returns {Promise<Object|null>}
   */
  async getProjectById(projectId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .select(`
          *,
          user:users(id, username, full_name, photo_url)
        `)
        .eq('id', projectId)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Get project by ID error:', error);
      return null;
    }
  },

  /**
   * Get project by slug
   * @param {string} slug
   * @returns {Promise<Object|null>}
   */
  async getProjectBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .select(`
          *,
          user:users(id, username, full_name, photo_url)
        `)
        .eq('slug', slug)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Get project by slug error:', error);
      return null;
    }
  },

  /**
   * Check if slug exists
   * @param {string} slug
   * @param {string} excludeId - Exclude this project ID
   * @returns {Promise<boolean>}
   */
  async slugExists(slug, excludeId = null) {
    let query = supabase
      .from(TABLES.PROJECTS)
      .select('id')
      .eq('slug', slug);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data } = await query;
    return data && data.length > 0;
  },

  /**
   * Get public projects
   * @param {Object} options
   * @returns {Promise<{data: Array, total: number, error: Error|null}>}
   */
  async getPublicProjects(options = {}) {
    try {
      const {
        page = 1,
        pageSize = 12,
        language = null,
        search = null,
        sortBy = 'created_at',
        sortOrder = 'desc',
      } = options;

      const offset = (page - 1) * pageSize;

      let query = supabase
        .from(TABLES.PROJECTS)
        .select(`
          *,
          user:users(id, username, full_name, photo_url)
        `, { count: 'exact' })
        .eq('visibility', 'public')
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(offset, offset + pageSize - 1);

      // Apply filters
      if (language) {
        query = query.eq('primary_language', language);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,short_description.ilike.%${search}%`);
      }

      const { data, count, error } = await query;

      if (error) throw error;

      return {
        data: data || [],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
        error: null,
      };
    } catch (error) {
      console.error('Get public projects error:', error);
      return { data: [], total: 0, page: 1, pageSize: 12, totalPages: 0, error };
    }
  },

  /**
   * Get user's projects
   * @param {string} userId
   * @param {Object} options
   * @returns {Promise<{data: Array, error: Error|null}>}
   */
  async getUserProjects(userId, options = {}) {
    try {
      const { visibility = null, sortBy = 'created_at', sortOrder = 'desc' } = options;

      let query = supabase
        .from(TABLES.PROJECTS)
        .select('*')
        .eq('user_id', userId)
        .order(sortBy, { ascending: sortOrder === 'asc' });

      if (visibility) {
        query = query.eq('visibility', visibility);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Get user projects error:', error);
      return { data: [], error };
    }
  },

  /**
   * Get user's project count
   * @param {string} userId
   * @returns {Promise<number>}
   */
  async getUserProjectCount(userId) {
    const { count } = await supabase
      .from(TABLES.PROJECTS)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    return count || 0;
  },

  /**
   * Increment view count
   * @param {string} projectId
   * @param {string} userId - Viewer's user ID (optional)
   * @returns {Promise<void>}
   */
  async incrementViewCount(projectId, userId = null) {
    try {
      // Check if user already viewed (prevent duplicate counts)
      if (userId) {
        const { data: existingView } = await supabase
          .from(TABLES.PROJECT_VIEWS)
          .select('id')
          .eq('project_id', projectId)
          .eq('user_id', userId)
          .single();

        if (existingView) return; // Already viewed

        // Record view
        await supabase.from(TABLES.PROJECT_VIEWS).insert({
          project_id: projectId,
          user_id: userId,
          viewed_at: new Date().toISOString(),
        });
      }

      // Increment counter
      await supabase.rpc('increment_project_views', { project_id: projectId });
    } catch (error) {
      console.error('Increment view count error:', error);
    }
  },

  /**
   * Increment download count
   * @param {string} projectId
   * @returns {Promise<void>}
   */
  async incrementDownloadCount(projectId) {
    try {
      await supabase.rpc('increment_project_downloads', { project_id: projectId });
    } catch (error) {
      console.error('Increment download count error:', error);
    }
  },

  /**
   * Get trending projects
   * @param {number} limit
   * @returns {Promise<Array>}
   */
  async getTrendingProjects(limit = 6) {
    try {
      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .select(`
          *,
          user:users(id, username, full_name, photo_url)
        `)
        .eq('visibility', 'public')
        .order('view_count', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Get trending projects error:', error);
      return [];
    }
  },

  /**
   * Get recent projects
   * @param {number} limit
   * @returns {Promise<Array>}
   */
  async getRecentProjects(limit = 6) {
    try {
      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .select(`
          *,
          user:users(id, username, full_name, photo_url)
        `)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Get recent projects error:', error);
      return [];
    }
  },

  /**
   * Search projects
   * @param {string} query
   * @param {Object} options
   * @returns {Promise<Array>}
   */
  async searchProjects(searchQuery, options = {}) {
    try {
      const { limit = 20, language = null } = options;

      let query = supabase
        .from(TABLES.PROJECTS)
        .select(`
          *,
          user:users(id, username, full_name, photo_url)
        `)
        .eq('visibility', 'public')
        .or(`title.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%`)
        .order('view_count', { ascending: false })
        .limit(limit);

      if (language) {
        query = query.eq('primary_language', language);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Search projects error:', error);
      return [];
    }
  },
};

export default projectsService;
