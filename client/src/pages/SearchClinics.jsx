import React, { useState } from "react";

const SearchClinics = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [clinics, setClinics] = useState([
        {
            name: "Health First Clinic",
            location: "New York, NY",
            specialty: "General Practice",
            phone: "123-456-7890",
            email: "info@healthfirstclinic.com"
        },
        {
            name: "Wellness Center",
            location: "Los Angeles, CA",
            specialty: "Pediatrics",
            phone: "987-654-3210",
            email: "contact@wellnesscenter.com"
        },
        {
            name: "City Health Clinic",
            location: "Chicago, IL",
            specialty: "Dermatology",
            phone: "555-555-5555",
            email: "info@cityhealthclinic.com"
        },
        {
            name: "Family Care Clinic",
            location: "Houston, TX",
            specialty: "Family Medicine",
            phone: "444-444-4444",
            email: "support@familycareclinic.com"
        },
        {
            name: "Sunshine Health",
            location: "Miami, FL",
            specialty: "Cardiology",
            phone: "333-333-3333",
            email: "info@sunshinehealth.com"
        }
    ]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredClinics = clinics.filter(clinic => 
        clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <h1 className="text-4xl font-bold text-center mb-8">Search for Clinics</h1>

            <div className="mb-6">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="border p-2 rounded w-full"
                    placeholder="Search by clinic name, location, or specialty"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredClinics.length > 0 ? (
                    filteredClinics.map((clinic, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{clinic.name}</h2>
                            <p className="text-gray-500 mb-1">Location: {clinic.location}</p>
                            <p className="text-gray-500 mb-1">Specialty: {clinic.specialty}</p>
                            <p className="text-gray-500 mb-1">Phone: {clinic.phone}</p>
                            <p className="text-gray-500 mb-1">Email: <a href={`mailto:${clinic.email}`} className="text-blue-500 hover:underline">{clinic.email}</a></p>
                        </div>
                    ))
                ) : (
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3 bg-white rounded-lg shadow-lg p-6 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Clinics Found</h2>
                        <p className="text-gray-600 mb-4">Please adjust your search criteria and try again.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchClinics;