import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    FaUserMd,
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
            let url = `http://localhost:8080/api/doctor/all`;

            const params = new URLSearchParams();
            params.append('page', currentPage);
            params.append('limit', doctorsPerPage);

            if (filters.Speciality) params.append('Speciality', filters.Speciality);
            if (filters.experience) params.append('experience', filters.experience);
            if (filters.state) params.append('state', filters.state);

            url += `?${params.toString()}`;

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setData(response.data)
            setDoctors(response.data.doctors || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            if (error.response) {
                toast.error(error.response.data.message || 'Failed to fetch doctors');
            } else {
                toast.error('Network error. Please try again later.');
            }
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
            const token = localStorage.getItem('adminToken');
            const doctorData = {
                ...formData,
                phone: String(formData.phone).replace(/\D/g, ''),
                status: formData.status || 'active'
            };

            if (editingDoctor) {
                await axios.put(
                    `http://localhost:8080/api/add_doc/add${editingDoctor._id}`,
                    doctorData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success('Doctor updated successfully');
            } else {
                await axios.post(
                    'http://localhost:8080/api/add_doc/add',
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
            const token = localStorage.getItem('adminToken');
            await axios.delete(`http://localhost:8080/api/add_doc/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

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
        <div className="bg-gray-100 min-h-screen">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Doctors Management</h1>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition-colors"
                    >
                        <FaPlus className="mr-2" />
                        Add Doctor
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
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
                                Filters
                            </button>
                            <button
                                onClick={handleSearch}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Specialization Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Speciality</label>
                                    <select
                                        name="specialization"
                                        value={filters.Speciality}
                                        onChange={handleFilterChange}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">All Speciality</option>
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
                                        value={filters.Experience}
                                        onChange={handleFilterChange}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">All Experience Levels</option>
                                        {experienceRanges.map((range, index) => (
                                            <option key={index} value={range}>{range}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* State Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                    <select
                                        name="country"
                                        value={filters.State}
                                        onChange={handleFilterChange}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">All States</option>
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
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">NAME</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Speciality</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Experience</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">State</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {
                                    data.doctor && data.doctor.length > 0 ? (
                                        data.doctor.map((doctor) => (
                                            <tr key={doctor._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                                    <div className="text-sm text-gray-900">{doctor._id}</div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <FaUserMd className="h-10 w-10 text-gray-400" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{doctor.Name}</div>
                                                            <div className="text-sm text-gray-500">{doctor.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                                    <div className="text-sm text-gray-900">{doctor.Speciality}</div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                                    <div className="text-sm text-gray-900">{doctor.Experience} years</div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                                    <div className="text-sm text-gray-900">
                                                        {doctor.State ? String(doctor.State).replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : 'N/A'}
                                                    </div>
                                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                                        {doctor.country && <span className="mr-2">{doctor.country}</span>}
                                                        {doctor.address}
                                                    </div>
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
                                            <td colSpan="7" className="px-4 py-4 text-center text-gray-500 sm:px-6">
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
    );
};

export default AdminDoctors;