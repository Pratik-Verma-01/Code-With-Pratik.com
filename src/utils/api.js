/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 API Client
 * 
 * HTTP client for serverless API functions.
 */

import { auth } from '@lib/firebase';
import { API_CONFIG, ERROR_MESSAGES } from '@config/app.config';

/**
 * API Error class
 */
export class ApiError extends Error {
  constructor(message, status, code = null, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Get auth token for API requests
 * @returns {Promise<string|null>}
 */
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    return await user.getIdToken();
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Parse API response
 * @param {Response} response - Fetch response
 * @returns {Promise<any>}
 */
const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  if (contentType?.includes('application/json')) {
    return response.json();
  }
  
  if (contentType?.includes('text/')) {
    return response.text();
  }
  
  return response.blob();
};

/**
 * Handle API error response
 * @param {Response} response - Fetch response
 * @returns {Promise<never>}
 */
const handleErrorResponse = async (response) => {
  let errorMessage = ERROR_MESSAGES.default;
  let errorCode = null;
  let details = null;
  
  try {
    const data = await response.json();
    errorMessage = data.error || data.message || errorMessage;
    errorCode = data.code || null;
    details = data.details || null;
  } catch {
    // Response wasn't JSON
    if (response.status === 401) {
      errorMessage = ERROR_MESSAGES.unauthorized;
    } else if (response.status === 403) {
      errorMessage = ERROR_MESSAGES.forbidden;
    } else if (response.status === 404) {
      errorMessage = ERROR_MESSAGES.notFound;
    } else if (response.status === 429) {
      errorMessage = ERROR_MESSAGES.rateLimited;
    } else if (response.status >= 500) {
      errorMessage = ERROR_MESSAGES.serverError;
    }
  }
  
  throw new ApiError(errorMessage, response.status, errorCode, details);
};

/**
 * API client with common configuration
 */
export const api = {
  /**
   * Make API request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<any>}
   */
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      body = null,
      headers = {},
      auth: requireAuth = true,
      timeout = API_CONFIG.timeout,
      ...fetchOptions
    } = options;
    
    // Build URL
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${API_CONFIG.baseUrl}${endpoint}`;
    
    // Build headers
    const requestHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };
    
    // Add auth token if required
    if (requireAuth) {
      const token = await getAuthToken();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }
    
    // Build fetch options
    const fetchOpts = {
      method,
      headers: requestHeaders,
      ...fetchOptions,
    };
    
    // Add body for non-GET requests
    if (body && method !== 'GET') {
      fetchOpts.body = typeof body === 'string' ? body : JSON.stringify(body);
    }
    
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    fetchOpts.signal = controller.signal;
    
    try {
      const response = await fetch(url, fetchOpts);
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        await handleErrorResponse(response);
      }
      
      return parseResponse(response);
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new ApiError('Request timed out', 408);
      }
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Network error
      throw new ApiError(ERROR_MESSAGES.networkError, 0);
    }
  },
  
  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<any>}
   */
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  },
  
  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} body - Request body
   * @param {Object} options - Request options
   * @returns {Promise<any>}
   */
  post(endpoint, body = {}, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  },
  
  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} body - Request body
   * @param {Object} options - Request options
   * @returns {Promise<any>}
   */
  put(endpoint, body = {}, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  },
  
  /**
   * PATCH request
   * @param {string} endpoint - API endpoint
   * @param {Object} body - Request body
   * @param {Object} options - Request options
   * @returns {Promise<any>}
   */
  patch(endpoint, body = {}, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body });
  },
  
  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<any>}
   */
  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  },
};

// ===================
// API Endpoints
// ===================

/**
 * AI API endpoints
 */
export const aiApi = {
  /**
   * Send message to AI
   * @param {Object} data - Message data
   * @returns {Promise<Response>} Streaming response
   */
  async sendMessage(data) {
    const token = await getAuthToken();
    
    return fetch(API_CONFIG.endpoints.aiRespond, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  },
};

/**
 * Validation API endpoints
 */
export const validationApi = {
  /**
   * Check username availability
   * @param {string} username - Username to check
   * @returns {Promise<{available: boolean}>}
   */
  checkUsername(username) {
    return api.post(API_CONFIG.endpoints.validateUsername, { username }, { auth: false });
  },
  
  /**
   * Check email availability
   * @param {string} email - Email to check
   * @returns {Promise<{available: boolean}>}
   */
  checkEmail(email) {
    return api.post(API_CONFIG.endpoints.validateEmail, { email }, { auth: false });
  },
};

/**
 * Health check endpoint
 */
export const healthApi = {
  /**
   * Check API health
   * @returns {Promise<{status: string}>}
   */
  check() {
    return api.get(API_CONFIG.endpoints.health, { auth: false });
  },
};

export default api;
