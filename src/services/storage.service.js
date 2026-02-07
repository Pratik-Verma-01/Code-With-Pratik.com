/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 Storage Service
 * 
 * Handles all file uploads and storage operations using Supabase Storage.
 */

import { supabase, STORAGE_BUCKETS, getPublicUrl, uploadFile, deleteFile } from '@lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { compressImage } from '@utils/imageUtils';

/**
 * Storage Service
 */
export const storageService = {
  /**
   * Upload user avatar
   * @param {string} userId
   * @param {File} file
   * @returns {Promise<{url: string, path: string}|null>}
   */
  async uploadAvatar(userId, file) {
    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      if (file.size > 2 * 1024 * 1024) {
        throw new Error('File size must be less than 2MB');
      }

      // Compress image
      const compressedFile = await compressImage(file, {
        maxWidth: 500,
        maxHeight: 500,
        quality: 0.8,
      });

      // Generate unique filename
      const ext = file.name.split('.').pop();
      const filename = `${userId}/${uuidv4()}.${ext}`;

      // Delete old avatar if exists
      await this.deleteUserAvatars(userId);

      // Upload new avatar
      const result = await uploadFile(STORAGE_BUCKETS.AVATARS, filename, compressedFile, {
        contentType: file.type,
      });

      return result;
    } catch (error) {
      console.error('Avatar upload error:', error);
      throw error;
    }
  },

  /**
   * Delete all avatars for a user
   * @param {string} userId
   */
  async deleteUserAvatars(userId) {
    try {
      const { data: files } = await supabase.storage
        .from(STORAGE_BUCKETS.AVATARS)
        .list(userId);

      if (files && files.length > 0) {
        const filePaths = files.map((file) => `${userId}/${file.name}`);
        await supabase.storage.from(STORAGE_BUCKETS.AVATARS).remove(filePaths);
      }
    } catch (error) {
      console.error('Delete avatars error:', error);
    }
  },

  /**
   * Upload project thumbnail
   * @param {string} projectId
   * @param {File} file
   * @returns {Promise<{url: string, path: string}|null>}
   */
  async uploadThumbnail(projectId, file) {
    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      // Compress image
      const compressedFile = await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 900,
        quality: 0.85,
      });

      // Generate filename
      const ext = file.name.split('.').pop();
      const filename = `${projectId}/${uuidv4()}.${ext}`;

      // Upload
      const result = await uploadFile(STORAGE_BUCKETS.THUMBNAILS, filename, compressedFile, {
        contentType: file.type,
      });

      return result;
    } catch (error) {
      console.error('Thumbnail upload error:', error);
      throw error;
    }
  },

  /**
   * Upload code archive (ZIP)
   * @param {string} projectId
   * @param {File} file
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<{url: string, path: string, size: number}|null>}
   */
  async uploadCodeArchive(projectId, file, onProgress) {
    try {
      // Validate file
      const validTypes = [
        'application/zip',
        'application/x-zip-compressed',
        'application/x-rar-compressed',
        'application/gzip',
        'application/x-tar',
      ];

      if (!validTypes.includes(file.type) && !file.name.match(/\.(zip|rar|tar\.gz|tgz)$/i)) {
        throw new Error('File must be a ZIP, RAR, or TAR.GZ archive');
      }

      if (file.size > 50 * 1024 * 1024) {
        throw new Error('File size must be less than 50MB');
      }

      // Generate filename
      const ext = file.name.split('.').pop();
      const filename = `${projectId}/${uuidv4()}.${ext}`;

      // Upload with progress tracking
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKETS.CODE_ARCHIVES)
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: true,
          // Note: Supabase doesn't support progress natively in browser
          // You'd need to use XMLHttpRequest for progress
        });

      if (error) throw error;

      const url = getPublicUrl(STORAGE_BUCKETS.CODE_ARCHIVES, data.path);

      // Simulate progress complete
      if (onProgress) onProgress(100);

      return { url, path: data.path, size: file.size };
    } catch (error) {
      console.error('Code archive upload error:', error);
      throw error;
    }
  },

  /**
   * Upload project asset
   * @param {string} projectId
   * @param {File} file
   * @returns {Promise<{url: string, path: string}>}
   */
  async uploadProjectAsset(projectId, file) {
    try {
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      const ext = file.name.split('.').pop();
      const filename = `${projectId}/${uuidv4()}.${ext}`;

      const result = await uploadFile(STORAGE_BUCKETS.PROJECT_ASSETS, filename, file, {
        contentType: file.type,
      });

      return result;
    } catch (error) {
      console.error('Project asset upload error:', error);
      throw error;
    }
  },

  /**
   * Delete project files
   * @param {string} projectId
   */
  async deleteProjectFiles(projectId) {
    try {
      const buckets = [
        STORAGE_BUCKETS.THUMBNAILS,
        STORAGE_BUCKETS.CODE_ARCHIVES,
        STORAGE_BUCKETS.PROJECT_ASSETS,
      ];

      for (const bucket of buckets) {
        const { data: files } = await supabase.storage.from(bucket).list(projectId);

        if (files && files.length > 0) {
          const filePaths = files.map((file) => `${projectId}/${file.name}`);
          await supabase.storage.from(bucket).remove(filePaths);
        }
      }
    } catch (error) {
      console.error('Delete project files error:', error);
    }
  },

  /**
   * Get signed URL for private file
   * @param {string} bucket
   * @param {string} path
   * @param {number} expiresIn - Expiry in seconds (default 1 hour)
   * @returns {Promise<string|null>}
   */
  async getSignedUrl(bucket, path, expiresIn = 3600) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

      if (error) throw error;

      return data.signedUrl;
    } catch (error) {
      console.error('Get signed URL error:', error);
      return null;
    }
  },

  /**
   * Download file
   * @param {string} bucket
   * @param {string} path
   * @returns {Promise<Blob|null>}
   */
  async downloadFile(bucket, path) {
    try {
      const { data, error } = await supabase.storage.from(bucket).download(path);

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Download file error:', error);
      return null;
    }
  },

  /**
   * Get file metadata
   * @param {string} bucket
   * @param {string} path
   * @returns {Promise<Object|null>}
   */
  async getFileMetadata(bucket, path) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(path.split('/').slice(0, -1).join('/'), {
          search: path.split('/').pop(),
        });

      if (error || !data || data.length === 0) return null;

      return data[0];
    } catch (error) {
      console.error('Get file metadata error:', error);
      return null;
    }
  },

  /**
   * Get public URL
   * @param {string} bucket
   * @param {string} path
   * @returns {string}
   */
  getPublicUrl(bucket, path) {
    return getPublicUrl(bucket, path);
  },

  // Export bucket names
  buckets: STORAGE_BUCKETS,
};

export default storageService;
