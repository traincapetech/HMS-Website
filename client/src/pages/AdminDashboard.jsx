import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUserMd, 
  FaUsers, 
  FaDollarSign, 
  FaSignOutAlt, 
  FaChartLine,
  FaBars,
  FaBell,
  FaSearch,
  FaCog
} from 'react-icons/fa';
import api from '../utils/app.api';

const StatCard = ({ icon, title, value, bgColor, textColor }) => (
  <div className="bg-white rounded-xl shadow p-4 sm:p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center">
      <div className={`p-2 sm:p-3 rounded-full ${bgColor} ${textColor}`}>
        {icon}
      </div>
      <div className="ml-3 sm:ml-4">
        <h2 className="text-gray-500 text-xs sm:text-sm font-medium">{title}</h2>
        <p className="text-xl sm:text-2xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalDoctors: 0,
        totalPatients: 0,
        totalAppointments: 0,
        totalRevenue: 0
    });

    // Refs for dropdowns
    const notificationRef = useRef(null);
    const profileRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        const loadMockData = () => {
            setStats({
                totalDoctors: 15,
                totalPatients: 248,
                totalAppointments: 156,
                totalRevenue: 18500
            });
        };

        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/stats');
                setStats(response.data);
            } catch (error) {
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

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleMobileSidebar = () => {
        setMobileSidebarOpen(!mobileSidebarOpen);
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        setShowProfileDropdown(false);
    };

    const toggleProfileDropdown = () => {
        setShowProfileDropdown(!showProfileDropdown);
        setShowNotifications(false);
    };

    const handleViewAllNotifications = () => {
        setShowNotifications(false);
        navigate('/admin/notifications');
    };

    // Mock notifications data
    const notifications = [
        { id: 1, message: 'New appointment scheduled with Dr. Smith', time: '10 mins ago', read: false },
        { id: 2, message: 'Patient John Doe completed his profile', time: '2 hours ago', read: false },
        { id: 3, message: 'System maintenance scheduled for tonight', time: '1 day ago', read: true },
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

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
                        className={`flex items-center px-4 sm:px-6 py-3 text-white hover:bg-blue-700 ${
                            activeTab === 'overview' ? 'bg-blue-700' : ''
                        } ${!sidebarOpen ? 'justify-center' : ''}`}
                        onClick={() => setMobileSidebarOpen(false)}
                    >
                        <FaChartLine className={`${sidebarOpen ? 'mr-3' : ''}`} />
                        {sidebarOpen && "Overview"}
                    </Link>
                    <Link
                        to="/admin/doctors"
                        className={`flex items-center px-4 sm:px-6 py-3 text-white hover:bg-blue-700 ${
                            activeTab === 'doctors' ? 'bg-blue-700' : ''
                        } ${!sidebarOpen ? 'justify-center' : ''}`}
                        onClick={() => setMobileSidebarOpen(false)}
                    >
                        <FaUserMd className={`${sidebarOpen ? 'mr-3' : ''}`} />
                        {sidebarOpen && "Doctors"}
                    </Link>
                    <Link
                        to="/admin/patients"
                        className={`flex items-center px-4 sm:px-6 py-3 text-white hover:bg-blue-700 ${
                            activeTab === 'patients' ? 'bg-blue-700' : ''
                        } ${!sidebarOpen ? 'justify-center' : ''}`}
                        onClick={() => setMobileSidebarOpen(false)}
                    >
                        <FaUsers className={`${sidebarOpen ? 'mr-3' : ''}`} />
                        {sidebarOpen && "Patients"}
                    </Link>
                    <Link
                        to="/admin/pricing"
                        className={`flex items-center px-4 sm:px-6 py-3 text-white hover:bg-blue-700 ${
                            activeTab === 'pricing' ? 'bg-blue-700' : ''
                        } ${!sidebarOpen ? 'justify-center' : ''}`}
                        onClick={() => setMobileSidebarOpen(false)}
                    >
                        <FaDollarSign className={`${sidebarOpen ? 'mr-3' : ''}`} />
                        {sidebarOpen && "Pricing"}
                    </Link>
                    <Link
                        to="/admin/analytics"
                        className={`flex items-center px-4 sm:px-6 py-3 text-white hover:bg-blue-700 ${
                            activeTab === 'pricing' ? 'bg-blue-700' : ''
                        } ${!sidebarOpen ? 'justify-center' : ''}`}
                        onClick={() => setMobileSidebarOpen(false)}
                    >
                        <FaDollarSign className={`${sidebarOpen ? 'mr-3' : ''}`} />
                        {sidebarOpen && "Analytics"}
                    </Link>
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-white">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center w-full text-gray-300 hover:text-white ${
                            !sidebarOpen ? 'justify-center' : ''
                        }`}
                    >
                        <FaSignOutAlt className={`${sidebarOpen ? 'mr-3' : ''}`} />
                        {sidebarOpen && "Logout"}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <header className="bg-white shadow-sm z-10">
                    <div className="flex items-center justify-between px-4 sm:px-6 py-3">
                        {/* Mobile menu button */}
                        <button
                            onClick={toggleMobileSidebar}
                            className="lg:hidden p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100"
                        >
                            <FaBars />
                        </button>
                        
                        {/* Search bar - hidden on mobile */}
                        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
                            <div className="relative w-full">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            {/* Notification Dropdown */}
                            <div className="relative" ref={notificationRef}>
                                <button 
                                    onClick={toggleNotifications}
                                    className="relative p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100"
                                >
                                    <FaBell />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                                
                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
                                        <div className="py-1">
                                            <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
                                                <h3 className="text-sm font-medium text-gray-700">Notifications ({unreadCount} new)</h3>
                                            </div>
                                            <div className="max-h-96 overflow-y-auto">
                                                {notifications.length > 0 ? (
                                                    notifications.map((notification) => (
                                                        <div 
                                                            key={notification.id} 
                                                            className={`px-4 py-3 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                                                        >
                                                            <div className="flex items-start">
                                                                <div className="flex-shrink-0 pt-0.5">
                                                                    <div className={`h-2 w-2 rounded-full ${!notification.read ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                                                                </div>
                                                                <div className="ml-3 flex-1">
                                                                    <p className="text-sm text-gray-800">{notification.message}</p>
                                                                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-3 text-center text-sm text-gray-500">
                                                        No new notifications
                                                    </div>
                                                )}
                                            </div>
                                            <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-center">
                                                <button 
                                                    onClick={handleViewAllNotifications}
                                                    className="text-xs text-blue-600 hover:text-blue-800"
                                                >
                                                    View all notifications
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Profile Dropdown */}
                            <div className="relative" ref={profileRef}>
                                <button 
                                    onClick={toggleProfileDropdown}
                                    className="flex items-center space-x-2 focus:outline-none"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                                        A
                                    </div>
                                    {sidebarOpen && (
                                        <span className="text-gray-700 hidden sm:inline">Admin</span>
                                    )}
                                </button>
                                
                                {showProfileDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                                        <div className="py-1">
                                            <Link
                                                to="/admin/settings"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setShowProfileDropdown(false)}
                                            >
                                                <div className="flex items-center">
                                                    <FaCog className="mr-2" /> Settings
                                                </div>
                                            </Link>
                                            <div className="border-t border-gray-200"></div>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <div className="flex items-center">
                                                    <FaSignOutAlt className="mr-2" /> Logout
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard</h1>
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            {/* Additional header buttons can go here */}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <StatCard 
                            icon={<FaUserMd className="text-xl sm:text-2xl" />}
                            title="Total Doctors"
                            value={stats.totalDoctors}
                            bgColor="bg-blue-100"
                            textColor="text-blue-500"
                        />
                        <StatCard 
                            icon={<FaUsers className="text-xl sm:text-2xl" />}
                            title="Total Patients"
                            value={stats.totalPatients}
                            bgColor="bg-green-100"
                            textColor="text-green-500"
                        />
                        <StatCard 
                            icon={<FaChartLine className="text-xl sm:text-2xl" />}
                            title="Appointments"
                            value={stats.totalAppointments}
                            bgColor="bg-purple-100"
                            textColor="text-purple-500"
                        />
                        <StatCard 
                            icon={<FaDollarSign className="text-xl sm:text-2xl" />}
                            title="Total Revenue"
                            value={`$${stats.totalRevenue}`}
                            bgColor="bg-yellow-100"
                            textColor="text-yellow-500"
                        />
                    </div>

                    {/* Recent Activity and Quick Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">Recent Activity</h2>
                            <div className="space-y-3 sm:space-y-4">
                                {[
                                    { title: "New patient registered", desc: "John Doe", time: "2 hours ago" },
                                    { title: "Appointment completed", desc: "Dr. Smith with Jane Doe", time: "4 hours ago" },
                                    { title: "New doctor registered", desc: "Dr. Johnson", time: "1 day ago" }
                                ].map((activity, index) => (
                                    <div key={index} className="border-b pb-2 sm:pb-3 last:border-b-0">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm sm:text-base font-medium text-gray-700">{activity.title}</p>
                                                <p className="text-xs sm:text-sm text-gray-500">{activity.desc}</p>
                                            </div>
                                            <span className="text-xs text-gray-400">{activity.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">Quick Actions</h2>
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                {[
                                    { icon: <FaUserMd className="text-lg sm:text-xl" />, label: "Add Doctor", color: "bg-blue-500" },
                                    { icon: <FaUsers className="text-lg sm:text-xl" />, label: "Add Patient", color: "bg-green-500" },
                                    { icon: <FaChartLine className="text-lg sm:text-xl" />, label: "Generate Report", color: "bg-purple-500" },
                                    { icon: <FaDollarSign className="text-lg sm:text-xl" />, label: "Billing", color: "bg-yellow-500" }
                                ].map((action, index) => (
                                    <button 
                                        key={index} 
                                        className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg ${action.color} text-white hover:opacity-90 transition-opacity`}
                                    >
                                        {action.icon}
                                        <span className="mt-1 sm:mt-2 text-xs sm:text-sm">{action.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;