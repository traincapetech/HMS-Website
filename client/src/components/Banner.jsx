import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";

const Banner = () => {
  const [location, setLocation] = useState("");
  const [doctorType, setDoctorType] = useState("");

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleDoctorTypeChange = (e) => {
    setDoctorType(e.target.value);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="relative bg-cover bg-center min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[50vh] flex items-center justify-center text-black">
      {/* Background Image */}
      {/* <div className="absolute inset-0 bg-black opacity-40"></div> */}

      <div className="relative z-10 text-center px-4 sm:px-6 md:px-8 lg:px-12 w-full max-w-[95%] mx-auto">
        {/* Banner Text */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-3 md:mb-4">
          Welcome to TAMD Portal
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-4 md:mb-6">
          Find the best doctors, clinics, and hospitals near you
        </p>

        {/* Search Bar */}
        <div className="flex justify-center items-center bg-white p-3 md:p-4 rounded-lg shadow-lg max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row w-full space-y-3 sm:space-y-0 sm:space-x-3 md:space-x-4">
            {/* Location Section */}
            <div className="flex-1">
              <select
                value={location}
                onChange={handleLocationChange}
                className="w-full p-2 md:p-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary text-sm md:text-base"
              >
                <option value="">Select Location</option>
                <option value="New York">New York</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Chicago">Chicago</option>
                <option value="San Francisco">San Francisco</option>
              </select>
            </div>

            {/* Doctor Type Section */}
            <div className="flex-1">
              <select
                value={doctorType}
                onChange={handleDoctorTypeChange}
                className="w-full p-2 md:p-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary text-sm md:text-base"
              >
                <option value="">Select Type</option>
                <option value="Doctor">Doctor</option>
                <option value="Clinic">Clinic</option>
                <option value="Hospital">Hospital</option>
              </select>
            </div>

            {/* Search Button */}
            <button className="flex items-center justify-center bg-primary hover:bg-primary-dark text-white bg-blue-400 py-2 md:py-3 px-4 md:px-6 rounded-md text-sm md:text-base transition duration-300">
              <IoIosSearch className="mr-1 text-lg md:text-xl" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;