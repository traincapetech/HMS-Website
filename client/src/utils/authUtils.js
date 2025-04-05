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

// Get the full doctor data
export const getCurrentDoctor = () => {
  try {
    // Try to get from localStorage
    const doctorData = localStorage.getItem('doctor');
    if (doctorData) {
      return JSON.parse(doctorData);
    }
    
    // If no doctor is found
    return null;
  } catch (error) {
    console.error("Error getting doctor data:", error);
    return null;
  }
}; 