import React, { useEffect, useState } from "react";
import axios from "axios";

const ShowDoctors = () => {
    const [doctors, setDoctors] = useState([]); // Initial state is an empty array
    const [sortOption, setSortOption] = useState("Name");
    const [filter, setFilter] = useState({
        gender: "",
        experience: "",
        fees: "",
        specialty: ""
    });

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get("/api/doctors"); // Adjust the API endpoint as necessary
                setDoctors(response.data);
            } catch (error) {
                console.error("Error fetching doctors:", error);
                // If there's an error fetching from the backend, use static data
                setDoctors(staticDoctors);
            }
        };

        fetchDoctors();
    }, []);

    const staticDoctors = [
        {
            Name: "Dr. John Smith",
            Email: "john.smith@example.com",
            Phone: "123-456-7890",
            Speciality: ["Cardiology"],
            Experience: 10,
            Fee: 150,
            Gender: "Male",
            ConsultationType: "In-Person"
        },
        {
            Name: "Dr. Jane Doe",
            Email: "jane.doe@example.com",
            Phone: "098-765-4321",
            Speciality: ["Pediatrics"],
            Experience: 8,
            Fee: 120,
            Gender: "Female",
            ConsultationType: "Online"
        },
        {
            Name: "Dr. Emily Johnson",
            Email: "emily.johnson@example.com",
            Phone: "555-555-5555",
            Speciality: ["Dermatology"],
            Experience: 5,
            Fee: 100,
            Gender: "Female",
            ConsultationType: "In-Person"
        },
        {
            Name: "Dr. Michael Brown",
            Email: "michael.brown@example.com",
            Phone: "444-444-4444",
            Speciality: ["Orthopedics"],
            Experience: 12,
            Fee: 200,
            Gender: "Male",
            ConsultationType: "Online"
        },
        {
            Name: "Dr. Sarah Wilson",
            Email: "sarah.wilson@example.com",
            Phone: "333-333-3333",
            Speciality: ["Neurology"],
            Experience: 7,
            Fee: 180,
            Gender: "Female",
            ConsultationType: "In-Person"
        }
    ];

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter((prev) => ({ ...prev, [name]: value }));
    };

    // Debugging: Check the type of doctors
    console.log("Doctors:", doctors);
    console.log("Is doctors an array?", Array.isArray(doctors));

    const filteredDoctors = Array.isArray(doctors) ? doctors
        .filter((doctor) => {
            return (
                (filter.gender ? doctor.Gender === filter.gender : true) &&
                (filter.experience ? doctor.Experience >= parseInt(filter.experience) : true) &&
                (filter.fees ? doctor.Fee <= parseInt(filter.fees) : true) &&
                (filter.specialty ? doctor.Speciality.includes(filter.specialty) : true)
            );
        })
        .sort((a, b) => {
            if (sortOption === "Experience") {
                return a.Experience - b.Experience; // Sort by Experience
            } else if (sortOption === "Fee") {
                return a.Fee - b.Fee; // Sort by Fee
            } else if (sortOption === "Name") {
                return a.Name.localeCompare(b.Name); // Sort by Name
            } else {
                return 0; // Default case
            }
        }) : []; // Fallback to an empty array if doctors is not an array

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <h1 className="text-4xl font-bold text-center mb-8">Doctors List</h1>

            <div className="mb-6">
                <label className="mr-2">Sort by:</label>
                <select value={sortOption} onChange={handleSortChange} className="border p-2 rounded">
                    <option value="Name">Name</option>
                    <option value="Experience">Experience</option>
                    <option value="Fee">Fee</option>
                </select>
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Filters</h2>
                <div className="flex flex-wrap">
                    <div className="mr-4">
                        <label className="mr-2">Gender:</label>
                        <select name="gender" onChange={handleFilterChange} className="border p-2 rounded">
                            <option value="">All</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="mr-4">
                        <label className="mr-2">Experience (Years):</label>
                        <input
                            type="number"
                            name="experience"
                            onChange={handleFilterChange}
                            className="border p-2 rounded"
                            placeholder="Min Experience"
                        />
                    </div>
                    <div className="mr-4">
                        <label className="mr-2">Max Fee:</label>
                        <input
                            type="number"
                            name="fees"
                            onChange={handleFilterChange}
                            className="border p-2 rounded"
                            placeholder="Max Fee"
                        />
                    </div>
                    <div>
                        <label className="mr-2">Specialty:</label>
                        <input
                            type="text"
                            name="specialty"
                            onChange={handleFilterChange}
                            className="border p-2 rounded"
                            placeholder="Specialty"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doctor) => (
                        <div key={doctor.Email} className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{doctor.Name}</h2>
                            <p className="text-gray-500 mb-1">Email: {doctor.Email}</p>
                            <p className="text-gray-500 mb-1">Phone: {doctor.Phone}</p>
                            <p className="text-gray-500 mb-1">Specialty: {doctor.Speciality.join(", ")}</p>
                            <p className="text-gray-500 mb-1">Experience: {doctor.Experience} years</p>
                            <p className="text-gray-500 mb-1">Fee: ${doctor.Fee}</p>
                            <p className="text-gray-500 mb-1">Gender: {doctor.Gender}</p>
                            <p className="text-gray-500 mb-1">Consultation Type: {doctor.ConsultationType}</p>
                        </div>
                    ))
                ) : (
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3 bg-white rounded-lg shadow-lg p-6 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Doctors Found</h2>
                        <p className="text-gray-600 mb-4">Please adjust your filters and try again.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShowDoctors;