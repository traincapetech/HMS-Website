// app.api.js
import axios from "axios";

// Use environment-based URL or fallback to local development
const API_BASE_URL = "https://hms-backend-1-pngp.onrender.com/api"; // Production backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically add authentication token
api.interceptors.request.use((config) => {
  // For multipart/form-data requests, don't modify the Content-Type header
  if (config.headers["Content-Type"] === "multipart/form-data") {
    // Delete the default Content-Type so the browser can set it with the boundary
    delete config.headers["Content-Type"];
  }

  // Check for admin routes first
  if (config.url?.includes('/admin')) {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
      return config;
    }
  }
  
  // Check for doctor routes next
  if (config.url?.includes('/doctors')) {
    const doctorToken = localStorage.getItem("doctorToken");
    if (doctorToken) {
      config.headers.Authorization = `Bearer ${doctorToken}`;
      return config;
    }
  }
  
  // Otherwise use regular user token
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors for debugging
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;