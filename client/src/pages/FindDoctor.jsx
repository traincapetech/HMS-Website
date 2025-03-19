import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FindDoctor = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const navigate = useNavigate();

  // Sample data for doctors
  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      experience: "15 years",
      location: "New York Medical Center",
      rating: 4.8,
      image:
        "https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg",
      availability: "Available Today",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Orthopedic",
      experience: "12 years",
      location: "City Hospital",
      rating: 4.7,
      image:
        "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg",
      availability: "Next Available: Tomorrow",
    },
    {
      id: 3,
      name: "Dr. Emily Brown",
      specialty: "Pediatrician",
      experience: "10 years",
      location: "Children's Hospital",
      rating: 4.9,
      image:
        "https://img.freepik.com/free-photo/female-doctor-hospital-with-stethoscope_23-2148827775.jpg",
      availability: "Available Today",
    },
  ];

  const specialties = [
    "All Specialties",
    "Cardiologist",
    "Orthopedic",
    "Pediatrician",
    "Dermatologist",
    "Neurologist",
    "Psychiatrist",
    "Gynecologist",
  ];

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === "" ||
      selectedSpecialty === "All Specialties" ||
      doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });
  
  // Handle booking appointment - redirects to the appointment page
  const handleBookAppointment = (doctor) => {
    navigate("/Appointments", { state: { selectedDoctor: doctor } });
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Search Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Find a Doctor</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by doctor name or specialty..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent bg-white"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
          >
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-20 h-20 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {doctor.name}
                  </h3>
                  <p className="text-red-800">{doctor.specialty}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Experience:</span>{" "}
                  {doctor.experience}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Location:</span>{" "}
                  {doctor.location}
                </p>
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="font-medium">{doctor.rating}</span>
                </div>
                <p className="text-green-600 font-medium">
                  {doctor.availability}
                </p>
              </div>
              <button 
                className="mt-4 w-full bg-red-800 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300"
                onClick={() => handleBookAppointment(doctor)}
              >
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindDoctor;