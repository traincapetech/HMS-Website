import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaUserMd, FaSpinner } from 'react-icons/fa';
import { getDoctorProfile } from '../redux/doctorSlice';

const ProtectedDoctorRoute = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isVerifying, setIsVerifying] = useState(true);
  const [authError, setAuthError] = useState(null);
  
  // Get doctor authentication state from Redux
  const { isAuthenticated, loading, doctor, error } = useSelector((state) => state.doctor || {});
  
  // Check for deployment environment
  const isDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    // Setup authentication verification
    const verifyAuth = async () => {
      try {
        setIsVerifying(true);
        const doctorToken = localStorage.getItem('doctorToken');
        
        // If already authenticated in Redux state, we're good
        if (isAuthenticated && doctor) {
          console.log("✅ Doctor already authenticated:", doctor.Name || "Unknown");
          setIsVerifying(false);
          return;
        }
        
        // If we have a token but not authenticated in Redux, verify the token
        if (doctorToken) {
          try {
            // Try to get the doctor profile with the token
            await dispatch(getDoctorProfile()).unwrap();
            setIsVerifying(false);
          } catch (error) {
            console.error("🔴 Authentication failed:", error);
            
            // If development mode, log but allow access anyway
            if (isDevelopment) {
              console.warn("⚠️ Development mode: Bypassing auth check despite error");
              setIsVerifying(false);
            } else {
              setAuthError("Your session has expired. Please login again.");
              setIsVerifying(false);
            }
          }
        } else {
          // No token - show auth error or bypass in development
          if (isDevelopment) {
            console.warn("⚠️ Development mode: Bypassing auth check (no token)");
            setIsVerifying(false);
          } else {
            setAuthError("Authentication required to access this page");
            setIsVerifying(false);
          }
        }
      } catch (err) {
        console.error("🔴 Authentication verification error:", err);
        setAuthError("Authentication error. Please try logging in again.");
        setIsVerifying(false);
      }
    };

    verifyAuth();
  }, [isAuthenticated, doctor, location.pathname, dispatch, isDevelopment]);

  // Show loading spinner while verifying
  if (isVerifying || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <FaSpinner className="animate-spin h-16 w-16 text-red-600 mb-4" />
        <p className="text-gray-700 text-lg">Verifying your credentials...</p>
      </div>
    );
  }

  // Handle authentication error in production
  if (authError && !isDevelopment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-blue-600 text-5xl mb-6">
            <FaUserMd className="mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">{authError}</p>
          <button
            onClick={() => navigate('/doctor/login', { state: { from: location } })}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // In development mode, allow access regardless of auth status
  if (isDevelopment) {
    console.log("⚠️ Development mode: Rendering protected content without authentication");
    return children;
  }

  // In production, require authentication
  if (!isAuthenticated) {
    console.log("🔴 Authentication required, redirecting to login");
    return <Navigate to="/doctor/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedDoctorRoute; 