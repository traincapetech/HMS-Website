// app.api.js
import axios from "axios";

const API_BASE_URL = "https://hms-backend-1-pngp.onrender.com/api"; // Production backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically add authentication token (if using authentication)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Get token from local storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;