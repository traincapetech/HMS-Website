import React, { useEffect } from "react";
import { FaUserMd, FaHeartbeat, FaBrain, FaStethoscope, FaLaptopMedical } from "react-icons/fa"; // Importing React icons

const ConsultTopDoctors = () => {
  const doctorTypes = [
    {
      id: 1,
      name: "Orthopedic",
      icon: <FaUserMd className="w-16 h-16 text-blue-500" />,
    },
    {
      id: 2,
      name: "Cardiologist",
      icon: <FaHeartbeat className="w-16 h-16 text-red-500" />,
    },
    {
      id: 3,
      name: "Neurologist",
      icon: <FaBrain className="w-16 h-16 text-purple-500" />,
    },
    {
      id: 4,
      name: "General Physician",
      icon: <FaStethoscope className="w-16 h-16 text-green-500" />,
    },
    {
      id: 5,
      name: "Online Consultations",
      icon: <FaLaptopMedical className="w-16 h-16 text-teal-500" />,
    },
  ];
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
              className="flex flex-col items-center space-y-2"
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
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300">
            Start Your Consultation
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsultTopDoctors;