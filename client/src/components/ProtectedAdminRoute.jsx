import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
    const [isVerifying, setIsVerifying] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Simplified verification for direct login
        const verifyAdmin = () => {
            // Check if admin token exists
            const adminToken = localStorage.getItem('adminToken');
            const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
            
            // For the direct login approach, just check if token and role exist
            setIsAuthenticated(!!adminToken && !!adminData.role);
            setIsVerifying(false);
        };
        
        verifyAdmin();
    }, []);

    // Show loading while verifying
    if (isVerifying) {
        return <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    // If authenticated, render the protected component
    return children;
};

export default ProtectedAdminRoute; 