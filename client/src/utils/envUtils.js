/**
 * Environment variable utility module for safe browser access
 */

/**
 * Safely retrieves an environment variable with fallback
 * @param {string} key - The environment variable key to retrieve
 * @param {string} defaultValue - Default value if not found
 * @returns {string} The value of the environment variable or the default
 */
export const getEnv = (key, defaultValue = '') => {
  // Check if window.ENV_CONFIG is available (for runtime-injected env vars)
  // This has highest priority as it's dynamically injected at runtime
  if (typeof window !== 'undefined' && window.ENV_CONFIG && window.ENV_CONFIG[key]) {
    return window.ENV_CONFIG[key];
  }
  
  // Check if window.__env is available (alternate runtime env vars)
  if (typeof window !== 'undefined' && window.__env && window.__env[key]) {
    return window.__env[key];
  }
  
  // Check if process.env is available (for React environments)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  
  return defaultValue;
};

/**
 * Common environment variables used in the application
 */
export const ENV = {
  // Use the runtime-injected API URL or fallback to the production URL
  API_URL: getEnv('REACT_APP_API_URL', 'https://hms-backend-1-pngp.onrender.com/api'),
  NODE_ENV: getEnv('NODE_ENV', 'production'),
  IS_DEV: getEnv('NODE_ENV') === 'development',
  IS_PROD: getEnv('NODE_ENV') === 'production' || getEnv('NODE_ENV') === '',
};

/**
 * Returns if the current environment is development
 * @returns {boolean} True if in development mode
 */
export const isDev = () => ENV.IS_DEV;

/**
 * Returns if the current environment is production
 * @returns {boolean} True if in production mode
 */
export const isProd = () => ENV.IS_PROD;

export default {
  getEnv,
  ENV,
  isDev,
  isProd
}; 