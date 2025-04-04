/**
 * Runtime environment configuration
 * This script is loaded in index.html and populates window.__env with environment variables
 */
(function(window) {
  // Default configuration to use when environment variables are not available
  window.__env = window.__env || {};
  
  // API URLs
  window.__env.REACT_APP_API_URL = 'https://hms-backend-1-pngp.onrender.com/api';
  
  // Auto-detect API URL from current location (useful for development/testing)
  try {
    const currentHost = window.location.hostname;
    
    // If not localhost and not using the production URL, try to detect local API
    if (currentHost !== 'localhost' && 
        currentHost !== '127.0.0.1' && 
        !currentHost.includes('hms-backend-1-pngp.onrender.com')) {
      
      // Use the same hostname but with API port (useful for local development)
      const apiPort = 3001; // Adjust based on your API port
      window.__env.REACT_APP_API_URL = `http://${currentHost}:${apiPort}/api`;
      
      console.log('Auto-detected API URL:', window.__env.REACT_APP_API_URL);
    }
  } catch (error) {
    console.warn('Error auto-detecting API URL:', error);
  }
  
  console.log('Environment config loaded:', window.__env);
})(window); 