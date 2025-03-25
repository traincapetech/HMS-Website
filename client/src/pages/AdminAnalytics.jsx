import React, { useState } from 'react';

// Mock chart components using simple SVG representations
const LineChart = ({ data, color, height = 200, width = 400 }) => {
    const maxValue = Math.max(...data);
    const scaleFactor = height / maxValue;

    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - (value * scaleFactor);
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
            <polyline 
                fill="none" 
                stroke={color} 
                strokeWidth="3" 
                points={points}
            />
        </svg>
    );
};

const AnalyticsCard = ({ title, value, change, icon, bgColor }) => (
    <div className={`${bgColor} rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2`}>
        <div className="flex justify-between items-center">
            <div>
                <h3 className="text-sm uppercase tracking-wide text-gray-500">{title}</h3>
                <div className="flex items-center mt-2">
                    <p className="text-2xl font-bold">{value}</p>
                    <span className={`ml-2 text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {change > 0 ? '▲' : '▼'} {Math.abs(change)}%
                    </span>
                </div>
            </div>
            <div className={`${bgColor} p-3 rounded-full`}>
                {icon}
            </div>
        </div>
    </div>
);

const AdminAnalytics = () => {
    const [activeFilter, setActiveFilter] = useState('monthly');

    // Mock icons using SVG
    const Icons = {
        Patients: () => (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 text-blue-500">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-8 4a4 4 0 00-4 4v1a2 2 0 002 2h12a2 2 0 002-2v-1a4 4 0 00-4-4h-4z"/>
            </svg>
        ),
        Revenue: () => (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 text-green-500">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
        ),
        Appointments: () => (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 text-purple-500">
                <path d="M8 7V3m8 4V3m-9 8h10M5 11h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z"/>
            </svg>
        )
    };

    const timeFilters = [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Quarterly', value: 'quarterly' },
        { label: 'Yearly', value: 'yearly' }
    ];

    // Mock data for analytics
    const analyticsData = {
        patients: {
            monthly: { value: 1245, change: 12.5 },
            quarterly: { value: 3789, change: 18.2 },
            yearly: { value: 14567, change: 22.7 }
        },
        revenue: {
            monthly: { value: '$85,670', change: 9.3 },
            quarterly: { value: '$256,890', change: 15.6 },
            yearly: { value: '$1,024,560', change: 25.4 }
        },
        appointments: {
            monthly: { value: 456, change: 7.8 },
            quarterly: { value: 1389, change: 14.2 },
            yearly: { value: 5678, change: 19.5 }
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="container mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
                    <p className="text-gray-600 mt-2">Comprehensive insights into your medical practice</p>
                </div>

                {/* Time Filter */}
                <div className="flex justify-end mb-6">
                    <div className="bg-white rounded-lg shadow-md inline-flex">
                        {timeFilters.map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => setActiveFilter(filter.value)}
                                className={`px-4 py-2 text-sm transition-colors ${
                                    activeFilter === filter.value 
                                    ? 'bg-blue-600 text-white' 
                                    : 'hover:bg-gray-100 text-gray-700'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Analytics Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <AnalyticsCard 
                        title="Total Patients"
                        value={analyticsData.patients[activeFilter].value}
                        change={analyticsData.patients[activeFilter].change}
                        icon={<Icons.Patients />}
                        bgColor="bg-blue-50"
                    />
                    <AnalyticsCard 
                        title="Total Revenue"
                        value={analyticsData.revenue[activeFilter].value}
                        change={analyticsData.revenue[activeFilter].change}
                        icon={<Icons.Revenue />}
                        bgColor="bg-green-50"
                    />
                    <AnalyticsCard 
                        title="Total Appointments"
                        value={analyticsData.appointments[activeFilter].value}
                        change={analyticsData.appointments[activeFilter].change}
                        icon={<Icons.Appointments />}
                        bgColor="bg-purple-50"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Patient Growth Chart */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Patient Growth</h2>
                            <span className="text-sm text-gray-500">{activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}</span>
                        </div>
                        <LineChart 
                            data={[100, 250, 180, 300, 220, 280, 350]} 
                            color="#3B82F6" 
                        />
                    </div>

                    {/* Revenue Trend Chart */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Revenue Trend</h2>
                            <span className="text-sm text-gray-500">{activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}</span>
                        </div>
                        <LineChart 
                            data={[5000, 7500, 6200, 8900, 7800, 9500, 10200]} 
                            color="#10B981" 
                        />
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-md p-6 mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        {[
                            { title: "New Patient Registered", description: "John Doe", time: "2 hours ago" },
                            { title: "Appointment Completed", description: "Dr. Smith with Emily Johnson", time: "4 hours ago" },
                            { title: "Payment Received", description: "Invoice #1234", time: "1 day ago" }
                        ].map((activity, index) => (
                            <div key={index} className="border-b pb-4 last:border-b-0">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-gray-700">{activity.title}</p>
                                        <p className="text-sm text-gray-500">{activity.description}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">{activity.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;