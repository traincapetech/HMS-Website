import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUserMd, 
  FaUsers, 
  FaDollarSign, 
  FaSignOutAlt, 
  FaChartLine,
  FaBell,
  FaSearch,
  FaCog
} from 'react-icons/fa';
import axios from 'axios';

// Enhanced StatCard with animated counter
const StatCard = ({ icon, title, value, bgColor, textColor, loading }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  // Animate the counter when value changes
  useEffect(() => {
    if (loading) return;
    
    // Parse the value (handle string values like "$18,500")
    let targetValue = value;
    if (typeof value === 'string') {
      // Extract numbers from strings like "$18,500"
      const matches = value.match(/\d+/g);
      if (matches) {
        targetValue = parseInt(matches.join(''), 10);
      } else {
        targetValue = 0;
      }
    }
    
    // Don't animate if value is already displayed
    if (displayValue === targetValue) return;
    
    // Calculate animation duration and steps
    const duration = 1000; // 1 second animation
    const steps = 20;
    const stepTime = duration / steps;
    const increment = (targetValue - displayValue) / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayValue(targetValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.round(displayValue + (increment * currentStep)));
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [value, loading, displayValue]);
  
  // Format the display value
  const formattedValue = () => {
    if (typeof value === 'string' && value.startsWith('$')) {
      return `$${displayValue.toLocaleString()}`;
    }
    return displayValue.toLocaleString();
  };
  
  return (
    <div className="bg-white rounded-xl shadow p-4 hover:shadow-md transition-shadow h-full">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${bgColor} ${textColor}`}>
          {icon}
        </div>
        <div className="ml-4">
          <h2 className="text-gray-500 text-sm font-medium">{title}</h2>
          {loading ? (
            <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <p className="text-2xl font-semibold text-gray-800">{formattedValue()}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalDoctors: 0,
        totalPatients: 0,
        totalAppointments: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    // Fetch data from API with retry mechanism
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        const fetchDashboardData = async (retryCount = 0) => {
            setLoading(true);
            setError(null);
            
            try {
                // Configure headers with authentication token
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                
                // Make parallel requests to get counts
                const [doctorsResponse, patientsResponse, appointmentsResponse, revenueResponse] = await Promise.all([
                    axios.get('http://localhost:8080/api/doctor/count', config),
                    axios.get('http://localhost:8080/api/newuser/count', config),
                    axios.get('http://localhost:8080/api/appoint/count', config),
                    // Optional: Add revenue API if available or use mock data
                    Promise.resolve({ data: { revenue: 0} })
                ]);
                
                // Update state with fetched data
                setStats({
                    totalDoctors: doctorsResponse.data.count || 0,
                    totalPatients: patientsResponse.data.count || 0,
                    totalAppointments: appointmentsResponse.data.count || 0,
                    totalRevenue: revenueResponse.data.revenue || 0
                });
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                
                // Retry logic (3 attempts maximum)
                if (retryCount < 3) {
                    console.log(`Retrying fetch attempt ${retryCount + 1}/3...`);
                    setTimeout(() => fetchDashboardData(retryCount + 1), 1000);
                    return;
                }
                
                setError("Failed to load dashboard data. Please try again later.");
                
                // Use cached data if available
                const cachedStats = JSON.parse(localStorage.getItem('dashboardStats'));
                if (cachedStats) {
                    setStats(cachedStats);
                } else {
                    // Fallback to default values
                    setStats({
                        totalDoctors: 0,
                        totalPatients: 0,
                        totalAppointments: 0,
                        totalRevenue: 0,
                    });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
        
        // Set up periodic refresh (every 5 minutes)
        const refreshInterval = setInterval(() => fetchDashboardData(), 5 * 60 * 1000);
        
        return () => clearInterval(refreshInterval);
    }, [navigate]);
    
    // Cache stats when they change
    useEffect(() => {
        if (!loading && !error) {
            localStorage.setItem('dashboardStats', JSON.stringify(stats));
        }
    }, [stats, loading, error]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        localStorage.removeItem('dashboardStats');
        navigate('/admin/login');
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

    // Handle quick action button clicks
    const handleQuickAction = (action) => {
        switch(action) {
            case 'add-doctor':
                navigate('/admin/doctors');
                break;
            case 'add-patient':
                navigate('/admin/patients');
                break;
            case 'generate-report':
                navigate('/admin/analytics');
                break;
            case 'billing':
                navigate('/admin/pricing');
                break;
            default:
                break;
        }
    };

    // Mock notifications data
    const notifications = [
        { id: 1, message: 'New appointment scheduled with Dr. Smith', time: '10 mins ago', read: false },
        { id: 2, message: 'Patient John Doe completed his profile', time: '2 hours ago', read: false },
        { id: 3, message: 'System maintenance scheduled for tonight', time: '1 day ago', read: true },
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        // Make sure the component takes the full screen height and width
        <div className="flex flex-col h-screen w-full bg-gray-50">
            {/* Navbar */}
            <header className="bg-white shadow-sm z-10 flex-shrink-0">
                <div className="flex items-center justify-between px-4 py-3">
                    {/* Search bar - optimized for all screens */}
                    <div className="flex items-center flex-1 max-w-md mx-4">
                        <div className="relative w-full">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-20">
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
                                <span className="text-gray-700 hidden sm:inline">Admin</span>
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

            {/* Dashboard Content - Using flex-1 to expand and fill remaining space */}
            <main className="flex-1 overflow-auto">
                <div className="p-4 h-full">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                    </div>

                    {/* Error message if API calls fail */}
                    {error && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Stats Grid - Optimized for all screen sizes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <StatCard 
                            icon={<FaUserMd className="text-2xl" />}
                            title="Total Doctors"
                            value={stats.totalDoctors}
                            bgColor="bg-blue-100"
                            textColor="text-blue-500"
                            loading={loading}
                        />
                        <StatCard 
                            icon={<FaUsers className="text-2xl" />}
                            title="Total Patients"
                            value={stats.totalPatients}
                            bgColor="bg-green-100"
                            textColor="text-green-500"
                            loading={loading}
                        />
                        <StatCard 
                            icon={<FaChartLine className="text-2xl" />}
                            title="Appointments"
                            value={stats.totalAppointments}
                            bgColor="bg-purple-100"
                            textColor="text-purple-500"
                            loading={loading}
                        />
                        <StatCard 
                            icon={<FaDollarSign className="text-2xl" />}
                            title="Total Revenue"
                            value={`$${stats.totalRevenue.toLocaleString()}`}
                            bgColor="bg-yellow-100"
                            textColor="text-yellow-500"
                            loading={loading}
                        />
                    </div>

                    {/* Recent Activity and Quick Actions - Full width on smaller screens */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl shadow-md p-4 h-full">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2>
                            <div className="space-y-4 overflow-y-auto max-h-64">
                                {[
                                    { title: "New patient registered", desc: "John Doe", time: "2 hours ago" },
                                    { title: "Appointment completed", desc: "Dr. Smith with Jane Doe", time: "4 hours ago" },
                                    { title: "New doctor registered", desc: "Dr. Johnson", time: "1 day ago" },
                                    { title: "Prescription updated", desc: "For patient Mary Wilson", time: "1 day ago" },
                                    { title: "Payment received", desc: "$150 from Robert Brown", time: "2 days ago" }
                                ].map((activity, index) => (
                                    <div key={index} className="border-b pb-3 last:border-b-0">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-base font-medium text-gray-700">{activity.title}</p>
                                                <p className="text-sm text-gray-500">{activity.desc}</p>
                                            </div>
                                            <span className="text-xs text-gray-400">{activity.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-md p-4 h-full">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => handleQuickAction('add-doctor')}
                                    className="flex flex-col items-center justify-center p-4 rounded-lg bg-blue-500 text-white hover:opacity-90 transition-opacity"
                                >
                                    <FaUserMd className="text-xl" />
                                    <span className="mt-2 text-sm">Add Doctor</span>
                                </button>
                                <button 
                                    onClick={() => handleQuickAction('add-patient')}
                                    className="flex flex-col items-center justify-center p-4 rounded-lg bg-green-500 text-white hover:opacity-90 transition-opacity"
                                >
                                    <FaUsers className="text-xl" />
                                    <span className="mt-2 text-sm">Add Patient</span>
                                </button>
                                <button 
                                    onClick={() => handleQuickAction('generate-report')}
                                    className="flex flex-col items-center justify-center p-4 rounded-lg bg-purple-500 text-white hover:opacity-90 transition-opacity"
                                >
                                    <FaChartLine className="text-xl" />
                                    <span className="mt-2 text-sm">Generate Report</span>
                                </button>
                                <button 
                                    onClick={() => handleQuickAction('billing')}
                                    className="flex flex-col items-center justify-center p-4 rounded-lg bg-yellow-500 text-white hover:opacity-90 transition-opacity"
                                >
                                    <FaDollarSign className="text-xl" />
                                    <span className="mt-2 text-sm">Billing</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Upcoming Appointments section */}
                    <div className="bg-white rounded-xl shadow-md p-4 mb-4">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Upcoming Appointments</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Patient</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Doctor</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Date & Time</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Status</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { patient: "Sarah Johnson", doctor: "Dr. Michael Smith", datetime: "Apr 11, 2025 - 10:00 AM", status: "Confirmed" },
                                        { patient: "Robert Davis", doctor: "Dr. Emily Clark", datetime: "Apr 11, 2025 - 11:30 AM", status: "Pending" },
                                        { patient: "Maria Garcia", doctor: "Dr. James Wilson", datetime: "Apr 12, 2025 - 09:15 AM", status: "Confirmed" },
                                        { patient: "David Miller", doctor: "Dr. Lisa Anderson", datetime: "Apr 12, 2025 - 02:00 PM", status: "Confirmed" }
                                    ].map((appointment, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="px-4 py-3 text-sm text-gray-800">{appointment.patient}</td>
                                            <td className="px-4 py-3 text-sm text-gray-800">{appointment.doctor}</td>
                                            <td className="px-4 py-3 text-sm text-gray-800">{appointment.datetime}</td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {appointment.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <button className="text-blue-600 hover:text-blue-800">View</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;