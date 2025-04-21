import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaStar, FaCalendarAlt, FaUserMd, FaFilter, FaHospital, FaCity, FaMoneyBillWave, FaRegClock, FaLock } from "react-icons/fa";
import api from "../utils/app.api";
import { API_BASE_URL, getDoctorImageUrl } from "../utils/app.api";
import axios from "axios";

const FindDoctor = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [consultType, setConsultType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in - run this more frequently to keep it updated
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      setIsLoggedIn(!!token && !!user);
    };
    
    // Check initially
    checkLoginStatus();
    
    // Also set up an interval to check periodically
    const intervalId = setInterval(checkLoginStatus, 5000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Specialty options from the doctor registration page
  const specialties = [
    "All Specialties",
    "Allergy and Immunology",
    "Anesthesiology",
    "Cardiology",
    "Dermatology",
    "Emergency Medicine",
    "Endocrinology",
    "Family Medicine",
    "Gastroenterology",
    "General Practice",
    "Geriatrics",
    "Hematology",
    "Infectious Disease",
    "Internal Medicine",
    "Nephrology",
    "Neurology",
    "Obstetrics and Gynecology",
    "Oncology",
    "Ophthalmology",
    "Orthopedics",
    "Otolaryngology",
    "Pathology",
    "Pediatrics",
    "Physical Medicine",
    "Plastic Surgery",
    "Psychiatry",
    "Pulmonology",
    "Radiology",
    "Rheumatology",
    "Sports Medicine",
    "Surgery",
    "Urology",
    "Vascular Medicine",
    "Veterinary",
  ];

  const experienceOptions = [
    { label: "All Experience Levels", value: "" },
    { label: "Less than 5 years", value: "0-5" },
    { label: "5-10 years", value: "5-10" },
    { label: "10-15 years", value: "10-15" },
    { label: "15+ years", value: "15+" },
  ];

  const consultTypeOptions = [
    { label: "All Types", value: "" },
    { label: "Video Consultation", value: "Video" },
    { label: "In-Clinic", value: "InClinic" },
    { label: "Both", value: "Both" },
  ];

  // Fetch doctors data from API
  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("https://hms-backend-1-pngp.onrender.com/api/doctor/all");
        if (response.data && response.data.doctor) {
          setDoctors(response.data.doctor);
          setError(null);
        } else {
          setError("Failed to fetch doctor data");
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setError("An error occurred while fetching doctors. Please try again later.");
        
        // For development - fall back to sample data if API fails
        setDoctors([
          {
            _id: "1",
            Name: "Dr. Sarah Johnson",
            Speciality: "Cardiology",
            Experience: "15",
            City: "New York",
            State: "NY",
            ConsultType: "Both",
            Fees: 150,
            Education: "MD, Harvard Medical School",
            // Sample rating for UI demonstration
            rating: 4.8,
          },
          {
            _id: "2",
            Name: "Dr. Michael Chen",
            Speciality: "Orthopedics",
            Experience: "12",
            City: "Chicago",
            State: "IL",
            ConsultType: "InClinic",
            Fees: 175,
            Education: "MD, Johns Hopkins University",
            rating: 4.7,
          },
          {
            _id: "3",
            Name: "Dr. Emily Brown",
            Speciality: "Pediatrics",
            Experience: "10",
            City: "Los Angeles",
            State: "CA",
            ConsultType: "Video",
            Fees: 120,
            Education: "MD, Stanford University",
            rating: 4.9,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Filter doctors based on search criteria
  useEffect(() => {
    if (!doctors.length) return;

    const filtered = doctors.filter((doctor) => {
      // Match name or specialty
      const matchesSearch =
        searchQuery === "" ||
        doctor.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.Speciality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doctor.Education && doctor.Education.toLowerCase().includes(searchQuery.toLowerCase()));

      // Match specialty filter
      const matchesSpecialty =
        selectedSpecialty === "" ||
        selectedSpecialty === "All Specialties" ||
        doctor.Speciality === selectedSpecialty;

      // Match city filter
      const matchesCity =
        selectedCity === "" ||
        (doctor.City && doctor.City.toLowerCase().includes(selectedCity.toLowerCase()));

      // Match experience filter
      let matchesExperience = true;
      if (selectedExperience) {
        const experience = parseInt(doctor.Experience, 10);
        if (selectedExperience === "0-5") {
          matchesExperience = experience < 5;
        } else if (selectedExperience === "5-10") {
          matchesExperience = experience >= 5 && experience < 10;
        } else if (selectedExperience === "10-15") {
          matchesExperience = experience >= 10 && experience < 15;
        } else if (selectedExperience === "15+") {
          matchesExperience = experience >= 15;
        }
      }

      // Match consultation type
      const matchesConsultType =
        consultType === "" ||
        doctor.ConsultType === consultType ||
        doctor.ConsultType === "Both";

      return matchesSearch && matchesSpecialty && matchesCity && matchesExperience && matchesConsultType;
    });

    setFilteredDoctors(filtered);
  }, [searchQuery, selectedSpecialty, selectedCity, selectedExperience, consultType, doctors]);

  // List of unique cities for the filter
  const cityOptions = [
    { label: "All Cities", value: "" },
    ...Array.from(new Set(doctors.map((doctor) => doctor.City)))
      .filter(Boolean)
      .sort()
      .map((city) => ({ label: city, value: city })),
  ];
  
  // Handle booking appointment - redirects to the appointment page
  const handleBookAppointment = (doctor) => {
    if (!isLoggedIn) {
      // Redirect to login page with return URL
      navigate("/login", { 
        state: { 
          returnUrl: "/Appointments",
          selectedDoctor: doctor 
        } 
      });
      return;
    }
    
    // If user is logged in, proceed directly to appointment page
    navigate("/Appointments", { 
      state: { 
        selectedDoctor: doctor,
        skipDoctorSelection: true // Flag to skip doctor selection step
      } 
    });
  };

  // View doctor profile
  const handleViewProfile = (doctorId) => {
    navigate(`/doctor/${doctorId}`);
  };
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Toggle filter visibility on mobile
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Hero Section with Search */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-red-800 to-red-600 rounded-2xl shadow-lg p-6 md:p-10 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Find the Right Doctor</h1>
          <p className="text-white text-lg mb-6">Search from our network of qualified healthcare professionals</p>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by doctor name, specialty, or qualification..."
              className="w-full pl-10 pr-4 py-4 border-none rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-md text-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Mobile Filter Button */}
        <button
          className="md:hidden w-full flex items-center justify-center gap-2 bg-white p-3 rounded-lg shadow-md mb-4"
          onClick={toggleFilters}
        >
          <FaFilter />
          {filtersVisible ? "Hide Filters" : "Show Filters"}
        </button>

        {/* Filters Section */}
        <div className={`bg-white rounded-xl shadow-md p-6 mb-8 ${filtersVisible ? 'block' : 'hidden md:block'}`}>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Specialty Filter */}
            <div>
              <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                Specialty
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserMd className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  id="specialty"
                  className="block w-full pl-10 pr-10 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
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

            {/* City Filter */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCity className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  id="city"
                  className="block w-full pl-10 pr-10 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  {cityOptions.map((option) => (
                    <option key={option.value || 'all'} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Experience Filter */}
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                Experience
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaRegClock className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  id="experience"
                  className="block w-full pl-10 pr-10 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                >
                  {experienceOptions.map((option) => (
                    <option key={option.value || 'all'} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Consultation Type Filter */}
            <div>
              <label htmlFor="consultType" className="block text-sm font-medium text-gray-700 mb-1">
                Consultation Type
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaHospital className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  id="consultType"
                  className="block w-full pl-10 pr-10 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  value={consultType}
                  onChange={(e) => setConsultType(e.target.value)}
                >
                  {consultTypeOptions.map((option) => (
                    <option key={option.value || 'all'} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isLoading ? "Loading doctors..." : 
           `${filteredDoctors.length} Doctor${filteredDoctors.length !== 1 ? 's' : ''} Found`}
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaUserMd className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Doctors Found</h3>
            <p className="text-gray-600 mb-4">
              We couldn't find any doctors matching your search criteria. Please try adjusting your filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedSpecialty("");
                setSelectedCity("");
                setSelectedExperience("");
                setConsultType("");
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="relative h-20 w-20 mr-4 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      {doctor.image ? (
                        <img
                          src={getDoctorImageUrl(doctor._id, doctor.Name)}
                          alt={doctor.Name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <img
                          src={getDoctorImageUrl(doctor._id, doctor.Name)}
                          alt={doctor.Name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
                        {doctor.Name}
                      </h3>
                      <p className="text-red-700 font-medium mb-1">{doctor.Speciality}</p>
                      <div className="flex items-center text-yellow-400 mb-1">
                        <FaStar className="mr-1" />
                        <span className="text-gray-700">{doctor.rating || "4.5"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-start">
                      <FaRegClock className="mt-0.5 mr-2 text-gray-400" />
                      <span><span className="font-medium">Experience:</span> {doctor.Experience} years</span>
                    </div>
                    
                    <div className="flex items-start">
                      <FaMapMarkerAlt className="mt-0.5 mr-2 text-gray-400" />
                      <span><span className="font-medium">Location:</span> {doctor.City}, {doctor.State}</span>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCalendarAlt className="mt-0.5 mr-2 text-gray-400" />
                      <span><span className="font-medium">Consultation:</span> {
                        doctor.ConsultType === "Both" ? "In-Clinic & Video" : 
                        doctor.ConsultType === "InClinic" ? "In-Clinic Only" : 
                        doctor.ConsultType === "Video" ? "Video Only" : 
                        "Not Specified"
                      }</span>
                    </div>
                    
                    {doctor.Fees && (
                      <div className="flex items-start">
                        <FaMoneyBillWave className="mt-0.5 mr-2 text-gray-400" />
                        <span><span className="font-medium">Fees:</span> ${doctor.Fees}</span>
                      </div>
                    )}
                    
                    {doctor.Education && (
                      <div className="flex items-start">
                        <FaUserMd className="mt-0.5 mr-2 text-gray-400" />
                        <span className="line-clamp-1"><span className="font-medium">Education:</span> {doctor.Education}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button 
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300 text-center flex items-center justify-center"
                      onClick={() => handleBookAppointment(doctor)}
                    >
                      {!isLoggedIn && <FaLock className="mr-2" />}
                      Book Appointment
                    </button>
                    <button 
                      className="flex-1 bg-white text-red-600 border border-red-600 py-2 px-4 rounded-lg hover:bg-red-50 transition-colors duration-300 text-center"
                      onClick={() => handleViewProfile(doctor._id)}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindDoctor;