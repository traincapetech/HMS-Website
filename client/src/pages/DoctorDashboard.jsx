import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUserMd, FaCalendarCheck, FaFilePrescription, FaSpinner, FaExclamationTriangle, FaUser, FaUserTie } from 'react-icons/fa';
import { getCurrentDoctor } from '../utils/authUtils';
import { 
  getDoctorStatistics, 
  getDoctorTodayAppointments, 
  getDoctorPatients, 
  getDoctorPendingPrescriptions 
} from '../api/doctorApi';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { doctor } = useSelector((state) => state.doctor);
  
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

  // Get current doctor data from Redux or localStorage
  const [currentDoctor, setCurrentDoctor] = useState(null);

  useEffect(() => {
    // Try to get doctor from Redux first, then from localStorage
    const doctorData = doctor || getCurrentDoctor();
    
    if (doctorData) {
      console.log("Using doctor data:", doctorData.Name, doctorData._id || '(no ID)');
      setCurrentDoctor(doctorData);
    } else {
      console.warn("No doctor data found, using fallback");
      // Provide a fallback doctor for demo
      setCurrentDoctor({
        Name: "Doctor",
        Speciality: "General Medicine",
        Email: "doctor@example.com",
        _id: null
      });
      
      // Show warning toast only once
      toast.warning("Limited functionality: Doctor data incomplete.", {
        toastId: 'missing-doctor-data',
      });
    }
  }, [doctor]);

  useEffect(() => {
    // Fetch data when currentDoctor updates
    if (currentDoctor) {
      fetchDashboardData();
    }
  }, [currentDoctor]);

  const fetchDashboardData = async () => {
    if (!currentDoctor) return;

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
    const doctorId = currentDoctor._id;
    const doctorEmail = currentDoctor.Email;

    // Log the fetch attempt with available info
    console.log(`Fetching dashboard data for doctor: ID=${doctorId || 'undefined'}, Email=${doctorEmail || 'undefined'}`);

    // Fetch each metric independently so one failure doesn't block others
    fetchTotalPatients(doctorId, doctorEmail);
    fetchTodayAppointments(doctorId, doctorEmail);
    fetchPendingPrescriptions(doctorId, doctorEmail);
  };

  // Fetch total unique patients for this doctor
  const fetchTotalPatients = async (doctorId, doctorEmail) => {
    try {
      // First try the endpoint for combined statistics
      const statsResponse = await getDoctorStatistics(doctorId);
      
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
      
      // Count unique patients
      if (response && response.data) {
        const uniquePatients = response.data.length;
        setStatistics(prev => ({ ...prev, totalPatients: uniquePatients }));
      }
    } catch (err) {
      console.error('Error fetching patient count:', err);
      setError(prev => ({ ...prev, patients: 'Failed to load patient data' }));
      
      // Fallback to a reasonable estimate
      setStatistics(prev => ({ ...prev, totalPatients: 0 }));
    } finally {
      setLoading(prev => ({ ...prev, patients: false, stats: false }));
    }
  };

  // Fetch today's appointments
  const fetchTodayAppointments = async (doctorId, doctorEmail) => {
    try {
      const response = await getDoctorTodayAppointments(doctorId);
      
      if (response && (response.appointments || response.data)) {
        const appointments = response.appointments || response.data || [];
        setStatistics(prev => ({ 
          ...prev, 
          todayAppointments: Array.isArray(appointments) ? appointments.length : 0
        }));
      }
    } catch (err) {
      console.error('Error fetching today appointments:', err);
      setError(prev => ({ ...prev, appointments: 'Failed to load appointment data' }));
      
      // Fallback to zero
      setStatistics(prev => ({ ...prev, todayAppointments: 0 }));
    } finally {
      setLoading(prev => ({ ...prev, appointments: false }));
    }
  };

  // Fetch pending prescriptions
  const fetchPendingPrescriptions = async (doctorId, doctorEmail) => {
    try {
      const response = await getDoctorPendingPrescriptions(doctorId);
      
      if (response && (response.prescriptions || response.data)) {
        const prescriptions = response.prescriptions || response.data || [];
        setStatistics(prev => ({ 
          ...prev, 
          pendingPrescriptions: Array.isArray(prescriptions) ? prescriptions.length : 0
        }));
      }
    } catch (err) {
      console.error('Error fetching pending prescriptions:', err);
      setError(prev => ({ ...prev, prescriptions: 'Failed to load prescription data' }));
      
      // Fallback to zero
      setStatistics(prev => ({ ...prev, pendingPrescriptions: 0 }));
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
    <div className="bg-gray-100 min-h-screen">
      {/* Header section */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <FaUserTie className="text-red-600 text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, Dr. {currentDoctor?.Name || 'Doctor'}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {currentDoctor?.Speciality || 'Specialist'}
              </p>
              {currentDoctor?.Email && (
                <p className="mt-1 text-sm text-gray-500">
                  {currentDoctor.Email}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

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
  );
};

export default DoctorDashboard;