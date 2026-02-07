/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 Supabase Configuration
 * 
 * Supabase is used for:
 * - Database (PostgreSQL)
 * - Storage (Files, Images)
 * - Realtime subscriptions
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  throw new Error('Supabase configuration is incomplete.');
}

// Create Supabase client with custom options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // We use Firebase for auth, so disable Supabase auth features
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'code-with-pratik',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// ===================
// Database Helpers
// ===================

/**
 * Execute a query with error handling
 * @param {Promise} query - Supabase query promise
 * @returns {Promise<{data: any, error: Error|null}>}
 */
export const executeQuery = async (query) => {
  try {
    const { data, error } = await query;
    
    if (error) {
      console.error('Supabase query error:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Supabase execution error:', error);
    return { data: null, error };
  }
};

/**
 * Get single record or null
 * @param {Promise} query - Supabase query promise
 * @returns {Promise<any|null>}
 */
export const getSingle = async (query) => {
  const { data, error } = await query.single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned - not an error
      return null;
    }
    throw error;
  }
  
  return data;
};

// ===================
// Storage Helpers
// ===================

/**
 * Storage bucket names
 */
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  THUMBNAILS: 'thumbnails',
  CODE_ARCHIVES: 'code-archives',
  PROJECT_ASSETS: 'project-assets',
};

/**
 * Get public URL for a storage file
 * @param {string} bucket - Bucket name
 * @param {string} path - File path within bucket
 * @returns {string}
 */
export const getPublicUrl = (bucket, path) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

/**
 * Upload file to storage
 * @param {string} bucket - Bucket name
 * @param {string} path - File path
 * @param {File} file - File to upload
 * @param {Object} options - Upload options
 * @returns {Promise<{path: string, url: string}|null>}
 */
export const uploadFile = async (bucket, path, file, options = {}) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
      ...options,
    });
  
  if (error) {
    console.error('Upload error:', error);
    throw error;
  }
  
  const url = getPublicUrl(bucket, data.path);
  return { path: data.path, url };
};

/**
 * Delete file from storage
 * @param {string} bucket - Bucket name
 * @param {string} path - File path
 * @returns {Promise<boolean>}
 */
export const deleteFile = async (bucket, path) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);
  
  if (error) {
    console.error('Delete error:', error);
    return false;
  }
  
  return true;
};

/**
 * List files in a folder
 * @param {string} bucket - Bucket name
 * @param {string} folder - Folder path
 * @returns {Promise<Array>}
 */
export const listFiles = async (bucket, folder = '') => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folder, {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    });
  
  if (error) {
    console.error('List files error:', error);
    return [];
  }
  
  return data;
};

// ===================
// Realtime Helpers
// ===================

/**
 * Subscribe to table changes
 * @param {string} table - Table name
 * @param {Function} callback - Callback function
 * @param {Object} filter - Optional filter
 * @returns {Function} Unsubscribe function
 */
export const subscribeToTable = (table, callback, filter = {}) => {
  const channel = supabase
    .channel(`${table}-changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table,
        ...filter,
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * Subscribe to user-specific changes
 * @param {string} userId - User ID
 * @param {string} table - Table name
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export const subscribeToUserChanges = (userId, table, callback) => {
  return subscribeToTable(table, callback, {
    filter: `user_id=eq.${userId}`,
  });
};

// ===================
// Table Names
// ===================
export const TABLES = {
  USERS: 'users',
  PROJECTS: 'projects',
  PROJECT_VIEWS: 'project_views',
  REWARDS: 'rewards',
  NOTIFICATIONS: 'notifications',
  AI_CHAT_HISTORY: 'ai_chat_history',
};

export default supabase;
