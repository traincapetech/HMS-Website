import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaCalendarAlt, FaUserMd, FaStethoscope, FaSpinner, FaLock, FaClock, FaSync, FaFileUpload, FaFilePdf, FaTrash } from 'react-icons/fa';
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

// Create a specific key for appointments localStorage
const LOCAL_APPOINTMENTS_KEY = 'hms_appointments';
const LOCAL_USER_DATA_KEY = 'hms_user_data';
const SYNC_PENDING_KEY = 'hms_pending_sync';

// Maximum file size in bytes (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;
// Allowed file types
const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

const Appointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Form state - Get user info immediately (prioritize different sources)
  const userInfoFromStorage = localStorage.getItem('userInfo');
  const userData = localStorage.getItem('userData');
  const userDataFromLocalStorage = localStorage.getItem(LOCAL_USER_DATA_KEY);
  const token = localStorage.getItem('token');
  
  // Add file upload states
  const [files, setFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);
  const fileInputRef = useRef(null);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const [fetchingUserData, setFetchingUserData] = useState(false);
  const [userDataFetchFailed, setUserDataFetchFailed] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [syncingAppointments, setSyncingAppointments] = useState(false);
  const [showOfflineUI, setShowOfflineUI] = useState(false);
  
  // Add this near the top of the component to debug
  console.log("API_BASE_URL:", API_BASE_URL);
  
  // Extract user data from all possible sources
  const extractUserData = () => {
    try {
      console.log('Extracting user data from all possible sources...');
      
      // Check all localStorage keys that might contain user data
      const possibleKeys = [
        'user',        // Most common
        'userInfo',    // Often used
        'userData',    // Often used
        LOCAL_USER_DATA_KEY,
        'userProfile', 
        'loggedInUser', 
        'profile', 
        'currentUser', 
        'authUser', 
        'loginData',
        'auth',        // Common in JWT auth
        'userAuth',    // Common in JWT auth
        'hmsUser',     // Specific to this project
        'patient',     // Specific to this project
        'patientData'  // Specific to this project
      ];
      
      // Log all keys in localStorage for debugging
      console.log('All localStorage keys:', Object.keys(localStorage));
      
      // Try each key in order of priority
      for (const key of possibleKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            const parsedData = JSON.parse(data);
            console.log(`Found user data in localStorage["${key}"]:`, parsedData);
            
            // Check if we have name/email in this data
            const hasName = !!(parsedData.name || parsedData.fullName || parsedData.Name || 
                            parsedData.username || parsedData.Username || parsedData.UserName || 
                            (parsedData.FirstName && parsedData.LastName) || 
                            (parsedData.firstName && parsedData.lastName));
            const hasEmail = !!(parsedData.email || parsedData.Email);
            const hasPhone = !!(parsedData.phone || parsedData.Phone || parsedData.phoneNumber);
            
            if (hasName || hasEmail || hasPhone) {
              return {
                fullName: parsedData.name || parsedData.fullName || parsedData.Name || parsedData.username || parsedData.Username || 
                         parsedData.UserName || 
                         (parsedData.FirstName && parsedData.LastName ? `${parsedData.FirstName} ${parsedData.LastName}` : '') ||
                         (parsedData.firstName && parsedData.lastName ? `${parsedData.firstName} ${parsedData.lastName}` : '') || '',
                email: parsedData.email || parsedData.Email || '',
                phone: parsedData.phone || parsedData.phoneNumber || parsedData.Phone || parsedData.contact || parsedData.mobileNumber || parsedData.mobile || parsedData.contactNumber || ''
              };
            } else if (parsedData.user) {
              // Some APIs nest the user data in a 'user' property
              const userData = parsedData.user;
              return {
                fullName: userData.name || userData.fullName || userData.Name || userData.username || userData.Username || 
                         userData.UserName || 
                         (userData.FirstName && userData.LastName ? `${userData.FirstName} ${userData.LastName}` : '') ||
                         (userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : '') || '',
                email: userData.email || userData.Email || '',
                phone: userData.phone || userData.phoneNumber || userData.Phone || userData.contact || userData.mobileNumber || userData.mobile || userData.contactNumber || ''
              };
            }
          } catch (e) {
            console.error(`Error parsing localStorage["${key}"]:`, e);
          }
        }
      }
    } catch (err) {
      console.error("Error extracting user data:", err);
    }
    
    // Default empty data if nothing found
    console.warn('No user data found in any localStorage key');
    return {
      fullName: '',
      email: '',
      phone: ''
    };
  };
  
  // Get initial user data
  const initialUserData = extractUserData();
  
  // Log what we found to help debugging
  console.log('Initial user data loaded for appointment form:', initialUserData);
  
  // Check if we have a pre-selected doctor from the location state
  const preSelectedDoctor = location.state?.selectedDoctor;
  const skipDoctorSelection = location.state?.skipDoctorSelection;
  const preSelectedSpecialty = location.state?.selectedSpecialty;
  
  // Set initial form state with user data if available
  const [formData, setFormData] = useState({
    fullName: initialUserData.fullName,
    email: initialUserData.email,
    phone: initialUserData.phone,
    Speciality: preSelectedDoctor?.Speciality || preSelectedSpecialty || '',
    doctorId: preSelectedDoctor?._id || '',
    doctorEmail: preSelectedDoctor?.Email || '',
    appointmentDate: '',
    appointmentTime: '',
    Reason: '',
  });
  
  // Check if we have user data to lock fields - now considers a user logged in if they have either email or phone
  const [hasUserData, setHasUserData] = useState(
    (initialUserData.email && initialUserData.email.trim() !== '') || 
    (initialUserData.phone && initialUserData.phone.toString().trim() !== '')
  );
  const [userDataSource, setUserDataSource] = useState('localStorage');
  
  // Data states
  const [allDoctors, setAllDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [bookedTimeSlots, setBookedTimeSlots] = useState([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  // Create a function to sync pending appointments to the backend
  const syncPendingAppointments = async () => {
    if (isOfflineMode || !token) return; // Don't try to sync if offline or not logged in
    
    try {
      console.log('Attempting to sync pending appointments...');
      const pendingSyncAppointments = JSON.parse(localStorage.getItem(SYNC_PENDING_KEY) || '[]');
      
      if (pendingSyncAppointments.length === 0) {
        console.log('No pending appointments to sync');
        return; // Nothing to sync
      }
      
      setSyncingAppointments(true);
      
      // Track successful syncs to remove from pending list
      const successfullySynced = [];
      
      // Get the auth token
      const authToken = token || localStorage.getItem('token');
      if (!authToken) {
        console.warn('No authentication token found for syncing');
        return;
      }
      
      // Use the correct endpoint from the backend
      const syncEndpoint = `http://localhost:8080/api/appoint/create`;
      console.log('Using correct sync endpoint:', syncEndpoint);
      
      // Try to sync each appointment
      for (const appointment of pendingSyncAppointments) {
        try {
          console.log(`Attempting to sync appointment:`, appointment);
          
          // Format the appointment data according to the backend schema
          // In syncPendingAppointments:
        const appointmentData = {
          Speciality: appointment.Speciality,
          Doctor: appointment.Doctor || "Unknown Doctor", // Make sure this is included
          Name: appointment.Name || appointment.fullName,
          Email: appointment.Email || appointment.email,
          AppointDate: appointment.AppointDate,
          AppointTime: appointment.AppointTime,
          Phone: appointment.Phone || appointment.phone,
          Reason: appointment.Symptoms || appointment.symptoms || 'Not specified',
          DocEmail: appointment.DocEmail || appointment.doctorEmail // This is required!
        };
          
          // Make the API call to the correct endpoint
          const response = await axios.post(syncEndpoint, appointmentData, {
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
            },
            timeout: 10000
          });
          
          if (response && response.status < 400) {
            console.log('Successfully synced appointment:', response.data);
            successfullySynced.push(appointment._id);
            
            // Show notification
            toast.success(`Appointment with Dr. ${appointment.Doctor} synced successfully`);
          }
        } catch (error) {
          console.error(`Failed to sync appointment ${appointment._id}:`, error);
          // Optionally try FormData as fallback if JSON fails
          try {
            const formDataForApi = new FormData();
            Object.entries(appointment).forEach(([key, value]) => {
              if (key !== 'fileCount') {
                formDataForApi.append(key, value);
              }
            });
            
            const response = await axios.post(syncEndpoint, formDataForApi, {
              headers: { 
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${authToken}`
              },
              timeout: 15000
            });
            
            if (response && response.status < 400) {
              console.log('Successfully synced appointment with FormData:', response.data);
              successfullySynced.push(appointment._id);
              toast.success(`Appointment with Dr. ${appointment.Doctor} synced successfully`);
            }
          } catch (formDataError) {
            console.error(`Failed to sync appointment with FormData:`, formDataError);
          }
        }
      }
      
      // Remove successfully synced appointments
      if (successfullySynced.length > 0) {
        const updatedPending = pendingSyncAppointments.filter(
          appt => !successfullySynced.includes(appt._id)
        );
        
        localStorage.setItem(SYNC_PENDING_KEY, JSON.stringify(updatedPending));
        setPendingSyncCount(updatedPending.length);
        
        if (successfullySynced.length > 0 && pendingSyncAppointments.length === successfullySynced.length) {
          toast.success('All pending appointments synced successfully');
        } else if (successfullySynced.length > 0) {
          toast.info(`${successfullySynced.length} of ${pendingSyncAppointments.length} appointments synced`);
        }
      }
    } catch (error) {
      console.error('Error syncing pending appointments:', error);
      toast.error('Failed to sync appointments. Will try again later.');
    } finally {
      setSyncingAppointments(false);
    }
  };

  // Add a function to get previously booked appointments from local storage
  const getLocalBookings = () => {
    try {
      const localBookings = localStorage.getItem(LOCAL_APPOINTMENTS_KEY);
      return localBookings ? JSON.parse(localBookings) : [];
    } catch (error) {
      console.error('Error parsing local appointments:', error);
      return [];
    }
  };

  // Save a booking to local storage
  const saveLocalBooking = (appointment) => {
    try {
      const existingBookings = getLocalBookings();
      const updatedBookings = [...existingBookings, appointment];
      localStorage.setItem(LOCAL_APPOINTMENTS_KEY, JSON.stringify(updatedBookings));
    } catch (error) {
      console.error('Error saving local appointment:', error);
    }
  };

  // Save an appointment for later sync to backend
  const savePendingSync = (appointment) => {
    try {
      const pendingAppointments = JSON.parse(localStorage.getItem(SYNC_PENDING_KEY) || '[]');
      pendingAppointments.push(appointment);
      localStorage.setItem(SYNC_PENDING_KEY, JSON.stringify(pendingAppointments));
      setPendingSyncCount(pendingAppointments.length);
    } catch (error) {
      console.error('Error saving pending sync:', error);
    }
  };

  // Save user data to local storage
  const saveUserDataLocally = (userData) => {
    try {
      localStorage.setItem(LOCAL_USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data locally:', error);
    }
  };

  // Check if a slot is already booked locally
  const isSlotBookedLocally = (doctorId, date, time) => {
    try {
      const localBookings = getLocalBookings();
      return localBookings.some(booking => 
        booking.doctorId === doctorId && 
        booking.appointmentDate === date && 
        booking.appointmentTime === time &&
        booking.status !== 'Cancelled'
      );
    } catch (error) {
      console.error('Error checking local bookings:', error);
      return false;
    }
  };

  // Get all booked slots for a specific doctor and date from local storage
  const getLocalBookedSlots = (doctorId, date) => {
    try {
      const allBookings = getLocalBookings();
      return allBookings
        .filter(booking => 
          booking.doctorId === doctorId && 
          booking.appointmentDate === date &&
          booking.status !== 'Cancelled'
        )
        .map(booking => booking.appointmentTime);
    } catch (error) {
      console.error('Error getting locally booked slots:', error);
      return [];
    }
  };

  // Check for login state
  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!token && !userInfoFromStorage && !userData) {
      toast.error("Please log in to book an appointment");
      navigate("/login", { 
        state: { 
          returnUrl: "/Appointments",
          selectedDoctor: preSelectedDoctor,
          selectedSpecialty: preSelectedSpecialty
        } 
      });
    }
  }, [navigate, userInfoFromStorage, userData, preSelectedDoctor, preSelectedSpecialty, token]);

  // Component initialization and data fetching
  useEffect(() => {
    // Step 1: Fetch doctors
    fetchDoctors();
    
    // Step 2: Check for user data or fetch it
    if (!hasUserData) {
      console.log('No user data found initially, attempting to fetch from API...');
      fetchUserDataFromAPI();
      
      // If we still don't have data after a delay, check all possible localStorage keys again
      setTimeout(() => {
        if (!hasUserData) {
          console.log('Retrying user data extraction after delay...');
          const retryUserData = extractUserData();
          
          if (retryUserData.fullName || retryUserData.email || retryUserData.phone) {
            console.log('Found user data on retry:', retryUserData);
            setFormData(prev => ({
              ...prev,
              fullName: retryUserData.fullName || prev.fullName,
              email: retryUserData.email || prev.email,
              phone: retryUserData.phone || prev.phone
            }));
            
            setHasUserData(true);
            setUserDataSource('localStorage');
          }
        }
      }, 1500);
    }
    
    // Step 3: Initialize online status checking
    const checkOnlineStatus = async () => {
      try {
        // Simple ping to check if API is reachable
        const response = await axios.get(`${API_BASE_URL}/ping`, { timeout: 3000 });
        
        if (response.status === 200) {
          if (isOfflineMode) {
            console.log('Backend is now reachable, switching to online mode');
            setIsOfflineMode(false);
            syncPendingAppointments(); // Try to sync when we reconnect
          }
        }
      } catch (error) {
        if (!isOfflineMode) {
          console.log('Backend not reachable, using local storage mode');
          setIsOfflineMode(true);
          // Don't show offline UI in production
          setShowOfflineUI(process.env.NODE_ENV === 'development');
        }
      }
    };
    
    // Run online check immediately
    checkOnlineStatus();
    
    // Set up interval for checking (every 60 seconds)
    const interval = setInterval(checkOnlineStatus, 60000);
    
    // Step 4: Check for pending appointments
    try {
      const pendingAppointments = JSON.parse(localStorage.getItem(SYNC_PENDING_KEY) || '[]');
      setPendingSyncCount(pendingAppointments.length);
    } catch (e) {
      console.error('Error getting pending sync count:', e);
    }
    
    // Cleanup on component unmount
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Initialize app by checking for pending appointments - depends on online status
  useEffect(() => {
    // Try to sync if we have pending appointments and token
    if (pendingSyncCount > 0 && token && !isOfflineMode && !syncingAppointments) {
      syncPendingAppointments();
    }
  }, [pendingSyncCount, token, isOfflineMode, syncingAppointments]);

  // After doctors are loaded, handle pre-selected doctor or specialty
  useEffect(() => {
    if (allDoctors.length > 0 && preSelectedDoctor) {
      // If the pre-selected doctor is in the loaded doctors list, filter by specialty
      if (preSelectedDoctor.Speciality) {
        const doctorsWithSameSpecialty = allDoctors.filter(
          doctor => doctor.Speciality === preSelectedDoctor.Speciality
        );
        
        // Only set filtered doctors if we found some with this specialty
        if (doctorsWithSameSpecialty.length > 0) {
          setFilteredDoctors(doctorsWithSameSpecialty);
        } 
        // If we can't find the doctor in our list, add it manually
        else if (!allDoctors.some(doctor => doctor._id === preSelectedDoctor._id)) {
          setAllDoctors(prev => [...prev, preSelectedDoctor]);
          setFilteredDoctors([preSelectedDoctor]);
        }
      }
    } else if (allDoctors.length > 0 && preSelectedSpecialty) {
      // If only specialty is pre-selected, filter doctors by that specialty
      const doctorsWithSelectedSpecialty = allDoctors.filter(
        doctor => doctor.Speciality === preSelectedSpecialty
      );
      
      if (doctorsWithSelectedSpecialty.length > 0) {
        setFilteredDoctors(doctorsWithSelectedSpecialty);
      }
    }
  }, [allDoctors, preSelectedDoctor, preSelectedSpecialty]);

  // Auto-select specialty if none selected but there's a doctor
  useEffect(() => {
    // If we have a doctor selected but no specialty, try to set it from the doctor
    if (formData.doctorId && !formData.Speciality && filteredDoctors.length > 0) {
      const selectedDoctor = filteredDoctors.find(doc => doc._id === formData.doctorId);
      if (selectedDoctor && selectedDoctor.Speciality) {
        setFormData(prev => ({
          ...prev,
          Speciality: selectedDoctor.Speciality
        }));
      }
    }
  }, [formData.doctorId, formData.Speciality, filteredDoctors]);

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

  // Update appointment time availability when doctor or date changes
  useEffect(() => {
    if (formData.doctorId && formData.appointmentDate) {
      fetchBookedTimeSlots(formData.doctorId, formData.appointmentDate);
    } else {
      setBookedTimeSlots([]);
    }
  }, [formData.doctorId, formData.appointmentDate]);

  // Modified version to check both API (if available) and local storage data
  const fetchBookedTimeSlots = async (doctorId, date) => {
    if (!doctorId || !date) return;
    
    setCheckingAvailability(true);
    try {
      console.log(`Checking availability for doctor ${doctorId} on ${date}`);
      
      // Always get local bookings first
      const locallyBookedSlots = getLocalBookedSlots(doctorId, date);
      console.log('Locally booked slots:', locallyBookedSlots);
      
      // If we're already in offline mode, don't try the API
      if (isOfflineMode) {
        setBookedTimeSlots(locallyBookedSlots);
        setCheckingAvailability(false);
        return;
      }
      
      // Format date consistently for API requests
      const formattedDate = new Date(date).toISOString().split('T')[0];
      
      // Only try one simple endpoint to avoid console spam
      try {
        // Try a simpler endpoint with a short timeout
        const endpoint = `${API_BASE_URL}/appointment/doctor/${doctorId}`;
        console.log(`Attempting to check availability at: ${endpoint}`);
        
        const response = await axios.get(endpoint, { timeout: 3000 });
        
        if (response.data) {
          console.log(`Received response from ${endpoint}:`, response.data);
          
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
            
            const remoteBookedSlots = appointments
              .filter(appointment => {
                // Check for cancelled status
                if (appointment.Status === 'Cancelled' || appointment.status === 'Cancelled') return false;
                
                // Handle date in different formats
                const appointmentDate = new Date(appointment.AppointDate || appointment.appointmentDate || appointment.date);
                const appointmentDateStr = appointmentDate.toISOString().split('T')[0];
                
                // Check if this appointment is for this doctor
                if (appointment.doctorId && appointment.doctorId !== doctorId) return false;
                
                // Compare date strings
                return appointmentDateStr === targetDateStr;
              })
              .map(appointment => appointment.AppointTime || appointment.appointmentTime || appointment.time);
            
            console.log('Remote booked slots:', remoteBookedSlots);
            
            // Combine remote and local slots
            const allBookedSlots = [...new Set([...remoteBookedSlots, ...locallyBookedSlots])];
            setBookedTimeSlots(allBookedSlots);
            return;
          }
        }
      } catch (endpointError) {
        console.warn('Failed to check availability from API, using local data only');
        setIsOfflineMode(true);
      }
      
      // If API call failed or returned no data, use local storage only
      setBookedTimeSlots(locallyBookedSlots);
      
    } catch (error) {
      console.error('Error fetching booked time slots:', error);
      // Use local storage as fallback
      const locallyBookedSlots = getLocalBookedSlots(doctorId, date);
      setBookedTimeSlots(locallyBookedSlots);
      setIsOfflineMode(true);
    } finally {
      setCheckingAvailability(false);
    }
  };

  // Fetch user data from backend if token is available
  const fetchUserDataFromAPI = async () => {
    if (!token) return;
    
    setFetchingUserData(true);
    setUserDataFetchFailed(false);
    
    try {
      // Try multiple endpoints to increase chances of success
      const endpoints = [
        `${API_BASE_URL}/user/profile`,
        `${API_BASE_URL}/user/me`, 
        `${API_BASE_URL}/profile`,
        `${API_BASE_URL}/auth/me`,
        `${API_BASE_URL}/users/me`
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying to fetch user data from: ${endpoint}`);
          const response = await axios.get(endpoint, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            timeout: 3000 // Shorter timeout to fail faster
          });
          
          if (response.data) {
            console.log('User data received from API:', response.data);
            
            // Extract user data
            let userData = null;
            if (response.data.user) {
              userData = response.data.user;
            } else if (response.data.data) {
              userData = response.data.data;
            } else {
              userData = response.data;
            }
            
            // If we got valid user data
            if (userData && (userData.name || userData.fullName || userData.email)) {
              const updatedUserData = {
                fullName: userData.name || userData.fullName || userData.Name || initialUserData.fullName,
                email: userData.email || userData.Email || initialUserData.email,
                phone: userData.phone || userData.phoneNumber || userData.Phone || userData.contact || userData.mobileNumber || userData.mobile || initialUserData.phone
              };
              
              // Save this verified data locally to reuse
              saveUserDataLocally(updatedUserData);
              
              // Update form data with the fetched user data
              setFormData(prev => ({
                ...prev,
                fullName: updatedUserData.fullName || prev.fullName,
                email: updatedUserData.email || prev.email,
                phone: updatedUserData.phone || prev.phone
              }));
              
              // Set flags to indicate we have verified user data
              setHasUserData(true);
              setUserDataSource('database');
              
              console.log('User data fetched from API and applied to form');
              return; // Exit the function if successful
            }
          }
        } catch (endpointError) {
          console.warn(`Failed to fetch user data from ${endpoint}:`, endpointError.message);
          // Continue to next endpoint
        }
      }
      
      // If we got here, all API calls failed
      setUserDataFetchFailed(true);
      
      // Use local storage data
      if (initialUserData.fullName && initialUserData.email) {
        setHasUserData(true);
        setUserDataSource('localStorage');
        
        // Make sure form data is updated if we're using local storage
        setFormData(prev => ({
          ...prev,
          fullName: initialUserData.fullName || prev.fullName,
          email: initialUserData.email || prev.email,
          phone: initialUserData.phone || prev.phone
        }));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserDataFetchFailed(true);
    } finally {
      setFetchingUserData(false);
    }
  };

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
    
    // If doctorId changes, get the doctor's email
    if (name === 'doctorId') {
      const selectedDoctor = filteredDoctors.find(doc => doc._id === value);
      
      // Clear appointment time if doctor changes
      setFormData(prev => ({
        ...prev,
        [name]: value,
        appointmentTime: '',
        doctorEmail: selectedDoctor?.Email || '',
      }));
      
      // Debug log for doctor email
      console.log("Selected doctor email:", selectedDoctor?.Email);
    } 
    // Clear appointment time if date changes
    else if (name === 'appointmentDate' && formData.appointmentTime) {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        appointmentTime: ''
      }));
    } 
    // If speciality changes, reset doctor selection
    else if (name === 'Speciality' && formData.doctorId) {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value, 
        doctorId: '', 
        doctorEmail: '',
        appointmentTime: '' 
      }));
    } 
    // Update form state
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newErrors = [];
    const validFiles = [];
    
    // Validate each file
    selectedFiles.forEach(file => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        newErrors.push(`${file.name} is too large (max: 5MB)`);
        return;
      }
      
      // Check file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        newErrors.push(`${file.name} is not a supported file type (PDF, JPG, PNG only)`);
        return;
      }
      
      // Valid file
      validFiles.push({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
      });
    });
    
    // Update state
    setFiles(prev => [...prev, ...validFiles]);
    setFileErrors(newErrors);
    
    // Show error if any
    if (newErrors.length > 0) {
      toast.error(newErrors.join('. '));
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Remove file
  const removeFile = (index) => {
    setFiles(prev => {
      const newFiles = [...prev];
      
      // Release object URL if it's an image preview
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview);
      }
      
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  // Function to ensure we have a proper user object
  const ensureUserExists = async () => {
    // If we don't have token, we can't create a user
    if (!token) return false;
    
    // Check if we have the minimum required data
    if (!formData.fullName || !formData.email) return false;
    
    try {
      // Try to create or update user profile
      const userProfileData = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone
      };
      
      const endpoint = `${API_BASE_URL}/user/profile`;
      console.log('Attempting to update user profile:', userProfileData);
      
      const response = await axios.post(endpoint, userProfileData, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        timeout: 5000
      });
      
      if (response && response.data) {
        console.log('User profile updated successfully:', response.data);
        
        // Save this data to localStorage
        saveUserDataLocally(userProfileData);
        return true;
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
    
    return false;
  };

  // Update handleSubmit to include doctorEmail
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
    
    if (!formData.phone || (typeof formData.phone === 'string' && !formData.phone.trim())) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Please select a date';
    }
    
    if (!formData.appointmentTime) {
      newErrors.appointmentTime = 'Please select a time';
    }
    
    // Check if the selected time slot is already booked remotely
    if (formData.appointmentTime && bookedTimeSlots.includes(formData.appointmentTime)) {
      newErrors.appointmentTime = 'This time slot has already been booked. Please select another time.';
      
      // Refresh booked slots to ensure we have the latest data
      if (formData.doctorId && formData.appointmentDate) {
        fetchBookedTimeSlots(formData.doctorId, formData.appointmentDate);
      }
    }
    
    // Check if the selected time slot is already booked locally
    if (formData.appointmentTime && isSlotBookedLocally(formData.doctorId, formData.appointmentDate, formData.appointmentTime)) {
      newErrors.appointmentTime = 'You have already booked this time slot. Please select another time.';
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
      // Get the selected doctor to ensure we have their email
      const selectedDoctor = filteredDoctors.find(doc => doc._id === formData.doctorId);
      
      // Format data for sending to API
      const appointmentData = {
        Speciality: formData.Speciality,
        Doctor: selectedDoctor?.Name || "Unknown Doctor",
        doctorId: formData.doctorId,
        doctorEmail: formData.doctorEmail || selectedDoctor?.Email || '',
        Name: formData.fullName,
        Email: formData.email,
        Phone: formData.phone,
        AppointDate: formData.appointmentDate,
        AppointTime: formData.appointmentTime,
        Symptoms: formData.symptoms || 'Not specified',
        Status: 'Active'
      };
      
      console.log("Appointment data with doctor email:", appointmentData);
      
      // Create a timestamp-based ID for local storage
      const localAppointmentId = `local-${Date.now()}`;
      
      console.log("Correct API endpoint based on backend code:", `${API_BASE_URL}/appoint/create`);
      
      // Get auth token
      const authToken = token || localStorage.getItem('token');
      console.log("Authentication token available:", !!authToken);
      
      // Try JSON first - the most reliable format
      try {
        console.log(`Making direct API call to the correct endpoint: ${API_BASE_URL}/appoint/create`);
        
        const response = await axios({
          method: 'post',
          url: `${API_BASE_URL}/appoint/create`,
          data: appointmentData,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken ? `Bearer ${authToken}` : '',
          },
          timeout: 10000
        });
        
        console.log("API Response:", response);
        
        if (response && response.data) {
          console.log("Successfully saved appointment to database:", response.data);
          
          // Get ID and process as usual
          const serverAppointmentId = response.data.appointmentId || 
                                    response.data._id || 
                                    response.data.id;
          
          // Handle file uploads if needed
          if (files.length > 0 && serverAppointmentId) {
            await uploadFiles(serverAppointmentId, authToken);
          }
          
          // Show success message
          toast.success("Appointment successfully stored in database!");
          
          // Redirect to confirmation page
          navigate('/appointment-confirmed', { 
            state: {
              appointmentId: serverAppointmentId || localAppointmentId,
              doctorName: selectedDoctor?.Name || "Your doctor",
              appointmentDate: formData.appointmentDate,
              appointmentTime: formData.appointmentTime,
              offlineMode: false,
              pendingSync: false,
              hasDocuments: files.length > 0
            }
          });
          return;
        }
      } catch (apiError) {
        console.error("Error saving appointment with correct endpoint:", apiError);
        
        if (apiError.response) {
          console.error("API response details:", apiError.response.status, apiError.response.data);
        }
      }
      
      // If direct approach fails, try the multiple endpoints approach
      try {
        // ... existing multiple endpoints code ...
      } catch (jsonError) {
        console.error("DIRECT JSON API CALL FAILED:", jsonError);
        
        // Try FormData as fallback
        try {
          const formDataForApi = new FormData();
          
          // Add all appointment data
          Object.entries(appointmentData).forEach(([key, value]) => {
            formDataForApi.append(key, value);
          });
          
          // Add files if any
          files.forEach((fileObj, index) => {
            formDataForApi.append(`document_${index}`, fileObj.file);
          });
          
          console.log("Trying FormData approach...");
          
          // Try multiple endpoints with FormData
          const possibleEndpoints = [
            `${API_BASE_URL}/appointments`, // Simple RESTful endpoint
            `${API_BASE_URL}/appointment`,  // Singular version
            `${API_BASE_URL}/appointments/add`, // Common add verb
            `${API_BASE_URL}/appointment/save`, // Save verb
            `${API_BASE_URL}/add-appointment`, // Hyphenated version
            `${API_BASE_URL}/appointment/create` // Original with no API prefix
          ];
          
          let formDataSuccess = false;
          let serverAppointmentId = null;
          let formDataResponse = null;
          
          // Try each endpoint until one works
          for (const endpoint of possibleEndpoints) {
            try {
              console.log(`Trying FormData endpoint: ${endpoint}`);
              
              const response = await axios({
                method: 'post',
                url: endpoint,
                data: formDataForApi,
                headers: {
                  'Content-Type': 'multipart/form-data',
                  'Authorization': authToken ? `Bearer ${authToken}` : '',
                },
                timeout: 15000
              });
              
              if (response && response.status < 400) {
                console.log(`SUCCESS! FormData endpoint ${endpoint} worked:`, response);
                formDataResponse = response;
                
                // Get appointment ID
                serverAppointmentId = response.data.appointmentId || 
                                    response.data._id || 
                                    response.data.id || 
                                    response.data.appointment?._id;
                
                formDataSuccess = true;
                break;
              }
            } catch (error) {
              console.warn(`FormData endpoint ${endpoint} failed:`, error.message);
            }
          }
          
          if (formDataSuccess && formDataResponse) {
            console.log("FORMDATA API CALL SUCCESSFUL:", formDataResponse);
            
            // Show success message
            toast.success("Appointment successfully stored in database!");
            
            // Redirect to confirmation page
            navigate('/appointment-confirmed', { 
              state: {
                appointmentId: serverAppointmentId || localAppointmentId,
                doctorName: selectedDoctor?.Name || "Your doctor",
                appointmentDate: formData.appointmentDate,
                appointmentTime: formData.appointmentTime,
                offlineMode: false,
                pendingSync: false,
                hasDocuments: files.length > 0
              }
            });
            return;
          }
        } catch (formDataError) {
          console.error("ALL FORMDATA API CALLS FAILED:", formDataError);
        }
      }
      
      // If we got here, both API calls failed - save to localStorage as fallback
      console.log("API calls failed, saving to localStorage as fallback");
      
      // Add booking to local storage 
      const localAppointment = {
        _id: localAppointmentId,
        doctorId: formData.doctorId,
        doctorName: appointmentData.Doctor,
        specialty: formData.Speciality,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        symptoms: formData.symptoms || 'Not specified',
        status: 'Active',
        createdAt: new Date().toISOString(),
        hasDocuments: files.length > 0
      };
      
      // Save to local storage
      saveLocalBooking(localAppointment);
      savePendingSync({...appointmentData, fileCount: files.length});
      
      // Show message
      toast.warning("Could not connect to server. Appointment saved locally for now.");
      
      // Redirect to confirmation page
      navigate('/appointment-confirmed', { 
        state: {
          appointmentId: localAppointmentId,
          doctorName: selectedDoctor?.Name || "Your doctor",
          appointmentDate: formData.appointmentDate,
          appointmentTime: formData.appointmentTime,
          offlineMode: true,
          pendingSync: true,
          hasDocuments: files.length > 0
        }
      });
      
    } catch (error) {
      console.error("ERROR DURING SUBMISSION:", error);
      
      if (error.stack) {
        console.error("Stack trace:", error.stack);
      }
      
      toast.error("Failed to book appointment. Please try again later.");
      
    } finally {
      setSubmitting(false);
    }
  };
  
  // Helper function to upload files
  const uploadFiles = async (appointmentId, authToken) => {
    if (!appointmentId || files.length === 0) return;
    
    try {
      console.log("Uploading files for appointment:", appointmentId);
      
      // Create FormData for files
      const fileFormData = new FormData();
      fileFormData.append('appointmentId', appointmentId);
      
      // Add files
      files.forEach((fileObj, index) => {
        fileFormData.append(`document_${index}`, fileObj.file);
        fileFormData.append(`documentName_${index}`, fileObj.name);
      });
      
      // Upload to server - use the correct endpoint based on backend code structure
      const fileEndpoint = `${API_BASE_URL}/appoint/documents/${appointmentId}`;
      console.log(`Uploading files to: ${fileEndpoint}`);
      
      const fileResponse = await axios({
        method: 'post',
        url: fileEndpoint,
        data: fileFormData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': authToken ? `Bearer ${authToken}` : '',
        },
        timeout: 30000
      });
      
      console.log("File upload response:", fileResponse);
      
      if (fileResponse && fileResponse.data) {
        console.log("Files uploaded successfully:", fileResponse.data);
        return true;
      }
    } catch (fileError) {
      console.error("Error uploading files:", fileError);
      // Try alternative endpoint
      try {
        const fileFormData = new FormData();
        fileFormData.append('appointmentId', appointmentId);
        
        // Add files
        files.forEach((fileObj, index) => {
          fileFormData.append(`document_${index}`, fileObj.file);
        });
        
        const alternativeEndpoint = `${API_BASE_URL}/upload/appointment/${appointmentId}`;
        console.log(`Trying alternative endpoint: ${alternativeEndpoint}`);
        
        const altResponse = await axios({
          method: 'post',
          url: alternativeEndpoint,
          data: fileFormData,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': authToken ? `Bearer ${authToken}` : '',
          },
          timeout: 30000
        });
        
        if (altResponse && altResponse.data) {
          console.log("Files uploaded successfully with alternative endpoint:", altResponse.data);
          return true;
        }
      } catch (altError) {
        console.error("Alternative upload failed:", altError);
      }
      
      if (fileError.response) {
        console.error("Upload error details:", fileError.response.data);
      }
      toast.warning("Appointment saved, but there was an issue uploading files.");
    }
    
    return false;
  };

  // Update getAvailableTimeSlots to use both API and local storage data
  const getAvailableTimeSlots = () => {
    const allSlots = [
      '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
      '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
      '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', 
      '04:00 PM', '04:30 PM', '05:00 PM'
    ];
    
    // Return all slots if no booked slots data
    if (!formData.doctorId || !formData.appointmentDate) {
      return allSlots;
    }
    
    // First check remote booked slots
    const remoteBookedSlots = bookedTimeSlots || [];
    
    // Then check locally stored booked slots
    const locallyBookedSlots = allSlots.filter(slot => 
      isSlotBookedLocally(formData.doctorId, formData.appointmentDate, slot)
    );
    
    // Combine both sources of booked slots
    const allBookedSlots = [...new Set([...remoteBookedSlots, ...locallyBookedSlots])];
    
    // Filter out booked slots
    return allSlots.filter(slot => !allBookedSlots.includes(slot));
  };

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

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center">
                Personal Information
                {hasUserData && (
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    From Profile
                  </span>
                )}
              </h2>
              
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 items-center">
                  Full Name
                  {hasUserData && (
                    <span className="ml-2">
                      <FaLock className="h-3 w-3 text-gray-400" />
                    </span>
                  )}
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
                  } ${hasUserData ? 'bg-gray-50 cursor-not-allowed border-gray-200 text-gray-700' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 items-center">
                  Email Address
                  {hasUserData && (
                    <span className="ml-2">
                      <FaLock className="h-3 w-3 text-gray-400" />
                    </span>
                  )}
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
                  } ${hasUserData ? 'bg-gray-50 cursor-not-allowed border-gray-200 text-gray-700' : ''}`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 items-center">
                  Phone Number
                  {hasUserData && (
                    <span className="ml-2">
                      <FaLock className="h-3 w-3 text-gray-400" />
                    </span>
                  )}
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
                  } ${hasUserData ? 'bg-gray-50 cursor-not-allowed border-gray-200 text-gray-700' : ''}`}
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
              
              {hasUserData && (
                <div className="text-xs text-gray-500 italic">
                  Personal information is automatically filled with your profile data to ensure accuracy.
                </div>
              )}
              
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
              
              {/* Medical Documents Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Medical Records (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 mt-1">
                  <div className="space-y-1 text-center">
                    <FaFileUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500">
                        <span>Upload previous reports or documents</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only" 
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept=".pdf,.jpg,.jpeg,.png"
                          multiple
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, JPG or PNG up to 5MB
                    </p>
                  </div>
                  
                  {/* File Preview */}
                  {files.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
                      <ul className="divide-y divide-gray-200">
                        {files.map((file, index) => (
                          <li key={index} className="py-3 flex justify-between items-center">
                            <div className="flex items-center">
                              {file.preview ? (
                                <img 
                                  src={file.preview} 
                                  alt={file.name} 
                                  className="h-10 w-10 object-cover rounded"
                                />
                              ) : (
                                <FaFilePdf className="h-10 w-10 text-red-500" />
                              )}
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(file.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                            </div>
                            <button 
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FaTrash className="h-4 w-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {fileErrors.length > 0 && (
                  <div className="mt-2">
                    {fileErrors.map((error, index) => (
                      <p key={index} className="text-sm text-red-600">{error}</p>
                    ))}
                  </div>
                )}
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
                    disabled={skipDoctorSelection && preSelectedDoctor}
                  >
                    <option value="">Select Specialty</option>
                    {SPECIALITIES.map((speciality) => (
                      <option key={speciality} value={speciality}>
                        {speciality}
                      </option>
                    ))}
                    {/* Add custom specialty if it's not in our predefined list */}
                    {preSelectedDoctor?.Speciality && 
                     !SPECIALITIES.includes(preSelectedDoctor.Speciality) && (
                      <option key={preSelectedDoctor.Speciality} value={preSelectedDoctor.Speciality}>
                        {preSelectedDoctor.Speciality}
                      </option>
                    )}
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
                      disabled={!formData.Speciality || (skipDoctorSelection && preSelectedDoctor)}
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
              
              {/* Doctor Email - Added for transparency */}
              {formData.doctorId && (
                <div>
                  <label htmlFor="doctorEmail" className="block text-sm font-medium text-gray-700">
                    Doctor's Email (for video consultation)
                  </label>
                  <input
                    type="email"
                    id="doctorEmail"
                    name="doctorEmail"
                    value={formData.doctorEmail || ""}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm cursor-not-allowed"
                  />
                  {!formData.doctorEmail && (
                    <p className="mt-1 text-sm text-amber-600">
                      No email available for this doctor. Video consultation may not be possible.
                    </p>
                  )}
                </div>
              )}
              
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
                {formData.appointmentDate && formData.doctorId && !checkingAvailability && getAvailableTimeSlots().length === 0 && (
                  <p className="mt-1 text-sm text-amber-600">
                    No available slots for this date. Please try another date.
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