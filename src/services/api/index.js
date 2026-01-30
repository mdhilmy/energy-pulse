import axios from 'axios';
import { REQUEST_TIMEOUT, RETRY_CONFIG } from '../../config/api.config';

// Create axios instance with defaults
const api = axios.create({
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add timestamp to request for logging
    config.metadata = { startTime: new Date() };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with retry logic
api.interceptors.response.use(
  (response) => {
    // Log response time in development
    if (import.meta.env.DEV && response.config.metadata) {
      const duration = new Date() - response.config.metadata.startTime;
      console.log(`[API] ${response.config.url} - ${duration}ms`);
    }
    return response;
  },
  async (error) => {
    const { config, response } = error;

    // Don't retry if no config or max retries reached
    if (!config || config.__retryCount >= RETRY_CONFIG.maxRetries) {
      return Promise.reject(error);
    }

    // Initialize retry count
    config.__retryCount = config.__retryCount || 0;

    // Check if error is retryable
    if (
      !response ||
      !RETRY_CONFIG.retryableStatuses.includes(response.status)
    ) {
      return Promise.reject(error);
    }

    // Increment retry count
    config.__retryCount += 1;

    // Calculate delay with exponential backoff
    const delay = RETRY_CONFIG.retryDelay * Math.pow(2, config.__retryCount - 1);

    console.log(
      `[API Retry] Attempt ${config.__retryCount}/${RETRY_CONFIG.maxRetries} for ${config.url} after ${delay}ms`
    );

    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, delay));

    // Retry request
    return api(config);
  }
);

/**
 * Helper function to handle API errors consistently
 * @param {Error} error - Axios error object
 * @param {string} context - Context message for error
 * @returns {Error} Formatted error
 */
export const handleApiError = (error, context = '') => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || error.response.statusText;
    console.error(`[API Error] ${context}: ${message}`, error.response.data);
    return new Error(`${context}: ${message}`);
  } else if (error.request) {
    // Request made but no response received
    console.error(`[API Error] ${context}: No response received`, error.request);
    return new Error(`${context}: Network error - no response received`);
  } else {
    // Something else happened
    console.error(`[API Error] ${context}:`, error.message);
    return new Error(`${context}: ${error.message}`);
  }
};

/**
 * Make a GET request with error handling
 * @param {string} url - Request URL
 * @param {Object} config - Axios config
 * @returns {Promise} Response data
 */
export const get = async (url, config = {}) => {
  try {
    const response = await api.get(url, config);
    return response.data;
  } catch (error) {
    throw handleApiError(error, `GET ${url}`);
  }
};

/**
 * Make a POST request with error handling
 * @param {string} url - Request URL
 * @param {Object} data - Request body
 * @param {Object} config - Axios config
 * @returns {Promise} Response data
 */
export const post = async (url, data, config = {}) => {
  try {
    const response = await api.post(url, data, config);
    return response.data;
  } catch (error) {
    throw handleApiError(error, `POST ${url}`);
  }
};

export default api;
