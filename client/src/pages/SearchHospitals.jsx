import React, { useEffect, useState } from "react";

const SearchHospitals = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [hospitals, setHospitals] = useState([
        {
            name: "City General Hospital",
            location: "New York, NY",
            specialty: "Emergency Care",
            phone: "123-456-7890",
            email: "info@citygeneralhospital.com"
        },
        {
            name: "Green Valley Hospital",
            location: "Los Angeles, CA",
            specialty: "Cardiology",
            phone: "987-654-3210",
            email: "contact@greenvalleyhospital.com"
        },
        {
            name: "Sunrise Medical Center",
            location: "Chicago, IL",
            specialty: "Pediatrics",
            phone: "555-555-5555",
            email: "info@sunrisemedicalcenter.com"
        },
        {
            name: "Health Plus Hospital",
            location: "Houston, TX",
            specialty: "Orthopedics",
            phone: "444-444-4444",
            email: "support@healthplushospital.com"
        },
        {
            name: "Lakeside Hospital",
            location: "Miami, FL",
            specialty: "Neurology",
            phone: "333-333-3333",
            email: "info@lakesidehospital.com"
        }
    ]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredHospitals = hospitals.filter(hospital => 
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <h1 className="text-4xl font-bold text-center mb-8">Search for Hospitals</h1>

            <div className="mb-6">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="border p-2 rounded w-full"
                    placeholder="Search by hospital name, location, or specialty"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredHospitals.length > 0 ? (
                    filteredHospitals.map((hospital, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{hospital.name}</h2>
                            <p className="text-gray-500 mb-1">Location: {hospital.location}</p>
                            <p className="text-gray-500 mb-1">Specialty: {hospital.specialty}</p>
                            <p className="text-gray-500 mb-1">Phone: {hospital.phone}</p>
                            <p className="text-gray-500 mb-1">Email: <a href={`mailto:${hospital.email}`} className="text-blue-500 hover:underline">{hospital.email}</a></p>
                        </div>
                    ))
                ) : (
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3 bg-white rounded-lg shadow-lg p-6 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Hospitals Found</h2>
                        <p className="text-gray-600 mb-4">Please adjust your search criteria and try again.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchHospitals;