import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaSpinner, FaServer, FaInfoCircle, FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getCurrentDoctor } from '../utils/authUtils';
import { ENV } from '../utils/envUtils';

const ApiDiagnostics = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [doctorId, setDoctorId] = useState('');
  const [doctorEmail, setDoctorEmail] = useState('');
  const [expandedSection, setExpandedSection] = useState(null);
  
  // Fetch doctor info on load
  useEffect(() => {
    const doctorData = getCurrentDoctor();
    if (doctorData) {
      setDoctorId(doctorData._id || '');
      setDoctorEmail(doctorData.Email || '');
    }
  }, []);

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const runDiagnostics = async () => {
    setLoading(true);
    setResults({});
    const API_URL = ENV.API_URL || 'https://hms-backend-1-pngp.onrender.com/api';
    
    console.log(`Running diagnostics with doctor ID: ${doctorId || 'not available'}`);
    
    const diagnosticResults = {
      connectivity: { success: false, data: null, error: null },
      doctorEndpoints: { success: false, data: [], error: null },
      appointmentEndpoints: { success: false, data: [], error: null },
      statistics: { success: false, data: null, error: null },
    };
    
    // Test basic connectivity first
    try {
      const baseUrlResponse = await axios.get(`${API_URL}/status`, { timeout: 5000 });
      diagnosticResults.connectivity = {
        success: true,
        data: {
          status: baseUrlResponse.status,
          data: baseUrlResponse.data,
          url: `${API_URL}/status`
        },
        error: null
      };
    } catch (error) {
      console.error('API connectivity test failed:', error);
      diagnosticResults.connectivity = {
        success: false,
        data: null,
        error: error.message,
        details: error.response ? {
          status: error.response.status,
          data: error.response.data
        } : 'No response received'
      };
    }
    
    // Test doctor-specific endpoints if we have a doctor ID
    if (doctorId) {
      const doctorEndpoints = [
        { name: 'Get Doctor Profile', url: `${API_URL}/doctors/${doctorId}` },
        { name: 'Get Doctor Statistics', url: `${API_URL}/doctors/statistics/${doctorId}` },
        { name: 'Get Doctor Appointments', url: `${API_URL}/appoint/doctor/${doctorId}` },
        { name: 'Get Doctor Today Appointments', url: `${API_URL}/appoint/doctor/${doctorId}?date=${new Date().toISOString().split('T')[0]}` },
        { name: 'Get Doctor Prescriptions', url: `${API_URL}/prescriptions/doctor/${doctorId}/pending` }
      ];
      
      const doctorResults = [];
      
      for (const endpoint of doctorEndpoints) {
        try {
          const response = await axios.get(endpoint.url, {
            timeout: 8000,
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('doctorToken')}`,
              'Content-Type': 'application/json'
            }
          });
          
          doctorResults.push({
            name: endpoint.name,
            url: endpoint.url,
            success: true,
            status: response.status,
            data: response.data,
            dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
            dataLength: Array.isArray(response.data) ? response.data.length : (
              response.data && typeof response.data === 'object' ? Object.keys(response.data).length : 'N/A'
            )
          });
        } catch (error) {
          doctorResults.push({
            name: endpoint.name,
            url: endpoint.url,
            success: false,
            status: error.response ? error.response.status : 'No response',
            error: error.message,
            details: error.response ? error.response.data : 'No details available'
          });
        }
      }
      
      diagnosticResults.doctorEndpoints = {
        success: doctorResults.some(r => r.success),
        data: doctorResults,
        error: null
      };
    }
    
    // Test appointment endpoints
    const appointmentEndpoints = [
      { name: 'Get All Appointments', url: `${API_URL}/appoint` },
      { name: 'Get Appointments by Query', url: `${API_URL}/appoint/query` }
    ];
    
    if (doctorEmail) {
      appointmentEndpoints.push(
        { name: 'Get Appointments by Doctor Email', url: `${API_URL}/appoint?doctor=${encodeURIComponent(doctorEmail)}` }
      );
    }
    
    const appointmentResults = [];
    
    for (const endpoint of appointmentEndpoints) {
      try {
        const response = await axios.get(endpoint.url, {
          timeout: 8000,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('doctorToken')}`,
            'Content-Type': 'application/json'
          }
        });
        
        appointmentResults.push({
          name: endpoint.name,
          url: endpoint.url,
          success: true,
          status: response.status,
          data: response.data,
          dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
          dataLength: Array.isArray(response.data) ? response.data.length : (
            response.data && typeof response.data === 'object' ? Object.keys(response.data).length : 'N/A'
          )
        });
      } catch (error) {
        appointmentResults.push({
          name: endpoint.name,
          url: endpoint.url,
          success: false,
          status: error.response ? error.response.status : 'No response',
          error: error.message,
          details: error.response ? error.response.data : 'No details available'
        });
      }
    }
    
    diagnosticResults.appointmentEndpoints = {
      success: appointmentResults.some(r => r.success),
      data: appointmentResults,
      error: null
    };
    
    // Set all results
    setResults(diagnosticResults);
    setLoading(false);
    toast.info('API diagnostics completed');
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto my-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <FaServer className="mr-2 text-blue-600" /> API Diagnostics Tool
      </h1>
      
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaInfoCircle className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              This tool helps diagnose issues with the HMS API connections. It will test various endpoints and report their status.
            </p>
          </div>
        </div>
      </div>
      
      {/* Doctor ID input */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700 mb-1">
            Doctor ID (for testing doctor endpoints)
          </label>
          <input
            type="text"
            id="doctorId"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
            placeholder="Enter doctor ID"
          />
          <p className="mt-1 text-xs text-gray-500">Current value from your session</p>
        </div>
        
        <div>
          <label htmlFor="doctorEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Doctor Email (for email-based queries)
          </label>
          <input
            type="email"
            id="doctorEmail"
            value={doctorEmail}
            onChange={(e) => setDoctorEmail(e.target.value)}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
            placeholder="Enter doctor email"
          />
          <p className="mt-1 text-xs text-gray-500">Used for testing email-based queries</p>
        </div>
      </div>
      
      <div className="mb-6">
        <button
          onClick={runDiagnostics}
          disabled={loading}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
            loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Running Diagnostics...
            </>
          ) : (
            'Run API Diagnostics'
          )}
        </button>
      </div>
      
      {/* Results Section */}
      {Object.keys(results).length > 0 && (
        <div className="mt-8 space-y-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Diagnostic Results</h2>
          
          {/* Basic Connectivity */}
          <div className="border rounded-lg overflow-hidden">
            <div 
              className={`px-4 py-3 flex justify-between items-center cursor-pointer ${
                results.connectivity?.success ? 'bg-green-50' : 'bg-red-50'
              }`}
              onClick={() => toggleSection('connectivity')}
            >
              <div className="flex items-center">
                {results.connectivity?.success ? (
                  <FaCheck className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <FaTimes className="h-5 w-5 text-red-500 mr-2" />
                )}
                <h3 className="text-lg font-medium">Basic API Connectivity</h3>
              </div>
              <div>
                {expandedSection === 'connectivity' ? (
                  <FaAngleUp className="h-5 w-5" />
                ) : (
                  <FaAngleDown className="h-5 w-5" />
                )}
              </div>
            </div>
            
            {expandedSection === 'connectivity' && (
              <div className="px-4 py-3 bg-gray-50 border-t">
                {results.connectivity?.success ? (
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Status:</span> {results.connectivity.data.status}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">URL:</span> {results.connectivity.data.url}
                    </p>
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                      {JSON.stringify(results.connectivity.data.data, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-red-700">
                      <span className="font-medium">Error:</span> {results.connectivity.error}
                    </p>
                    {results.connectivity.details && (
                      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                        {JSON.stringify(results.connectivity.details, null, 2)}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Doctor Endpoints */}
          {results.doctorEndpoints && (
            <div className="border rounded-lg overflow-hidden">
              <div 
                className={`px-4 py-3 flex justify-between items-center cursor-pointer ${
                  results.doctorEndpoints?.success ? 'bg-green-50' : 'bg-red-50'
                }`}
                onClick={() => toggleSection('doctorEndpoints')}
              >
                <div className="flex items-center">
                  {results.doctorEndpoints?.success ? (
                    <FaCheck className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <FaTimes className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <h3 className="text-lg font-medium">Doctor-Specific Endpoints</h3>
                </div>
                <div>
                  {expandedSection === 'doctorEndpoints' ? (
                    <FaAngleUp className="h-5 w-5" />
                  ) : (
                    <FaAngleDown className="h-5 w-5" />
                  )}
                </div>
              </div>
              
              {expandedSection === 'doctorEndpoints' && (
                <div className="p-0">
                  {results.doctorEndpoints.data.map((result, index) => (
                    <div 
                      key={index} 
                      className={`p-4 border-t ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        {result.success ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                            <FaCheck className="h-3 w-3 mr-1" /> {result.status}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                            <FaTimes className="h-3 w-3 mr-1" /> {result.status}
                          </span>
                        )}
                        <h4 className="text-sm font-semibold text-gray-700">
                          {result.name}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-600 mb-2 break-all">{result.url}</p>
                      
                      {result.success ? (
                        <>
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">Data Type:</span> {result.dataType} 
                            {result.dataLength !== 'N/A' && ` (${result.dataLength} items)`}
                          </p>
                          <div className="mt-2">
                            <button 
                              className="text-xs text-blue-600 hover:text-blue-800"
                              onClick={() => {
                                navigator.clipboard.writeText(JSON.stringify(result.data, null, 2));
                                toast.success('Response data copied to clipboard');
                              }}
                            >
                              Copy response data
                            </button>
                          </div>
                        </>
                      ) : (
                        <p className="text-xs text-red-600">
                          <span className="font-medium">Error:</span> {result.error}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Appointment Endpoints */}
          {results.appointmentEndpoints && (
            <div className="border rounded-lg overflow-hidden">
              <div 
                className={`px-4 py-3 flex justify-between items-center cursor-pointer ${
                  results.appointmentEndpoints?.success ? 'bg-green-50' : 'bg-red-50'
                }`}
                onClick={() => toggleSection('appointmentEndpoints')}
              >
                <div className="flex items-center">
                  {results.appointmentEndpoints?.success ? (
                    <FaCheck className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <FaTimes className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <h3 className="text-lg font-medium">Appointment Endpoints</h3>
                </div>
                <div>
                  {expandedSection === 'appointmentEndpoints' ? (
                    <FaAngleUp className="h-5 w-5" />
                  ) : (
                    <FaAngleDown className="h-5 w-5" />
                  )}
                </div>
              </div>
              
              {expandedSection === 'appointmentEndpoints' && (
                <div className="p-0">
                  {results.appointmentEndpoints.data.map((result, index) => (
                    <div 
                      key={index} 
                      className={`p-4 border-t ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        {result.success ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                            <FaCheck className="h-3 w-3 mr-1" /> {result.status}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                            <FaTimes className="h-3 w-3 mr-1" /> {result.status}
                          </span>
                        )}
                        <h4 className="text-sm font-semibold text-gray-700">
                          {result.name}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-600 mb-2 break-all">{result.url}</p>
                      
                      {result.success ? (
                        <>
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">Data Type:</span> {result.dataType} 
                            {result.dataLength !== 'N/A' && ` (${result.dataLength} items)`}
                          </p>
                          <div className="mt-2">
                            <button 
                              className="text-xs text-blue-600 hover:text-blue-800"
                              onClick={() => {
                                navigator.clipboard.writeText(JSON.stringify(result.data, null, 2));
                                toast.success('Response data copied to clipboard');
                              }}
                            >
                              Copy response data
                            </button>
                          </div>
                        </>
                      ) : (
                        <p className="text-xs text-red-600">
                          <span className="font-medium">Error:</span> {result.error}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Troubleshooting tips */}
          <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaInfoCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Troubleshooting Tips</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Check if your authentication token is valid (try logging out and back in)</li>
                    <li>Verify that the doctor ID is correct and exists in the database</li>
                    <li>If endpoints return 404, they might not be implemented or have a different URL structure</li>
                    <li>For 500 errors, check the server logs for more detailed error information</li>
                    <li>Network issues might also cause failures, especially if the API is hosted externally</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiDiagnostics; 