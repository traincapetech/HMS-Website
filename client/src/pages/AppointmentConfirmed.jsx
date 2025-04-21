import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FaCalendarCheck, FaVideo, FaFileMedical, FaUserMd, FaInfoCircle, FaClock, FaMapMarkerAlt, FaClipboard, FaEnvelope, FaHome } from 'react-icons/fa';
import { ENV } from '../utils/envUtils';

const AppointmentConfirmed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if we have appointment data in location state
    if (location.state && (location.state.appointmentId || location.state.demoMode)) {
      // Set appointment data from state
      setAppointment(location.state);
      setLoading(false);
      
      // Log for debugging
      console.log("Appointment data from state:", location.state);
    } else {
      // If no data in state, check if we have appointmentId in URL params
      const searchParams = new URLSearchParams(location.search);
      const appointmentId = searchParams.get('id');
      
      if (appointmentId) {
        // Fetch appointment data using the ID
        fetchAppointmentById(appointmentId);
      } else {
        setError('No appointment information found. Please try booking again.');
        setLoading(false);
      }
    }
  }, [location]);

  const fetchAppointmentById = async (id) => {
    try {
      const API_BASE_URL = ENV.API_URL;
      const response = await fetch(`${API_BASE_URL}/appointment/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch appointment details');
      }
      
      const data = await response.json();
      
      if (data && data.appointment) {
        setAppointment({
          appointmentId: data.appointment._id,
          doctorName: data.appointment.Doctor,
          appointmentDate: data.appointment.AppointDate,
          appointmentTime: data.appointment.AppointTime,
          zoomMeetingUrl: data.appointment.zoomMeetingUrl,
          zoomMeetingPassword: data.appointment.zoomMeetingPassword
        });
      } else {
        throw new Error('Invalid appointment data received');
      }
    } catch (err) {
      console.error('Error fetching appointment:', err);
      setError('Failed to load appointment details. Please check your email for confirmation.');
    } finally {
      setLoading(false);
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', options);
    } catch (e) {
      return dateString; // Fallback to original string if parsing fails
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-4" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <h3 className="text-xl font-semibold">Loading appointment details...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-red-600 py-6 px-8">
            <h1 className="text-2xl font-bold text-white">Appointment Error</h1>
          </div>
          <div className="p-8 text-center">
            <FaInfoCircle className="text-red-500 text-5xl mb-4 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex justify-center space-x-4">
              <Link 
                to="/appointment" 
                className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Book New Appointment
              </Link>
              <Link 
                to="/contact-us" 
                className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-green-600 py-6 px-8">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <FaCalendarCheck className="mr-2" /> Appointment Confirmed!
          </h1>
          <p className="text-white opacity-80 mt-1">
            Your appointment has been successfully booked
          </p>
        </div>

        {appointment?.demoMode && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 m-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaInfoCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Demo Mode:</strong> This is a demonstration booking. In a real booking, you would receive a confirmation email with all the details.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="p-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <FaCalendarCheck className="text-green-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Your appointment is confirmed!</h2>
                <p className="text-gray-600">
                  A confirmation has been sent to your email address.
                </p>
              </div>
            </div>
            
            <div className="border-t border-green-200 pt-4 mt-4">
              <p className="text-gray-700">
                <strong>Appointment ID:</strong> {appointment?.appointmentId}
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Appointment Details</h3>
          
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
            <div className="p-4 flex items-start">
              <FaUserMd className="text-gray-500 mt-1 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Doctor</p>
                <p className="font-medium text-gray-900">Dr. {appointment?.doctorName}</p>
              </div>
            </div>
            
            <div className="p-4 flex items-start">
              <FaCalendarCheck className="text-gray-500 mt-1 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium text-gray-900">{formatDate(appointment?.appointmentDate)}</p>
              </div>
            </div>
            
            <div className="p-4 flex items-start">
              <FaClock className="text-gray-500 mt-1 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium text-gray-900">{appointment?.appointmentTime}</p>
              </div>
            </div>
            
            {appointment?.zoomMeetingUrl && (
              <div className="p-4 flex items-start">
                <FaVideo className="text-gray-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Video Consultation Link</p>
                  <div className="mt-1">
                    <a 
                      href={appointment.zoomMeetingUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FaVideo className="mr-2" /> Join Zoom Meeting
                    </a>
                  </div>
                  {appointment.zoomMeetingPassword && (
                    <p className="text-sm text-gray-500 mt-2">
                      <strong>Meeting Password:</strong> {appointment.zoomMeetingPassword}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">What's Next?</h3>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <ol className="space-y-4">
              <li className="flex items-start">
                <div className="bg-blue-100 rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 font-medium text-sm">1</span>
                </div>
                <p className="text-gray-700">
                  <strong>Check your email</strong> - We've sent a confirmation with all the details and instructions.
                </p>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 font-medium text-sm">2</span>
                </div>
                <p className="text-gray-700">
                  <strong>Join your appointment on time</strong> - Use the Zoom link provided 5 minutes before your scheduled time.
                </p>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 font-medium text-sm">3</span>
                </div>
                <p className="text-gray-700">
                  <strong>Have your information ready</strong> - Prepare any medical records, list of medications, or questions you have for the doctor.
                </p>
              </li>
            </ol>
          </div>
          
          <div className="mt-8 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <Link 
              to="/UserProfile#Payments" 
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => {
                // Add analytics event if needed
                console.log('Navigating to appointments page');
                // Force a reload to ensure fresh data
                setTimeout(() => window.location.reload(), 100);
              }}
            >
              <FaClipboard className="mr-2" /> View My Appointments
            </Link>
            <Link 
              to="/" 
              className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <FaHome className="mr-2" /> Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentConfirmed; 