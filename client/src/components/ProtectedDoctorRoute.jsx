import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedDoctorRoute = ({ children }) => {
  // Temporarily bypass authentication check
  // Original code:
  // const { isAuthenticated, loading } = useSelector((state) => state.doctor);
  // const location = useLocation();

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
  //     </div>
  //   );
  // }

  // if (!isAuthenticated) {
  //   return <Navigate to="/doctor/login" state={{ from: location }} replace />;
  // }

  // TEMPORARY: Allow access to all doctor panel routes without authentication
  console.log("⚠️ TEMPORARY: Authentication bypassed for doctor panel routes");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return children;
};

export default ProtectedDoctorRoute; 