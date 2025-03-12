import React from "react";
import {
  FaUserMd,
  FaHeartbeat,
  FaBaby,
  FaBrain,
  FaStethoscope,
  FaRegSmile,
  FaFemale,
  FaShieldAlt,
  FaMicroscope,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DoctorPage = () => {
  const navigate = useNavigate(); // ✅ Hook for navigation

  const doctorTypes = [
    { id: 1, name: "Orthopedic", icon: <FaUserMd className="w-16 h-16 text-blue-500" />, description: "Specialists in bone and joint health." },
    { id: 2, name: "Gynecologist", icon: <FaBaby className="w-16 h-16 text-pink-500" />, description: "Experts in women's reproductive health." },
    { id: 3, name: "Cardiologist", icon: <FaHeartbeat className="w-16 h-16 text-red-500" />, description: "Specialists in heart and vascular health." },
    { id: 4, name: "Neurologist", icon: <FaBrain className="w-16 h-16 text-purple-500" />, description: "Experts in brain and nervous system health." },
    { id: 5, name: "General Physician", icon: <FaStethoscope className="w-16 h-16 text-green-500" />, description: "Primary care for overall health." },
    { id: 6, name: "Dermatologist", icon: <FaShieldAlt className="w-16 h-16 text-yellow-500" />, description: "Experts in skin, hair, and nails health." },
    { id: 7, name: "Pediatrician", icon: <FaFemale className="w-16 h-16 text-teal-500" />, description: "Specialists in children's health and care." },
    { id: 8, name: "Psychiatrist", icon: <FaRegSmile className="w-16 h-16 text-indigo-500" />, description: "Experts in mental health and emotional well-being." },
    { id: 9, name: "Endocrinologist", icon: <FaMicroscope className="w-16 h-16 text-orange-500" />, description: "Specialists in hormone-related issues, such as diabetes and thyroid problems." },
  ];

  // ✅ Function to scroll down and navigate to DoctorRegister
  const handleJoinAsDoctor = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    setTimeout(() => {
      navigate("/doctorRegister");
    }, 500); // Delay to allow scrolling before navigation
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Our Specialists</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctorTypes.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex justify-center">{doctor.icon}</div>
              <h2 className="text-2xl font-semibold mt-4">{doctor.name}</h2>
              <p className="text-gray-600 mt-2">{doctor.description}</p>
            </div>
          ))}
        </div>

        {/* ✅ Scroll & Navigate to Doctor Register Page */}
        <div className="text-center mt-10">
          <button
            onClick={handleJoinAsDoctor}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Join as a Doctor
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorPage;