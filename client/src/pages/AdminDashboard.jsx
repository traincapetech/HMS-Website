 import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUserMd, 
  FaUsers, 
  FaDollarSign, 
  FaSignOutAlt, 
  FaChartLine,
  FaBars,
  FaBell,
  FaSearch
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
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalDoctors: 0,
        totalPatients: 0,
        totalAppointments: 0,
        totalRevenue: 0
    });

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
                            {/* <button 
                                onClick={toggleSidebar}
                                className="mr-4 text-gray-600 hover:text-blue-600 focus:outline-none"
                            >
                                <FaBars />
                            </button> */}
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
                            <button className="relative text-gray-600 hover:text-blue-600">
                                <FaBell />
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                                    A
                                </div>
                                {sidebarOpen && (
                                    <span className="ml-2 text-gray-700">Admin</span>
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
                            {/* <button className="relative p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                                <FaBell className="text-gray-600" />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs">
                                    3
                                </span>
                            </button> */}
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