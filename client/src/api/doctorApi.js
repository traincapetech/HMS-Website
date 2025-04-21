import axios from 'axios';
import { getCurrentDoctor } from '../utils/authUtils';

const BASE_URL = 'https://hms-backend-1-pngp.onrender.com/api';
// Define alternative base URLs to try
const ALT_BASE_URLS = [
  'https://hms-backend-1-pngp.onrender.com/api',
  'https://hms-backend-1-pngp.onrender.com',
  'https://hms-backend-1-pngp.onrender.com/v1/api',
  'https://hms-backend-1-pngp.onrender.com/v1'
];

// Create a diagnostic interface to track API calls
const apiCallLog = [];
const logApiCall = (endpoint, method, id, result) => {
  const entry = {
    timestamp: new Date().toISOString(),
    endpoint,
    method,
    id,
    success: result?.success || false,
    status: result?.status,
    error: result?.error,
  };
  
  console.log(`[API LOG] ${method} ${endpoint} → ${entry.success ? 'SUCCESS' : 'FAILED'}`);
  apiCallLog.push(entry);
  
  // Keep log to last 100 entries
  if (apiCallLog.length > 100) {
    apiCallLog.shift();
  }
  
  return result;
};

// Export special diagnostic function that doesn't depend on any imports
export const getDiagnostics = () => {
  return {
    apiLog: apiCallLog,
    baseUrl: BASE_URL,
    altBaseUrls: ALT_BASE_URLS,
    authStatus: {
      doctorToken: !!localStorage.getItem('doctorToken'),
      doctorData: !!localStorage.getItem('doctor'),
      doctorEmail: localStorage.getItem('doctorEmail')
    }
  };
};

// Configure axios instance with auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('doctorToken');
  
  // Debug token information
  if (token) {
    try {
      console.log('[DEBUG] Token details:');
      console.log(`[DEBUG] Token length: ${token.length}`);
      console.log(`[DEBUG] Token first 20 chars: ${token.substring(0, 20)}...`);
      
      // Check token parts
      const parts = token.split('.');
      console.log(`[DEBUG] Token has ${parts.length} parts`);
      
      if (parts.length === 3) {
        try {
          const payload = JSON.parse(atob(parts[1]));
          console.log('[DEBUG] Token payload:', payload);
          
          // Check expiration
          if (payload.exp) {
            const expDate = new Date(payload.exp * 1000);
            const now = new Date();
            console.log(`[DEBUG] Token expires: ${expDate}`);
            console.log(`[DEBUG] Token ${expDate > now ? 'is valid' : 'has expired'}`);
          }
        } catch (e) {
          console.warn('[DEBUG] Could not parse token payload:', e);
        }
      }
    } catch (e) {
      console.error('[DEBUG] Error inspecting token:', e);
    }
  } else {
    console.warn('[DEBUG] No token found in localStorage');
  }
  
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Safe function to get doctor ID with fallback
const getDoctorId = () => {
  console.log('[DEBUG] Starting doctor ID resolution process');
  
  // Try to get doctor ID from localStorage
  const doctorData = getCurrentDoctor();
  console.log('[DEBUG] Doctor data from localStorage:', doctorData);
  
  if (!doctorData) {
    console.warn('[DEBUG] No doctor data found in localStorage');
    return null;
  }
  
  // First try to get ID from JWT token
  const token = localStorage.getItem('doctorToken');
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('[DEBUG] JWT token payload:', payload);
      if (payload.userId || payload.id || payload._id || payload.doctorId) {
        const tokenId = payload.userId || payload.id || payload._id || payload.doctorId;
        console.log('[DEBUG] Found doctor ID from JWT:', tokenId);
        return tokenId;
      }
    } catch (e) {
      console.warn('[DEBUG] Could not parse JWT token:', e);
    }
  }
  
  // Check for various ID field names that might be used
  const possibleIds = {
    '_id': doctorData._id,
    'id': doctorData.id,
    'Id': doctorData.Id,
    'doctorId': doctorData.doctorId
  };
  
  console.log('[DEBUG] Checking possible ID fields:', possibleIds);
  
  for (const [field, value] of Object.entries(possibleIds)) {
    if (value) {
      console.log(`[DEBUG] Found doctor ID in field '${field}':`, value);
      return value;
    }
  }
  
  // If we found doctor data but no ID, use email as fallback
  if (doctorData.Email || doctorData.email) {
    const email = doctorData.Email || doctorData.email;
    console.log('[DEBUG] Using email as fallback identifier:', email);
    return email;
  }
  
  // If we found doctor data but no ID, log the structure to help debugging
  console.warn('[DEBUG] Doctor data found but no ID field present. Available fields:', Object.keys(doctorData));
  console.warn('[DEBUG] Full doctor data:', JSON.stringify(doctorData, null, 2));
  
  return null;
};

// Get doctor's statistics (patients, appointments, prescriptions)
export const getDoctorStatistics = async (doctorId = getDoctorId()) => {
  console.log('[DEBUG] Starting statistics fetch for doctor:', doctorId);
  
  try {
    const doctorData = getCurrentDoctor();
    console.log('[DEBUG] Current doctor data:', doctorData);
    
    // If no doctor ID, try to fetch a summary without it
    if (!doctorId) {
      console.warn('[DEBUG] Missing doctor ID for statistics fetch, attempting fallback methods');
      
      // Try all combination of base URLs and endpoints
      for (const baseUrl of ALT_BASE_URLS) {
        // Try direct access to doctor/all first
        try {
          console.log(`[DEBUG] Trying basic endpoint - GET ${baseUrl}/doctor/all`);
          const response = await axios.get(`${baseUrl}/doctor/all`, {
            headers: getAuthHeader()
          });
          
          // Log this API call
          logApiCall(`${baseUrl}/doctor/all`, 'GET', null, {
            success: true,
            status: response.status,
            data: response.data
          });
          
          console.log('[DEBUG] Response from /doctor/all endpoint:', response.data);
          // Extract doctor info from list
          if (Array.isArray(response.data) && response.data.length > 0) {
            // Find the right doctor using email
            const email = doctorData?.email || doctorData?.Email;
            const foundDoctor = response.data.find(d => 
              (d.email === email || d.Email === email)
            );
            
            if (foundDoctor) {
              console.log('[DEBUG] Found doctor in list:', foundDoctor);
              // We can possibly use this ID now
              const foundId = foundDoctor._id || foundDoctor.id;
              if (foundId) {
                console.log(`[DEBUG] Using found doctor ID: ${foundId}`);
                // Try again with this ID
                const statsResponse = await getDoctorStatistics(foundId);
                return statsResponse;
              }
            }
          }
        } catch (basicError) {
          // Log this failed API call
          logApiCall(`${baseUrl}/doctor/all`, 'GET', null, {
            success: false,
            error: basicError.message
          });
          
          console.warn('[DEBUG] Basic endpoint failed:', basicError.message);
        }
        
        const endpoints = [
          { url: `${baseUrl}/doctor/statistics`, type: 'token-based' },
          { url: `${baseUrl}/doctors/statistics`, type: 'plural-base' },
          // Try direct controller endpoints based on doctorRoutes.js
          { url: `${baseUrl}/doctor/statistics/${doctorId}`, type: 'doctor-stats' },
          { url: `${baseUrl}/doctors/statistics/${doctorId}`, type: 'plural-doctor-stats' },
          { url: `${baseUrl}/doctor/all/${doctorId}/stats`, type: 'custom-path' }
        ];
        
        for (const endpoint of endpoints) {
          try {
            console.log(`[DEBUG] Trying ${endpoint.type} endpoint with base ${baseUrl}:`, endpoint.url);
            const response = await axios.get(endpoint.url, {
              headers: getAuthHeader()
            });
            console.log(`[DEBUG] Successful response from ${endpoint.type}:`, response.data);
            return response.data;
          } catch (endpointError) {
            console.warn(`[DEBUG] ${endpoint.type} endpoint with base ${baseUrl} failed:`, endpointError.message);
          }
        }
      }
      
      console.warn('[DEBUG] All fallback methods failed, returning default statistics');
      return {
        success: true,
        data: {
          totalPatients: 0,
          todayAppointments: 0,
          pendingPrescriptions: 0
        }
      };
    }
    
    // Try directly with the endpoints used in doctor.route.js
    try {
      console.log(`[DEBUG] Trying main doctor API endpoint - GET ${BASE_URL}/doctor/${doctorId}`);
      const doctorResponse = await axios.get(`${BASE_URL}/doctor/${doctorId}`, {
        headers: getAuthHeader()
      });
      console.log('[DEBUG] Doctor info response:', doctorResponse.data);
      
      // If we get doctor info, we might be able to extract related statistics from it
      if (doctorResponse.data) {
        const doctorInfo = doctorResponse.data;
        
        // Check if statistic data is embedded in the doctor response
        if (doctorInfo.patients || doctorInfo.appointments) {
          console.log('[DEBUG] Found statistics in doctor response:', {
            patients: doctorInfo.patients?.length || 0,
            appointments: doctorInfo.appointments?.length || 0
          });
          
          return {
            success: true,
            data: {
              totalPatients: Array.isArray(doctorInfo.patients) ? doctorInfo.patients.length : 0,
              todayAppointments: Array.isArray(doctorInfo.appointments) ? 
                doctorInfo.appointments.filter(a => {
                  // Filter today's appointments
                  const today = new Date().toISOString().split('T')[0];
                  const appointmentDate = new Date(a.date).toISOString().split('T')[0];
                  return appointmentDate === today;
                }).length : 0,
              pendingPrescriptions: Array.isArray(doctorInfo.prescriptions) ? 
                doctorInfo.prescriptions.filter(p => p.status === 'pending').length : 0
            }
          };
        }
      }
    } catch (directError) {
      console.warn('[DEBUG] Direct doctor info endpoint failed:', directError.message);
    }
    
    // Try all combinations of base URLs and endpoints with doctor ID
    for (const baseUrl of ALT_BASE_URLS) {
      const mainEndpoints = [
        { url: `${baseUrl}/doctor/statistics/${doctorId}`, type: 'id-based' },
        { url: `${baseUrl}/doctors/statistics/${doctorId}`, type: 'alt-id' },
        { url: `${baseUrl}/doctor/${doctorId}/statistics`, type: 'restful-id' },
        { url: `${baseUrl}/doctors/${doctorId}/statistics`, type: 'alt-restful-id' },
      ];
      
      for (const endpoint of mainEndpoints) {
        try {
          console.log(`[DEBUG] Trying ${endpoint.type} endpoint with base ${baseUrl}:`, endpoint.url);
          const response = await axios.get(endpoint.url, {
            headers: getAuthHeader()
          });
          console.log(`[DEBUG] Successful response from ${endpoint.type}:`, response.data);
          return response.data;
        } catch (endpointError) {
          console.warn(`[DEBUG] ${endpoint.type} endpoint with base ${baseUrl} failed:`, endpointError.message);
          console.warn(`[DEBUG] Error details:`, {
            status: endpointError.response?.status,
            statusText: endpointError.response?.statusText,
            data: endpointError.response?.data
          });
        }
      }
    }
    
    throw new Error('All endpoints failed');
  } catch (error) {
    console.error('[DEBUG] Fatal error fetching doctor statistics:', error);
    console.error('[DEBUG] Stack trace:', error.stack);
    return {
      success: true,
      data: {
        totalPatients: 0,
        todayAppointments: 0,
        pendingPrescriptions: 0
      }
    };
  }
};

// Get doctor's appointments for today
export const getDoctorTodayAppointments = async (doctorId = getDoctorId()) => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    const doctorData = getCurrentDoctor();
    
    console.log(`[DEBUG] Attempting to fetch today's appointments for doctor ID: ${doctorId}`);
    console.log(`[DEBUG] Today's date: ${today}`);
    console.log(`[DEBUG] Using auth header:`, getAuthHeader());
    
    // Try direct appoint endpoint
    try {
      const appointmentUrl = `${BASE_URL}/appoint/doctor/${doctorId}`;
      console.log(`[DEBUG] Trying main appointment endpoint: ${appointmentUrl}`);
      const appointmentResponse = await axios.get(appointmentUrl, {
        headers: getAuthHeader()
      });
      
      console.log('[DEBUG] Appointment response:', appointmentResponse.data);
      
      if (appointmentResponse.data && Array.isArray(appointmentResponse.data)) {
        // Filter for today's appointments
        const todaysAppointments = appointmentResponse.data.filter(appointment => {
          const appointmentDate = new Date(appointment.date).toISOString().split('T')[0];
          return appointmentDate === today;
        });
        
        console.log(`[DEBUG] Filtered ${todaysAppointments.length} appointments for today`);
        
        return {
          success: true,
          data: todaysAppointments
        };
      }
    } catch (directError) {
      console.warn('[DEBUG] Direct appointment endpoint failed:', directError.message);
    }
    
    // Try all base URLs with all endpoint patterns
    for (const baseUrl of ALT_BASE_URLS) {
      console.log(`[DEBUG] Trying base URL: ${baseUrl}`);
      
      // Try multiple endpoints in sequence
      const endpoints = [
        `${baseUrl}/doctor/appointments/${doctorId}?date=${today}`,
        `${baseUrl}/doctors/appointments/${doctorId}?date=${today}`,
        `${baseUrl}/appoint/doctor/${doctorId}`,
        `${baseUrl}/appointments/doctor/${doctorId}?date=${today}`,
        `${baseUrl}/appointments?doctorId=${doctorId}&date=${today}`,
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`[DEBUG] Trying endpoint: ${endpoint}`);
          const response = await axios.get(endpoint, {
            headers: getAuthHeader()
          });
          
          console.log(`[DEBUG] Response from ${endpoint}:`, response.data);
          
          if (response.data) {
            let appointments = response.data;
            
            // If it's an array, check if we need to filter for today
            if (Array.isArray(appointments) && !endpoint.includes('date=')) {
              appointments = appointments.filter(appointment => {
                const appointmentDate = new Date(appointment.date).toISOString().split('T')[0];
                return appointmentDate === today;
              });
              console.log(`[DEBUG] Filtered to ${appointments.length} appointments for today`);
            }
            
            return {
              success: true,
              data: appointments
            };
          }
        } catch (error) {
          console.warn(`[DEBUG] Endpoint ${endpoint} failed:`, error.message);
        }
      }
    }
    
    // If all attempts failed, return empty array
    console.warn('[DEBUG] All appointment endpoints failed, returning empty data');
    return {
      success: true,
      data: []
    };
  } catch (error) {
    console.error('[DEBUG] Error fetching appointments:', error);
    return {
      success: false,
      message: error.message,
      data: []
    };
  }
};

// Get doctor's patients
export const getDoctorPatients = async (doctorId = getDoctorId()) => {
  try {
    console.log(`[DEBUG] Fetching patients for doctor: ${doctorId}`);
    
    // Try direct approach with doctor id endpoint
    try {
      console.log(`[DEBUG] Trying direct doctor endpoint - GET ${BASE_URL}/doctor/${doctorId}`);
      const response = await axios.get(`${BASE_URL}/doctor/${doctorId}`, {
        headers: getAuthHeader()
      });
      
      console.log('[DEBUG] Doctor response:', response.data);
      
      // If doctor data contains patients
      if (response.data && response.data.patients && Array.isArray(response.data.patients)) {
        console.log(`[DEBUG] Found ${response.data.patients.length} patients in doctor data`);
        return {
          success: true,
          data: response.data.patients
        };
      }
    } catch (directError) {
      console.warn('[DEBUG] Direct doctor endpoint failed:', directError.message);
    }
    
    // Try direct add_patient endpoint
    try {
      console.log(`[DEBUG] Trying add_patient endpoint - GET ${BASE_URL}/add_patient/doctor/${doctorId}`);
      const response = await axios.get(`${BASE_URL}/add_patient/doctor/${doctorId}`, {
        headers: getAuthHeader()
      });
      
      console.log('[DEBUG] add_patient response:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        console.log(`[DEBUG] Found ${response.data.length} patients from add_patient endpoint`);
        return {
          success: true,
          data: response.data
        };
      }
    } catch (addPatientError) {
      console.warn('[DEBUG] add_patient endpoint failed:', addPatientError.message);
    }
    
    // Try all base URLs with all endpoint patterns
    for (const baseUrl of ALT_BASE_URLS) {
      const endpoints = [
        `${baseUrl}/doctor/patients/${doctorId}`,
        `${baseUrl}/doctors/patients/${doctorId}`,
        `${baseUrl}/doctor/${doctorId}/patients`,
        `${baseUrl}/doctors/${doctorId}/patients`,
        `${baseUrl}/patients/doctor/${doctorId}`,
        `${baseUrl}/add_patient/doctor/${doctorId}`
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`[DEBUG] Trying endpoint: ${endpoint}`);
          const response = await axios.get(endpoint, {
            headers: getAuthHeader()
          });
          
          console.log(`[DEBUG] Response from ${endpoint}:`, response.data);
          
          if (response.data) {
            return {
              success: true,
              data: Array.isArray(response.data) ? response.data : []
            };
          }
        } catch (error) {
          console.warn(`[DEBUG] Endpoint ${endpoint} failed:`, error.message);
        }
      }
    }
    
    // Return empty array if all endpoints fail
    console.warn('[DEBUG] All patient endpoints failed, returning empty data');
    return {
      success: true,
      data: []
    };
  } catch (error) {
    console.error('[DEBUG] Error fetching patients:', error);
    return {
      success: false,
      message: error.message,
      data: []
    };
  }
};

// Get doctor's pending prescriptions
export const getDoctorPendingPrescriptions = async (doctorId = getDoctorId()) => {
  try {
    console.log(`[DEBUG] Fetching pending prescriptions for doctor: ${doctorId}`);
    
    // Try direct prescription endpoint
    try {
      console.log(`[DEBUG] Trying prescription endpoint - GET ${BASE_URL}/prescription/doctor/${doctorId}`);
      const response = await axios.get(`${BASE_URL}/prescription/doctor/${doctorId}`, {
        headers: getAuthHeader()
      });
      
      console.log('[DEBUG] Prescription response:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        // Filter only pending prescriptions
        const pendingPrescriptions = response.data.filter(p => 
          p.status === 'pending' || p.status === 'Pending'
        );
        
        console.log(`[DEBUG] Found ${pendingPrescriptions.length} pending prescriptions out of ${response.data.length} total`);
        
        return {
          success: true,
          data: pendingPrescriptions
        };
      }
    } catch (directError) {
      console.warn('[DEBUG] Direct prescription endpoint failed:', directError.message);
    }
    
    // Try all base URLs with all endpoint patterns
    for (const baseUrl of ALT_BASE_URLS) {
      const endpoints = [
        `${baseUrl}/doctor/prescriptions/pending/${doctorId}`,
        `${baseUrl}/doctors/prescriptions/pending/${doctorId}`,
        `${baseUrl}/doctor/${doctorId}/prescriptions/pending`,
        `${baseUrl}/doctors/${doctorId}/prescriptions/pending`,
        `${baseUrl}/prescriptions/doctor/${doctorId}?status=pending`,
        `${baseUrl}/prescription/doctor/${doctorId}`,
        `${baseUrl}/prescriptions?doctorId=${doctorId}&status=pending`
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`[DEBUG] Trying endpoint: ${endpoint}`);
          const response = await axios.get(endpoint, {
            headers: getAuthHeader()
          });
          
          console.log(`[DEBUG] Response from ${endpoint}:`, response.data);
          
          if (response.data) {
            let prescriptions = response.data;
            
            // If it's an array and doesn't include status=pending in URL, filter for pending status
            if (Array.isArray(prescriptions) && !endpoint.includes('status=pending')) {
              prescriptions = prescriptions.filter(p => 
                p.status === 'pending' || p.status === 'Pending'
              );
              console.log(`[DEBUG] Filtered to ${prescriptions.length} pending prescriptions`);
            }
            
            return {
              success: true,
              data: prescriptions
            };
          }
        } catch (error) {
          console.warn(`[DEBUG] Endpoint ${endpoint} failed:`, error.message);
        }
      }
    }
    
    // Return empty array if all endpoints fail
    console.warn('[DEBUG] All prescription endpoints failed, returning empty data');
    return {
      success: true,
      data: []
    };
  } catch (error) {
    console.error('[DEBUG] Error fetching prescriptions:', error);
    return {
      success: false,
      message: error.message,
      data: []
    };
  }
};

export const getDoctorByEmail = async (email) => {
  try {
    const token = localStorage.getItem('doctorToken');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    // Since you may not have a direct endpoint for finding by email,
    // We can get all doctors and filter by email (only works for a few doctors)
    // Alternatively, your backend should provide a dedicated endpoint
    const response = await fetch(`${BASE_URL}/doctors`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch doctors: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Find the doctor with matching email - handle different response formats
    let doctor = null;
    
    if (data.doctor && Array.isArray(data.doctor)) {
      doctor = data.doctor.find(doc => doc.Email === email);
    } else if (Array.isArray(data)) {
      doctor = data.find(doc => doc.Email === email);
    } else if (data.doctors && Array.isArray(data.doctors)) {
      doctor = data.doctors.find(doc => doc.Email === email);
    }
    
    if (!doctor) {
      throw new Error(`Doctor with email ${email} not found`);
    }
    
    console.log("Doctor data fetched by email:", doctor);
    return doctor;
  } catch (error) {
    console.error("Error fetching doctor by email:", error);
    throw error;
  }
};

// At the end of the file, add this diagnostic route to help identify routing issues
export const checkRoutes = async () => {
  const routesToCheck = [
    { route: '/api/doctor/all', method: 'GET' },
    { route: '/api/doctor/:id', method: 'GET', param: 'DOCTOR_ID' },
    { route: '/api/appoint/doctor/:id', method: 'GET', param: 'DOCTOR_ID' },
    { route: '/api/prescription/doctor/:id', method: 'GET', param: 'DOCTOR_ID' }
  ];
  
  const results = [];
  const doctorId = getDoctorId() || 'test';
  
  for (const routeInfo of routesToCheck) {
    try {
      let route = routeInfo.route;
      
      // Replace parameters
      if (routeInfo.param === 'DOCTOR_ID') {
        route = route.replace(':id', doctorId);
      }
      
      const url = `${BASE_URL}${route}`;
      console.log(`[ROUTE CHECK] Testing ${routeInfo.method} ${url}`);
      
      const response = await axios({
        method: routeInfo.method,
        url,
        headers: getAuthHeader(),
        timeout: 5000 // Set timeout to 5 seconds
      });
      
      results.push({
        route,
        method: routeInfo.method,
        status: response.status,
        success: true,
        data: typeof response.data === 'object' ? 'object' : response.data
      });
      
    } catch (error) {
      results.push({
        route: routeInfo.route,
        method: routeInfo.method,
        status: error.response?.status,
        success: false,
        error: error.message
      });
    }
  }
  
  return {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    results
  };
}; 