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
  FaCog,
  FaCalendarCheck,
  FaHeartbeat,
  FaClinicMedical,
  FaNotesMedical,
  FaUserInjured,
  FaPrescriptionBottleAlt,
  FaFileMedical,
  FaHospital,
  FaStethoscope,
  FaExclamationTriangle
} from 'react-icons/fa';
import api, { API_BASE_URL } from '../../../utils/app.api';
import { ENV } from '../../../utils/envUtils';

// Medical-themed color palette
const COLORS = {
  primary: '#1a759f', // Teal blue
  secondary: '#76c893', // Mint green
  accent: '#34a0a4', // Teal
  red: '#d00000', // Medical red
  yellow: '#ffb703', // Warning yellow
  lightBlue: '#e0f2fe', // Light blue background
  lightGreen: '#d8f3dc', // Light green background
  white: '#ffffff',
  gray: '#f8f9fa',
  darkGray: '#6c757d',
  textDark: '#2b2d42',
}

// Enhanced StatCard with animated counter and medical styling
const StatCard = ({ icon, title, value, iconBgColor, accentColor, loading }) => {
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
    <div className={`bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow h-full border-l-4`} style={{ borderLeftColor: accentColor }}>
      <div className="flex items-center">
        <div className={`p-4 rounded-full mr-4`} style={{ backgroundColor: iconBgColor, color: COLORS.white }}>
          {icon}
        </div>
        <div>
          <h2 className="text-gray-500 text-sm font-medium">{title}</h2>
          {loading ? (
            <div className="h-7 w-24 bg-gray-200 animate-pulse rounded mt-1"></div>
          ) : (
            <p className="text-2xl font-bold mt-1" style={{ color: accentColor }}>{formattedValue()}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Activity Card Component
const ActivityCard = ({ title, icon, time, description, category }) => {
  const getCategoryColor = () => {
    switch(category) {
      case 'patient': return COLORS.secondary;
      case 'doctor': return COLORS.primary;
      case 'appointment': return COLORS.accent;
      case 'payment': return COLORS.yellow;
      default: return COLORS.darkGray;
    }
  };

  return (
    <div className="flex items-start mb-4 pb-4 border-b last:border-b-0">
      <div className="rounded-full p-2 mr-3 text-white" style={{ backgroundColor: getCategoryColor() }}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <span className="text-xs text-gray-400 whitespace-nowrap">{time}</span>
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
                // Make parallel requests to get counts using the api instance
                // which already has the auth token in its interceptors
                const [doctorsResponse, patientsResponse, appointmentsResponse, revenueResponse] = await Promise.all([
                    api.get('/doctor/count'),
                    api.get('/newuser/count'),
                    api.get('/appoint/count'),
                    // Optional: Add revenue API if available or use mock data
                    Promise.resolve({ data: { revenue: 18500 } })
                ]);
                
                // Update state with fetched data
                setStats({
                    totalDoctors: doctorsResponse.data.count || 0,
                    totalPatients: patientsResponse.data.count || 0,
                    totalAppointments: appointmentsResponse.data.count || 0,
                    totalRevenue: revenueResponse.data.revenue || 18500
                });
                
                // Cache the timestamp of when data was last successfully fetched
                localStorage.setItem('dashboardStatsTimestamp', Date.now());
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                
                // Add more specific error message based on error type
                let errorMessage = "Failed to load dashboard data. ";
                
                if (err.response) {
                    // Server responded with an error status
                    if (err.response.status === 401) {
                        errorMessage = "Authentication expired. Please log in again.";
                        // Optionally redirect to login
                        setTimeout(() => {
                            handleLogout();
                        }, 2000);
                    } else {
                        errorMessage += `Server error: ${err.response.status}`;
                    }
                } else if (err.request) {
                    // Request made but no response received (network error)
                    errorMessage += "No response from server. Check your connection.";
                } else {
                    // Something else happened
                    errorMessage += err.message || "Unknown error occurred.";
                }
                
                setError(errorMessage);
                
                // Retry logic (3 attempts maximum)
                if (retryCount < 2) {
                    console.log(`Retrying fetch attempt ${retryCount + 1}/3...`);
                    setTimeout(() => fetchDashboardData(retryCount + 1), 2000 * (retryCount + 1)); // Exponential backoff
                    return;
                }
                
                // Use cached data if available and not too old (24 hours)
                const cachedStats = JSON.parse(localStorage.getItem('dashboardStats'));
                const cachedTimestamp = parseInt(localStorage.getItem('dashboardStatsTimestamp') || '0');
                const isDataFresh = Date.now() - cachedTimestamp < 24 * 60 * 60 * 1000; // 24 hours
                
                if (cachedStats && isDataFresh) {
                    console.log("Using cached dashboard data");
                    setStats(cachedStats);
                } else {
                    // Use demo data if no cache or cache is too old
                    console.log("Using demo dashboard data");
                    setStats({
                        totalDoctors: 15,
                        totalPatients: 120,
                        totalAppointments: 67,
                        totalRevenue: 18500,
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

    // Medical themed activity data
    const recentActivities = [
        { 
            title: "New patient onboarded", 
            description: "John Doe completed registration",
            time: "2 hours ago", 
            icon: <FaUserInjured size={14} />,
            category: "patient"
        },
        { 
            title: "Teleconsultation completed", 
            description: "Dr. Smith with Sarah Johnson",
            time: "4 hours ago", 
            icon: <FaStethoscope size={14} />,
            category: "appointment" 
        },
        { 
            title: "Specialist joined", 
            description: "Dr. Emily Johnson - Cardiology",
            time: "1 day ago", 
            icon: <FaUserMd size={14} />,
            category: "doctor" 
        },
        { 
            title: "E-prescription issued", 
            description: "For patient Mary Wilson",
            time: "1 day ago", 
            icon: <FaPrescriptionBottleAlt size={14} />,
            category: "patient" 
        },
        { 
            title: "Payment received", 
            description: "$150 for teleconsultation",
            time: "2 days ago", 
            icon: <FaDollarSign size={14} />,
            category: "payment" 
        }
    ];

    return (
        // Main container with a subtle medical themed background
        <div className="flex flex-col h-screen w-full" style={{ backgroundColor: '#f0f5f9' }}>
            {/* Navbar with medical theme */}
            <header className="bg-white shadow-md z-10 flex-shrink-0">
                <div className="flex items-center justify-between px-6 py-4">
                    {/* Logo and Brand */}
                    <div className="flex items-center">
                        <div className="mr-3 flex items-center" style={{ color: COLORS.primary }}>
                            <FaHospital size={24} />
                        </div>
                        <h1 className="text-xl font-bold" style={{ color: COLORS.primary }}>
                            TAMD Health Admin
                        </h1>
                    </div>
                    
                    {/* Search bar */}
                    <div className="flex items-center flex-1 max-w-md mx-4">
                        <div className="relative w-full">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search patients, doctors, appointments..."
                                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2"
                                style={{ borderColor: '#e2e8f0', backgroundColor: '#f8fafc', focusRingColor: COLORS.primary }}
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                        {/* Notification Dropdown */}
                        <div className="relative" ref={notificationRef}>
                            <button 
                                onClick={toggleNotifications}
                                className="relative p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100"
                                aria-label="Notifications"
                            >
                                <FaBell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                            
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-20">
                                    <div className="py-1">
                                        <div className="px-4 py-3 border-b border-gray-200" style={{ backgroundColor: COLORS.lightBlue }}>
                                            <h3 className="text-sm font-medium" style={{ color: COLORS.primary }}>
                                                Notifications ({unreadCount} new)
                                            </h3>
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
                                        <div className="px-4 py-2 border-t border-gray-200 text-center" style={{ backgroundColor: COLORS.lightBlue }}>
                                            <button 
                                                onClick={handleViewAllNotifications}
                                                className="text-xs font-medium hover:underline"
                                                style={{ color: COLORS.primary }}
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
                                aria-label="User menu"
                            >
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: COLORS.primary }}>
                                    A
                                </div>
                                <span className="text-gray-700 hidden sm:inline font-medium">Administrator</span>
                            </button>
                            
                            {showProfileDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl overflow-hidden z-20">
                                    <div className="py-2">
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
                <div className="p-6 h-full">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold" style={{ color: COLORS.primary }}>Telemedicine Dashboard</h1>
                            <p className="text-gray-600 mt-1">Overview of your telemedicine platform's activity and statistics</p>
                        </div>
                        
                        <div className="flex space-x-2">
                            <span className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: COLORS.lightBlue, color: COLORS.primary }}>
                                <FaHeartbeat className="inline mr-1" /> System Status: Healthy
                            </span>
                        </div>
                    </div>

                    {/* Error message if API calls fail */}
                    {error && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center shadow">
                            <FaExclamationTriangle className="mr-2" /> <p>{error}</p>
                        </div>
                    )}

                    {/* Stats Grid - Optimized for all screen sizes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <StatCard 
                            icon={<FaUserMd size={22} />}
                            title="Active Doctors"
                            value={stats.totalDoctors}
                            iconBgColor={COLORS.primary}
                            accentColor={COLORS.primary}
                            loading={loading}
                        />
                        <StatCard 
                            icon={<FaUserInjured size={22} />}
                            title="Registered Patients"
                            value={stats.totalPatients}
                            iconBgColor={COLORS.secondary}
                            accentColor={COLORS.secondary}
                            loading={loading}
                        />
                        <StatCard 
                            icon={<FaCalendarCheck size={22} />}
                            title="Total Consultations"
                            value={stats.totalAppointments}
                            iconBgColor={COLORS.accent}
                            accentColor={COLORS.accent}
                            loading={loading}
                        />
                        <StatCard 
                            icon={<FaDollarSign size={22} />}
                            title="Platform Revenue"
                            value={`$${stats.totalRevenue.toLocaleString()}`}
                            iconBgColor={COLORS.yellow}
                            accentColor={COLORS.yellow}
                            loading={loading}
                        />
                    </div>

                    {/* Recent Activity and Quick Actions - Full width on smaller screens */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Recent Activity */}
                        <div className="lg:col-span-2 bg-white rounded-lg shadow p-5 h-full">
                            <div className="flex items-center mb-4">
                                <FaHeartbeat className="mr-2" style={{ color: COLORS.primary }} />
                                <h2 className="text-xl font-semibold" style={{ color: COLORS.textDark }}>Recent Platform Activity</h2>
                            </div>
                            
                            <div className="space-y-2 overflow-y-auto max-h-80">
                                {recentActivities.map((activity, index) => (
                                    <ActivityCard 
                                        key={index} 
                                        title={activity.title}
                                        description={activity.description}
                                        time={activity.time}
                                        icon={activity.icon}
                                        category={activity.category}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow p-5 h-full">
                            <div className="flex items-center mb-4">
                                <FaClinicMedical className="mr-2" style={{ color: COLORS.primary }} />
                                <h2 className="text-xl font-semibold" style={{ color: COLORS.textDark }}>Medical Actions</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4">
                                <button 
                                    onClick={() => handleQuickAction('add-doctor')}
                                    className="flex items-center p-3 rounded-lg text-white hover:opacity-90 transition-all" 
                                    style={{ backgroundColor: COLORS.primary }}
                                >
                                    <FaUserMd className="text-xl mr-3" />
                                    <span className="text-sm font-medium">Add New Doctor</span>
                                </button>
                                
                                <button 
                                    onClick={() => handleQuickAction('add-patient')}
                                    className="flex items-center p-3 rounded-lg text-white hover:opacity-90 transition-all"
                                    style={{ backgroundColor: COLORS.secondary }}
                                >
                                    <FaUserInjured className="text-xl mr-3" />
                                    <span className="text-sm font-medium">Register Patient</span>
                                </button>
                                
                                <button 
                                    onClick={() => handleQuickAction('generate-report')}
                                    className="flex items-center p-3 rounded-lg text-white hover:opacity-90 transition-all"
                                    style={{ backgroundColor: COLORS.accent }}
                                >
                                    <FaFileMedical className="text-xl mr-3" />
                                    <span className="text-sm font-medium">Medical Reports</span>
                                </button>
                                
                                <button 
                                    onClick={() => handleQuickAction('billing')}
                                    className="flex items-center p-3 rounded-lg text-white hover:opacity-90 transition-all"
                                    style={{ backgroundColor: COLORS.yellow }}
                                >
                                    <FaDollarSign className="text-xl mr-3" />
                                    <span className="text-sm font-medium">Billing Management</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Upcoming Consultations */}
                    <div className="bg-white rounded-lg shadow-md p-5 mb-6">
                        <div className="flex items-center mb-4">
                            <FaStethoscope className="mr-2" style={{ color: COLORS.primary }} />
                            <h2 className="text-xl font-semibold" style={{ color: COLORS.textDark }}>Upcoming Teleconsultations</h2>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr style={{ backgroundColor: COLORS.lightBlue }}>
                                        <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: COLORS.primary }}>Patient</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: COLORS.primary }}>Doctor</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: COLORS.primary }}>Date & Time</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: COLORS.primary }}>Status</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: COLORS.primary }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { patient: "Sarah Johnson", doctor: "Dr. Michael Smith", datetime: "Apr 11, 2025 - 10:00 AM", status: "Confirmed" },
                                        { patient: "Robert Davis", doctor: "Dr. Emily Clark", datetime: "Apr 11, 2025 - 11:30 AM", status: "Pending" },
                                        { patient: "Maria Garcia", doctor: "Dr. James Wilson", datetime: "Apr 12, 2025 - 09:15 AM", status: "Confirmed" },
                                        { patient: "David Miller", doctor: "Dr. Lisa Anderson", datetime: "Apr 12, 2025 - 02:00 PM", status: "Confirmed" }
                                    ].map((appointment, index) => (
                                        <tr key={index} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-4 text-sm text-gray-800">{appointment.patient}</td>
                                            <td className="px-4 py-4 text-sm text-gray-800">{appointment.doctor}</td>
                                            <td className="px-4 py-4 text-sm text-gray-800">{appointment.datetime}</td>
                                            <td className="px-4 py-4 text-sm">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    appointment.status === 'Confirmed' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {appointment.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-sm">
                                                <button className="px-3 py-1 rounded-md text-white font-medium" style={{ backgroundColor: COLORS.primary }}>
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    {/* Health Metrics Summary - A new medical-focused section */}
                    <div className="bg-white rounded-lg shadow-md p-5">
                        <div className="flex items-center mb-4">
                            <FaNotesMedical className="mr-2" style={{ color: COLORS.primary }} />
                            <h2 className="text-xl font-semibold" style={{ color: COLORS.textDark }}>Telemedicine Platform Metrics</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.lightBlue }}>
                                <h3 className="font-medium mb-2" style={{ color: COLORS.primary }}>Patient Satisfaction</h3>
                                <div className="flex items-end justify-between">
                                    <span className="text-3xl font-bold" style={{ color: COLORS.primary }}>94%</span>
                                    <div className="flex items-center">
                                        <span className="text-green-500 text-sm mr-1">↑ 2%</span>
                                        <span className="text-xs text-gray-500">from last month</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.lightGreen }}>
                                <h3 className="font-medium mb-2" style={{ color: COLORS.secondary }}>Average Response Time</h3>
                                <div className="flex items-end justify-between">
                                    <span className="text-3xl font-bold" style={{ color: COLORS.secondary }}>4.2 min</span>
                                    <div className="flex items-center">
                                        <span className="text-green-500 text-sm mr-1">↓ 0.5</span>
                                        <span className="text-xs text-gray-500">from last week</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.lightBlue }}>
                                <h3 className="font-medium mb-2" style={{ color: COLORS.accent }}>Consultation Completion</h3>
                                <div className="flex items-end justify-between">
                                    <span className="text-3xl font-bold" style={{ color: COLORS.accent }}>98%</span>
                                    <div className="flex items-center">
                                        <span className="text-green-500 text-sm mr-1">↑ 1%</span>
                                        <span className="text-xs text-gray-500">from last month</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;