// Get the current doctor's email
export const getCurrentDoctorEmail = () => {
  try {
    // Try to get directly from localStorage
    const email = localStorage.getItem('doctorEmail');
    if (email) {
      return email;
    }
    
    // As fallback, parse from doctor data
    const doctorData = localStorage.getItem('doctor');
    if (doctorData) {
      const doctor = JSON.parse(doctorData);
      return doctor.Email;
    }
    
    // If no email is found
    return null;
  } catch (error) {
    console.error("Error getting doctor email:", error);
    return null;
  }
};

/**
 * Get current doctor data from localStorage
 * @returns {Object|null} The doctor data or null if not found
 */
export const getCurrentDoctor = () => {
  try {
    console.log('[DEBUG] getCurrentDoctor: Attempting to get doctor data');
    
    // First try to get the complete data object
    const doctorData = localStorage.getItem('doctor');
    
    if (doctorData) {
      try {
        const doctor = JSON.parse(doctorData);
        console.log('[DEBUG] getCurrentDoctor: Found doctor data in localStorage');
        
        // Log available fields to help with debugging
        console.log('[DEBUG] getCurrentDoctor: Available fields:', Object.keys(doctor));
        
        return doctor;
      } catch (parseError) {
        console.error("[DEBUG] getCurrentDoctor: Error parsing doctor data:", parseError);
        console.log("[DEBUG] getCurrentDoctor: Raw doctor data:", doctorData);
        localStorage.removeItem('doctor'); // Clear invalid data
      }
    } else {
      console.log('[DEBUG] getCurrentDoctor: No doctor data found in localStorage');
    }
    
    // If no data object, try to get information from the JWT token
    const token = localStorage.getItem('doctorToken');
    if (token) {
      console.log('[DEBUG] getCurrentDoctor: Found doctorToken, attempting to extract data');
      
      try {
        // Extract data from JWT
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        console.log('[DEBUG] getCurrentDoctor: JWT payload:', payload);
        
        // Construct minimal doctor object from JWT
        const doctorEmail = localStorage.getItem('doctorEmail') || payload.email || payload.Email;
        
        if (doctorEmail || payload.userId || payload.id || payload._id || payload.doctorId) {
          const constructedDoctor = {
            _id: payload.userId || payload.id || payload._id || payload.doctorId,
            email: doctorEmail || 'unknown',
            Email: doctorEmail || 'unknown',
            name: payload.name || 'Doctor',
            Name: payload.name || 'Doctor',
            // Add other fields from payload that might be useful
            ...(payload.role && { role: payload.role }),
            ...(payload.specialty && { specialty: payload.specialty })
          };
          
          console.log('[DEBUG] getCurrentDoctor: Constructed doctor from JWT:', constructedDoctor);
          return constructedDoctor;
        }
      } catch (tokenError) {
        console.error("[DEBUG] getCurrentDoctor: Error extracting data from token:", tokenError);
      }
    } else {
      console.log('[DEBUG] getCurrentDoctor: No doctorToken found in localStorage');
    }
    
    // If we still have nothing, try email as last resort
    const doctorEmail = localStorage.getItem('doctorEmail');
    if (doctorEmail) {
      console.log('[DEBUG] getCurrentDoctor: Found only doctorEmail:', doctorEmail);
      
      return {
        email: doctorEmail,
        Email: doctorEmail,
        _id: null,
        name: 'Unknown Doctor',
        Name: 'Unknown Doctor'
      };
    }
    
    console.log('[DEBUG] getCurrentDoctor: No valid doctor data found');
    return null;
  } catch (error) {
    console.error("[DEBUG] getCurrentDoctor: Fatal error:", error);
    return null;
  }
};

/**
 * Get current patient data from localStorage
 * @returns {Object|null} The patient data or null if not found
 */
export const getCurrentPatient = () => {
  try {
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    
    return JSON.parse(userData);
  } catch (error) {
    console.error("Error parsing patient data:", error);
    localStorage.removeItem('user'); // Clear invalid data
    return null;
  }
};

/**
 * Check if a user is logged in as a doctor
 * @returns {boolean} True if logged in as doctor
 */
export const isDoctorLoggedIn = () => {
  return !!localStorage.getItem('doctorToken') && !!getCurrentDoctor();
};

/**
 * Check if a user is logged in as a patient
 * @returns {boolean} True if logged in as patient
 */
export const isPatientLoggedIn = () => {
  return !!localStorage.getItem('token') && !!getCurrentPatient();
};

/**
 * Check if a user is simultaneously logged in as both doctor and patient
 * @returns {boolean} True if logged in as both roles
 */
export const hasDualLogin = () => {
  return isDoctorLoggedIn() && isPatientLoggedIn();
};

/**
 * Clear all doctor authentication data
 * This is used when logging out or switching roles
 */
export const clearDoctorAuth = () => {
  localStorage.removeItem('doctorToken');
  localStorage.removeItem('doctor');
  localStorage.removeItem('doctorEmail');
};

/**
 * Clear all patient authentication data
 * This is used when logging out or switching roles
 */
export const clearPatientAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Clear all authentication data (both doctor and patient)
 * Use this for a complete logout
 */
export const clearAllAuth = () => {
  clearDoctorAuth();
  clearPatientAuth();
}; 