import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LineChart, BarChart, AreaChart, PieChart } from 'recharts';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Bar, Area, Pie, Cell, ResponsiveContainer } from 'recharts';
import { 
  FaUserMd, 
  FaUsers, 
  FaDollarSign, 
  FaChartLine,
  FaBars,
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaSearch, 
  FaFilter,
  FaSignOutAlt
} from 'react-icons/fa';
import { 
  Calendar, 
  Users as UsersIcon, 
  DollarSign as DollarSignIcon, 
  Clock, 
  TrendingUp, 
  Activity, 
  FileText, 
  Settings, 
  Bell 
} from 'lucide-react';

const AdminAnalytics = () => {
    const [activeFilter, setActiveFilter] = useState('monthly');
    const [showNotifications, setShowNotifications] = useState(false);
    const [activeChart, setActiveChart] = useState('line');
    const [isLoading, setIsLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const navigate = useNavigate();

    // Simulate data loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const timeFilters = [
        { label: 'Daily', value: 'daily' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Quarterly', value: 'quarterly' },
        { label: 'Yearly', value: 'yearly' }
    ];

    const chartTypes = [
        { label: 'Line', value: 'line' },
        { label: 'Bar', value: 'bar' },
        { label: 'Area', value: 'area' },
        { label: 'Pie', value: 'pie' }
    ];

    // Enhanced mock data
    const analyticsData = {
        patients: {
            daily: { value: 42, change: 5.2 },
            weekly: { value: 287, change: 8.7 },
            monthly: { value: 1245, change: 12.5 },
            quarterly: { value: 3789, change: 18.2 },
            yearly: { value: 14567, change: 22.7 }
        },
        revenue: {
            daily: { value: '$2,890', change: 3.5 },
            weekly: { value: '$19,450', change: 6.8 },
            monthly: { value: '$85,670', change: 9.3 },
            quarterly: { value: '$256,890', change: 15.6 },
            yearly: { value: '$1,024,560', change: 25.4 }
        },
        appointments: {
            daily: { value: 15, change: 2.3 },
            weekly: { value: 98, change: 5.4 },
            monthly: { value: 456, change: 7.8 },
            quarterly: { value: 1389, change: 14.2 },
            yearly: { value: 5678, change: 19.5 }
        },
        satisfaction: {
            daily: { value: '95%', change: 1.2 },
            weekly: { value: '93%', change: 0.8 },
            monthly: { value: '92%', change: 1.5 },
            quarterly: { value: '91%', change: 2.3 },
            yearly: { value: '90%', change: 3.7 }
        }
    };

    // Chart data
    const patientGrowthData = [
        { name: 'Jan', value: 100 },
        { name: 'Feb', value: 250 },
        { name: 'Mar', value: 180 },
        { name: 'Apr', value: 300 },
        { name: 'May', value: 220 },
        { name: 'Jun', value: 280 },
        { name: 'Jul', value: 350 }
    ];

    const revenueTrendData = [
        { name: 'Jan', value: 5000 },
        { name: 'Feb', value: 7500 },
        { name: 'Mar', value: 6200 },
        { name: 'Apr', value: 8900 },
        { name: 'May', value: 7800 },
        { name: 'Jun', value: 9500 },
        { name: 'Jul', value: 10200 }
    ];

    const departmentData = [
        { name: 'Cardiology', value: 35 },
        { name: 'Neurology', value: 25 },
        { name: 'Pediatrics', value: 20 },
        { name: 'Orthopedics', value: 15 },
        { name: 'Dermatology', value: 5 }
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    const notifications = [
        { id: 1, title: "Appointment Reminder", message: "Dr. Smith has 5 appointments tomorrow", time: "12 min ago", unread: true },
        { id: 2, title: "Revenue Alert", message: "Revenue target reached for the month", time: "1 hour ago", unread: true },
        { id: 3, title: "System Update", message: "New features available in the dashboard", time: "3 hours ago", unread: false },
        { id: 4, title: "New Reviews", message: "3 new patient reviews received", time: "Yesterday", unread: false }
    ];

    const AnalyticsCard = ({ title, value, change, icon, bgColor, textColor }) => (
        <div className={`${bgColor} rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-sm uppercase tracking-wide text-gray-500 font-medium">{title}</h3>
                    <div className="flex items-center mt-2">
                        <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
                        <span className={`ml-2 text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                            {change > 0 ? '▲' : '▼'} {Math.abs(change)}%
                        </span>
                    </div>
                </div>
                <div className={`${bgColor === 'bg-white' ? 'bg-gray-100' : 'bg-white bg-opacity-20'} p-3 rounded-full`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    const renderActiveChart = (data, color) => {
        switch (activeChart) {
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill={color} />
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'area':
                return (
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="value" stroke={color} fill={color} fillOpacity={0.2} />
                        </AreaChart>
                    </ResponsiveContainer>
                );
            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                );
            default:
                return (
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                );
        }
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

    if (isLoading) {
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
                        className={`flex items-center px-6 py-3 text-white hover:bg-blue-700 bg-blue-700 ${
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
                {/* Navbar */}
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
                        <h1 className="text-xl font-bold text-gray-800 ml-2 lg:ml-0">Analytics Dashboard</h1>
                        
                        {/* Notifications */}
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                {/* <button 
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="p-2 rounded-full hover:bg-gray-100 relative"
                                >
                                    <Bell className="w-5 h-5 text-gray-600" />
                                    {notifications.filter(n => n.unread).length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {notifications.filter(n => n.unread).length}
                                        </span>
                                    )}
                                </button> */}
                                
                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-20">
                                        <div className="p-3 border-b">
                                            <h3 className="font-semibold">Notifications</h3>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.map(notification => (
                                                <div key={notification.id} className={`p-3 border-b hover:bg-gray-50 ${notification.unread ? 'bg-blue-50' : ''}`}>
                                                    <div className="flex justify-between">
                                                        <h4 className="font-medium text-sm">{notification.title}</h4>
                                                        <span className="text-xs text-gray-400">{notification.time}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-3 text-center">
                                            <button className="text-sm text-blue-600 hover:underline">View All Notifications</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* <div className="flex items-center">
                                <img 
                                    src="/api/placeholder/40/40" 
                                    alt="User Avatar" 
                                    className="w-10 h-10 rounded-full border-2 border-blue-500"
                                />
                                <div className="ml-2">
                                    <p className="text-sm font-medium">Admin User</p>
                                    <p className="text-xs text-gray-500">Administrator</p>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </header>

                {/* Analytics Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
                    {/* Dashboard Header */}
                    <div className="mb-8 flex flex-wrap justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Analytics</h1>
                            <p className="text-gray-600 mt-2">Comprehensive insights into your medical practice</p>
                        </div>
                        
                        {/* Date Range & Export */}
                        {/* <div className="flex space-x-2 mt-4 sm:mt-0">
                            <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>Select Date Range</span>
                            </button>
                            <button className="bg-green-100 text-green-700 px-4 py-2 rounded-lg flex items-center">
                                <FileText className="w-4 h-4 mr-2" />
                                <span>Export Report</span>
                            </button>
                        </div> */}
                    </div>
                    
                    {/* Time Filter */}
                    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                        <div className="flex flex-wrap items-center justify-between">
                            <p className="text-gray-700 font-medium mb-2 sm:mb-0">Filter Analytics By:</p>
                            <div className="inline-flex rounded-md shadow-sm">
                                {timeFilters.map((filter) => (
                                    <button
                                        key={filter.value}
                                        onClick={() => setActiveFilter(filter.value)}
                                        className={`px-4 py-2 text-sm transition-colors ${
                                            activeFilter === filter.value 
                                            ? 'bg-blue-600 text-white font-medium' 
                                            : 'hover:bg-gray-100 text-gray-700'
                                        } ${
                                            filter.value === timeFilters[0].value ? 'rounded-l-md' : ''
                                        } ${
                                            filter.value === timeFilters[timeFilters.length - 1].value ? 'rounded-r-md' : ''
                                        }`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Analytics Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <AnalyticsCard 
                            title="Total Patients"
                            value={analyticsData.patients[activeFilter].value}
                            change={analyticsData.patients[activeFilter].change}
                            icon={<UsersIcon className="w-6 h-6 text-blue-600" />}
                            bgColor="bg-blue-50"
                            textColor="text-blue-800"
                        />
                        <AnalyticsCard 
                            title="Total Revenue"
                            value={analyticsData.revenue[activeFilter].value}
                            change={analyticsData.revenue[activeFilter].change}
                            icon={<DollarSignIcon className="w-6 h-6 text-green-600" />}
                            bgColor="bg-green-50"
                            textColor="text-green-800"
                        />
                        <AnalyticsCard 
                            title="Total Appointments"
                            value={analyticsData.appointments[activeFilter].value}
                            change={analyticsData.appointments[activeFilter].change}
                            icon={<Clock className="w-6 h-6 text-purple-600" />}
                            bgColor="bg-purple-50"
                            textColor="text-purple-800"
                        />
                        <AnalyticsCard 
                            title="Patient Satisfaction"
                            value={analyticsData.satisfaction[activeFilter].value}
                            change={analyticsData.satisfaction[activeFilter].change}
                            icon={<Activity className="w-6 h-6 text-orange-600" />}
                            bgColor="bg-orange-50"
                            textColor="text-orange-800"
                        />
                    </div>

                    {/* Chart type selector */}
                    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                        <div className="flex flex-wrap items-center justify-between">
                            <p className="text-gray-700 font-medium mb-2 sm:mb-0">Chart Type:</p>
                            <div className="inline-flex rounded-md shadow-sm">
                                {chartTypes.map((chart) => (
                                    <button
                                        key={chart.value}
                                        onClick={() => setActiveChart(chart.value)}
                                        className={`px-4 py-2 text-sm transition-colors ${
                                            activeChart === chart.value 
                                            ? 'bg-indigo-600 text-white font-medium' 
                                            : 'hover:bg-gray-100 text-gray-700'
                                        } ${
                                            chart.value === chartTypes[0].value ? 'rounded-l-md' : ''
                                        } ${
                                            chart.value === chartTypes[chartTypes.length - 1].value ? 'rounded-r-md' : ''
                                        }`}
                                    >
                                        {chart.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {/* Patient Growth Chart */}
                        <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">Patient Growth</h2>
                                    <p className="text-sm text-gray-500 mt-1">{activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} trend</p>
                                </div>
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                            </div>
                            {renderActiveChart(patientGrowthData, '#3B82F6')}
                        </div>

                        {/* Revenue Trend Chart */}
                        <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">Revenue Trend</h2>
                                    <p className="text-sm text-gray-500 mt-1">{activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} analysis</p>
                                </div>
                                <TrendingUp className="w-5 h-5 text-green-600" />
                            </div>
                            {renderActiveChart(revenueTrendData, '#10B981')}
                        </div>
                    </div>

                    {/* Department Distribution & Recent Activity */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Department Distribution */}
                        <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">Department Distribution</h2>
                                <Settings className="w-5 h-5 text-gray-600" />
                            </div>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={departmentData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={true}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {departmentData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl shadow-md p-6 md:col-span-2 transition-all duration-300 hover:shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
                                <button className="text-blue-600 text-sm hover:underline">View All</button>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { title: "New Patient Registered", description: "John Doe (35) - Cardiology department", time: "2 hours ago", icon: <UsersIcon className="w-5 h-5 text-blue-500" /> },
                                    { title: "Appointment Completed", description: "Dr. Smith with Emily Johnson - Follow-up check", time: "4 hours ago", icon: <Clock className="w-5 h-5 text-purple-500" /> },
                                    { title: "Payment Received", description: "Invoice #1234 - $750.00 for surgery consultation", time: "1 day ago", icon: <DollarSignIcon className="w-5 h-5 text-green-500" /> },
                                    { title: "New Review Received", description: "5-star rating from Robert Davis", time: "2 days ago", icon: <Activity className="w-5 h-5 text-orange-500" /> }
                                ].map((activity, index) => (
                                    <div key={index} className="border-b pb-4 last:border-b-0">
                                        <div className="flex">
                                            <div className="bg-gray-100 p-3 rounded-full mr-4">
                                                {activity.icon}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-1">
                                                    <p className="font-medium text-gray-800">{activity.title}</p>
                                                    <span className="text-xs text-gray-400">{activity.time}</span>
                                                </div>
                                                <p className="text-sm text-gray-600">{activity.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminAnalytics;