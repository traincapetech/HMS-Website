import React from 'react';
import ApiDiagnosticsComponent from '../components/ApiDiagnostics';

const ApiDiagnostics = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">API Diagnostics</h1>
      <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
        This page helps diagnose issues with API endpoints and connectivity. Use it to troubleshoot 404 errors 
        and other API-related problems.
      </p>
      
      <ApiDiagnosticsComponent />
    </div>
  );
};

export default ApiDiagnostics; 