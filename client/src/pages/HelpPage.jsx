import React from 'react';
import { useState } from 'react';

const HelpPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const helpCategories = [
        {
            title: 'Appointments',
            topics: [
                { title: 'Scheduling an Appointment', link: '#' },
                { title: 'Rescheduling/Cancelling Appointments', link: '#' },
                { title: 'Preparing for Your Appointment', link: '#' },
                { title: 'Finding a Specialist', link: '#' },
            ],
        },
        {
            title: 'Billing and Insurance',
            topics: [
                { title: 'Understanding Your Bill', link: '#' },
                { title: 'Insurance Accepted', link: '#' },
                { title: 'Payment Options', link: '#' },
                { title: 'Financial Assistance', link: '#' },
            ],
        },
        {
            title: 'Patient Portal',
            topics: [
                { title: 'Accessing the Patient Portal', link: '#' },
                { title: 'Resetting Your Password', link: '#' },
                { title: 'Viewing Medical Records', link: '#' },
                { title: 'Messaging Your Doctor', link: '#' },
            ],
        },
        {
            title: 'Visiting the Hospital',
            topics: [
                { title: 'Location and Directions', link: '#' },
                { title: 'Parking Information', link: '#' },
                { title: 'Visiting Hours', link: '#' },
                { title: 'Amenities', link: '#' },
            ],
        },
        {
            title: 'Medical Services',
            topics: [
                { title: 'Departments and Specialties', link: '#' },
                { title: 'Diagnostic Services', link: '#' },
                { title: 'Treatment Options', link: '#' },
                { title: 'Emergency Care', link: '#' },
            ],
        },
        {
            title: 'Contact and Support',
            topics: [
                { title: 'Contact Information', link: '#' },
                { title: 'Frequently Asked Questions', link: '#' },
                { title: 'Feedback and Complaints', link: '#' },
                { title: 'Technical Support', link: '#' },
            ],
        },
    ];

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // In a real application, you might filter the helpCategories
    // based on the searchTerm here.  For simplicity, we'll
    // display all categories for now.

    return (
        <div className="bg-gray-50 font-sans">
            <div className="container mx-auto py-12 px-4">
                {/* Help Page Header */}
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-700">Welcome to TAMD Hospital Help Center</h1>
                    <p className="text-gray-600 mt-2">How can we assist you today?</p>
                </header>

                {/* Search Bar */}
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Search for help topics..."
                        className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>

                {/* Help Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {helpCategories.map((category, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                        >
                            <h2 className="text-xl font-semibold text-blue-600 mb-4">{category.title}</h2>
                            <ul className="list-disc list-inside text-gray-700">
                                {category.topics.map((topic, index) => (
                                    <li key={index}>
                                        <a
                                            href={topic.link}
                                            className="hover:text-blue-500"
                                        >
                                            {topic.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Additional Support Section */}
                <div className="mt-12 text-center">
                    <p className="text-lg text-gray-700">
                        Still need help? Contact our support team at{' '}
                        <a
                            href="mailto:support@tamdhospital.com"
                            className="text-blue-500 hover:underline"
                        >
                            support@tamdhospital.com
                        </a>{' '}
                        or call us at{' '}
                        <a href="tel:+1234567890" className="text-blue-500 hover:underline">
                            +1 (234) 567-890
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HelpPage;