import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaStar, FaRegClock, FaUserMd, FaGraduationCap, FaHospital, FaMoneyBillWave, FaPhone, FaEnvelope } from "react-icons/fa";
import api from "../utils/app.api";
import { getDoctorImageUrl } from "../utils/app.api";

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!token && !!user);
  }, []);

  // Fetch doctor data
  useEffect(() => {
    const fetchDoctorData = async () => {
      setLoading(true);
      try {
        // Try to get doctor by ID
        const response = await api.get(`/doctor/${id}`);
        
        if (response.data && response.data.doctor) {
          setDoctor(response.data.doctor);
          setError(null);
        } else {
          setError("Could not retrieve doctor information");
        }
      } catch (err) {
        console.error("Error fetching doctor data:", err);
        
        // For demo and development purposes - use sample data if API fails
        if (id && ["1", "2", "3"].includes(id)) {
          // Sample data for doctors with IDs 1-3
          const sampleDoctors = {
            "1": {
              _id: "1",
              Name: "Dr. Sarah Johnson",
              Speciality: "Cardiology",
              Experience: "15",
              City: "New York",
              State: "NY",
              ConsultType: "Both",
              Fees: 150,
              Education: "MD, Harvard Medical School",
              Hospital: "New York Medical Center",
              About: "Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience. She specializes in interventional cardiology and heart disease prevention.",
              rating: 4.8,
            },
            "2": {
              _id: "2",
              Name: "Dr. Michael Chen",
              Speciality: "Orthopedics",
              Experience: "12",
              City: "Chicago",
              State: "IL",
              ConsultType: "InClinic",
              Fees: 175,
              Education: "MD, Johns Hopkins University",
              Hospital: "Chicago Memorial Hospital",
              About: "Dr. Michael Chen is an orthopedic surgeon specializing in sports injuries and joint reconstruction. With 12 years of practice, he has treated numerous professional athletes.",
              rating: 4.7,
            },
            "3": {
              _id: "3",
              Name: "Dr. Emily Brown",
              Speciality: "Pediatrics",
              Experience: "10",
              City: "Los Angeles",
              State: "CA",
              ConsultType: "Video",
              Fees: 120,
              Education: "MD, Stanford University",
              Hospital: "Children's Hospital Los Angeles",
              About: "Dr. Emily Brown is a compassionate pediatrician with a decade of experience caring for children of all ages. She has a special interest in childhood development and preventive care.",
              rating: 4.9,
            }
          };
          
          // Set the sample doctor data
          setDoctor(sampleDoctors[id]);
          setError(null);
        } else {
          setError("Doctor information not available");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDoctorData();
    }
  }, [id]);

  // Handle booking appointment
  const handleBookAppointment = () => {
    if (!isLoggedIn) {
      // Redirect to login page with return URL and selected doctor
      navigate("/login", { 
        state: { 
          returnUrl: "/Appointments",
          selectedDoctor: doctor,
          selectedSpecialty: doctor.Speciality // Explicitly pass the specialty
        } 
      });
      return;
    }
    
    // If user is logged in, proceed directly to appointment page
    navigate("/Appointments", { 
      state: { 
        selectedDoctor: doctor,
        selectedSpecialty: doctor.Speciality, // Explicitly pass the specialty
        skipDoctorSelection: true // Flag to skip doctor selection step
      } 
    });
  };

  // For scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaUserMd className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Doctor Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "The doctor profile you're looking for is not available."}</p>
            <button
              onClick={() => navigate("/doctor")}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
            >
              Back to Doctors
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Doctor Profile Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-red-800 to-red-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Doctor Profile</h1>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row">
              {/* Doctor Image */}
              <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                <div className="relative h-64 w-64 rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src={getDoctorImageUrl(doctor._id, doctor.Name)}
                    alt={doctor.Name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      // If image fails to load, use a backup avatar
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.Name)}&size=256&background=random&color=fff`;
                    }}
                  />
                </div>
              </div>
              
              {/* Doctor Info */}
              <div className="md:w-2/3 md:pl-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{doctor.Name}</h2>
                
                <div className="mb-4">
                  <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    {doctor.Speciality}
                  </span>
                  
                  <div className="flex items-center mt-2 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={`${i < Math.floor(doctor.rating || 4.5) ? 'text-yellow-400' : 'text-gray-300'} mr-1`}
                      />
                    ))}
                    <span className="text-gray-700 ml-2">{doctor.rating || "4.5"}/5</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mb-6">
                  <div className="flex items-center">
                    <FaRegClock className="mr-2 text-red-600" />
                    <span><span className="font-medium">Experience:</span> {doctor.Experience} years</span>
                  </div>
                  
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-red-600" />
                    <span><span className="font-medium">Location:</span> {doctor.City}, {doctor.State}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2 text-red-600" />
                    <span><span className="font-medium">Consultation:</span> {
                      doctor.ConsultType === "Both" ? "In-Clinic & Video" : 
                      doctor.ConsultType === "InClinic" ? "In-Clinic Only" : 
                      doctor.ConsultType === "Video" ? "Video Only" : 
                      "Not Specified"
                    }</span>
                  </div>
                  
                  {doctor.Fees && (
                    <div className="flex items-center">
                      <FaMoneyBillWave className="mr-2 text-red-600" />
                      <span><span className="font-medium">Fees:</span> ${doctor.Fees}</span>
                    </div>
                  )}
                  
                  {doctor.Education && (
                    <div className="flex items-center col-span-1 md:col-span-2">
                      <FaGraduationCap className="mr-2 text-red-600" />
                      <span><span className="font-medium">Education:</span> {doctor.Education}</span>
                    </div>
                  )}
                  
                  {doctor.Hospital && (
                    <div className="flex items-center col-span-1 md:col-span-2">
                      <FaHospital className="mr-2 text-red-600" />
                      <span><span className="font-medium">Hospital:</span> {doctor.Hospital}</span>
                    </div>
                  )}
                </div>
                
                <button 
                  className="w-full md:w-auto bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors duration-300 flex items-center justify-center font-medium"
                  onClick={handleBookAppointment}
                >
                  <FaCalendarAlt className="mr-2" />
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* About Section */}
        {doctor.About && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-red-800 to-red-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">About {doctor.Name}</h2>
            </div>
            <div className="p-6 md:p-8">
              <p className="text-gray-700 leading-relaxed">{doctor.About}</p>
            </div>
          </div>
        )}
        
        {/* Services & Specializations (if available) */}
        {doctor.Services && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-red-800 to-red-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Services & Specializations</h2>
            </div>
            <div className="p-6 md:p-8">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctor.Services.map((service, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-red-600 text-sm font-bold">✓</span>
                    </div>
                    <span className="text-gray-700">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {/* Contact Information (if available) */}
        {(doctor.Email || doctor.Phone) && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-red-800 to-red-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Contact Information</h2>
            </div>
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctor.Email && (
                  <div className="flex items-center">
                    <FaEnvelope className="mr-2 text-red-600" />
                    <span><span className="font-medium">Email:</span> {doctor.Email}</span>
                  </div>
                )}
                
                {doctor.Phone && (
                  <div className="flex items-center">
                    <FaPhone className="mr-2 text-red-600" />
                    <span><span className="font-medium">Phone:</span> {doctor.Phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile; 