import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaUserInjured, 
  FaUserMd,
  FaDollarSign, 
  FaSignOutAlt, 
  FaChartLine,
  FaBars,
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaSearch, 
  FaFilter,
  FaTimes,
  FaSortAmountDown,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaVenusMars,
  FaGlobe,
  FaHeartbeat,
  FaChevronLeft,
  FaChevronRight,
  FaNotesMedical
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api, { API_BASE_URL } from '../../../utils/app.api';
import Draggable from 'react-draggable';

const specialtiesList = [
  "Covid Treatment",
  "Sexual Health",
  "Eye Specialist",
  "Womens Health",
  "Diet & Nutrition",
  "Skin & Hair",
  "Bones and Joints",
  "Child Specialist",
  "Dental Care",
  "Heart",
  "Kidney Issues",
  "Cancer",
  "Ayurveda",
  "General Physician",
  "Mental Wellness",
  "Homoeopath",
  "General Surgery",
  "Urinary Issues",
  "Lungs and Breathing",
  "Physiotherapy",
  "Ear, Nose, Throat",
  "Brain and Nerves",
  "Diabetes Management",
  "Veterinary",
];

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const ageRanges = ["0-18", "19-30", "31-45", "46-60", "61+"];

const AppStyles = {
  gradients: {
    primary: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)',
    secondary: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)',
    accent: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #7dd3fc 100%)',
    success: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
    warning: 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)',
    danger: 'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)',
  },
  shadows: {
    small: '0 1px 2px rgba(0, 0, 0, 0.05)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    large: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  }
};

const AdminPatients = () => {
    const [patients, setPatients] = useState([]);
    const [newuser, setNewUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [countries, setCountries] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [filters, setFilters] = useState({
        gender: '',
        bloodGroup: '',
        status: '',
        ageRange: '',
        specialization: '',
        country: ''
    });
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        country: '',
        dateOfBirth: '',
        gender: 'male',
        bloodGroup: 'A+',
        medicalHistory: '',
        isActive: true,
        specializations: []
    });

    const patientsPerPage = 10;

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        fetchPatients();
        fetchCountries();
    }, [currentPage, filters, navigate]);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
    
            if (!token) {
                toast.error('You are not authenticated. Please log in again.');
                return;
            }
    
            // Build params for the request
            const params = new URLSearchParams();
            params.append('page', currentPage);
            params.append('limit', patientsPerPage);
    
            Object.entries(filters).forEach(([key, value]) => {
                if (value) {
                    params.append(key, value);
                }
            });
    
            console.log('Making request to:', `${API_BASE_URL}/newuser/all?${params.toString()}`);
    
            // Use the api utility which already has auth headers and proper base URL
            const response = await api.get(`/newuser/all?${params.toString()}`);
    
            console.log('Raw API response:', response.data);
    
            if (response.data && Array.isArray(response.data.newuser)) {
                setNewUser(response.data.newuser);
                setTotalPages(response.data.totalPages || 1);
            } else {
                console.error('Unexpected API response structure:', response.data);
                toast.error('Received invalid data format from server');
                setNewUser([]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error('Detailed fetch error:', error);
    
            if (error.response) {
                console.log('Error response data:', error.response.data);
                toast.error(`Server error: ${error.response.data.message || error.response.status}`);
            } else if (error.request) {
                console.log('Error request:', error.request);
                toast.error('No response received from server. Please check if the server is running.');
            } else {
                toast.error(`Error: ${error.message}`);
            }
    
            setNewUser([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };
    
    

    const fetchCountries = async () => {
        try {
            const response = await axios.get('https://restcountries.com/v3.1/all');
            const countryList = response.data.map(country => ({
                code: country.cca2,
                name: country.name.common
            })).sort((a, b) => a.name.localeCompare(b.name));
            setCountries(countryList);
        } catch (error) {
            console.error('Error fetching countries:', error);
            toast.error('Failed to load countries');
            setCountries([
                { code: 'US', name: 'United States' },
                { code: 'GB', name: 'United Kingdom' },
                { code: 'CA', name: 'Canada' },
                { code: 'AU', name: 'Australia' },
                { code: 'IN', name: 'India' }
            ]);
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.firstName.trim()) errors.firstName = 'First name is required';
        if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
        
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }
        
        if (!formData.phone) {
            errors.phone = 'Phone is required';
        } else if (String(formData.phone).replace(/\D/g, '').length < 10) {
            errors.phone = 'Phone must be 10 digits';
        }
        
        if (!formData.dateOfBirth) {
            errors.dateOfBirth = 'Date of birth is required';
        } else {
            const dob = new Date(formData.dateOfBirth);
            const today = new Date();
            if (dob >= today) {
                errors.dateOfBirth = 'Date of birth must be in the past';
            }
        }
    
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        try {
            const patientData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: String(formData.phone).replace(/\D/g, ''),
                address: formData.address,
                country: formData.country,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                bloodGroup: formData.bloodGroup,
                medicalHistory: formData.medicalHistory,
                isActive: formData.isActive,
                specializations: formData.specializations
            };
    
            let response;
            if (editingPatient) {
                response = await api.put(
                    `/add_patient/add`,
                    patientData
                );
                toast.success('Patient updated successfully');
            } else {
                response = await api.post(
                    '/add_patient/add', 
                    patientData
                );
                toast.success('Patient added successfully');
            }
    
            console.log('API Response:', response.data); // Debug log
            
            setShowModal(false);
            await fetchPatients();
            resetForm();
        } catch (error) {
            console.error('Detailed error:', {
                message: error.message,
                response: error.response?.data,
                config: error.config
            });
            
            let errorMessage = 'Failed to save patient. Please try again.';
            if (error.response) {
                // Server responded with a status code outside 2xx
                errorMessage = error.response.data.message || 
                             `Server error: ${error.response.status}`;
            } else if (error.request) {
                // Request was made but no response received
                errorMessage = 'No response from server. Please check your connection.';
            }
            
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (patient) => {
        setEditingPatient(patient);
        // Format date for input[type="date"]
        const formattedDate = patient.dateOfBirth 
            ? new Date(patient.dateOfBirth).toISOString().split('T')[0]
            : '';
            
        setFormData({
            firstName: patient.firstName,
            lastName: patient.lastName,
            email: patient.email,
            phone: patient.phone ? String(patient.phone) : '',
            address: patient.address,
            country: patient.country || '',
            dateOfBirth: formattedDate,
            gender: patient.gender || 'male',
            bloodGroup: patient.bloodGroup || 'A+',
            medicalHistory: patient.medicalHistory || '',
            isActive: patient.isActive !== undefined ? patient.isActive : true,
            specializations: patient.specializations || []
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`https://hms-backend-1-pngp.onrender.com/api/add_patient/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Patient deleted successfully');

                if (patients.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                } else {
                    await fetchPatients();
                }
            } catch (error) {
                console.error('Error deleting patient:', error);
                toast.error('Failed to delete patient. Please try again.');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
            country: '',
            dateOfBirth: '',
            gender: 'male',
            bloodGroup: 'A+',
            medicalHistory: '',
            isActive: true,
            specializations: []
        });
        setEditingPatient(null);
        setFormErrors({});
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`https://hms-backend-1-pngp.onrender.com/api/add_patient/search?query=${searchTerm}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPatients(response.data.patients || []);
            setCurrentPage(1);
            setTotalPages(1);
        } catch (error) {
            console.error('Error searching patients:', error);
            toast.error('Failed to search patients. Please try again.');
            setPatients([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSpecializationChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            let updatedSpecializations;
            if (checked) {
                updatedSpecializations = [...prev.specializations, value];
            } else {
                updatedSpecializations = prev.specializations.filter(s => s !== value);
            }
            return {
                ...prev,
                specializations: updatedSpecializations
            };
        });
    };

    const resetFilters = () => {
        setFilters({
            gender: '',
            bloodGroup: '',
            status: '',
            ageRange: '',
            specialization: '',
            country: ''
        });
        setSearchTerm('');
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        navigate('/admin/login');
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleMobileSidebar = () => {
        setMobileSidebarOpen(!mobileSidebarOpen);
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-100 overflow-hidden">
                <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-700 text-white transition-all duration-300 ease-in-out flex flex-col`}></div>
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Modern Glass-effect Navbar */}
            <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center">
                            <FaUserInjured className="mr-2 text-blue-600" />
                            <span className="hidden sm:inline">Patient Management</span>
                            <span className="sm:hidden">Patients</span>
                        </h1>
                        <button
                            onClick={() => {
                                resetForm();
                                setShowModal(true);
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-full shadow-md text-sm font-medium text-white transition-all duration-300 ease-in-out"
                            style={{ background: AppStyles.gradients.primary }}
                        >
                            <FaPlus className="mr-2 -ml-1" />
                            Add Patient
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Search and Filter Card with glass effect */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100/50 mb-6 overflow-hidden transform transition-all duration-300 hover:shadow-xl">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            {/* Cool glowing search input */}
                            <div className="relative flex-1 w-full">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-500">
                                    <FaSearch />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search patients by name, email, or phone..."
                                    className="block w-full pl-12 pr-4 py-3 border-0 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-inner bg-gray-50"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`inline-flex items-center px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                                        showFilters
                                            ? 'text-white shadow-lg' 
                                            : 'text-gray-700 bg-white shadow border border-gray-200'
                                    }`}
                                    style={showFilters ? { background: AppStyles.gradients.secondary } : {}}
                                >
                                    <FaFilter className="mr-2" />
                                    Filters
                                </button>
                                <button
                                    onClick={handleSearch}
                                    className="inline-flex items-center px-5 py-3 border border-transparent rounded-xl shadow-md text-sm font-medium text-white transition-all duration-300"
                                    style={{ background: AppStyles.gradients.primary }}
                                >
                                    <FaSearch className="mr-2" />
                                    Search
                                </button>
                            </div>
                        </div>

                        {/* Animated Filter Panel */}
                        {showFilters && (
                            <div className="mt-6 pt-6 border-t border-gray-100 animate-fadeIn">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    {/* Gender Filter - with little icons */}
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <FaVenusMars className="mr-2 text-blue-500" />
                                            Gender
                                        </label>
                                        <select
                                            name="gender"
                                            value={filters.gender}
                                            onChange={handleFilterChange}
                                            className="block w-full pl-3 pr-10 py-3 text-base border-0 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm rounded-lg shadow-inner"
                                        >
                                            <option value="">All Genders</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    {/* Age Range Filter */}
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <FaCalendarAlt className="mr-2 text-blue-500" />
                                            Age Range
                                        </label>
                                        <select
                                            name="ageRange"
                                            value={filters.ageRange}
                                            onChange={handleFilterChange}
                                            className="block w-full pl-3 pr-10 py-3 text-base border-0 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm rounded-lg shadow-inner"
                                        >
                                            <option value="">All Ages</option>
                                            {ageRanges.map((range, index) => (
                                                <option key={index} value={range}>{range}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Country Filter */}
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <FaGlobe className="mr-2 text-blue-500" />
                                            Country
                                        </label>
                                        <select
                                            name="country"
                                            value={filters.country}
                                            onChange={handleFilterChange}
                                            className="block w-full pl-3 pr-10 py-3 text-base border-0 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm rounded-lg shadow-inner"
                                        >
                                            <option value="">All Countries</option>
                                            {countries.map(country => (
                                                <option key={country.code} value={country.name}>{country.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end mt-5">
                                    <button
                                        onClick={resetFilters}
                                        className="inline-flex items-center px-5 py-2 rounded-lg border border-gray-300 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300"
                                    >
                                        <FaTimes className="mr-2" />
                                        Reset All Filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Patients Table with Modern Card-Based Design */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
                        <div className="relative w-24 h-24">
                            <div className="animate-ping absolute inset-0 bg-blue-400 opacity-30 rounded-full"></div>
                            <div className="animate-spin relative rounded-full h-24 w-24 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                        <div className="mt-4 text-blue-600 font-medium">Loading patients...</div>
                    </div>
                ) : (
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100/50 overflow-hidden">
                        {newuser.length > 0 ? (
                            <div className="grid gap-4 p-6">
                                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                    <h2 className="text-xl font-bold text-gray-800">Patients Directory</h2>
                                    <div className="text-sm text-gray-500">{newuser.length} patients found</div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {newuser.map((patient) => (
                                        <div 
                                            key={patient._id} 
                                            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]"
                                        >
                                            <div className="p-1" style={{ background: AppStyles.gradients.primary }}></div>
                                            <div className="p-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-md">
                                                        <FaUserInjured className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-800">{patient.firstName} {patient.lastName}</h3>
                                                        <p className="text-sm text-gray-500">@{patient.UserName || 'unnamed'}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-4 space-y-2">
                                                    <div className="flex items-center text-sm">
                                                        <FaPhone className="h-3 w-3 mr-2 text-blue-500" />
                                                        <span className="text-gray-600">{patient.Phone ? String(patient.Phone).replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : 'No phone'}</span>
                                                    </div>
                                                    
                                                    <div className="flex items-center text-sm">
                                                        <FaVenusMars className="h-3 w-3 mr-2 text-blue-500" />
                                                        <span className="text-gray-600">
                                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                                                                patient.Gender === 'male' ? 'bg-blue-100 text-blue-700' : 
                                                                patient.Gender === 'female' ? 'bg-pink-100 text-pink-700' : 
                                                                'bg-gray-100 text-gray-700'
                                                            }`}>
                                                                {patient.Gender}
                                                            </span>
                                                            <span className="ml-2 text-gray-500">{calculateAge(patient.DOB)} years</span>
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex items-center text-sm">
                                                        <FaGlobe className="h-3 w-3 mr-2 text-blue-500" />
                                                        <span className="text-gray-600">{patient.Country || 'Unknown location'}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                                                    <button
                                                        onClick={() => handleEdit(patient)}
                                                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-white shadow-sm transition-all duration-300"
                                                        style={{ background: AppStyles.gradients.primary }}
                                                    >
                                                        <FaEdit className="mr-1" size={12} /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(patient._id)}
                                                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-white shadow-sm transition-all duration-300"
                                                        style={{ background: AppStyles.gradients.danger }}
                                                    >
                                                        <FaTrash className="mr-1" size={12} /> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-10 flex flex-col items-center justify-center text-center">
                                {searchTerm || Object.values(filters).some(f => f) ? (
                                    <div className="flex flex-col items-center">
                                        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <FaSearch className="h-16 w-16 text-gray-300" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-700 mb-1">No patients found</h3>
                                        <p className="text-gray-500 max-w-md">We couldn't find any patients matching your search criteria. Try adjusting your filters or search terms.</p>
                                        <button
                                            onClick={resetFilters}
                                            className="mt-6 px-6 py-3 rounded-lg text-white shadow-md text-sm font-medium transition-all duration-300"
                                            style={{ background: AppStyles.gradients.primary }}
                                        >
                                            Clear All Filters
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                            <FaUserInjured className="h-16 w-16 text-blue-200" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-700 mb-1">No patients yet</h3>
                                        <p className="text-gray-500 max-w-md">Get started by adding your first patient to the system.</p>
                                        <button
                                            onClick={() => {
                                                resetForm();
                                                setShowModal(true);
                                            }}
                                            className="mt-6 px-6 py-3 rounded-lg text-white shadow-md text-sm font-medium transition-all duration-300"
                                            style={{ background: AppStyles.gradients.primary }}
                                        >
                                            <FaPlus className="mr-2 inline-block" /> Add First Patient
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Modern Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-100/50 px-6 py-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <p className="text-sm text-gray-700">
                                Showing page <span className="font-bold text-blue-600">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                            </p>
                            <div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <FaChevronLeft className="h-4 w-4" />
                                    </button>
                                    
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === page 
                                                ? 'text-white z-10 focus-visible:outline-2 focus-visible:outline-offset-2' 
                                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'}`}
                                            style={currentPage === page ? { background: AppStyles.gradients.primary } : {}}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <FaChevronRight className="h-4 w-4" />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modernized Modal with Glassmorphism - Now Draggable */}
                {showModal && (
                    <div className="fixed inset-0 bg-blue-900/30 backdrop-blur-sm z-40 flex items-center justify-center p-4 transition-all">
                        <Draggable handle=".modal-header" bounds="parent">
                            <div 
                                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 my-8 overflow-hidden border border-blue-100"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="px-6 py-4 cursor-move modal-header" style={{ background: AppStyles.gradients.primary }}>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium text-white flex items-center">
                                            {editingPatient ? (
                                                <span className="flex items-center">
                                                    <FaEdit className="mr-2" /> Edit Patient Profile
                                                </span>
                                            ) : (
                                                <span className="flex items-center">
                                                    <FaUserInjured className="mr-2" /> New Patient Registration
                                                </span>
                                            )}
                                        </h3>
                                        <button
                                            onClick={() => {
                                                setShowModal(false);
                                                resetForm();
                                            }}
                                            className="text-white hover:text-gray-200 transition-colors"
                                        >
                                            <FaTimes size={20} />
                                        </button>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${formErrors.firstName ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                                                required
                                            />
                                            {formErrors.firstName && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${formErrors.lastName ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                                                required
                                            />
                                            {formErrors.lastName && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaEnvelope className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className={`block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${formErrors.email ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                                                    required
                                                />
                                            </div>
                                            {formErrors.email && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone*</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaPhone className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={(e) => {
                                                        const numbersOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                        setFormData({ ...formData, phone: numbersOnly });
                                                    }}
                                                    className={`block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${formErrors.phone ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                                                    required
                                                    pattern="[0-9]{10}"
                                                    inputMode="numeric"
                                                    maxLength={10}
                                                    placeholder="10-digit number"
                                                />
                                            </div>
                                            {formErrors.phone && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth*</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <input
                                                    type="date"
                                                    name="dateOfBirth"
                                                    value={formData.dateOfBirth}
                                                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                                    className={`block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${formErrors.dateOfBirth ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                                                    required
                                                />
                                            </div>
                                            {formErrors.dateOfBirth && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.dateOfBirth}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender*</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaVenusMars className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <select
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                    className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                    required
                                                >
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaHeartbeat className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <select
                                                    name="bloodGroup"
                                                    value={formData.bloodGroup}
                                                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                                                    className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                >
                                                    {bloodGroups.map(group => (
                                                        <option key={group} value={group}>{group}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaGlobe className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <select
                                                    name="country"
                                                    value={formData.country}
                                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                                    className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                >
                                                    <option value="">Select Country</option>
                                                    {countries.map(country => (
                                                        <option key={country.code} value={country.name}>{country.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                            <div className="mt-1 flex items-center">
                                                <div className={`flex items-center h-8 px-3 rounded-md border ${formData.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                                    <input
                                                        type="checkbox"
                                                        name="isActive"
                                                        checked={formData.isActive}
                                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                                                    />
                                                    <label className="text-sm">
                                                        {formData.isActive ? 'Active Account' : 'Inactive Account'}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            rows="2"
                                            placeholder="Enter full address"
                                        />
                                    </div>

                                    <div className="mt-5">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <span className="flex items-center">
                                                <FaNotesMedical className="mr-1 text-gray-500" /> 
                                                Medical History
                                            </span>
                                        </label>
                                        <textarea
                                            name="medicalHistory"
                                            value={formData.medicalHistory}
                                            onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            rows="3"
                                            placeholder="Enter any relevant medical history"
                                        />
                                    </div>

                                    <div className="mt-5">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Medical Specializations of Interest</label>
                                        <div className="max-h-60 overflow-y-auto p-3 bg-gray-50 rounded-md border border-gray-200">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {specialtiesList.map((spec, index) => (
                                                    <div key={index} className="flex items-center bg-white px-3 py-2 rounded-md border border-gray-100">
                                                        <input
                                                            type="checkbox"
                                                            id={`spec-${index}`}
                                                            value={spec}
                                                            checked={formData.specializations.includes(spec)}
                                                            onChange={handleSpecializationChange}
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                        />
                                                        <label htmlFor={`spec-${index}`} className="ml-2 text-sm text-gray-700">
                                                            {spec}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowModal(false);
                                                resetForm();
                                            }}
                                            className="px-5 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-5 py-2 text-sm font-medium rounded-lg text-white transition-all duration-300"
                                            style={{ background: AppStyles.gradients.primary }}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    {editingPatient ? 'Updating...' : 'Adding...'}
                                                </span>
                                            ) : (
                                                editingPatient ? 'Update Patient' : 'Add Patient'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </Draggable>
                    </div>
                )}
            </main>
        </div>
    );
};

function calculateAge(dateOfBirth) {
    if (!dateOfBirth) return 'N/A';
    const birthDate = new Date(dateOfBirth);
    const diff = Date.now() - birthDate.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default AdminPatients;