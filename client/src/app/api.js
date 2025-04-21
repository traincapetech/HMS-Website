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
  const token = localStorage.getItem('doctorToken') || localStorage.getItem('token') || localStorage.getItem('adminToken');
  
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
    console.log('[DEBUG API] Request with auth token to:', req.url);
  } else {
    console.log('[DEBUG API] Request without auth token to:', req.url);
  }
  
  return req;
});

// Add response interceptor for logging
API.interceptors.response.use(
  (response) => {
    console.log(`[DEBUG API] Response from ${response.config.url}:`, {
      status: response.status,
      headers: response.headers,
      dataType: typeof response.data,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error(`[DEBUG API] Error from ${error.config?.url || 'unknown endpoint'}:`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Handle API errors
const handleApiError = (error) => {
  console.log('[DEBUG API] API Error: ', error.response?.data || error.message);
  throw error;
};

// Doctor APIs
export const registerDoctor = (formData) => {
  console.log('[DEBUG API] Registering doctor:', formData.Name || formData.Email);
  
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
  
  return API.post('/api/doctor/register', data)
    .catch(handleApiError);
};

export const loginDoctor = (credentials) => {
  console.log('[DEBUG API] Doctor login attempt:', credentials.Email);
  return API.post('/api/doctor/login', credentials)
    .catch(handleApiError);
};

export const getDoctorProfile = () => {
  console.log('[DEBUG API] Fetching doctor profile');
  // Try the doctor ID endpoint if available
  const doctorData = localStorage.getItem('doctor');
  if (doctorData) {
    try {
      const doctor = JSON.parse(doctorData);
      const doctorId = doctor._id || doctor.id;
      if (doctorId) {
        console.log('[DEBUG API] Using doctor ID for profile fetch:', doctorId);
        return API.get(`/api/doctor/${doctorId}`)
          .catch((error) => {
            console.warn('[DEBUG API] Failed to fetch by ID, trying generic profile endpoint');
            return API.get('/api/doctor/profile').catch(handleApiError);
          });
      }
    } catch (error) {
      console.warn('[DEBUG API] Error parsing doctor data:', error);
    }
  }
  
  return API.get('/api/doctor/profile')
    .catch(handleApiError);
};

export const updateDoctorProfile = (updateData) => 
  API.put('/api/doctor/profile', updateData)
    .catch(handleApiError);

// Additional functions for doctor dashboard
export const getDoctorStatistics = (doctorId) => {
  console.log('[DEBUG API] Fetching doctor statistics for ID:', doctorId);
  if (!doctorId) {
    console.warn('[DEBUG API] Missing doctor ID for statistics');
    return Promise.reject(new Error('Doctor ID is required'));
  }
  
  // First try direct doctor info
  return API.get(`/api/doctor/${doctorId}`)
    .then(response => {
      console.log('[DEBUG API] Got doctor info, extracting statistics');
      // Try to extract statistics from doctor data
      const data = response.data;
      return {
        data: {
          totalPatients: Array.isArray(data.patients) ? data.patients.length : 0,
          todayAppointments: Array.isArray(data.appointments) ? 
            data.appointments.filter(a => {
              const today = new Date().toISOString().split('T')[0];
              const appDate = new Date(a.date).toISOString().split('T')[0]; 
              return appDate === today;
            }).length : 0,
          pendingPrescriptions: Array.isArray(data.prescriptions) ? 
            data.prescriptions.filter(p => p.status === 'pending').length : 0
        }
      };
    })
    .catch(error => {
      console.warn('[DEBUG API] Error fetching doctor info, trying appoint endpoint');
      
      // Try the appoint endpoint for appointments
      return API.get(`/api/appoint/doctor/${doctorId}`)
        .then(response => {
          console.log('[DEBUG API] Got appointments from appoint endpoint:', response.data.length);
          
          // Filter today's appointments
          const today = new Date().toISOString().split('T')[0];
          const todayAppointments = Array.isArray(response.data) ? 
            response.data.filter(a => {
              const appDate = new Date(a.date).toISOString().split('T')[0]; 
              return appDate === today;
            }) : [];
            
          return {
            data: {
              totalPatients: 0, // We don't have this info
              todayAppointments: todayAppointments.length,
              pendingPrescriptions: 0 // We don't have this info
            }
          };
        })
        .catch(error => {
          console.warn('[DEBUG API] Error with appoint endpoint, returning fallback');
          return {
            data: {
              totalPatients: 0,
              todayAppointments: 0,
              pendingPrescriptions: 0
            }
          };
        });
    });
};

export const getDoctorAppointments = (doctorId, filter = '', date = '') => {
  console.log('[DEBUG API] Fetching doctor appointments:', { doctorId, filter, date });
  
  if (!doctorId) {
    console.warn('[DEBUG API] Missing doctor ID for appointments');
    return Promise.reject(new Error('Doctor ID is required'));
  }
  
  // Try the appoint endpoint directly
  let url = `/api/appoint/doctor/${doctorId}`;
  const params = new URLSearchParams();
  
  if (filter) params.append('status', filter);
  if (date) params.append('date', date);
  
  const queryString = params.toString();
  if (queryString) url += `?${queryString}`;
  
  return API.get(url)
    .catch(error => {
      console.warn('[DEBUG API] Error with appoint endpoint, trying doctor endpoint');
      // Fallback to doctor endpoint
      return API.get(`/api/doctor/${doctorId}`)
        .then(response => {
          if (response.data && Array.isArray(response.data.appointments)) {
            let appointments = response.data.appointments;
            
            // Apply filters if needed
            if (filter) {
              appointments = appointments.filter(a => a.status === filter);
            }
            
            if (date) {
              const filterDate = new Date(date).toISOString().split('T')[0];
              appointments = appointments.filter(a => {
                const appDate = new Date(a.date).toISOString().split('T')[0];
                return appDate === filterDate;
              });
            }
            
            return { data: appointments };
          }
          throw new Error('No appointments found in doctor data');
        })
        .catch(handleApiError);
    });
};

export const updateAppointmentStatus = (appointmentId, status) => 
  API.put(`/api/appoint/${appointmentId}/status`, { status })
    .catch(handleApiError);

export const addPrescription = (appointmentId, prescriptionData) => 
  API.post(`/api/prescription/create`, { 
    appointmentId, 
    ...prescriptionData 
  })
  .catch(handleApiError);

// Patient APIs
export const getPatientAppointments = (patientId) => {
  console.log('[DEBUG API] Fetching patient appointments for ID:', patientId);
  return API.get(`/api/appoint/patient/${patientId}`)
    .catch(handleApiError);
};

export const bookAppointment = (appointmentData) => {
  console.log('[DEBUG API] Booking appointment:', appointmentData);
  return API.post('/api/appoint/create', appointmentData)
    .catch(handleApiError);
};

// Utility to get structured debug information
export const getApiDebugInfo = () => {
  return {
    apiUrl: getApiUrl(),
    isAuthenticated: {
      doctor: !!localStorage.getItem('doctorToken'),
      patient: !!localStorage.getItem('token'),
      admin: !!localStorage.getItem('adminToken')
    },
    localStorage: {
      doctorEmail: localStorage.getItem('doctorEmail'),
      hasDoctor: !!localStorage.getItem('doctor'),
      hasPatient: !!localStorage.getItem('user')
    }
  };
};

export default API; 