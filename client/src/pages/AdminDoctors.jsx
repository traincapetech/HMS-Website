import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaUserMd, 
  FaUsers, 
  FaDollarSign, 
  FaSignOutAlt, 
  FaChartLine,
  FaBars,
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaSearch, 
  FaFilter 
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const experienceRanges = [
  "0-5 years",
  "6-10 years",
  "11-15 years",
  "16-20 years",
  "20+ years"
];

const AdminDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
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
        status: '',
        specialization: '',
        experience: '',
        country: ''
    });
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        specialization: '',
        experience: '',
        phone: '',
        address: '',
        country: '',
        status: 'active', 
        isActive: true
    });

    const doctorsPerPage = 10;

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        fetchDoctors();
        fetchCountries();
    }, [currentPage, filters, navigate]);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            let url = `https://hms-backend-1-pngp.onrender.com/api/add_doc/all?page=${currentPage}&limit=${doctorsPerPage}`; 
    
            // Construct query parameters
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.specialization) params.append('specialization', filters.specialization);
            if (filters.experience) params.append('experience', filters.experience);
            if (filters.country) params.append('country', filters.country);
    
            // Append query parameters only if they exist
            if (params.toString()) {
                url += `?${params.toString()}`;
            }
    
            console.log("Fetching doctors from:", url); // Debugging
    
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            setDoctors(response.data.doctors || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            toast.error('Failed to fetch doctors. Please try again later.');
            setDoctors([]);
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
        if (!formData.name.trim()) errors.name = 'Name is required';
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }
        if (!formData.specialization) errors.specialization = 'Specialization is required';
        if (!formData.experience) errors.experience = 'Experience is required';
        if (!formData.phone) {
            errors.phone = 'Phone is required';
        } else if (String(formData.phone).length < 10) {
            errors.phone = 'Phone must be 10 digits';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!validateForm()) return;
    
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('adminToken');
            const doctorData = {
                ...formData,
                phone: String(formData.phone).replace(/\D/g, ''), // Ensure phone is string and clean
                status: formData.status || 'active' // Ensure status is always set
            };
    
            if (editingDoctor) {
                // Update existing doctor
                await axios.put(
                    `https://hms-backend-1-pngp.onrender.com/api/add_doc/${editingDoctor._id}`,
                    doctorData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success('Doctor updated successfully');
            } else {
                // Add new doctor
                await axios.post(
                    'https://hms-backend-1-pngp.onrender.com/api/add_doc/add', 
                    doctorData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success('Doctor added successfully');
            }
    
            setShowModal(false);
            resetForm();
            await fetchDoctors();
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setIsSubmitting(false);
        }
    };
    

    const handleEdit = (doctor) => {
        setEditingDoctor(doctor);
        setFormData({
            name: doctor.name,
            email: doctor.email,
            specialization: doctor.specialization,
            experience: doctor.experience,
            phone: doctor.phone ? String(doctor.phone) : '', // Ensure phone is string
            address: doctor.address,
            country: doctor.country || '',
            status: doctor.status || 'active',
            isActive: doctor.isActive
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this doctor?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`https://hms-backend-1-pngp.onrender.com/api/add_doc/67ed0e29f7f273bd2ae47917`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Doctor deleted successfully');
    
                // Optimistic UI update - remove the doctor from local state immediately
                setDoctors(prevDoctors => prevDoctors.filter(doctor => doctor._id !== id));
    
                // If we're on the last page with only one doctor, go back a page
                if (doctors.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }
                
                // Optional: Refetch data to ensure consistency with server
                // await fetchDoctors();
            } catch (error) {
                console.error('Error deleting doctor:', error);
                
                // Revert the optimistic update if deletion failed
                await fetchDoctors();
                
                toast.error(error.response?.data?.message || 'Failed to delete doctor. Please try again.');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            specialization: '',
            experience: '',
            phone: '',
            address: '',
            country: '',
            status: 'active',
            isActive: true
        });
        setEditingDoctor(null);
        setFormErrors({});
    };

    const handleSearch = () => {
        try {
            setLoading(true);
            
            if (!searchTerm.trim()) {
                // If search term is empty, reset to show all doctors
                fetchDoctors(); // This will fetch all doctors again
                return;
            }
    
            // Convert search term to lowercase for case-insensitive search
            const term = searchTerm.toLowerCase();
            
            // Filter doctors based on search term
            const filteredDoctors = doctors.filter(doctor => {
                return (
                    doctor.name.toLowerCase().includes(term) ||
                    doctor.email.toLowerCase().includes(term) ||
                    doctor.specialization.toLowerCase().includes(term) ||
                    (doctor.phone && String(doctor.phone).toLowerCase().includes(term)) ||
                    (doctor.country && doctor.country.toLowerCase().includes(term)) ||
                    (doctor.address && doctor.address.toLowerCase().includes(term))
                );
            });
    
            setDoctors(filteredDoctors);
            setCurrentPage(1);
            setTotalPages(1);
        } catch (error) {
            console.error('Error searching doctors:', error);
            toast.error('Error during search. Please try again.');
            setDoctors([]);
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
    
    // Add this useEffect to apply filters whenever filters state changes
    useEffect(() => {
        const applyFilters = () => {
            if (!doctors.length) return;
    
            const filteredDoctors = doctors.filter(doctor => {
                // Status filter
                if (filters.status && doctor.status !== filters.status) {
                    return false;
                }
                
                // Specialization filter
                if (filters.specialization && doctor.specialization !== filters.specialization) {
                    return false;
                }
                
                // Experience filter
                if (filters.experience) {
                    const [minExp, maxExp] = filters.experience.split('-').map(Number);
                    const doctorExp = parseInt(doctor.experience) || 0;
                    
                    if (maxExp) {
                        if (doctorExp < minExp || doctorExp > maxExp) return false;
                    } else {
                        // Handle "20+ years" case
                        if (doctorExp < minExp) return false;
                    }
                }
                
                // Country filter
                if (filters.country && doctor.country !== filters.country) {
                    return false;
                }
                
                return true;
            });
    
            setDoctors(filteredDoctors);
            setCurrentPage(1);
            setTotalPages(Math.ceil(filteredDoctors.length / doctorsPerPage) || 1);
        };
    
        applyFilters();
    }, [filters, doctors]);
    
    // Update your resetFilters function to also reset the doctors list
    const resetFilters = async () => {
        setFilters({
            status: '',
            specialization: '',
            experience: '',
            country: ''
        });
        setSearchTerm('');
        await fetchDoctors(); // This will refetch the original unfiltered list
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
                {/* Sidebar */}
                <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-700 text-white transition-all duration-300 ease-in-out flex flex-col`}>
                    {/* Sidebar content */}
                </div>
                
                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Loading spinner */}
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {mobileSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={toggleMobileSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-20'} 
                ${mobileSidebarOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden lg:flex'} 
                bg-gray-700 text-white transition-all duration-300 ease-in-out flex flex-col`}>
                
                {/* Sidebar Header */}
                <div className="p-4 flex items-center justify-between border-b border-white h-16">
                    {sidebarOpen ? (
                        <h1 className="text-xl font-bold whitespace-nowrap">Admin Dashboard</h1>
                    ) : (
                        <div className="w-6"></div>
                    )}
                    <button 
                        onClick={toggleSidebar}
                        className="text-white hover:text-blue-200 focus:outline-none hidden lg:block"
                    >
                        <FaBars />
                    </button>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 overflow-y-auto">
                    <Link
                        to="/admin/dashboard"
                        className={`flex items-center px-6 py-3 text-white hover:bg-blue-700 ${
                            !sidebarOpen ? 'justify-center' : ''
                        }`}
                        onClick={() => setMobileSidebarOpen(false)}
                    >
                        <FaChartLine className={`${sidebarOpen ? 'mr-3' : ''}`} />
                        {sidebarOpen && "Overview"}
                    </Link>
                    <Link
                        to="/admin/doctors"
                        className={`flex items-center px-6 py-3 text-white hover:bg-blue-700 bg-blue-700 ${
                            !sidebarOpen ? 'justify-center' : ''
                        }`}
                        onClick={() => setMobileSidebarOpen(false)}
                    >
                        <FaUserMd className={`${sidebarOpen ? 'mr-3' : ''}`} />
                        {sidebarOpen && "Doctors"}
                    </Link>
                    <Link
                        to="/admin/patients"
                        className={`flex items-center px-6 py-3 text-white hover:bg-blue-700 ${
                            !sidebarOpen ? 'justify-center' : ''
                        }`}
                        onClick={() => setMobileSidebarOpen(false)}
                    >
                        <FaUsers className={`${sidebarOpen ? 'mr-3' : ''}`} />
                        {sidebarOpen && "Patients"}
                    </Link>
                    <Link
                        to="/admin/pricing"
                        className={`flex items-center px-6 py-3 text-white hover:bg-blue-700 ${
                            !sidebarOpen ? 'justify-center' : ''
                        }`}
                        onClick={() => setMobileSidebarOpen(false)}
                    >
                        <FaDollarSign className={`${sidebarOpen ? 'mr-3' : ''}`} />
                        {sidebarOpen && "Pricing"}
                    </Link>
                    <Link
                        to="/admin/analytics"
                        className={`flex items-center px-6 py-3 text-white hover:bg-blue-700 ${
                            !sidebarOpen ? 'justify-center' : ''
                        }`}
                        onClick={() => setMobileSidebarOpen(false)}
                    >
                        <FaChartLine className={`${sidebarOpen ? 'mr-3' : ''}`} />
                        {sidebarOpen && "Analytics"}
                    </Link>
                </nav>

                {/* Sidebar Footer */}
                {/* <div className="p-4 border-t border-white">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center w-full text-gray-300 hover:text-white ${
                            !sidebarOpen ? 'justify-center' : ''
                        }`}
                    >
                        <FaSignOutAlt className={`${sidebarOpen ? 'mr-3' : ''}`} />
                        {sidebarOpen && "Logout"}
                    </button>
                </div> */}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar - Simplified */}
                <header className="bg-white shadow-sm z-10">
                    <div className="flex items-center justify-between px-4 py-3 sm:px-6">
                        {/* Mobile menu button */}
                        <button
                            onClick={toggleMobileSidebar}
                            className="lg:hidden p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100"
                        >
                            <FaBars />
                        </button>
                        
                        {/* Page title */}
                        <h1 className="text-xl font-bold text-gray-800 ml-2 lg:ml-0">Doctors Management</h1>
                        
                        {/* Add Doctor button */}
                        <button
                            onClick={() => {
                                resetForm();
                                setShowModal(true);
                            }}
                            className="bg-blue-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg flex items-center hover:bg-blue-600 transition-colors"
                        >
                            <FaPlus className="mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Add Doctor</span>
                        </button>
                    </div>
                </header>

                {/* Doctors Management Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
                    {/* Search and Filter Bar */}
                    <div className="mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search Input */}
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search doctors..."
                                    className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            
                            {/* Filter Button */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center hover:bg-gray-300 transition-colors"
                                >
                                    <FaFilter className="mr-2" />
                                    <span className="hidden sm:inline">Filters</span>
                                </button>
                                <button
                                    onClick={handleSearch}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    <span className="hidden sm:inline">Search</span>
                                    <FaSearch className="sm:hidden" />
                                </button>
                            </div>
                        </div>
                        
                        {/* Filter Panel */}
                        {showFilters && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Status Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            name="status"
                                            value={filters.status}
                                            onChange={handleFilterChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="">All Statuses</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                    
                                    {/* Specialization Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                                        <select
                                            name="specialization"
                                            value={filters.specialization}
                                            onChange={handleFilterChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="">All Specializations</option>
                                            {specialtiesList.map((spec, index) => (
                                                <option key={index} value={spec}>{spec}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    {/* Experience Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                                        <select
                                            name="experience"
                                            value={filters.experience}
                                            onChange={handleFilterChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="">All Experience Levels</option>
                                            {experienceRanges.map((range, index) => (
                                                <option key={index} value={range}>{range}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    {/* Country Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                        <select
                                            name="country"
                                            value={filters.country}
                                            onChange={handleFilterChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="">All Countries</option>
                                            {countries.map(country => (
                                                <option key={country.code} value={country.name}>{country.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={resetFilters}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Doctors Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Doctor</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Specialization</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Experience</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Contact</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {doctors.length > 0 ? (
                                        doctors.map((doctor) => (
                                            <tr key={doctor._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <FaUserMd className="h-10 w-10 text-gray-400" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                                                            <div className="text-sm text-gray-500">{doctor.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                                    <div className="text-sm text-gray-900">{doctor.specialization}</div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                                    <div className="text-sm text-gray-900">{doctor.experience} years</div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                                    <div className="text-sm text-gray-900">
                                                        {doctor.phone ? String(doctor.phone).replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : 'N/A'}
                                                    </div>
                                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                                        {doctor.country && <span className="mr-2">{doctor.country}</span>}
                                                        {doctor.address}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${doctor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {doctor.status === 'active' ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium sm:px-6">
                                                    <button
                                                        onClick={() => handleEdit(doctor)}
                                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                                        aria-label="Edit doctor"
                                                    >
                                                        <FaEdit className="inline-block" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(doctor._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        aria-label="Delete doctor"
                                                    >
                                                        <FaTrash className="inline-block" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-4 text-center text-gray-500 sm:px-6">
                                                {searchTerm || Object.values(filters).some(f => f) ? 'No matching doctors found' : 'No doctors found. Click "Add Doctor" to create one.'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6">
                            <nav className="inline-flex rounded-md shadow">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium ${currentPage === page ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </nav>
                        </div>
                    )}

                    {/* Add/Edit Doctor Modal */}
                    {showModal && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-start justify-center pt-16 z-50">
                            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 my-8">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
                                    </h3>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Name*</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${formErrors.name ? 'border-red-500' : ''}`}
                                                    required
                                                />
                                                {formErrors.name && (
                                                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Email*</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${formErrors.email ? 'border-red-500' : ''}`}
                                                    required
                                                />
                                                {formErrors.email && (
                                                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Specialization*</label>
                                                <select
                                                    name="specialization"
                                                    value={formData.specialization}
                                                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${formErrors.specialization ? 'border-red-500' : ''}`}
                                                    required
                                                >
                                                    <option value="">Select Specialization</option>
                                                    {specialtiesList.map((spec, index) => (
                                                        <option key={index} value={spec}>{spec}</option>
                                                    ))}
                                                </select>
                                                {formErrors.specialization && (
                                                    <p className="mt-1 text-sm text-red-600">{formErrors.specialization}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Experience (years)*</label>
                                                <input
                                                    type="number"
                                                    name="experience"
                                                    value={formData.experience}
                                                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${formErrors.experience ? 'border-red-500' : ''}`}
                                                    required
                                                    min="0"
                                                />
                                                {formErrors.experience && (
                                                    <p className="mt-1 text-sm text-red-600">{formErrors.experience}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Phone*</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={(e) => {
                                                        // Remove all non-digit characters and limit to 10 digits
                                                        const numbersOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                        setFormData({ ...formData, phone: numbersOnly });
                                                    }}
                                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${formErrors.phone ? 'border-red-500' : ''}`}
                                                    required
                                                    pattern="[0-9]{10}"
                                                    inputMode="numeric"
                                                    maxLength={10}
                                                />
                                                {formErrors.phone && (
                                                    <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Country</label>
                                                <select
                                                    name="country"
                                                    value={formData.country}
                                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                >
                                                    <option value="">Select Country</option>
                                                    {countries.map(country => (
                                                        <option key={country.code} value={country.name}>{country.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                                <select
                                                    name="status"
                                                    value={formData.status}
                                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Address</label>
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                rows="3"
                                            />
                                        </div>
                                        
                                        <div className="flex justify-end space-x-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowModal(false);
                                                    resetForm();
                                                }}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <span className="flex items-center justify-center">
                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        {editingDoctor ? 'Updating...' : 'Adding...'}
                                                    </span>
                                                ) : (
                                                    editingDoctor ? 'Update Doctor' : 'Add Doctor'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminDoctors;