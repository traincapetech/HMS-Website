import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHospital } from "react-icons/fa";

const CovidHospitalListing = () => {
    const [selectedCity, setSelectedCity] = useState("");
    const navigate = useNavigate();

    // Sample city data
    const cities = [
        "NewYork", "Los Angeles", "Chicago", "Houston", "Phoenix",
        "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"
    ];

    // Handle city selection
    const handleCitySelect = (city) => {
        setSelectedCity(city);
        navigate(`/hospitals/${city}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-blue-600 text-white py-16 text-center">
                <h1 className="text-4xl font-bold mb-4">COVID Hospital Bed Finder</h1>
                <p className="text-lg mb-6">Find available hospital beds in your city.</p>

                {/* City Selection Dropdown */}
                <div className="relative inline-block">
                    <select
                        value={selectedCity}
                        onChange={(e) => handleCitySelect(e.target.value)}
                        className="w-64 p-3 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-md focus:outline-none"
                    >
                        <option value="">Select a City</option>
                        {cities.map((city, index) => (
                            <option key={index} value={city}>{city}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Cities List Section */}
            <div className="py-12 px-4 max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-8">Available Hospitals in Major Cities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cities.map((city, index) => (
                        <div 
                            key={index} 
                            className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-4 cursor-pointer hover:bg-blue-100 transition-transform transform hover:scale-105"
                            onClick={() => handleCitySelect(city)}
                        >
                            <FaHospital className="text-blue-600 text-3xl" />
                            <h3 className="text-xl font-semibold text-gray-800">{city}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CovidHospitalListing;
