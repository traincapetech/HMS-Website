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
  // Check for admin routes first
  if (config.url?.includes('/admin')) {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
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

export default api;