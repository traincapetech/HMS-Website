import React, { useEffect } from "react";
import { FaUserMd, FaHeartbeat, FaBrain, FaStethoscope, FaLaptopMedical } from "react-icons/fa"; // Importing React icons
import { useNavigate, Link } from "react-router-dom";

const ConsultTopDoctors = () => {
  const navigate = useNavigate();
  
  const doctorTypes = [
    {
      id: 1,
      name: "Orthopedic",
      icon: <FaUserMd className="w-16 h-16 text-blue-500" />,
      specialtyId: 7, // Match with the Bones and Joints specialty ID
    },
    {
      id: 2,
      name: "Cardiologist",
      icon: <FaHeartbeat className="w-16 h-16 text-red-500" />,
      specialtyId: 10, // Match with the Heart specialty ID
    },
    {
      id: 3,
      name: "Neurologist",
      icon: <FaBrain className="w-16 h-16 text-purple-500" />,
      specialtyId: 22, // Match with the Brain and Nerves specialty ID
    },
    {
      id: 4,
      name: "General Physician",
      icon: <FaStethoscope className="w-16 h-16 text-green-500" />,
      specialtyId: 14, // Match with the General Physician specialty ID
    },
    {
      id: 5,
      name: "Online Consultations",
      icon: <FaLaptopMedical className="w-16 h-16 text-teal-500" />,
      route: "/video", // Direct route for video consultations
    },
  ];
  
  // Function to handle doctor type selection
  const handleDoctorTypeClick = (doctorType) => {
    if (doctorType.route) {
      navigate(doctorType.route);
    } else if (doctorType.specialtyId) {
      navigate(`/specialty/${doctorType.specialtyId}`);
    }
  };
  
  // Function to start a consultation
  const startConsultation = () => {
    navigate('/video');
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Consult Top Doctors Online for Any Health Concern
        </h1>
        <p className="text-lg text-gray-600 mb-12">
          Get expert consultations from our top-rated doctors in various
          specialties, all from the comfort of your home.
        </p>

        {/* Flex Layout for Icons and Names */}
        <div className="flex flex-wrap justify-center gap-8">
          {doctorTypes.map((doctor) => (
            <div
              key={doctor.id}
              className="flex flex-col items-center space-y-2 cursor-pointer hover:transform hover:scale-110 transition-transform duration-300"
              onClick={() => handleDoctorTypeClick(doctor)}
            >
              <div>{doctor.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900">
                {doctor.name}
              </h3>
            </div>
          ))}
        </div>

        {/* Start Your Consultation Button */}
        <div className="mt-12">
          <button 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
            onClick={startConsultation}
          >
            Start Your Consultation
          </button>
        </div>
        
        {/* Additional Info */}
        {/* <div className="mt-8 text-sm text-gray-600">
          <p>Our doctors are available 24/7 for video consultations</p>
          <p className="mt-2">
            Already have an appointment? <Link to="/VideoCall" className="text-blue-600 hover:underline">Join your video call</Link>
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default ConsultTopDoctors;