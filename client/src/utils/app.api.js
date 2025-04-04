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

export default api;
export { API_BASE_URL };