import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../../redux/userSlice";
import axios from "axios";
import { FaVideo, FaCalendarAlt, FaSpinner, FaExclamationTriangle, FaCheck, FaClock, FaTimes, FaSync, FaTools } from "react-icons/fa";
import { ENV } from "../../../utils/envUtils";
import api, { API_BASE_URL } from '../../../utils/app.api';
import { toast } from 'react-toastify';
import { format, parseISO } from 'date-fns';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [apiStatus, setApiStatus] = useState({ checking: false, error: null, success: false });
  
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.Email) {
      fetchAppointments();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("Attempting to fetch appointments for user:", user?.Email || user?.email);
      
      if (!user?.Email && !user?.email) {
        console.error("No user email found. User data:", user);
        setError("User email not found. Please log in again.");
        setLoading(false);
        return;
      }
      
      const userEmail = user.Email || user.email;
      console.log("Using email address:", userEmail);
      
      // Try endpoints in order - specifically try the most reliable endpoints first
      // Order is important - most specific to most general
      const endpoints = [
        // Try the query endpoint first (most reliable based on latest fixes)
        `${API_BASE_URL}/appoint/query?email=${encodeURIComponent(userEmail)}`,
        // Try direct patient endpoints next
        `${API_BASE_URL}/appoint/patient/${encodeURIComponent(userEmail)}`,
        // Try root endpoint with query parameters
        `${API_BASE_URL}/appoint?email=${encodeURIComponent(userEmail)}`,
        // Try get all and filter client-side as last resort
        `${API_BASE_URL}/appoint/all`,
        // Fallback to alternative endpoints if necessary
        `${API_BASE_URL}/appointment/query?email=${encodeURIComponent(userEmail)}`,
        `${API_BASE_URL}/appointment/patient/${encodeURIComponent(userEmail)}`,
        `${API_BASE_URL}/appointment?email=${encodeURIComponent(userEmail)}`
      ];
      
      let appointmentsData = null;
      let lastError = null;
      let successfulEndpoint = null;
      let responseDetails = [];
      
      // Try each endpoint until one succeeds
      for (const endpoint of endpoints) {
        try {
          console.log(`Attempting to fetch appointments from: ${endpoint}`);
          const startTime = Date.now();
          const response = await axios.get(endpoint, { timeout: 15000 }); // Increased timeout to 15 seconds
          const endTime = Date.now();
          
          responseDetails.push({
            endpoint,
            status: response.status,
            time: endTime - startTime,
            success: response.status === 200
          });
          
          if (response.status === 200) {
            console.log("Response from endpoint:", endpoint, response.status, response.data);
            
            if (response.data) {
              if (Array.isArray(response.data.appointments)) {
                // Handle standard { success: true, appointments: [...] } format
                appointmentsData = response.data.appointments;
                successfulEndpoint = endpoint;
                console.log(`Successfully retrieved ${appointmentsData.length} appointments from ${endpoint}`);
                break;
              } else if (Array.isArray(response.data)) {
                // Handle direct array response format
                appointmentsData = response.data;
                successfulEndpoint = endpoint;
                console.log(`Successfully retrieved ${appointmentsData.length} appointments from ${endpoint}`);
                break;
              } else if (response.data.appointment) {
                // Handle single appointment response - convert to array
                appointmentsData = [response.data.appointment];
                successfulEndpoint = endpoint;
                console.log(`Successfully retrieved single appointment from ${endpoint}`);
                break;
              } else {
                console.warn(`Endpoint ${endpoint} returned unexpected data format:`, response.data);
              }
            }
          }
        } catch (err) {
          console.error(`Error fetching from ${endpoint}:`, err);
          responseDetails.push({
            endpoint,
            status: err.response?.status || 'Network Error',
            error: err.message,
            success: false
          });
          lastError = err;
        }
      }
      
      // Process the results after trying all endpoints
      if (appointmentsData && appointmentsData.length > 0) {
        console.log(`Successfully retrieved ${appointmentsData.length} appointments from ${successfulEndpoint}`);
        
        // Filter appointments if we got appointments from 'all' endpoints
        if (successfulEndpoint.includes('/all')) {
          console.log('Filtering appointments from all endpoint');
          
          // Case insensitive email matching
          const userEmailLower = userEmail.toLowerCase();
          appointmentsData = appointmentsData.filter(appt => {
            const apptEmail = appt.Email || appt.patientEmail || appt.email || '';
            return apptEmail.toLowerCase() === userEmailLower;
          });
          
          console.log(`After filtering, found ${appointmentsData.length} appointments for user`);
        }
        
        // Sort appointments by date (newest first)
        appointmentsData.sort((a, b) => {
          const dateA = new Date(a.AppointDate || a.date);
          const dateB = new Date(b.AppointDate || b.date);
          return dateB - dateA;
        });
        
        setAppointments(appointmentsData);
        if (appointmentsData.length === 0) {
          setError("No appointments found. Schedule your first appointment!");
        }
      } else {
        // If we didn't get any appointments even though an endpoint succeeded
        if (successfulEndpoint && (!appointmentsData || appointmentsData.length === 0)) {
          console.log("No appointments found in successful response");
          setAppointments([]);
          setError("No appointments found. Schedule your first appointment!");
        } else {
          // No successful endpoint at all
          const endpointList = responseDetails.map(detail => 
            `${detail.endpoint} → ${detail.status} ${detail.error ? `(${detail.error})` : ''}`
          ).join('\n');
          
          const errorMsg = lastError 
            ? `Could not fetch appointments: ${lastError.message}`
            : "No appointments found. All endpoints failed.";
          
          console.error(errorMsg);
          console.error("Endpoint details:\n" + endpointList);
          
          setError(`${errorMsg}\nPlease try the API Diagnostics tool to troubleshoot.`);
          setAppointments([]);
        }
      }
    } catch (err) {
      console.error("Unhandled error fetching appointments:", err);
      setError(`Failed to load appointments: ${err.message}`);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.delete(`${API_BASE_URL}/appoint/${id}`);

      if (response.status === 200) {
        // Try to update the status instead of complete deletion
        try {
          await axios.patch(`${API_BASE_URL}/appointment/${id}/status`, { status: 'Cancelled' });
        } catch (statusError) {
          console.warn("Could not update status, but appointment was deleted", statusError);
        }
        
        await fetchAppointments();
        alert("Appointment canceled successfully.");
      } else {
        alert("Failed to cancel appointment. Please try again.");
      }
    } catch (error) {
      console.error("Error canceling appointment:", error);
      alert("Failed to cancel appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = (appointment) => {
    navigate(
      `/appointments?speciality=${appointment.Speciality}&doctor=${appointment.Doctor}&doctorId=${appointment.doctorId}`
    );
  };

  const handleJoinMeeting = (zoomUrl) => {
    if (zoomUrl) {
      window.open(zoomUrl, '_blank');
    } else {
      alert("No Zoom meeting link available for this appointment.");
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', options);
    } catch (e) {
      return dateString; // Fallback to original string if parsing fails
    }
  };

  // Check if appointment is today
  const isToday = (dateString) => {
    if (!dateString) return false;
    
    try {
      const appointmentDate = new Date(dateString);
      const today = new Date();
      
      return appointmentDate.getDate() === today.getDate() &&
             appointmentDate.getMonth() === today.getMonth() &&
             appointmentDate.getFullYear() === today.getFullYear();
    } catch (e) {
      return false;
    }
  };

  // Get status display information
  const getStatusInfo = (appointment) => {
    // If the appointment has a specific status field, use it
    if (appointment.Status) {
      switch (appointment.Status) {
        case 'Confirmed':
          return { 
            label: 'Confirmed', 
            color: 'text-green-600', 
            bgColor: 'bg-green-100',
            icon: <FaCheck className="mr-1" />
          };
        case 'Pending':
          return { 
            label: 'Pending', 
            color: 'text-yellow-600', 
            bgColor: 'bg-yellow-100',
            icon: <FaClock className="mr-1" />
          };
        case 'Completed':
          return { 
            label: 'Completed', 
            color: 'text-blue-600', 
            bgColor: 'bg-blue-100',
            icon: <FaCheck className="mr-1" />
          };
        case 'Cancelled':
          return { 
            label: 'Cancelled', 
            color: 'text-red-600', 
            bgColor: 'bg-red-100',
            icon: <FaTimes className="mr-1" />
          };
        default:
          return { 
            label: appointment.Status, 
            color: 'text-gray-600', 
            bgColor: 'bg-gray-100',
            icon: null
          };
      }
    }
    
    // Otherwise, derive status from date
    const appointmentDate = new Date(appointment.AppointDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (appointmentDate < today) {
      return { 
        label: 'Completed', 
        color: 'text-blue-600', 
        bgColor: 'bg-blue-100',
        icon: <FaCheck className="mr-1" />
      };
    } else if (isToday(appointment.AppointDate)) {
      return { 
        label: 'Today', 
        color: 'text-green-600', 
        bgColor: 'bg-green-100',
        icon: <FaCalendarAlt className="mr-1" />
      };
    } else {
      return { 
        label: 'Upcoming', 
        color: 'text-blue-600', 
        bgColor: 'bg-blue-100',
        icon: <FaCalendarAlt className="mr-1" />
      };
    }
  };

  // New function to check API connectivity
  const checkApiConnection = async () => {
    setApiStatus({ checking: true, error: null, success: false });
    
    try {
      // Try accessing the status endpoint first
      try {
        const response = await axios.get(`${API_BASE_URL}/status`);
        if (response.status === 200) {
          console.log('API status check successful:', response.data);
          setApiStatus({ checking: false, error: null, success: true });
          // Refresh appointments after confirming API is working
          fetchAppointments();
          return;
        }
      } catch (statusError) {
        console.warn('Status endpoint not available, trying root endpoint');
      }
      
      // Try the root endpoint as fallback
      const rootResponse = await axios.get('https://hms-backend-1-pngp.onrender.com/');
      console.log('Root endpoint response:', rootResponse.status);
      setApiStatus({ checking: false, error: null, success: true });
      
      // Refresh appointments after confirming API is working
      fetchAppointments();
    } catch (error) {
      console.error('API connection check failed:', error);
      setApiStatus({ 
        checking: false, 
        error: `Cannot connect to API server: ${error.message}`,
        success: false 
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div >
     
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Appointments</h2>
          <div className="flex space-x-2">
            {error && (
              <div className="flex space-x-2">
                <button
                  onClick={checkApiConnection}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md flex items-center"
                  disabled={apiStatus.checking}
                >
                  {apiStatus.checking ? (
                    <><FaSpinner className="animate-spin mr-2" /> Checking API...</>
                  ) : (
                    <><FaSync className="mr-2" /> Check Connection</>
                  )}
                </button>
                <Link
                  to="/api-diagnostics"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <FaTools className="mr-2" /> API Diagnostics
                </Link>
              </div>
            )}
            <Link 
              to="/Appointments" 
              className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              <FaCalendarAlt className="mr-2" /> Book New Appointment
            </Link>
          </div>
        </div>

        {apiStatus.error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <strong>API Connection Error:</strong> {apiStatus.error}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Please check your internet connection or try again later.
                </p>
              </div>
            </div>
          </div>
        )}

        {apiStatus.success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaCheck className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  <strong>API Connection Successful:</strong> Server is responding correctly.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
            <p>
              {error}
              <Link 
                to="/api-diagnostics" 
                className="ml-2 text-blue-600 hover:text-blue-800 font-medium underline"
              >
                Run API Diagnostics
              </Link>
            </p>
            <p className="text-sm mt-2">
              If you're having trouble viewing your appointments, try refreshing the page or checking your connection. 
              Still having issues? Click the diagnostic link above to troubleshoot.
            </p>
          </div>
        )}

        <div className="bg-white p-4 rounded-lg shadow-md">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FaSpinner className="animate-spin text-red-600 text-4xl mb-4" />
              <p className="text-gray-600">Loading your appointments...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FaExclamationTriangle className="text-yellow-500 text-4xl mb-4" />
              <p className="text-red-500 font-medium">{error}</p>
              <p className="text-gray-600 mt-2">Please try again later or contact support.</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FaCalendarAlt className="text-gray-400 text-4xl mb-4" />
              <p className="text-gray-600 font-medium">No appointments found</p>
              <Link 
                to="/Appointments" 
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Book Your First Appointment
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {appointments.map((appointment) => {
                    const statusInfo = getStatusInfo(appointment);
                    const isUpcoming = statusInfo.label === 'Upcoming' || statusInfo.label === 'Today' || statusInfo.label === 'Confirmed';
                    const showJoinButton = isUpcoming && appointment.zoomMeetingUrl && isToday(appointment.AppointDate);
                    
                    return (
                      <tr key={appointment._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{formatDate(appointment.AppointDate)}</div>
                          <div className="text-sm text-gray-500">{appointment.AppointTime}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">Dr. {appointment.Doctor}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{appointment.Speciality}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                            {statusInfo.icon}
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            {showJoinButton && (
                              <button
                                onClick={() => handleJoinMeeting(appointment.zoomMeetingUrl)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                <FaVideo className="mr-1" />
                                Join
                              </button>
                            )}
                            
                            {isUpcoming && (
                              <>
                                <button
                                  onClick={() => handleReschedule(appointment)}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none"
                                >
                                  Reschedule
                                </button>
                                <button
                                  onClick={() => handleDelete(appointment._id)}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
  );
};

export default MyAppointments;