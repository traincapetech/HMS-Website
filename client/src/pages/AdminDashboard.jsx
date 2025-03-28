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
  FaCog,
  FaUser
} from 'react-icons/fa';
import api from '../utils/app.api';

const StatCard = ({ icon, title, value, bgColor, textColor }) => (
  <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${bgColor} ${textColor}`}>
        {icon}
      </div>
      <div className="ml-4">
        <h2 className="text-gray-500 text-sm font-medium">{title}</h2>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);
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

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        setShowProfileDropdown(false);
    };

    const toggleProfileDropdown = () => {
        setShowProfileDropdown(!showProfileDropdown);
        setShowNotifications(false);
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
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-700 text-white transition-all duration-300 ease-in-out flex flex-col`}>
                {/* Sidebar Header */}
                <div className="p-4 flex items-center justify-between border-b border-white h-16">
                    {sidebarOpen ? (
                        <h1 className="text-xl font-bold whitespace-nowrap">Admin Dashboard</h1>
                    ) : (
                        <div className="w-6"></div>
                    )}
                    <button 
                        onClick={toggleSidebar}
                        className="text-white hover:text-blue-200 focus:outline-none"
                    >
                        <FaBars />
                    </button>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 overflow-y-auto">
                    <Link
                        to="/admin/doctors"
                        className={`flex items-center px-6 py-3 text-white hover:bg-blue-700 ${
                            activeTab === 'doctors' ? 'bg-blue-700' : ''
                        } ${!sidebarOpen ? 'justify-center' : ''}`}
                    >
                        <FaUserMd className={`${sidebarOpen ? 'mr-3' : ''}`} />
                        {sidebarOpen && "Doctors"}
                    </Link>
                    <Link
                        to="/admin/patients"
                        className={`flex items-center px-6 py-3 text-white hover:bg-blue-700 ${
                            activeTab === 'patients' ? 'bg-blue-700' : ''
                        } ${!sidebarOpen ? 'justify-center' : ''}`}
                    >
                        <FaUsers className={`${sidebarOpen ? 'mr-3' : ''}`} />
                        {sidebarOpen && "Patients"}
                    </Link>
                    <Link
                        to="/admin/pricing"
                        className={`flex items-center px-6 py-3 text-white hover:bg-blue-700 ${
                            activeTab === 'pricing' ? 'bg-blue-700' : ''
                        } ${!sidebarOpen ? 'justify-center' : ''}`}
                    >
                        <FaDollarSign className={`${sidebarOpen ? 'mr-3' : ''}`} />
                        {sidebarOpen && "Pricing"}
                    </Link>
                    <Link
                        to="/admin/analytics"
                        className={`flex items-center px-6 py-3 text-white hover:bg-blue-700 ${
                            activeTab === 'analytics' ? 'bg-blue-700' : ''
                        } ${!sidebarOpen ? 'justify-center' : ''}`}
                    >
                        <FaChartLine className={`${sidebarOpen ? 'mr-3' : ''}`} />
                        {sidebarOpen && "Analytics"}
                    </Link>
                    {/* <Link
                        to="/admin/settings"
                        className={`flex items-center px-6 py-3 text-white hover:bg-blue-700 ${
                            activeTab === 'settings' ? 'bg-blue-700' : ''
                        } ${!sidebarOpen ? 'justify-center' : ''}`}
                    >
                        <FaCog className={`${sidebarOpen ? 'mr-3' : ''}`} />
                        {sidebarOpen && "Settings"}
                    </Link> */}
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
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
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
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
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
                                                <Link to="/admin/notifications" className="text-xs text-blue-600 hover:text-blue-800">
                                                    View all notifications
                                                </Link>
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
                                        <span className="text-gray-700">Admin</span>
                                    )}
                                </button>
                                
                                {showProfileDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                                        <div className="py-1">
                                            {/* <Link
                                                to="/admin/settings"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setShowProfileDropdown(false)}
                                            >
                                                <div className="flex items-center">
                                                    <FaUser className="mr-2" /> Profile
                                                </div>
                                            </Link> */}
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
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                        <div className="flex items-center space-x-4">
                            {/* Additional header buttons can go here */}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard 
                            icon={<FaUserMd className="text-2xl" />}
                            title="Total Doctors"
                            value={stats.totalDoctors}
                            bgColor="bg-blue-100"
                            textColor="text-blue-500"
                        />
                        <StatCard 
                            icon={<FaUsers className="text-2xl" />}
                            title="Total Patients"
                            value={stats.totalPatients}
                            bgColor="bg-green-100"
                            textColor="text-green-500"
                        />
                        <StatCard 
                            icon={<FaChartLine className="text-2xl" />}
                            title="Appointments"
                            value={stats.totalAppointments}
                            bgColor="bg-purple-100"
                            textColor="text-purple-500"
                        />
                        <StatCard 
                            icon={<FaDollarSign className="text-2xl" />}
                            title="Total Revenue"
                            value={`$${stats.totalRevenue}`}
                            bgColor="bg-yellow-100"
                            textColor="text-yellow-500"
                        />
                    </div>

                    {/* Recent Activity and Quick Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2>
                            <div className="space-y-4">
                                {[
                                    { title: "New patient registered", desc: "John Doe", time: "2 hours ago" },
                                    { title: "Appointment completed", desc: "Dr. Smith with Jane Doe", time: "4 hours ago" },
                                    { title: "New doctor registered", desc: "Dr. Johnson", time: "1 day ago" }
                                ].map((activity, index) => (
                                    <div key={index} className="border-b pb-3 last:border-b-0">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-gray-700">{activity.title}</p>
                                                <p className="text-sm text-gray-500">{activity.desc}</p>
                                            </div>
                                            <span className="text-xs text-gray-400">{activity.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: <FaUserMd />, label: "Add Doctor", color: "bg-blue-500" },
                                    { icon: <FaUsers />, label: "Add Patient", color: "bg-green-500" },
                                    { icon: <FaChartLine />, label: "Generate Report", color: "bg-purple-500" },
                                    { icon: <FaDollarSign />, label: "Billing", color: "bg-yellow-500" }
                                ].map((action, index) => (
                                    <button 
                                        key={index} 
                                        className={`flex flex-col items-center justify-center p-4 rounded-lg ${action.color} text-white hover:opacity-90 transition-opacity`}
                                    >
                                        {action.icon}
                                        <span className="mt-2 text-sm">{action.label}</span>
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