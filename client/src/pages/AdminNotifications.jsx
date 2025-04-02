import React, { useState, useEffect } from 'react';
import { FaBell, FaCheck, FaTrash, FaFilter, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminNotifications = () => {
    // Sample notification data with more recent timestamps
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: 'New Appointment Booking',
            message: 'John Doe has booked an appointment for tomorrow at 10:00 AM',
            timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            isRead: false,
            type: 'appointment'
        },
        {
            id: 2,
            title: 'System Update Available',
            message: 'A new system update (v2.1.0) is available for installation',
            timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
            isRead: true,
            type: 'system'
        },
        {
            id: 3,
            title: 'Payment Received',
            message: 'Payment of $150 received from Jane Smith for service #4582',
            timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
            isRead: false,
            type: 'payment'
        },
        {
            id: 4,
            title: 'New Patient Registration',
            message: 'New patient Michael Brown has registered in the system',
            timestamp: new Date(Date.now() - 86400000 * 6).toISOString(), // 6 days ago
            isRead: true,
            type: 'registration'
        },
        {
            id: 5,
            title: 'Urgent: Server Maintenance',
            message: 'Scheduled server maintenance tonight from 1:00 AM to 3:00 AM',
            timestamp: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago (will show exact date)
            isRead: false,
            type: 'alert'
        }
    ]);

    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);

    // Calculate unread count whenever notifications change
    useEffect(() => {
        const count = notifications.filter(n => !n.isRead).length;
        setUnreadCount(count);
    }, [notifications]);

    // Filter notifications based on selected filter and search query
    const filteredNotifications = notifications.filter(notification => {
        const matchesFilter = filter === 'all' || 
                             (filter === 'unread' && !notification.isRead) || 
                             notification.type === filter;
        
        const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             notification.message.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesFilter && matchesSearch;
    });

    // Mark notification as read
    const markAsRead = (id) => {
        setNotifications(notifications.map(notification => 
            notification.id === id ? { ...notification, isRead: true } : notification
        ));
        toast.success('Marked as read');
    };

    // Mark all notifications as read
    const markAllAsRead = () => {
        setNotifications(notifications.map(notification => 
            ({ ...notification, isRead: true })
        ));
        toast.success('All notifications marked as read');
    };

    // Delete a notification
    const deleteNotification = (id) => {
        if (window.confirm('Are you sure you want to delete this notification?')) {
            setNotifications(notifications.filter(notification => notification.id !== id));
            toast.success('Notification deleted');
        }
    };

    // Clear all notifications
    const clearAllNotifications = () => {
        if (window.confirm('Are you sure you want to clear all notifications?')) {
            setNotifications([]);
            toast.success('All notifications cleared');
        }
    };

    // Updated formatTime function to show exact date for older notifications
    const formatTime = (timestamp) => {
        const now = new Date();
        const notificationDate = new Date(timestamp);
        const diffInSeconds = Math.floor((now - notificationDate) / 1000);
        const diffInDays = Math.floor(diffInSeconds / 86400);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInDays <= 6) return `${diffInDays} days ago`;
        
        // For notifications older than 6 days, show the exact date
        return notificationDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Get badge color based on notification type
    const getBadgeColor = (type) => {
        switch(type) {
            case 'appointment': return 'bg-blue-100 text-blue-800';
            case 'system': return 'bg-purple-100 text-purple-800';
            case 'payment': return 'bg-green-100 text-green-800';
            case 'registration': return 'bg-amber-100 text-amber-800';
            case 'alert': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div className="flex items-center mb-4 md:mb-0">
                        <FaBell className="text-2xl text-blue-600 mr-3" />
                        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
                        {unreadCount > 0 && (
                            <span className="ml-3 px-2.5 py-0.5 rounded-full bg-red-500 text-white text-sm font-medium">
                                {unreadCount} unread
                            </span>
                        )}
                    </div>
                    
                    <div className="flex space-x-3">
                        <button 
                            onClick={markAllAsRead}
                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                            Mark all as read
                        </button>
                        <button 
                            onClick={clearAllNotifications}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                        >
                            Clear all
                        </button>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search notifications..."
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        {/* Filter dropdown */}
                        <div className="relative">
                            <select
                                className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="all">All Notifications</option>
                                <option value="unread">Unread Only</option>
                                <option value="appointment">Appointments</option>
                                <option value="payment">Payments</option>
                                <option value="registration">Registrations</option>
                                <option value="system">System</option>
                                <option value="alert">Alerts</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <FaFilter className="text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {filteredNotifications.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <FaBell className="text-3xl text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-700 mb-1">No notifications found</h3>
                            <p className="text-gray-500">When you get notifications, they'll appear here</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {filteredNotifications.map(notification => (
                                <li 
                                    key={notification.id} 
                                    className={`px-4 py-4 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50' : ''}`}
                                >
                                    <div className="flex items-start">
                                        {/* Notification badge */}
                                        <div className={`flex-shrink-0 mt-1 mr-3 w-3 h-3 rounded-full ${!notification.isRead ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${getBadgeColor(notification.type)}`}>
                                                        {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                                                    </span>
                                                    <p className={`mt-1 text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                                                        {notification.title}
                                                    </p>
                                                </div>
                                                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                                    {formatTime(notification.timestamp)}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-600">
                                                {notification.message}
                                            </p>
                                        </div>
                                        
                                        {/* Action buttons */}
                                        <div className="ml-4 flex items-center space-x-2">
                                            {!notification.isRead && (
                                                <button
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                    title="Mark as read"
                                                >
                                                    <FaCheck className="text-sm" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteNotification(notification.id)}
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                title="Delete"
                                            >
                                                <FaTrash className="text-sm" />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminNotifications;