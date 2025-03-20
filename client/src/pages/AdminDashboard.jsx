import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserMd, FaUsers, FaDollarSign, FaSignOutAlt, FaChartLine } from 'react-icons/fa';
import api from '../utils/app.api'; // Use the API config

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalDoctors: 0,
        totalPatients: 0,
        totalAppointments: 0,
        totalRevenue: 0
    });

    useEffect(() => {
        // Check if user is authenticated and is admin
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        // For the direct login approach, use mock data
        const loadMockData = () => {
            console.log('Loading mock dashboard data');
            // Set mock statistics
            setStats({
                totalDoctors: 15,
                totalPatients: 248,
                totalAppointments: 156,
                totalRevenue: 18500
            });
        };

        // Try to fetch from API, fall back to mock data
        const fetchStats = async () => {
            try {
                // Try API call first (will likely fail with 404)
                const response = await api.get('/admin/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching stats, using mock data:', error);
                // Fall back to mock data
                loadMockData();
            }
        };

        fetchStats();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-64 bg-blue-800 text-white">
                <div className="p-4">
                    <h1 className="text-2xl font-bold">Admin Panel</h1>
                </div>
                <nav className="mt-8">
                    <Link
                        to="/admin/doctors"
                        className={`flex items-center px-6 py-3 text-gray-300 hover:bg-blue-700 ${
                            activeTab === 'doctors' ? 'bg-blue-700' : ''
                        }`}
                    >
                        <FaUserMd className="mr-3" />
                        Doctors
                    </Link>
                    <Link
                        to="/admin/patients"
                        className={`flex items-center px-6 py-3 text-gray-300 hover:bg-blue-700 ${
                            activeTab === 'patients' ? 'bg-blue-700' : ''
                        }`}
                    >
                        <FaUsers className="mr-3" />
                        Patients
                    </Link>
                    <Link
                        to="/admin/pricing"
                        className={`flex items-center px-6 py-3 text-gray-300 hover:bg-blue-700 ${
                            activeTab === 'pricing' ? 'bg-blue-700' : ''
                        }`}
                    >
                        <FaDollarSign className="mr-3" />
                        Pricing
                    </Link>
                    <Link
                        to="/admin/analytics"
                        className={`flex items-center px-6 py-3 text-gray-300 hover:bg-blue-700 ${
                            activeTab === 'analytics' ? 'bg-blue-700' : ''
                        }`}
                    >
                        <FaChartLine className="mr-3" />
                        Analytics
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center px-6 py-3 text-gray-300 hover:bg-blue-700 w-full"
                    >
                        <FaSignOutAlt className="mr-3" />
                        Logout
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="ml-64 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Stats Cards */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-500">
                                <FaUserMd className="text-2xl" />
                            </div>
                            <div className="ml-4">
                                <h2 className="text-gray-600 text-sm">Total Doctors</h2>
                                <p className="text-2xl font-semibold">{stats.totalDoctors}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 text-green-500">
                                <FaUsers className="text-2xl" />
                            </div>
                            <div className="ml-4">
                                <h2 className="text-gray-600 text-sm">Total Patients</h2>
                                <p className="text-2xl font-semibold">{stats.totalPatients}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100 text-purple-500">
                                <FaChartLine className="text-2xl" />
                            </div>
                            <div className="ml-4">
                                <h2 className="text-gray-600 text-sm">Total Appointments</h2>
                                <p className="text-2xl font-semibold">{stats.totalAppointments}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500">
                                <FaDollarSign className="text-2xl" />
                            </div>
                            <div className="ml-4">
                                <h2 className="text-gray-600 text-sm">Total Revenue</h2>
                                <p className="text-2xl font-semibold">${stats.totalRevenue}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        {/* Mock recent activity items */}
                        <div className="border-b pb-2">
                            <p className="font-medium">New patient registered</p>
                            <p className="text-sm text-gray-500">John Doe - 2 hours ago</p>
                        </div>
                        <div className="border-b pb-2">
                            <p className="font-medium">Appointment completed</p>
                            <p className="text-sm text-gray-500">Dr. Smith with Jane Doe - 4 hours ago</p>
                        </div>
                        <div className="border-b pb-2">
                            <p className="font-medium">New doctor registered</p>
                            <p className="text-sm text-gray-500">Dr. Johnson - 1 day ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 