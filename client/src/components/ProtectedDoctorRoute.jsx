import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';
import { getCurrentDoctor } from '../utils/authUtils';

const ProtectedDoctorRoute = ({ children }) => {
  const { doctor, isAuthenticated } = useSelector((state) => state.doctor);
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
        if (storedDoctor || doctor) {
          console.log('✅ Doctor authenticated:', storedDoctor?.Name || doctor?.Name);
          setAuthVerified(true);
        } else {
          console.log('🔴 Authentication failed: No doctor data');
          setAuthVerified(false);
        }
      } catch (error) {
        console.log('🔴 Authentication failed:', error);
        
        // For development, bypass auth check
        if (typeof window !== 'undefined' && window.location.hostname === 'https://hms-backend-1-pngp.onrender.com') {
          console.warn('⚠️ Development mode: Bypassing auth check despite error');
          setAuthVerified(true);
        } else {
          toast.error('Authentication failed. Please log in again.');
          setAuthVerified(false);
        }
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAuthentication();
  }, [doctor]);

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <FaSpinner className="animate-spin text-red-600 text-4xl mb-4" />
        <p className="text-gray-600">Verifying authentication...</p>
      </div>
    );
  }

  if (!authVerified && !isAuthenticated) {
    // Redirect to login with return path
    return <Navigate to="/doctor/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedDoctorRoute; 