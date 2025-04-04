import axios from 'axios';

// Safely check for environment variables or use fallbacks
const getApiUrl = () => {
  // Check if process.env is available
  if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  // Fallback to your production API URL
  return 'https://hms-backend-1-pngp.onrender.com';
};

// Set base URL for API requests
const API = axios.create({
  baseURL: getApiUrl(),
});

// Add request interceptor to include token in headers
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('doctorToken') || localStorage.getItem('patientToken') || localStorage.getItem('adminToken');
  
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  
  return req;
});

// Handle API errors
const handleApiError = (error) => {
  console.log('API Error: ', error.response?.data || error.message);
  throw error;
};

// Doctor APIs
export const registerDoctor = (formData) => {
  // Create FormData object for file uploads
  const data = new FormData();
  
  // Append all other form fields
  Object.keys(formData).forEach(key => {
    if (key !== 'image' && key !== 'document') {
      data.append(key, formData[key]);
    }
  });
  
  // Append file fields if they exist
  if (formData.image) {
    data.append('image', formData.image);
  }
  
  if (formData.document) {
    data.append('document', formData.document);
  }
  
  return API.post('/api/doctors/register', data)
    .catch(handleApiError);
};

export const loginDoctor = (credentials) => 
  API.post('/api/doctors/login', credentials)
    .catch(handleApiError);

export const getDoctorProfile = () => 
  API.get('/api/doctors/profile')
    .catch(handleApiError);

export const updateDoctorProfile = (updateData) => 
  API.put('/api/doctors/profile', updateData)
    .catch(handleApiError);

// Additional functions for doctor dashboard
export const getDoctorStatistics = (doctorId) => 
  API.get(`/api/doctors/statistics/${doctorId}`)
    .catch(handleApiError);

export const getDoctorAppointments = (doctorId, filter = '', date = '') => {
  let url = `/api/doctors/appointments/${doctorId}`;
  const params = new URLSearchParams();
  
  if (filter) params.append('status', filter);
  if (date) params.append('date', date);
  
  const queryString = params.toString();
  if (queryString) url += `?${queryString}`;
  
  return API.get(url).catch(handleApiError);
};

export const updateAppointmentStatus = (appointmentId, status) => 
  API.put(`/api/doctors/appointments/${appointmentId}/status`, { status })
    .catch(handleApiError);

export const addPrescription = (appointmentId, prescriptionData) => 
  API.post(`/api/doctors/appointments/${appointmentId}/prescription`, prescriptionData)
    .catch(handleApiError);

// Patient APIs
// (Add your patient API functions here)

// Admin APIs
// (Add your admin API functions here)

export default API; 