import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    FaUserMd,
    FaEdit,
    FaTrash,
    FaPlus,
    FaSearch,
    FaFilter,
    FaTimes,
    FaSortAmountDown,
    FaUserCog,
    FaDownload,
    FaExternalLinkAlt,
    FaChevronLeft,
    FaChevronRight,
    FaStethoscope,
    FaGlobe
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api, { API_BASE_URL } from '../../../utils/app.api';

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
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [data, setData] = useState([])
    const [filters, setFilters] = useState({
        Speciality: '',
        experience: '',
        state: '',
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
    const navigate = useNavigate();

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
            
            const params = new URLSearchParams();
            params.append('page', currentPage);
            params.append('limit', doctorsPerPage);

            if (filters.Speciality) params.append('Speciality', filters.Speciality);
            if (filters.experience) params.append('experience', filters.experience);
            if (filters.state) params.append('state', filters.state);

            const response = await api.get(`/doctor/all?${params.toString()}`);

            console.log("Doctor API response:", response.data);
            
            if (response.data && response.data.doctors) {
                setDoctors(response.data.doctors || []);
                setData(response.data);
                setTotalPages(response.data.totalPages || 1);
            } else if (response.data && Array.isArray(response.data.doctor)) {
                setDoctors(response.data.doctor || []);
                setData(response.data);
                setTotalPages(response.data.totalPages || 1);
            } else {
                console.error('Unexpected API response structure:', response.data);
                toast.error('Received invalid data format from server');
                setDoctors([]);
                setData({});
                setTotalPages(1);
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
            if (error.response) {
                toast.error(error.response.data.message || 'Failed to fetch doctors');
            } else {
                toast.error('Network error. Please try again later.');
            }
            setDoctors([]);
            setData({});
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
        fetchDoctors();
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
            const doctorData = {
                ...formData,
                phone: String(formData.phone).replace(/\D/g, ''),
                status: formData.status || 'active'
            };

            if (editingDoctor) {
                await api.put(
                    `/add_doc/add${editingDoctor._id}`,
                    doctorData
                );
                toast.success('Doctor updated successfully');
            } else {
                await api.post(
                    '/add_doc/add',
                    doctorData
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
            phone: doctor.phone ? String(doctor.phone) : '',
            address: doctor.address,
            country: doctor.country || '',
            status: doctor.status || 'active',
            isActive: doctor.isActive
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this doctor?')) {
            return;
        }

        try {
            await api.delete(`/add_doc/${id}`);

            toast.success('Doctor deleted successfully');
            setDoctors(prevDoctors => prevDoctors.filter(doctor => doctor._id !== id));

            if (doctors.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }

        } catch (error) {
            console.error('Error deleting doctor:', error);
            await fetchDoctors();

            let errorMessage = 'Failed to delete doctor. Please try again.';
            if (error.response) {
                if (error.response.status === 404) {
                    errorMessage = 'Doctor not found or already deleted.';
                } else if (error.response.data?.message) {
                    errorMessage = error.response.data.message;
                }
            } else if (error.request) {
                errorMessage = 'No response from server. Check your connection.';
            }

            toast.error(errorMessage);
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
                fetchDoctors();
                return;
            }

            const term = searchTerm.toLowerCase();
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

    const resetFilters = async () => {
        setFilters({
            Speciality: '',
            Experience: '',
            State: ''
        });
        setSearchTerm('');
        setCurrentPage(1);
        await fetchDoctors();
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
                            <FaUserMd className="mr-2 text-blue-600" />
                            <span className="hidden sm:inline">Doctor Management</span>
                            <span className="sm:hidden">Doctors</span>
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
                            Add Doctor
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Search and Filter Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100/50 mb-6 overflow-hidden transform transition-all duration-300 hover:shadow-xl">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            {/* Search Input with glowing effect */}
                            <div className="relative flex-1 w-full">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-500">
                                    <FaSearch />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search doctors by name, email, or speciality..."
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

                        {/* Filter Panel */}
                        {showFilters && (
                            <div className="mt-6 pt-6 border-t border-gray-100 animate-fadeIn">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    {/* Specialization Filter */}
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <FaStethoscope className="mr-2 text-blue-500" />
                                            Speciality
                                        </label>
                                        <select
                                            name="Speciality"
                                            value={filters.Speciality}
                                            onChange={handleFilterChange}
                                            className="block w-full pl-3 pr-10 py-3 text-base border-0 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm rounded-lg shadow-inner"
                                        >
                                            <option value="">All Specialities</option>
                                            {specialtiesList.map((spec, index) => (
                                                <option key={index} value={spec}>{spec}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Experience Filter */}
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <FaSortAmountDown className="mr-2 text-blue-500" />
                                            Experience
                                        </label>
                                        <select
                                            name="experience"
                                            value={filters.experience}
                                            onChange={handleFilterChange}
                                            className="block w-full pl-3 pr-10 py-3 text-base border-0 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm rounded-lg shadow-inner"
                                        >
                                            <option value="">All Experience Levels</option>
                                            {experienceRanges.map((range, index) => (
                                                <option key={index} value={range}>{range}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* State Filter */}
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <FaGlobe className="mr-2 text-blue-500" />
                                            Location
                                        </label>
                                        <select
                                            name="state"
                                            value={filters.state}
                                            onChange={handleFilterChange}
                                            className="block w-full pl-3 pr-10 py-3 text-base border-0 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm rounded-lg shadow-inner"
                                        >
                                            <option value="">All Locations</option>
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

                {/* Modern Card-Based Layout for Doctors */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
                        <div className="relative w-24 h-24">
                            <div className="animate-ping absolute inset-0 bg-blue-400 opacity-30 rounded-full"></div>
                            <div className="animate-spin relative rounded-full h-24 w-24 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                        <div className="mt-4 text-blue-600 font-medium">Loading doctors...</div>
                    </div>
                ) : (
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100/50 overflow-hidden">
                        {doctors && doctors.length > 0 ? (
                            <div className="grid gap-4 p-6">
                                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                    <h2 className="text-xl font-bold text-gray-800">Doctors Directory</h2>
                                    <div className="text-sm text-gray-500">{doctors.length} doctors found</div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                    {doctors.map((doctor) => (
                                        <div 
                                            key={doctor._id} 
                                            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]"
                                        >
                                            <div className="p-1" style={{ background: AppStyles.gradients.primary }}></div>
                                            <div className="p-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="h-12 w-12 rounded-full flex items-center justify-center text-white shadow-md" style={{ background: AppStyles.gradients.primary }}>
                                                        <FaUserMd className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-800">{doctor.Name || doctor.name}</h3>
                                                        <p className="text-sm text-gray-500">{doctor.email}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-4 space-y-3">
                                                    <div className="flex items-center">
                                                        <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {doctor.Speciality || doctor.specialization}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center text-sm">
                                                        <FaSortAmountDown className="h-3 w-3 mr-2 text-blue-500" />
                                                        <span className="text-gray-600">{doctor.Experience || doctor.experience} years experience</span>
                                                    </div>
                                                    
                                                    <div className="flex items-center text-sm">
                                                        <FaGlobe className="h-3 w-3 mr-2 text-blue-500" />
                                                        <span className="text-gray-600">
                                                            {doctor.State || doctor.country || 'Location not specified'}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                                                    <button
                                                        onClick={() => handleEdit(doctor)}
                                                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-white shadow-sm transition-all duration-300"
                                                        style={{ background: AppStyles.gradients.primary }}
                                                    >
                                                        <FaEdit className="mr-1" size={12} /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(doctor._id)}
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
                                        <h3 className="text-xl font-bold text-gray-700 mb-1">No doctors found</h3>
                                        <p className="text-gray-500 max-w-md">We couldn't find any doctors matching your search criteria. Try adjusting your filters or search terms.</p>
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
                                            <FaUserMd className="h-16 w-16 text-blue-200" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-700 mb-1">No doctors yet</h3>
                                        <p className="text-gray-500 max-w-md">Get started by adding your first doctor to the system.</p>
                                        <button
                                            onClick={() => {
                                                resetForm();
                                                setShowModal(true);
                                            }}
                                            className="mt-6 px-6 py-3 rounded-lg text-white shadow-md text-sm font-medium transition-all duration-300"
                                            style={{ background: AppStyles.gradients.primary }}
                                        >
                                            <FaPlus className="mr-2 inline-block" /> Add First Doctor
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

                {/* Modernized Modal with Glassmorphism */}
                {showModal && (
                    <div className="fixed inset-0 bg-blue-900/30 backdrop-blur-sm z-40 flex items-center justify-center p-4 transition-all">
                        <div 
                            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 my-8 overflow-hidden border border-blue-100"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="px-6 py-4" style={{ background: AppStyles.gradients.primary }}>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-white flex items-center">
                                        {editingDoctor ? (
                                            <span className="flex items-center">
                                                <FaEdit className="mr-2" /> Edit Doctor Profile
                                            </span>
                                        ) : (
                                            <span className="flex items-center">
                                                <FaUserMd className="mr-2" /> New Doctor Registration
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${formErrors.name ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                                            required
                                        />
                                        {formErrors.name && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${formErrors.email ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                                            required
                                        />
                                        {formErrors.email && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Specialization*</label>
                                        <select
                                            name="specialization"
                                            value={formData.specialization}
                                            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${formErrors.specialization ? 'border-red-500 ring-1 ring-red-500' : ''}`}
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)*</label>
                                        <input
                                            type="number"
                                            name="experience"
                                            value={formData.experience}
                                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${formErrors.experience ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                                            required
                                            min="0"
                                        />
                                        {formErrors.experience && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.experience}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone*</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={(e) => {
                                                const numbersOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                setFormData({ ...formData, phone: numbersOnly });
                                            }}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${formErrors.phone ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                                            required
                                            pattern="[0-9]{10}"
                                            inputMode="numeric"
                                            maxLength={10}
                                            placeholder="10-digit number"
                                        />
                                        {formErrors.phone && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        >
                                            <option value="">Select Country</option>
                                            {countries.map(country => (
                                                <option key={country.code} value={country.name}>{country.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        rows="3"
                                        placeholder="Enter full address"
                                    />
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
                )}
            </main>
        </div>
    );
};

export default AdminDoctors;