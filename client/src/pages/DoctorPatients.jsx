import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUserMd, FaUser, FaSpinner, FaSearch, FaExclamationCircle, FaArrowLeft, FaEnvelope, FaPhone, FaIdCard } from 'react-icons/fa';
import { getDoctorPatients } from '../api/doctorApi';
import { getCurrentDoctor } from '../utils/authUtils';
import { logoutDoctor } from '../redux/doctorSlice';

const DoctorPatients = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get auth state from Redux
  const { doctor, isAuthenticated } = useSelector((state) => state.doctor);
  
  // State for patients data
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Current doctor data
  const [currentDoctor, setCurrentDoctor] = useState(null);
  
  // Check authentication on component mount
  useEffect(() => {
    const doctorToken = localStorage.getItem('doctorToken');
    
    // If no doctor authentication, redirect to login
    if (!isAuthenticated && !doctorToken) {
      toast.error("Please log in as a doctor to view patients");
      navigate('/doctor/login');
      return;
    }
    
    // Get doctor data from Redux or localStorage
    const doctorData = doctor || getCurrentDoctor();
    
    if (doctorData) {
      console.log("Using doctor data:", doctorData.Name || doctorData.name, doctorData._id || '(no ID)');
      setCurrentDoctor(doctorData);
    } else {
      console.warn("No doctor data found, redirecting to login");
      toast.error("Doctor session expired. Please log in again.");
      
      // Clear any doctor state
      dispatch(logoutDoctor());
      
      // Redirect to login
      navigate('/doctor/login');
    }
  }, [doctor, isAuthenticated, navigate, dispatch]);
  
  // Fetch patients when doctor data is available
  useEffect(() => {
    if (currentDoctor) {
      fetchPatients();
    }
  }, [currentDoctor]);
  
  // Fetch patients
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get doctor ID for API calls
      const doctorId = currentDoctor._id || currentDoctor.id || currentDoctor.Id || currentDoctor.doctorId;
      
      if (!doctorId) {
        console.error("Missing doctor ID for patients fetch");
        throw new Error("Invalid doctor profile data. Please log in again.");
      }
      
      console.log(`Fetching patients for doctor ID: ${doctorId}`);
      
      // Call API
      const response = await getDoctorPatients(doctorId);
      console.log('Patients API response:', response);
      
      // Handle different response formats
      let patientsList = [];
      
      if (response && response.data && Array.isArray(response.data)) {
        patientsList = response.data;
      } else if (response && response.patients && Array.isArray(response.patients)) {
        patientsList = response.patients;
      } else if (response && Array.isArray(response)) {
        patientsList = response;
      }
      
      console.log(`Retrieved ${patientsList.length} patients`);
      setPatients(patientsList);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError(err.message || 'Failed to load patients data');
      toast.error(err.message || 'Failed to load patients data');
    } finally {
      setLoading(false);
    }
  };
  
  // Filter patients by search query
  const filteredPatients = patients.filter(patient => {
    const searchLower = searchQuery.toLowerCase();
    const name = (patient.Name || patient.name || '').toLowerCase();
    const email = (patient.Email || patient.email || '').toLowerCase();
    const phone = (patient.Phone || patient.phone || '').toLowerCase();
    
    return name.includes(searchLower) || email.includes(searchLower) || phone.includes(searchLower);
  });
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/doctor/dashboard')} 
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <FaUser className="mr-2 text-blue-600" />
                My Patients
              </h1>
              {currentDoctor && (
                <p className="text-sm text-gray-600 mt-1">
                  Dr. {currentDoctor.Name || currentDoctor.name} | {currentDoctor.Speciality || currentDoctor.speciality || 'Specialist'}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Search bar */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search patients by name, email, or phone"
            />
          </div>
        </div>
        
        {/* Patients list */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FaSpinner className="animate-spin h-8 w-8 text-blue-600 mb-4" />
              <p className="text-gray-600">Loading patients...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FaExclamationCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-red-500 font-medium mb-2">{error}</p>
              <button 
                onClick={fetchPatients}
                className="mt-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Again
              </button>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FaUser className="h-12 w-12 text-gray-300 mb-4" />
              {searchQuery ? (
                <p className="text-gray-500">No patients found matching "{searchQuery}"</p>
              ) : (
                <>
                  <p className="text-gray-500 font-medium">No patients found</p>
                  <p className="text-gray-400 mt-2">You don't have any patients assigned yet</p>
                </>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPatients.map((patient, index) => (
                    <tr key={patient._id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <FaUser />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {patient.Name || patient.name || 'Unknown Patient'}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <FaIdCard className="mr-1" />
                              ID: {patient._id || patient.id || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 flex items-center mb-1">
                          <FaEnvelope className="mr-2 text-gray-400" />
                          {patient.Email || patient.email || 'No email'}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <FaPhone className="mr-2 text-gray-400" />
                          {patient.Phone || patient.phone || 'No phone'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          Age: {patient.Age || patient.age || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Gender: {patient.Gender || patient.gender || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link 
                          to={`/doctor/patients/${patient._id || patient.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorPatients; 