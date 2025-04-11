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
  FaSignOutAlt
} from 'react-icons/fa';
import axios from 'axios';
import { 
  Users as UsersIcon, 
  DollarSign as DollarSignIcon, 
  Clock, 
  TrendingUp, 
  Activity, 
  Settings 
} from 'lucide-react';

const AdminAnalytics = () => {
    const [activeFilter, setActiveFilter] = useState('monthly');
    const [activeChart, setActiveChart] = useState('line');
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalDoctors: 0,
        totalPatients: 0,
        totalAppointments: 0,
        totalRevenue: 0
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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

    // Fetch data from API
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        const fetchDashboardData = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                
                const [doctorsResponse, patientsResponse, appointmentsResponse, revenueResponse] = await Promise.all([
                    axios.get('http://localhost:8080/api/doctor/count', config),
                    axios.get('http://localhost:8080/api/newuser/count', config),
                    axios.get('http://localhost:8080/api/appoint/count', config),
                    Promise.resolve({ data: { revenue: 18500 } }) // Replace with actual revenue API if available
                ]);
                
                setStats({
                    totalDoctors: doctorsResponse.data.count || 0,
                    totalPatients: patientsResponse.data.count || 0,
                    totalAppointments: appointmentsResponse.data.count || 0,
                    totalRevenue: revenueResponse.data.revenue || 18500
                });
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError("Failed to load dashboard data. Please try again later.");
                
                // Use cached data if available
                const cachedStats = JSON.parse(localStorage.getItem('dashboardStats'));
                if (cachedStats) {
                    setStats(cachedStats);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    // Generate chart data based on dashboard stats
    const generateChartData = (baseValue, months = 7) => {
        return Array.from({ length: months }, (_, i) => ({
            name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][i],
            value: Math.round(baseValue * (0.8 + Math.random() * 0.4) * (i + 1) / 2) // Added closing parenthesis here
        }));
    };

    const patientGrowthData = generateChartData(stats.totalPatients);
    const revenueTrendData = generateChartData(stats.totalRevenue / 1000).map(item => ({
        ...item,
        value: item.value * 1000 // Convert back to dollar amounts
    }));
    const appointmentTrendData = generateChartData(stats.totalAppointments);

    // Department distribution (mock data based on common hospital distributions)
    const departmentData = [
        { name: 'Cardiology', value: Math.round(stats.totalPatients * 0.35) },
        { name: 'Neurology', value: Math.round(stats.totalPatients * 0.25) },
        { name: 'Pediatrics', value: Math.round(stats.totalPatients * 0.20) },
        { name: 'Orthopedics', value: Math.round(stats.totalPatients * 0.15) },
        { name: 'Dermatology', value: Math.round(stats.totalPatients * 0.05) }
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    const AnalyticsCard = ({ title, value, change, icon, bgColor, textColor }) => (
        <div className={`${bgColor} rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-sm uppercase tracking-wide text-gray-500 font-medium">{title}</h3>
                    <div className="flex items-center mt-2">
                        <p className={`text-2xl font-bold ${textColor}`}>
                            {title.includes('Revenue') ? `$${value.toLocaleString()}` : value.toLocaleString()}
                        </p>
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
                            <Tooltip 
                                formatter={(value) => value.toLocaleString()}
                                labelFormatter={(label) => `Month: ${label}`}
                            />
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
                            <Tooltip 
                                formatter={(value) => value.toLocaleString()}
                                labelFormatter={(label) => `Month: ${label}`}
                            />
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
                            <Tooltip formatter={(value) => value.toLocaleString()} />
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
                            <Tooltip 
                                formatter={(value) => value.toLocaleString()}
                                labelFormatter={(label) => `Month: ${label}`}
                            />
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

    if (isLoading) {
        return (
            <div className="flex h-screen bg-gray-100 overflow-hidden">
                {/* Loading spinner */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <header className="bg-white shadow-sm z-10">
                    <div className="flex items-center justify-between px-4 py-3 sm:px-6">
                        <h1 className="text-xl font-bold text-gray-800">Analytics Dashboard</h1>
                        <button
                            onClick={handleLogout}
                            className="flex items-center text-gray-600 hover:text-red-600"
                        >
                            <FaSignOutAlt className="mr-2" />
                            Logout
                        </button>
                    </div>
                </header>

                {/* Analytics Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
                    {/* Dashboard Header */}
                    <div className="mb-8 flex flex-wrap justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Analytics</h1>
                            <p className="text-gray-600 mt-2">Comprehensive insights based on your dashboard data</p>
                        </div>
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
                            value={stats.totalPatients}
                            change={5.2} // You would calculate this based on your actual data trends
                            icon={<UsersIcon className="w-6 h-6 text-blue-600" />}
                            bgColor="bg-blue-50"
                            textColor="text-blue-800"
                        />
                        <AnalyticsCard 
                            title="Total Revenue"
                            value={stats.totalRevenue}
                            change={8.7} // You would calculate this based on your actual data trends
                            icon={<DollarSignIcon className="w-6 h-6 text-green-600" />}
                            bgColor="bg-green-50"
                            textColor="text-green-800"
                        />
                        <AnalyticsCard 
                            title="Total Appointments"
                            value={stats.totalAppointments}
                            change={3.5} // You would calculate this based on your actual data trends
                            icon={<Clock className="w-6 h-6 text-purple-600" />}
                            bgColor="bg-purple-50"
                            textColor="text-purple-800"
                        />
                        <AnalyticsCard 
                            title="Total Doctors"
                            value={stats.totalDoctors}
                            change={2.3} // You would calculate this based on your actual data trends
                            icon={<FaUserMd className="w-6 h-6 text-orange-600" />}
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
                                    <p className="text-sm text-gray-500 mt-1">Based on {stats.totalPatients} total patients</p>
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
                                    <p className="text-sm text-gray-500 mt-1">Based on ${stats.totalRevenue.toLocaleString()} total revenue</p>
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
                                    <Tooltip formatter={(value) => value.toLocaleString()} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Appointment Trend Chart */}
                        <div className="bg-white rounded-xl shadow-md p-6 md:col-span-2 transition-all duration-300 hover:shadow-lg">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">Appointment Trends</h2>
                                    <p className="text-sm text-gray-500 mt-1">Based on {stats.totalAppointments} total appointments</p>
                                </div>
                                <TrendingUp className="w-5 h-5 text-purple-600" />
                            </div>
                            {renderActiveChart(appointmentTrendData, '#8B5CF6')}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminAnalytics;