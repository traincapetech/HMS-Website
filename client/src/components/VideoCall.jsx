import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { FaVideo, FaEnvelope, FaCheckCircle, FaExclamationTriangle, FaCalendarAlt, FaClock, FaArrowLeft } from "react-icons/fa";

const VideoCall = () => {
  const location = useLocation();
  const { email, meetingLink } = location.state || {};
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        {/* Header Section with Gradient Background */}
        <div className="bg-gradient-to-r from-red-700 to-red-500 p-6">
          <div className="flex items-center justify-center">
            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <FaVideo className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h2 className="mt-4 text-center text-2xl font-extrabold text-white">
            {email ? "Appointment Confirmed!" : "Appointment Status"}
          </h2>
        </div>
        
        {/* Content Section */}
        <div className="p-8">
          {email ? (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="flex items-center justify-center text-green-600">
                <FaCheckCircle className="h-8 w-8 mr-2" />
                <span className="text-lg font-medium">Successfully Scheduled</span>
              </div>
              
              {/* Email Notification */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-start">
                  <FaEnvelope className="h-5 w-5 text-gray-500 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Meeting details have been sent to:</p>
                    <p className="font-medium text-gray-800">{email}</p>
                    <p className="mt-2 text-sm text-gray-500">
                      Please check your email inbox for the Zoom meeting invitation
                      including the meeting ID and password.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Meeting Information */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-800 mb-3">Appointment Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FaCalendarAlt className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">
                      Date: {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">
                      Please join the meeting at your scheduled appointment time
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Join Meeting Button */}
              {meetingLink ? (
                <div className="flex flex-col items-center">
                  <p className="text-center text-gray-700 font-medium mb-3">
                    Ready to join your appointment?
                  </p>
                  <a 
                    href={meetingLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                  >
                    <FaVideo className="mr-2" />
                    Join Meeting Now
                  </a>
                  <p className="mt-2 text-xs text-gray-500">
                    Opens Zoom in a new window
                  </p>
                </div>
              ) : (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                  <p className="text-blue-700 font-medium">
                    Meeting details will be available in your email
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    You will be able to join the meeting at your scheduled time
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4 text-center">
              <FaExclamationTriangle className="h-12 w-12 text-yellow-500" />
              <p className="text-lg font-medium text-gray-900">No appointment information found</p>
              <p className="text-gray-600">
                There was an error retrieving your appointment details. 
                Please try booking your appointment again.
              </p>
            </div>
          )}
          
          {/* Navigation Links */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-800">
              <FaArrowLeft className="mr-1" />
              Return to Home
            </Link>
            <Link to="/MyAppointments" className="text-sm font-medium text-red-600 hover:text-red-800">
              View My Appointments
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;