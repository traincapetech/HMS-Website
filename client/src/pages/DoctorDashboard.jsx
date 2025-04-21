import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUserMd, FaCalendarCheck, FaFilePrescription, FaSpinner, FaExclamationTriangle, FaUser, FaUserTie, FaExclamationCircle } from 'react-icons/fa';
import { getCurrentDoctor } from '../utils/authUtils';
import { 
  getDoctorStatistics, 
  getDoctorTodayAppointments, 
  getDoctorPatients, 
  getDoctorPendingPrescriptions 
} from '../api/doctorApi';
import { logoutDoctor } from '../redux/doctorSlice';
import { logoutUser } from '../redux/userSlice';
import API, { getApiDebugInfo } from '../app/api';

/**
 * DoctorDashboard Component
 * 
 * This component displays the doctor's dashboard with statistics and quick actions.
 * It includes strict authentication checks to ensure only logged-in doctors can access it
 * and prevents conflicts with patient authentication.
 */
const DoctorDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get authentication state from Redux
  const { doctor, isAuthenticated } = useSelector((state) => state.doctor);
  const { user: patientUser } = useSelector((state) => state.user);
  
  // Dashboard data states
  const [statistics, setStatistics] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingPrescriptions: 0
  });
  
  const [loading, setLoading] = useState({
    stats: true,
    patients: true,
    appointments: true,
    prescriptions: true
  });
  
  const [error, setError] = useState({
    stats: null,
    patients: null,
    appointments: null,
    prescriptions: null
  });

  // State for concurrent login warning
  const [showPatientLoginWarning, setShowPatientLoginWarning] = useState(false);
  
  // Add debug state
  const [debug, setDebug] = useState({
    visible: false,
    info: null,
    apiInfo: null,
    lastUpdate: null
  });

  // Get current doctor data from Redux or localStorage
  const [currentDoctor, setCurrentDoctor] = useState(null);

  /**
   * Authentication Check Effect
   * 
   * This effect runs on component mount and:
   * 1. Verifies doctor authentication
   * 2. Redirects to login if not authenticated
   * 3. Checks for conflicting patient login
   */
  useEffect(() => {
    const doctorToken = localStorage.getItem('doctorToken');
    
    // STEP 1: If no doctor authentication, redirect to login
    if (!isAuthenticated && !doctorToken) {
      toast.error("Please log in as a doctor to access the dashboard");
      navigate('/doctor/login');
      return;
    }
    
    // STEP 2: Check for concurrent patient login
    if (patientUser) {
      console.warn("User is simultaneously logged in as both patient and doctor");
      setShowPatientLoginWarning(true);
    }
    
    // STEP 3: Get doctor data from various sources
    const doctorData = doctor || getCurrentDoctor();
    
    if (doctorData) {
      console.log("[DEBUG] Using doctor data:", {
        name: doctorData.Name || doctorData.name || 'Unknown',
        id: doctorData._id || doctorData.id || 'No ID',
        email: doctorData.Email || doctorData.email || 'No email',
        fields: Object.keys(doctorData)
      });
      setCurrentDoctor(doctorData);
      
      // Update debug info
      updateDebugInfo(doctorData);
    } else {
      console.warn("[DEBUG] No doctor data found, redirecting to login");
      toast.error("Doctor session expired. Please log in again.");
      
      // Clear any doctor state
      dispatch(logoutDoctor());
      
      // Redirect to login
      navigate('/doctor/login');
    }
  }, [doctor, isAuthenticated, navigate, dispatch, patientUser]);

  // Fetch dashboard data when doctor data is available
  useEffect(() => {
    if (currentDoctor) {
      fetchDashboardData();
    }
  }, [currentDoctor]);
  
  // Add function to update debug info
  const updateDebugInfo = (doctorData) => {
    try {
      const token = localStorage.getItem('doctorToken');
      let tokenInfo = { exists: !!token };
      
      if (token) {
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            tokenInfo = {
              ...tokenInfo,
              payload,
              exp: payload.exp ? new Date(payload.exp * 1000).toLocaleString() : 'No expiration',
              isExpired: payload.exp ? Date.now() > payload.exp * 1000 : 'Unknown'
            };
          }
        } catch (e) {
          tokenInfo.error = e.message;
        }
      }
      
      setDebug(prev => ({
        ...prev,
        info: {
          doctor: doctorData ? {
            id: doctorData._id || doctorData.id || 'No ID',
            email: doctorData.Email || doctorData.email || 'No email',
            name: doctorData.Name || doctorData.name || 'No name',
            availableFields: Object.keys(doctorData)
          } : 'No doctor data',
          token: tokenInfo,
          localStorage: {
            doctorToken: !!localStorage.getItem('doctorToken'),
            doctorEmail: localStorage.getItem('doctorEmail'),
            doctorData: !!localStorage.getItem('doctor')
          }
        },
        apiInfo: getApiDebugInfo(),
        lastUpdate: new Date().toLocaleString()
      }));
    } catch (e) {
      console.error('Error updating debug info:', e);
    }
  };

  /**
   * handleLogout - Logs out from both doctor and patient accounts
   * 
   * This function:
   * 1. Clears all authentication data from localStorage
   * 2. Dispatches logout actions for both user types
   * 3. Redirects to the login page
   */
  const handleLogout = () => {
    // Clear both doctor and user tokens to prevent conflicts
    localStorage.removeItem('doctorToken');
    localStorage.removeItem('doctor');
    localStorage.removeItem('doctorEmail');
    
    // Also clear any user tokens to avoid conflicts
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Dispatch logout actions for both roles
    dispatch(logoutDoctor());
    dispatch(logoutUser()); // Also logout from patient account if logged in
    
    toast.success("Logged out successfully");
    navigate('/doctor/login');
  };

  /**
   * handlePatientLogout - Logs out only from patient account
   * 
   * This allows the user to continue as doctor while removing the patient session
   */
  const handlePatientLogout = () => {
    // Clear patient tokens
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Dispatch logout for patient
    dispatch(logoutUser());
    
    // Hide warning
    setShowPatientLoginWarning(false);
    
    toast.success("Logged out from patient account");
  };

  const fetchDashboardData = async () => {
    if (!currentDoctor) {
      console.error("[DEBUG] Cannot fetch dashboard data: No doctor data available");
      return;
    }

    // Reset all loading states
    setLoading({
      stats: true,
      patients: true,
      appointments: true, 
      prescriptions: true
    });

    // Reset errors
    setError({
      stats: null,
      patients: null,
      appointments: null,
      prescriptions: null
    });

    // Get doctor ID for API calls - if not available, use email to identify
    const doctorId = currentDoctor._id || currentDoctor.id || currentDoctor.Id || currentDoctor.doctorId;
    const doctorEmail = currentDoctor.Email || currentDoctor.email;

    // If neither ID nor email is available, we have invalid doctor data
    if (!doctorId && !doctorEmail) {
      console.error("[DEBUG] Invalid doctor data found:", currentDoctor);
      toast.error("Invalid doctor session detected. Please login again.");
      
      // Clear the invalid doctor data
      localStorage.removeItem('doctor');
      localStorage.removeItem('doctorToken');
      dispatch(logoutDoctor());
      
      // Redirect to login
      navigate('/doctor/login');
      return;
    }

    // Update debug info before API calls
    updateDebugInfo(currentDoctor);

    // Log the fetch attempt with available info
    console.log(`[DEBUG] Fetching dashboard data for doctor: ID=${doctorId || 'undefined'}, Email=${doctorEmail || 'undefined'}`);

    // Make a direct attempt to get doctor information first
    try {
      console.log('[DEBUG] Trying direct doctor info fetch');
      const response = await API.get(`/api/doctor/${doctorId}`);
      console.log('[DEBUG] Direct doctor fetch response:', response.data);
    } catch (err) {
      console.warn('[DEBUG] Direct doctor fetch failed:', err.message);
    }

    // Fetch each metric independently so one failure doesn't block others
    fetchTotalPatients(doctorId, doctorEmail);
    fetchTodayAppointments(doctorId, doctorEmail);
    fetchPendingPrescriptions(doctorId, doctorEmail);
  };

  // Toggle debug panel
  const toggleDebug = () => {
    setDebug(prev => ({
      ...prev,
      visible: !prev.visible
    }));
    
    // Update debug info when opening
    if (!debug.visible) {
      updateDebugInfo(currentDoctor);
    }
  };

  // Fetch total unique patients for this doctor
  const fetchTotalPatients = async (doctorId, doctorEmail) => {
    try {
      console.log(`Attempting to fetch patient data for doctor ID: ${doctorId}, Email: ${doctorEmail}`);
      
      // First try the endpoint for combined statistics
      const statsResponse = await getDoctorStatistics(doctorId);
      console.log('Statistics API response:', statsResponse);
      
      if (statsResponse && statsResponse.data) {
        // Update all statistics at once if available
        setStatistics(prev => ({
          ...prev,
          totalPatients: statsResponse.data.totalPatients || 0,
          todayAppointments: statsResponse.data.todayAppointments || 0,
          pendingPrescriptions: statsResponse.data.pendingPrescriptions || 0
        }));
        
        // All stats loaded at once
        setLoading(prev => ({
          ...prev,
          stats: false,
          patients: false,
          appointments: false,
          prescriptions: false
        }));
        
        return;
      }
      
      // Fallback: Get just patients if combined endpoint doesn't work
      const response = await getDoctorPatients(doctorId);
      console.log('Patients API response:', response);
      
      // Determine patients count from various possible response formats
      let patientCount = 0;
      
      if (response && response.data && Array.isArray(response.data)) {
        patientCount = response.data.length;
      } else if (response && response.patients && Array.isArray(response.patients)) {
        patientCount = response.patients.length;
      } else if (response && Array.isArray(response)) {
        patientCount = response.length;
      }
      
      console.log(`Calculated patient count: ${patientCount}`);
      setStatistics(prev => ({ ...prev, totalPatients: patientCount }));
    } catch (err) {
      console.error('Error fetching patient count:', err);
      setError(prev => ({ ...prev, patients: err.message || 'Failed to load patients' }));
    } finally {
      setLoading(prev => ({ ...prev, patients: false, stats: false }));
    }
  };

  // Fetch today's appointments
  const fetchTodayAppointments = async (doctorId, doctorEmail) => {
    try {
      console.log(`Attempting to fetch appointments for doctor ID: ${doctorId}, Email: ${doctorEmail}`);
      
      const response = await getDoctorTodayAppointments(doctorId);
      console.log('Appointments API response:', response);
      
      // Calculate appointment count from response
      let appointmentCount = 0;
      
      if (response && response.data && Array.isArray(response.data)) {
        appointmentCount = response.data.length;
      } else if (response && response.appointments && Array.isArray(response.appointments)) {
        appointmentCount = response.appointments.length;
      } else if (response && response.count) {
        appointmentCount = response.count;
      } else if (response && Array.isArray(response)) {
        appointmentCount = response.length;
      }
      
      console.log(`Calculated today's appointment count: ${appointmentCount}`);
      setStatistics(prev => ({ ...prev, todayAppointments: appointmentCount }));
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(prev => ({ ...prev, appointments: err.message || 'Failed to load appointments' }));
    } finally {
      setLoading(prev => ({ ...prev, appointments: false }));
    }
  };

  // Fetch pending prescriptions
  const fetchPendingPrescriptions = async (doctorId, doctorEmail) => {
    try {
      console.log(`Attempting to fetch prescriptions for doctor ID: ${doctorId}, Email: ${doctorEmail}`);
      
      const response = await getDoctorPendingPrescriptions(doctorId);
      console.log('Prescriptions API response:', response);
      
      // Calculate prescription count from response
      let prescriptionCount = 0;
      
      if (response && response.data && Array.isArray(response.data)) {
        prescriptionCount = response.data.length;
      } else if (response && response.prescriptions && Array.isArray(response.prescriptions)) {
        prescriptionCount = response.prescriptions.length;
      } else if (response && response.count) {
        prescriptionCount = response.count;
      } else if (response && Array.isArray(response)) {
        prescriptionCount = response.length;
      }
      
      console.log(`Calculated pending prescription count: ${prescriptionCount}`);
      setStatistics(prev => ({ ...prev, pendingPrescriptions: prescriptionCount }));
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
      setError(prev => ({ ...prev, prescriptions: err.message || 'Failed to load prescriptions' }));
    } finally {
      setLoading(prev => ({ ...prev, prescriptions: false }));
    }
  };

  // Check if all data is loaded
  const isAllLoaded = !loading.stats && !loading.patients && 
                      !loading.appointments && !loading.prescriptions;

  // If we're still loading everything and no doctor data
  if (Object.values(loading).every(l => l) && !currentDoctor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <FaSpinner className="animate-spin text-red-600 text-4xl mb-4" />
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Debug button - only in development */}
      <div className="text-right mb-2">
        <button 
          onClick={toggleDebug}
          className="text-sm bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
        >
          {debug.visible ? 'Hide Debug' : 'Show Debug'}
        </button>
      </div>
      
      {/* Debug Panel */}
      {debug.visible && (
        <div className="bg-gray-100 p-3 rounded mb-4 text-xs border border-gray-300 overflow-auto max-h-96">
          <h3 className="font-bold">Debug Information (Last updated: {debug.lastUpdate})</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <h4 className="font-semibold">Doctor Info</h4>
              <pre className="bg-white p-2 rounded mt-1 overflow-auto">
                {JSON.stringify(debug.info?.doctor, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold">Token Info</h4>
              <pre className="bg-white p-2 rounded mt-1 overflow-auto">
                {JSON.stringify(debug.info?.token, null, 2)}
              </pre>
            </div>
          </div>
          <div className="mt-3">
            <h4 className="font-semibold">API Info</h4>
            <pre className="bg-white p-2 rounded mt-1 overflow-auto">
              {JSON.stringify(debug.apiInfo, null, 2)}
            </pre>
          </div>
          <div className="mt-3">
            <h4 className="font-semibold">LocalStorage</h4>
            <pre className="bg-white p-2 rounded mt-1 overflow-auto">
              {JSON.stringify(debug.info?.localStorage, null, 2)}
            </pre>
          </div>
          <div className="mt-3">
            <button
              onClick={fetchDashboardData}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
            >
              Refresh Data
            </button>
          </div>
        </div>
      )}
      
      {/* Patient Login Warning */}
      {showPatientLoginWarning && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationTriangle className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm">
                You are currently logged in as both a patient and a doctor.
                This may cause confusion when switching between dashboards.
              </p>
              <div className="mt-2">
                <button
                  onClick={handlePatientLogout}
                  className="bg-yellow-200 hover:bg-yellow-300 text-yellow-800 px-3 py-1 rounded text-sm"
                >
                  Log out from patient account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Dashboard content */}
      <div className="min-h-screen bg-gray-100">
        {/* Dashboard Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <FaUserMd className="mr-2 text-red-600" />
                Doctor Dashboard
              </h1>
              {currentDoctor && (
                <p className="text-sm text-gray-600 mt-1">
                  Welcome, Dr. {currentDoctor.Name} | {currentDoctor.Speciality || 'Specialist'}
                </p>
              )}
            </div>
            
            {/* Logout Button */}
            <div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Statistics cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Total Patients Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                    <FaUser className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Patients
                      </dt>
                      <dd>
                        {loading.patients ? (
                          <FaSpinner className="animate-spin h-5 w-5 text-gray-400" />
                        ) : (
                          <div className="flex items-center">
                            <div className="text-lg font-medium text-gray-900">
                              {statistics.totalPatients}
                            </div>
                            {error.patients && (
                              <FaExclamationTriangle className="h-4 w-4 text-yellow-500 ml-2" title={error.patients} />
                            )}
                          </div>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to="/doctor/patients" className="font-medium text-blue-700 hover:text-blue-900">
                    View all patients
                  </Link>
                </div>
              </div>
            </div>

            {/* Today's Appointments Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <FaCalendarCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Today's Appointments
                      </dt>
                      <dd>
                        {loading.appointments ? (
                          <FaSpinner className="animate-spin h-5 w-5 text-gray-400" />
                        ) : (
                          <div className="flex items-center">
                            <div className="text-lg font-medium text-gray-900">
                              {statistics.todayAppointments}
                            </div>
                            {error.appointments && (
                              <FaExclamationTriangle className="h-4 w-4 text-yellow-500 ml-2" title={error.appointments} />
                            )}
                          </div>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to="/doctor/appointments" className="font-medium text-green-700 hover:text-green-900">
                    View appointments
                  </Link>
                </div>
              </div>
            </div>

            {/* Pending Prescriptions Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                    <FaFilePrescription className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Pending Prescriptions
                      </dt>
                      <dd>
                        {loading.prescriptions ? (
                          <FaSpinner className="animate-spin h-5 w-5 text-gray-400" />
                        ) : (
                          <div className="flex items-center">
                            <div className="text-lg font-medium text-gray-900">
                              {statistics.pendingPrescriptions}
                            </div>
                            {error.prescriptions && (
                              <FaExclamationTriangle className="h-4 w-4 text-yellow-500 ml-2" title={error.prescriptions} />
                            )}
                          </div>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to="/doctor/prescriptions" className="font-medium text-red-700 hover:text-red-900">
                    View prescriptions
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h2>
            <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Quick Action Cards */}
              <Link to="/doctor/appointments/new" className="bg-white overflow-hidden shadow rounded-lg hover:bg-gray-50">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                      <FaCalendarCheck className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <h3 className="text-base font-medium text-gray-900">Schedule Appointment</h3>
                      <p className="mt-1 text-sm text-gray-500">Create a new appointment for a patient</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link to="/doctor/consultations/new" className="bg-white overflow-hidden shadow rounded-lg hover:bg-gray-50">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                      <FaUserMd className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <h3 className="text-base font-medium text-gray-900">Start Consultation</h3>
                      <p className="mt-1 text-sm text-gray-500">Begin a new patient consultation</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link to="/doctor/prescriptions/new" className="bg-white overflow-hidden shadow rounded-lg hover:bg-gray-50">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                      <FaFilePrescription className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <h3 className="text-base font-medium text-gray-900">Write Prescription</h3>
                      <p className="mt-1 text-sm text-gray-500">Create a new prescription for a patient</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Show fallback notice if doctor ID is missing */}
          {!currentDoctor?._id && (
            <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <span className="font-medium">Notice:</span> Some features may be limited as you are using demo mode or have incomplete doctor profile data.
                  </p>
                  <div className="mt-2">
                    <Link to="/api-diagnostics" className="text-sm font-medium text-yellow-800 hover:text-yellow-900">
                      Run API Diagnostics to troubleshoot issues →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;