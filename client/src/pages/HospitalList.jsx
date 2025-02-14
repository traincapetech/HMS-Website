import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaHospital, FaPhoneAlt } from "react-icons/fa";

const HospitalList = () => {
    const { city } = useParams();
    const [hospitals, setHospitals] = useState([]);

    // Fetch hospital data (Replace with real API call)
    useEffect(() => {
        // Simulated data
        const hospitalData = [
            { name: "City General Hospital", location: `${city}, USA`, beds: { general: 30, oxygen: 15, icu: 10, ventilators: 5 }, phone: "123-456-7890" },
            { name: "Sunrise Medical Center", location: `${city}, USA`, beds: { general: 40, oxygen: 20, icu: 15, ventilators: 8 }, phone: "987-654-3210" },
            { name: "Hope Healthcare", location: `${city}, USA`, beds: { general: 25, oxygen: 10, icu: 8, ventilators: 3 }, phone: "555-123-4567" },
        ];

        setHospitals(hospitalData);
    }, [city]);

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Hospitals in {city}</h2>

            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {hospitals.map((hospital, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-lg flex flex-col">
                        <div className="flex items-center gap-4">
                            <FaHospital className="text-blue-600 text-3xl" />
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">{hospital.name}</h3>
                                <p className="text-gray-600">{hospital.location}</p>
                            </div>
                        </div>
                        <div className="mt-4 text-gray-700">
                            <p><strong>General Beds:</strong> {hospital.beds.general}</p>
                            <p><strong>Oxygen Beds:</strong> {hospital.beds.oxygen}</p>
                            <p><strong>ICU Beds:</strong> {hospital.beds.icu}</p>
                            <p><strong>ICU with Ventilators:</strong> {hospital.beds.ventilators}</p>
                        </div>
                        <a href={`tel:${hospital.phone}`} className="mt-4 flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300">
                            <FaPhoneAlt className="mr-2" /> Call Hospital
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HospitalList;
