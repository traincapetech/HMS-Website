import axios from 'axios';
import { ENV } from './envUtils';

// Get API configuration information
export const getApiInfo = () => {
  return {
    baseUrl: ENV.API_URL,
    version: '1.0.0',
    environment: ENV.NODE_ENV || 'development'
  };
};

// Test basic API connectivity
export const testApiConnectivity = async () => {
  const baseUrl = ENV.API_URL;
  const endpoints = [
    { url: `${baseUrl}/status`, name: 'Status Endpoint' },
    { url: `${baseUrl}`, name: 'API Root' },
    { url: baseUrl.replace('/api', ''), name: 'Server Root' }
  ];
  
  let success = false;
  const results = [];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing connectivity to ${endpoint.name}: ${endpoint.url}`);
      const response = await axios.get(endpoint.url, { timeout: 10000 });
      
      results.push({
        ...endpoint,
        status: response.status,
        success: true,
        data: {
          type: typeof response.data,
          length: Array.isArray(response.data) ? response.data.length : null
        }
      });
      
      if (response.status === 200) {
        success = true;
      }
    } catch (error) {
      console.error(`Error testing ${endpoint.name}:`, error);
      results.push({
        ...endpoint,
        status: error.response?.status || 'Network Error',
        success: false,
        error: error.message
      });
    }
  }
  
  return {
    success,
    message: success ? 'API is reachable' : 'Could not connect to API',
    endpoints: results
  };
};

// Test appointment endpoints for a specific user
export const testAppointmentEndpoints = async (userEmail) => {
  if (!userEmail) {
    return {
      success: false,
      message: 'No user email provided',
      endpoints: []
    };
  }
  
  const baseUrl = ENV.API_URL;
  const encodedEmail = encodeURIComponent(userEmail);
  
  const endpoints = [
    { 
      url: `${baseUrl}/appoint/patient/${encodedEmail}`, 
      name: 'Patient Appointments (appoint)' 
    },
    { 
      url: `${baseUrl}/appointment/patient/${encodedEmail}`, 
      name: 'Patient Appointments (appointment)' 
    },
    { 
      url: `${baseUrl}/appoint/query?email=${encodedEmail}`, 
      name: 'Query Appointments (appoint)' 
    },
    { 
      url: `${baseUrl}/appointment/query?email=${encodedEmail}`, 
      name: 'Query Appointments (appointment)' 
    },
    { 
      url: `${baseUrl}/appoint?email=${encodedEmail}`, 
      name: 'Root with Email (appoint)' 
    },
    { 
      url: `${baseUrl}/appointment?email=${encodedEmail}`, 
      name: 'Root with Email (appointment)' 
    },
    { 
      url: `${baseUrl}/appoint/all`, 
      name: 'All Appointments (appoint)' 
    },
    { 
      url: `${baseUrl}/appointment/all`, 
      name: 'All Appointments (appointment)' 
    }
  ];
  
  const results = [];
  let success = false;
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing appointment endpoint: ${endpoint.name} (${endpoint.url})`);
      const response = await axios.get(endpoint.url, { timeout: 10000 });
      
      // Parse response data
      let appointmentCount = 0;
      let hasAppointmentsField = false;
      
      if (response.data) {
        if (Array.isArray(response.data)) {
          appointmentCount = response.data.length;
        } else if (response.data.appointments && Array.isArray(response.data.appointments)) {
          appointmentCount = response.data.appointments.length;
          hasAppointmentsField = true;
        }
      }
      
      results.push({
        ...endpoint,
        status: response.status,
        success: true,
        appointmentCount,
        data: {
          type: typeof response.data,
          hasAppointmentsField,
          count: appointmentCount
        }
      });
      
      // If we got a successful response with appointments, consider the test successful
      if (response.status === 200 && appointmentCount > 0) {
        success = true;
      }
    } catch (error) {
      console.error(`Error testing ${endpoint.name}:`, error);
      results.push({
        ...endpoint,
        status: error.response?.status || 'Network Error',
        success: false,
        appointmentCount: 0,
        error: error.response?.data?.message || error.message
      });
    }
  }
  
  return {
    success,
    message: success 
      ? `Successfully found appointments for ${userEmail}` 
      : `Could not retrieve appointments for ${userEmail}`,
    endpoints: results
  };
};

// Test a specific appointment endpoint (for manual testing)
export const testSpecificEndpoint = async (url) => {
  try {
    console.log(`Testing specific endpoint: ${url}`);
    const response = await axios.get(url, { timeout: 10000 });
    
    return {
      url,
      status: response.status,
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error(`Error testing endpoint ${url}:`, error);
    return {
      url,
      status: error.response?.status || 'Network Error',
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
}; 