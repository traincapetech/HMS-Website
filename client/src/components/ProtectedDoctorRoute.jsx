import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';
import { getCurrentDoctor } from '../utils/authUtils';
import { logoutDoctor } from '../redux/doctorSlice';

const ProtectedDoctorRoute = ({ children }) => {
  const { doctor, isAuthenticated } = useSelector((state) => state.doctor);
  const dispatch = useDispatch();
  const [isVerifying, setIsVerifying] = useState(true);
  const [authVerified, setAuthVerified] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifyAuthentication = async () => {
      try {
        setIsVerifying(true);
        
        // Check if we have a token
        const token = localStorage.getItem('doctorToken');
        const storedDoctor = getCurrentDoctor();
        
        if (!token) {
          console.log('🔴 No token found');
          setAuthVerified(false);
          setIsVerifying(false);
          return;
        }
        
        // Verify we have doctor data either in Redux or localStorage
        if (storedDoctor || (doctor && Object.keys(doctor).length > 0)) {
          // Ensure we have proper doctor data with at least an email
          const doctorData = storedDoctor || doctor;
          const hasEmail = doctorData.Email || doctorData.email;
          
          if (hasEmail) {
            console.log('✅ Doctor authenticated:', doctorData.Name || doctorData.name || doctorData.Email || doctorData.email);
            setAuthVerified(true);
          } else {
            console.log('🔴 Invalid doctor data:', doctorData);
            // Clear the invalid data
            localStorage.removeItem('doctorToken');
            localStorage.removeItem('doctor');
            dispatch(logoutDoctor());
            setAuthVerified(false);
          }
        } else {
          console.log('🔴 Authentication failed: No doctor data');
          setAuthVerified(false);
        }
      } catch (error) {
        console.log('🔴 Authentication failed:', error);
        
        // For development, bypass auth check only on localhost
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
          console.warn('⚠️ Development mode (localhost): Bypassing auth check despite error');
          setAuthVerified(true);
        } else {
          toast.error('Authentication failed. Please log in again.');
          
          // Clear any invalid authentication data
          localStorage.removeItem('doctorToken');
          localStorage.removeItem('doctor');
          dispatch(logoutDoctor());
          
          setAuthVerified(false);
        }
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAuthentication();
  }, [doctor, dispatch]);

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <FaSpinner className="animate-spin text-red-600 text-4xl mb-4" />
        <p className="text-gray-600">Verifying authentication...</p>
      </div>
    );
  }

  if (!authVerified) {
    // Show a message before redirecting
    toast.error("Please log in as a doctor to access this page");
    
    // Redirect to login with return path
    return <Navigate to="/doctor/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedDoctorRoute; 