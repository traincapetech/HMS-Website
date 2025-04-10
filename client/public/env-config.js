/**
 * Runtime environment configuration
 * This script is loaded in index.html and populates window.__env with environment variables
 */
(function(window) {
  // Default configuration for local development
  const defaultConfig = {
    // Default API URL if not set by environment
    REACT_APP_API_URL: "https://hms-backend-1-pngp.onrender.com/api",
  };

  try {
    // Auto-detect API URL based on current host
    const currentHost = window.location.hostname;
    if (currentHost && !currentHost.includes('localhost')) {
      // If we're on a custom domain, update the API URL
      if (currentHost === 'tamdhealth.com') {
        defaultConfig.REACT_APP_API_URL = "https://hms-backend-1-pngp.onrender.com/api";
        console.log("Auto-detected production environment on tamdhealth.com");
      }
    } else {
      // Local development
      console.log("Auto-detected local development environment");
    }
  } catch (error) {
    console.warn("Error auto-detecting environment:", error);
  }

  // Create or update global ENV_CONFIG object
  window.ENV_CONFIG = window.ENV_CONFIG || defaultConfig;
  
  // Fill in any missing fields from defaultConfig
  Object.keys(defaultConfig).forEach(key => {
    if (window.ENV_CONFIG[key] === undefined) {
      window.ENV_CONFIG[key] = defaultConfig[key];
    }
  });

  console.log("Environment config loaded:", window.ENV_CONFIG);
})(window); 