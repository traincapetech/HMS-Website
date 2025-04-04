import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaCalendarAlt, FaUserMd, FaStethoscope, FaSpinner, FaLock, FaClock } from 'react-icons/fa';
import { ENV } from '../utils/envUtils';

// Hardcoded list of medical specialities
const SPECIALITIES = [
  "Covid Treatment",
  "Cardiology",
  "Sexual Health", 
  "Eye Specialist",
  "Womens Health",
  "Diet & Nutrition",
  "Skin & Hair",
  "Bones and Joints",
  "Child Specialist",
  "Dental Care",
  "Heart",
  "Kidney Issues",
  "Cancer",
  "Ayurveda",
  "General Physician",
  "Mental Wellness",
  "Homoeopath",
  "General Surgery",
  "Urinary Issues",
  "Lungs and Breathing",
  "Physiotherapy",
  "Ear, Nose, Throat",
  "Brain and Nerves",
  "Diabetes Management",
  "Veterinary",
];

// Sample doctor data for fallback
const SAMPLE_DOCTORS = [
  { _id: "doc1", Name: "John Smith", Speciality: "Heart", Experience: "10" },
  { _id: "doc2", Name: "Sarah Johnson", Speciality: "Eye Specialist", Experience: "8" },
  { _id: "doc3", Name: "David Lee", Speciality: "General Physician", Experience: "15" },
  { _id: "doc4", Name: "Maria Garcia", Speciality: "Dental Care", Experience: "12" },
  { _id: "doc5", Name: "Robert Chen", Speciality: "Brain and Nerves", Experience: "20" },
  { _id: "doc6", Name: "Emily Wilson", Speciality: "Womens Health", Experience: "9" },
  { _id: "doc7", Name: "Michael Brown", Speciality: "Skin & Hair", Experience: "7" },
  { _id: "doc8", Name: "Jennifer Taylor", Speciality: "Diet & Nutrition", Experience: "5" },
  { _id: "doc9", Name: "James Miller", Speciality: "Heart", Experience: "18" },
  { _id: "doc10", Name: "Patricia Davis", Speciality: "Eye Specialist", Experience: "11" },
  { _id: "doc11", Name: "Thomas White", Speciality: "Bones and Joints", Experience: "14" },
  { _id: "doc12", Name: "Jessica Martin", Speciality: "Mental Wellness", Experience: "6" }
];

// API base URL
const API_BASE_URL = ENV.API_URL;

const Appointment = () => {
  const navigate = useNavigate();
  
  // Form state - Get user info immediately
  const userInfoFromStorage = localStorage.getItem('userInfo');
  let initialUserData = {
    fullName: '',
    email: '',
    phone: ''
  };
  
  // Try to parse user data immediately
  try {
    if (userInfoFromStorage) {
      const userData = JSON.parse(userInfoFromStorage);
      initialUserData = {
        fullName: userData.name || userData.fullName || userData.Name || '',
        email: userData.email || userData.Email || '',
        phone: userData.phone || userData.phoneNumber || userData.Phone || userData.contact || ''
      };
    }
  } catch (err) {
    console.error("Error parsing user data:", err);
  }
  
  // Set initial form state with user data if available
  const [formData, setFormData] = useState({
    fullName: initialUserData.fullName,
    email: initialUserData.email,
    phone: initialUserData.phone,
    Speciality: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    symptoms: '',
  });
  
  // Check if we have user data to lock fields
  const hasUserData = initialUserData.fullName && initialUserData.email && initialUserData.phone;
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  
  // Data states
  const [allDoctors, setAllDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [bookedTimeSlots, setBookedTimeSlots] = useState([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Fetch doctors on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Fetch all doctors from backend
  const fetchDoctors = async () => {
    setLoading(true);
    
    try {
      console.log("Attempting to fetch doctors from backend...");
      
      // Try multiple endpoints in order
      const endpoints = [
        `${API_BASE_URL}/doctors/all`,
        `${API_BASE_URL}/doctors`,
        `${API_BASE_URL}/doctor/all`,
        `${API_BASE_URL}/doctor`
      ];
      
      let doctorsData = null;
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          const response = await axios.get(endpoint);
          
          // Check if we got a valid array of doctors
          if (response.data) {
            if (Array.isArray(response.data)) {
              doctorsData = response.data;
              break;
            } else if (response.data.doctor && Array.isArray(response.data.doctor)) {
              doctorsData = response.data.doctor;
              break;
            } else if (response.data.doctors && Array.isArray(response.data.doctors)) {
              doctorsData = response.data.doctors;
              break;
            }
          }
        } catch (endpointError) {
          console.warn(`Failed to fetch from ${endpoint}:`, endpointError.message);
        }
      }
      
      if (doctorsData && doctorsData.length > 0) {
        console.log(`Successfully loaded ${doctorsData.length} doctors from API`);
        setAllDoctors(doctorsData);
        setUsingFallbackData(false);
      } else {
        throw new Error("Could not fetch valid doctor data from any endpoint");
      }
    } catch (error) {
      console.warn("All API endpoints failed, using fallback data:", error.message);
      setAllDoctors(SAMPLE_DOCTORS);
      setUsingFallbackData(true);
      toast.warning("Could not connect to server. Using sample doctor data instead.");
    } finally {
      setLoading(false);
    }
  };

  // Update filtered doctors when speciality changes
  useEffect(() => {
    if (formData.Speciality) {
      console.log("Filtering doctors by Speciality:", formData.Speciality);
      
      const filtered = allDoctors.filter(
        doctor => doctor.Speciality === formData.Speciality
      );
      
      console.log(`Filtered doctors for ${formData.Speciality}:`, filtered.length);
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors([]);
    }
  }, [formData.Speciality, allDoctors]);

  // Validate phone number on input to allow only numbers
  const handlePhoneInput = (e) => {
    // Only allow digits 0-9 and backspace, delete keys
    const { value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (value !== numericValue) {
      // Set form data with numeric value
      setFormData(prev => ({ ...prev, phone: numericValue }));
    } else {
      // Set form data normally
      setFormData(prev => ({ ...prev, phone: value }));
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Don't allow changes to protected fields
    if (hasUserData && (name === 'fullName' || name === 'email' || name === 'phone')) {
      return;
    }
    
    // Special handling for phone to ensure numeric input only
    if (name === 'phone') {
      return; // Phone is handled by handlePhoneInput
    }
    
    // Clear any previous error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear appointment time if doctor or date changes
    if ((name === 'doctorId' || name === 'appointmentDate') && formData.appointmentTime) {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        appointmentTime: ''
      }));
    } else {
      // Update form state
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // If speciality changes, reset doctor selection
    if (name === 'Speciality' && formData.doctorId) {
      setFormData(prev => ({ ...prev, doctorId: '', appointmentTime: '' }));
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    
    if (!formData.Speciality) {
      newErrors.Speciality = 'Please select a specialty';
    }
    
    if (!formData.doctorId) {
      newErrors.doctorId = 'Please select a doctor';
    }
    
    if (!formData.fullName || !formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email || !formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone || !formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Please select a date';
    }
    
    if (!formData.appointmentTime) {
      newErrors.appointmentTime = 'Please select a time';
    }
    
    // If there are errors, show them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Clear errors
    setErrors({});
    setSubmitting(true);
    
    try {
      // Format data for sending to API
      const appointmentData = {
        Speciality: formData.Speciality,
        Doctor: filteredDoctors.find(doc => doc._id === formData.doctorId)?.Name || "Unknown Doctor",
        doctorId: formData.doctorId,
        Name: formData.fullName,
        Email: formData.email,
        Phone: formData.phone,
        AppointDate: formData.appointmentDate,
        AppointTime: formData.appointmentTime,
        Symptoms: formData.symptoms || 'Not specified'
      };
      
      console.log('Submitting appointment data:', appointmentData);
      
      // Define possible API endpoints to try - in order of preference
      const endpoints = [
        `${API_BASE_URL}/appoint/create`,
        `${API_BASE_URL}/appointment/create`,
        `${API_BASE_URL}/appoint`,
        `${API_BASE_URL}/appointment`
      ];
      
      let response = null;
      let lastError = null;
      
      // Try each endpoint until one succeeds
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying to submit to endpoint: ${endpoint}`);
          response = await axios.post(endpoint, appointmentData);
          if (response && response.data) {
            console.log('Successful response:', response.data);
            break; // Exit the loop if we got a successful response
          }
        } catch (err) {
          console.warn(`Failed with endpoint ${endpoint}:`, err.message);
          lastError = err;
          // Continue to next endpoint
        }
      }
      
      // If we have a successful response
      if (response && response.data) {
        toast.success('Appointment booked successfully!');
        
        // Redirect to confirmation page with appointment details
        navigate('/appointment-confirmed', { 
          state: {
            appointmentId: response.data.appointmentId,
            doctorName: filteredDoctors.find(doc => doc._id === formData.doctorId)?.Name || "Your doctor",
            appointmentDate: formData.appointmentDate,
            appointmentTime: formData.appointmentTime,
            zoomMeetingUrl: response.data.zoomMeetingUrl,
            zoomMeetingPassword: response.data.zoomMeetingPassword,
            demoMode: !response.data.zoomMeetingUrl // Flag to show demo notice if no Zoom URL
          }
        });
      } else {
        // If all endpoints failed, fall back to demo mode
        console.error('All API endpoints failed, using demo mode');
        toast.warning('Could not connect to server. Using demo mode instead.');
        
        // Create a demo appointment ID
        const demoAppointmentId = `demo-${Date.now()}`;
        
        // Redirect to confirmation page with demo data
        navigate('/appointment-confirmed', { 
          state: {
            appointmentId: demoAppointmentId,
            doctorName: filteredDoctors.find(doc => doc._id === formData.doctorId)?.Name || "Your doctor",
            appointmentDate: formData.appointmentDate,
            appointmentTime: formData.appointmentTime,
            demoMode: true
          }
        });
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      
      if (error.response && error.response.status === 409) {
        // Handle double booking with specific error
        setErrors(prev => ({ 
          ...prev, 
          appointmentTime: error.response.data.message || "This time slot is already booked. Please select another time." 
        }));
        
        // Scroll to time input
        const timeInput = document.getElementById("appointmentTime");
        if (timeInput) {
          timeInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        // Set a general submission error
        toast.error(error.response?.data?.message || "Failed to book appointment. Please try again later.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Get available time slots
  const getAvailableTimeSlots = () => {
    const allSlots = [
      '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
      '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
      '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', 
      '04:00 PM', '04:30 PM', '05:00 PM'
    ];
    
    // Return all slots if no booked slots data
    if (!bookedTimeSlots || bookedTimeSlots.length === 0) {
      return allSlots;
    }
    
    // Filter out booked slots
    return allSlots.filter(slot => !bookedTimeSlots.includes(slot));
  };

  // Add this function to fetch booked time slots
  const fetchBookedTimeSlots = async (doctorId, date) => {
    if (!doctorId || !date) return;
    
    setCheckingAvailability(true);
    try {
      console.log(`Checking availability for doctor ${doctorId} on ${date}`);
      
      // Format date consistently for API requests
      const formattedDate = new Date(date).toISOString().split('T')[0];
      
      // Define multiple endpoints to try, including the new availability endpoint and fallbacks
      const endpoints = [
        // Try the direct availability endpoint first
        `${API_BASE_URL}/availability/${doctorId}?date=${formattedDate}`,
        
        // Try availability-specific endpoints next
        `${API_BASE_URL}/appoint/doctor/${doctorId}/availability?date=${formattedDate}`,
        `${API_BASE_URL}/appointment/doctor/${doctorId}/availability?date=${formattedDate}`,
        
        // Try query endpoints next
        `${API_BASE_URL}/appoint/query?doctorId=${doctorId}&date=${formattedDate}`,
        `${API_BASE_URL}/appointment/query?doctorId=${doctorId}&date=${formattedDate}`,
        
        // Try general doctor appointments endpoints as fallback
        `${API_BASE_URL}/appoint/doctor/${doctorId}`,
        `${API_BASE_URL}/appointment/doctor/${doctorId}`
      ];
      
      let bookedSlots = [];
      let responseReceived = false;
      let responseDetails = [];
      
      // Try each endpoint until we get a successful response
      for (const endpoint of endpoints) {
        try {
          console.log(`Attempting to check availability at: ${endpoint}`);
          const response = await axios.get(endpoint, { timeout: 12000 });
          
          responseDetails.push({
            endpoint,
            status: response.status,
            dataType: response.data ? typeof response.data : 'none'
          });
          
          if (response.data) {
            responseReceived = true;
            console.log(`Received response from ${endpoint}:`, response.data);
            
            // Check if we got the new availability format with bookedSlots
            if (response.data.bookedSlots && Array.isArray(response.data.bookedSlots)) {
              bookedSlots = response.data.bookedSlots.map(slot => slot.time);
              console.log('Booked time slots from availability API:', bookedSlots);
              break;
            }
            
            let appointments = [];
            
            // Handle different response formats
            if (response.data.success && Array.isArray(response.data.appointments)) {
              appointments = response.data.appointments;
            } else if (Array.isArray(response.data)) {
              appointments = response.data;
            }
            
            if (appointments.length > 0) {
              // Filter appointments for the selected date
              const targetDate = new Date(formattedDate);
              targetDate.setHours(0, 0, 0, 0);
              
              // Ensure consistent date comparison by comparing date strings
              const targetDateStr = targetDate.toISOString().split('T')[0];
              
              bookedSlots = appointments
                .filter(appointment => {
                  // Check for cancelled status
                  if (appointment.Status === 'Cancelled') return false;
                  
                  // Handle date in different formats
                  const appointmentDate = new Date(appointment.AppointDate || appointment.appointmentDate || appointment.date);
                  const appointmentDateStr = appointmentDate.toISOString().split('T')[0];
                  
                  // Compare date strings for more reliable comparison
                  return appointmentDateStr === targetDateStr;
                })
                .map(appointment => appointment.AppointTime || appointment.appointmentTime || appointment.time);
              
              console.log('Booked time slots for selected date:', bookedSlots);
              
              if (bookedSlots.length > 0) {
                break; // Found what we needed
              }
            }
          }
        } catch (endpointError) {
          console.error(`Failed to check availability at ${endpoint}:`, endpointError.message);
          responseDetails.push({
            endpoint,
            status: endpointError.response?.status || 'Network Error',
            error: endpointError.message
          });
          // Continue to next endpoint
        }
      }
      
      // If we found appointments, set the booked slots
      setBookedTimeSlots(bookedSlots);
      
      if (!responseReceived) {
        console.error('Could not fetch availability from any endpoint');
        console.error('Response details:', responseDetails);
      }
    } catch (error) {
      console.error('Error fetching booked time slots:', error);
      // Don't set any booked slots if there's an error - better to let user try booking
      setBookedTimeSlots([]);
    } finally {
      setCheckingAvailability(false);
    }
  };

  // Add useEffect to call fetchBookedTimeSlots when doctor or date changes
  useEffect(() => {
    if (formData.doctorId && formData.appointmentDate) {
      fetchBookedTimeSlots(formData.doctorId, formData.appointmentDate);
    } else {
      setBookedTimeSlots([]);
    }
  }, [formData.doctorId, formData.appointmentDate]);

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-red-600 py-6 px-8">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <FaCalendarAlt className="mr-2" /> Book an Appointment
          </h1>
          <p className="text-white opacity-80 mt-1">
            Fill in the form below to schedule an appointment with one of our specialists
          </p>
        </div>

        {usingFallbackData && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 m-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Demo Mode:</strong> Using sample data for demonstration purposes.
                </p>
              </div>
            </div>
          </div>
        )}

        {hasUserData && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 m-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaLock className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  <strong>Personal Information Auto-filled:</strong> Your personal information has been automatically filled from your account.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center">
                Personal Information
                {hasUserData && (
                  <span className="ml-2 text-sm text-green-600 flex items-center">
                    <FaLock className="mr-1" size={14} /> Auto-filled
                  </span>
                )}
              </h2>
              
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  readOnly={hasUserData}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm ${
                    errors.fullName ? 'border-red-300' : ''
                  } ${hasUserData ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  readOnly={hasUserData}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm ${
                    errors.email ? 'border-red-300' : ''
                  } ${hasUserData ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneInput}
                  readOnly={hasUserData}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm ${
                    errors.phone ? 'border-red-300' : ''
                  } ${hasUserData ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="Enter your phone number (digits only)"
                  onKeyPress={(e) => {
                    // Allow only numbers (0-9) in phone field
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
                {!hasUserData && (
                  <p className="mt-1 text-xs text-gray-500">
                    Only numbers are allowed (e.g., 1234567890)
                  </p>
                )}
              </div>
              
              {/* Symptoms */}
              <div>
                <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">
                  Symptoms or Reason for Visit
                </label>
                <textarea
                  id="symptoms"
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  placeholder="Briefly describe your symptoms or reason for visit"
                />
              </div>
            </div>
            
            {/* Appointment Details */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Appointment Details
              </h2>
              
              {/* Speciality Selection */}
              <div>
                <label htmlFor="Speciality" className="block text-sm font-medium text-gray-700">
                  Specialty
                </label>
                <div className="relative">
                  <select
                    id="Speciality"
                    name="Speciality"
                    value={formData.Speciality}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm ${
                      errors.Speciality ? 'border-red-300' : ''
                    }`}
                  >
                    <option value="">Select Specialty</option>
                    {SPECIALITIES.map((speciality) => (
                      <option key={speciality} value={speciality}>
                        {speciality}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <FaStethoscope className="h-4 w-4" />
                  </div>
                </div>
                {errors.Speciality && (
                  <p className="mt-1 text-sm text-red-600">{errors.Speciality}</p>
                )}
              </div>
              
              {/* Doctor Selection */}
              <div>
                <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700">
                  Doctor
                </label>
                <div className="relative">
                  {loading ? (
                    <div className="mt-1 flex items-center space-x-2">
                      <FaSpinner className="animate-spin text-red-500" />
                      <span className="text-sm text-gray-500">Loading doctors...</span>
                    </div>
                  ) : (
                    <select
                      id="doctorId"
                      name="doctorId"
                      value={formData.doctorId}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm ${
                        errors.doctorId ? 'border-red-300' : ''
                      }`}
                      disabled={!formData.Speciality}
                    >
                      <option value="">
                        {!formData.Speciality
                          ? "Select a specialty first"
                          : filteredDoctors.length === 0
                          ? "No doctors available for this specialty"
                          : "Select Doctor"}
                      </option>
                      {filteredDoctors.map((doctor) => (
                        <option key={doctor._id} value={doctor._id}>
                          Dr. {doctor.Name} {doctor.Experience && `(${doctor.Experience} years exp)`}
                        </option>
                      ))}
                    </select>
                  )}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <FaUserMd className="h-4 w-4" />
                  </div>
                </div>
                {errors.doctorId && (
                  <p className="mt-1 text-sm text-red-600">{errors.doctorId}</p>
                )}
                {formData.Speciality && filteredDoctors.length === 0 && !loading && (
                  <p className="mt-1 text-sm text-amber-600">
                    No doctors available for this specialty. Please select a different specialty.
                  </p>
                )}
              </div>
              
              {/* Appointment Date */}
              <div>
                <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700">
                  Appointment Date
                </label>
                <input
                  type="date"
                  id="appointmentDate"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]} // Set min to today
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm ${
                    errors.appointmentDate ? 'border-red-300' : ''
                  }`}
                  disabled={!formData.doctorId}
                />
                {errors.appointmentDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.appointmentDate}</p>
                )}
              </div>
              
              {/* Appointment Time */}
              <div>
                <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700">
                  Appointment Time
                </label>
                <div className="relative">
                  {checkingAvailability ? (
                    <div className="mt-1 flex items-center space-x-2">
                      <FaSpinner className="animate-spin text-red-500" />
                      <span className="text-sm text-gray-500">Checking available time slots...</span>
                    </div>
                  ) : (
                    <select
                      id="appointmentTime"
                      name="appointmentTime"
                      value={formData.appointmentTime}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm ${
                        errors.appointmentTime ? 'border-red-300' : ''
                      }`}
                      disabled={!formData.appointmentDate || !formData.doctorId}
                    >
                      <option value="">
                        {!formData.appointmentDate
                          ? "Select date first"
                          : !formData.doctorId
                          ? "Select a doctor first"
                          : getAvailableTimeSlots().length === 0
                          ? "No available time slots for this date"
                          : "Select Time"}
                      </option>
                      
                      {getAvailableTimeSlots().map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  )}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <FaClock className="h-4 w-4" />
                  </div>
                </div>
                {errors.appointmentTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.appointmentTime}</p>
                )}
                {bookedTimeSlots.length > 0 && (
                  <p className="mt-1 text-xs text-yellow-600">
                    Note: Some time slots are unavailable as they are already booked.
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Booking Appointment...
                </>
              ) : (
                'Book Appointment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Appointment;