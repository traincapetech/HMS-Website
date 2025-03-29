import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaUserInjured, 
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

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const ageRanges = ["0-18", "19-30", "31-45", "46-60", "61+"];

const AdminPatients = () => {
    const [patients, setPatients] = useState([]);
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
            let url = `/api/patients?page=${currentPage}&limit=${patientsPerPage}`;
            
            if (filters.gender) url += `&gender=${filters.gender}`;
            if (filters.bloodGroup) url += `&bloodGroup=${filters.bloodGroup}`;
            if (filters.status) url += `&status=${filters.status}`;
            if (filters.ageRange) url += `&ageRange=${filters.ageRange}`;
            if (filters.specialization) url += `&specialization=${filters.specialization}`;
            if (filters.country) url += `&country=${filters.country}`;

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setPatients(response.data.patients || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching patients:', error);
            toast.error('Failed to fetch patients. Please try again later.');
            setPatients([]);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            if (editingPatient) {
                await axios.put(`/api/patients/${editingPatient._id}`, {
                    ...formData,
                    phone: formData.phone.replace(/\D/g, '')
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Patient updated successfully');
            } else {
                await axios.post('/api/patients', {
                    ...formData,
                    phone: formData.phone.replace(/\D/g, '')
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Patient added successfully');
            }
            setShowModal(false);
            await fetchPatients();
            resetForm();
        } catch (error) {
            console.error('Error saving patient:', error);
            toast.error(error.response?.data?.message || 'Failed to save patient');
        }
    };

    const handleEdit = (patient) => {
        setEditingPatient(patient);
        setFormData({
            firstName: patient.firstName,
            lastName: patient.lastName,
            email: patient.email,
            phone: patient.phone,
            address: patient.address,
            country: patient.country || '',
            dateOfBirth: patient.dateOfBirth.split('T')[0],
            gender: patient.gender,
            bloodGroup: patient.bloodGroup,
            medicalHistory: patient.medicalHistory || '',
            isActive: patient.isActive,
            specializations: patient.specializations || []
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`/api/patients/${id}`, {
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
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`/api/patients/search?query=${searchTerm}`, {
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
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {mobileSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={toggleMobileSidebar}
                ></div>
            )}

            <div className={`${sidebarOpen ? 'w-64' : 'w-20'} 
                ${mobileSidebarOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden lg:flex'} 
                bg-gray-700 text-white transition-all duration-300 ease-in-out flex flex-col`}>
                
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
                        className={`flex items-center px-6 py-3 text-white hover:bg-blue-700 ${
                            !sidebarOpen ? 'justify-center' : ''
                        }`}
                        onClick={() => setMobileSidebarOpen(false)}
                    >
                        <FaUserMd className={`${sidebarOpen ? 'mr-3' : ''}`} />
                        {sidebarOpen && "Doctors"}
                    </Link>
                    <Link
                        to="/admin/patients"
                        className={`flex items-center px-6 py-3 text-white hover:bg-blue-700 bg-blue-700 ${
                            !sidebarOpen ? 'justify-center' : ''
                        }`}
                        onClick={() => setMobileSidebarOpen(false)}
                    >
                        <FaUserInjured className={`${sidebarOpen ? 'mr-3' : ''}`} />
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

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm z-10">
                    <div className="flex items-center justify-between px-4 py-3 sm:px-6">
                        <button
                            onClick={toggleMobileSidebar}
                            className="lg:hidden p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100"
                        >
                            <FaBars />
                        </button>
                        
                        <h1 className="text-xl font-bold text-gray-800 ml-2 lg:ml-0">Patients Management</h1>
                        
                        <button
                            onClick={() => {
                                resetForm();
                                setShowModal(true);
                            }}
                            className="bg-blue-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg flex items-center hover:bg-blue-600 transition-colors"
                        >
                            <FaPlus className="mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Add Patient</span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
                    <div className="mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search patients..."
                                    className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            
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
                        
                        {showFilters && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                        <select
                                            name="gender"
                                            value={filters.gender}
                                            onChange={handleFilterChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="">All Genders</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                                        <select
                                            name="bloodGroup"
                                            value={filters.bloodGroup}
                                            onChange={handleFilterChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="">All Blood Groups</option>
                                            {bloodGroups.map((group, index) => (
                                                <option key={index} value={group}>{group}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
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
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
                                        <select
                                            name="ageRange"
                                            value={filters.ageRange}
                                            onChange={handleFilterChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="">All Ages</option>
                                            {ageRanges.map((range, index) => (
                                                <option key={index} value={range}>{range}</option>
                                            ))}
                                        </select>
                                    </div>

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

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Patient</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Contact</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Details</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Specializations</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {patients.length > 0 ? (
                                        patients.map((patient) => (
                                            <tr key={patient._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <FaUserInjured className="h-10 w-10 text-gray-400" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {patient.firstName} {patient.lastName}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {patient.gender}, {calculateAge(patient.dateOfBirth)} yrs
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                                    <div className="text-sm text-gray-900">{patient.email}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {patient.phone?.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                                    <div className="text-sm text-gray-900">{patient.bloodGroup}</div>
                                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                                        {patient.country && <span className="mr-2">{patient.country}</span>}
                                                        {patient.address}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 sm:px-6">
                                                    <div className="flex flex-wrap gap-1">
                                                        {patient.specializations?.length > 0 ? (
                                                            patient.specializations.map((spec, index) => (
                                                                <span key={index} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                                                    {spec}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-sm text-gray-500">None</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${patient.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {patient.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium sm:px-6">
                                                    <button
                                                        onClick={() => handleEdit(patient)}
                                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                                        aria-label="Edit patient"
                                                    >
                                                        <FaEdit className="inline-block" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(patient._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        aria-label="Delete patient"
                                                    >
                                                        <FaTrash className="inline-block" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-4 text-center text-gray-500 sm:px-6">
                                                {searchTerm || Object.values(filters).some(f => f) ? 'No matching patients found' : 'No patients found. Click "Add Patient" to create one.'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

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

                    {showModal && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-start justify-center pt-16 z-50">
                            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 my-8">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        {editingPatient ? 'Edit Patient' : 'Add New Patient'}
                                    </h3>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">First Name*</label>
                                                <input
                                                    type="text"
                                                    value={formData.firstName}
                                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Last Name*</label>
                                                <input
                                                    type="text"
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Email*</label>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Phone*</label>
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => {
                                                        const numbersOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                        setFormData({ ...formData, phone: numbersOnly });
                                                    }}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    required
                                                    pattern="[0-9]{10}"
                                                    inputMode="numeric"
                                                    maxLength={10}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Date of Birth*</label>
                                                <input
                                                    type="date"
                                                    value={formData.dateOfBirth}
                                                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Gender*</label>
                                                <select
                                                    value={formData.gender}
                                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    required
                                                >
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                                                <select
                                                    value={formData.bloodGroup}
                                                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                >
                                                    {bloodGroups.map(group => (
                                                        <option key={group} value={group}>{group}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Country</label>
                                                <select
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
                                                <div className="mt-1 flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.isActive}
                                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <label className="ml-2 block text-sm text-gray-900">Active</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Address</label>
                                            <input
                                                type="text"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Medical History</label>
                                            <textarea
                                                value={formData.medicalHistory}
                                                onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                rows="3"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Specializations</label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                {specialtiesList.map((spec, index) => (
                                                    <div key={index} className="flex items-center">
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
                                            >
                                                {editingPatient ? 'Update Patient' : 'Add Patient'}
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

function calculateAge(dateOfBirth) {
    if (!dateOfBirth) return 'N/A';
    const birthDate = new Date(dateOfBirth);
    const diff = Date.now() - birthDate.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default AdminPatients;