// app.api.js
import axios from "axios";
import { ENV } from './envUtils';

// Use API URL from environment utility
const API_BASE_URL = ENV.API_URL;

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 unauthorized errors (token expired, etc)
    if (error.response && error.response.status === 401) {
      // Redirect to login or refresh token
      console.warn("Authentication expired");
    }
    return Promise.reject(error);
  }
);

/**
 * Get doctor image URL with proper fallback to avoid 500 errors
 * @param {string} doctorId - The doctor ID
 * @param {string} doctorName - The doctor name for fallback avatar
 * @returns {string} The image URL
 */
export const getDoctorImageUrl = (doctorId, doctorName) => {
  // Always use UI Avatars as a reliable fallback
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(doctorName || 'Doctor')}&background=f1f5f9&color=0f172a&size=128`;
  
  // Note: The backend image endpoint is currently causing 500 errors
  // If the backend endpoint is fixed in the future, this function can be updated to:
  // 
  // try {
  //   return `${API_BASE_URL}/doctor/${doctorId}/image`;
  // } catch (error) {
  //   return `https://ui-avatars.com/api/?name=${encodeURIComponent(doctorName || 'Doctor')}&background=f1f5f9&color=0f172a&size=128`;
  // }
};

export default api;
export { API_BASE_URL };