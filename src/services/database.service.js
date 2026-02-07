/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 Database Service
 * 
 * Core database operations using Supabase.
 * Provides generic CRUD operations and query builders.
 */

import { supabase, executeQuery, getSingle, TABLES } from '@lib/supabase';

/**
 * Generic Database Service Factory
 * Creates CRUD operations for any table
 */
const createTableService = (tableName) => ({
  /**
   * Get all records
   * @param {Object} options
   * @returns {Promise<{data: Array, error: Error|null}>}
   */
  async getAll(options = {}) {
    const {
      select = '*',
      orderBy = 'created_at',
      orderDirection = 'desc',
      limit = 100,
      offset = 0,
      filters = {},
    } = options;

    let query = supabase
      .from(tableName)
      .select(select, { count: 'exact' })
      .order(orderBy, { ascending: orderDirection === 'asc' })
      .range(offset, offset + limit - 1);

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object' && value.operator) {
          // Custom operator filter
          query = query.filter(key, value.operator, value.value);
        } else {
          // Equality filter
          query = query.eq(key, value);
        }
      }
    });

    return executeQuery(query);
  },

  /**
   * Get record by ID
   * @param {string} id
   * @param {string} select
   * @returns {Promise<Object|null>}
   */
  async getById(id, select = '*') {
    const query = supabase
      .from(tableName)
      .select(select)
      .eq('id', id);

    return getSingle(query);
  },

  /**
   * Get records by field value
   * @param {string} field
   * @param {any} value
   * @param {string} select
   * @returns {Promise<{data: Array, error: Error|null}>}
   */
  async getByField(field, value, select = '*') {
    const query = supabase
      .from(tableName)
      .select(select)
      .eq(field, value);

    return executeQuery(query);
  },

  /**
   * Get single record by field value
   * @param {string} field
   * @param {any} value
   * @param {string} select
   * @returns {Promise<Object|null>}
   */
  async getOneByField(field, value, select = '*') {
    const query = supabase
      .from(tableName)
      .select(select)
      .eq(field, value);

    return getSingle(query);
  },

  /**
   * Create record
   * @param {Object} data
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async create(data) {
    const query = supabase
      .from(tableName)
      .insert(data)
      .select()
      .single();

    return executeQuery(query);
  },

  /**
   * Create multiple records
   * @param {Array} records
   * @returns {Promise<{data: Array, error: Error|null}>}
   */
  async createMany(records) {
    const query = supabase
      .from(tableName)
      .insert(records)
      .select();

    return executeQuery(query);
  },

  /**
   * Update record by ID
   * @param {string} id
   * @param {Object} data
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async update(id, data) {
    const query = supabase
      .from(tableName)
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    return executeQuery(query);
  },

  /**
   * Update records by field value
   * @param {string} field
   * @param {any} value
   * @param {Object} data
   * @returns {Promise<{data: Array, error: Error|null}>}
   */
  async updateByField(field, value, data) {
    const query = supabase
      .from(tableName)
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq(field, value)
      .select();

    return executeQuery(query);
  },

  /**
   * Delete record by ID
   * @param {string} id
   * @returns {Promise<{error: Error|null}>}
   */
  async delete(id) {
    const query = supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    return executeQuery(query);
  },

  /**
   * Delete records by field value
   * @param {string} field
   * @param {any} value
   * @returns {Promise<{error: Error|null}>}
   */
  async deleteByField(field, value) {
    const query = supabase
      .from(tableName)
      .delete()
      .eq(field, value);

    return executeQuery(query);
  },

  /**
   * Count records
   * @param {Object} filters
   * @returns {Promise<number>}
   */
  async count(filters = {}) {
    let query = supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });

    const { count, error } = await query;

    if (error) {
      console.error('Count error:', error);
      return 0;
    }

    return count || 0;
  },

  /**
   * Check if record exists
   * @param {string} field
   * @param {any} value
   * @returns {Promise<boolean>}
   */
  async exists(field, value) {
    const { data } = await supabase
      .from(tableName)
      .select('id')
      .eq(field, value)
      .limit(1);

    return data && data.length > 0;
  },

  /**
   * Search records with text search
   * @param {string} column
   * @param {string} query
   * @param {Object} options
   * @returns {Promise<{data: Array, error: Error|null}>}
   */
  async search(column, searchQuery, options = {}) {
    const { select = '*', limit = 20 } = options;

    const query = supabase
      .from(tableName)
      .select(select)
      .ilike(column, `%${searchQuery}%`)
      .limit(limit);

    return executeQuery(query);
  },

  /**
   * Get paginated records
   * @param {number} page
   * @param {number} pageSize
   * @param {Object} options
   * @returns {Promise<{data: Array, total: number, page: number, pageSize: number, totalPages: number}>}
   */
  async paginate(page = 1, pageSize = 10, options = {}) {
    const offset = (page - 1) * pageSize;
    const { data, error } = await this.getAll({
      ...options,
      limit: pageSize,
      offset,
    });

    if (error) {
      return { data: [], total: 0, page, pageSize, totalPages: 0, error };
    }

    const total = await this.count(options.filters);
    const totalPages = Math.ceil(total / pageSize);

    return {
      data: data || [],
      total,
      page,
      pageSize,
      totalPages,
      hasMore: page < totalPages,
      error: null,
    };
  },
});

// ===================
// Export Table Services
// ===================
export const usersTable = createTableService(TABLES.USERS);
export const projectsTable = createTableService(TABLES.PROJECTS);
export const projectViewsTable = createTableService(TABLES.PROJECT_VIEWS);
export const rewardsTable = createTableService(TABLES.REWARDS);
export const notificationsTable = createTableService(TABLES.NOTIFICATIONS);
export const aiChatHistoryTable = createTableService(TABLES.AI_CHAT_HISTORY);

// ===================
// Database Service Export
// ===================
export const databaseService = {
  // Table services
  users: usersTable,
  projects: projectsTable,
  projectViews: projectViewsTable,
  rewards: rewardsTable,
  notifications: notificationsTable,
  aiChatHistory: aiChatHistoryTable,

  // Factory function for custom tables
  createTableService,

  // Raw query access
  supabase,

  /**
   * Execute raw SQL (via RPC)
   * @param {string} functionName
   * @param {Object} params
   * @returns {Promise<{data: any, error: Error|null}>}
   */
  async rpc(functionName, params = {}) {
    return executeQuery(supabase.rpc(functionName, params));
  },
};

export default databaseService;
