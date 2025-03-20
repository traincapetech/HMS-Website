// import React, { useEffect, useState } from "react";
// import { IoIosSearch } from "react-icons/io";

// const Banner = () => {
//   const [location, setLocation] = useState("");
//   const [doctorType, setDoctorType] = useState("");

//   const handleLocationChange = (e) => {
//     setLocation(e.target.value);
//   };

//   const handleDoctorTypeChange = (e) => {
//     setDoctorType(e.target.value);
//   };
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);
//   return (
//     <div className="relative bg-cover bg-center h-[50vh] flex items-center justify-center text-black">
//       {/* Background Image */}
//       {/* <div className="absolute inset-0 bg-black opacity-40"></div> */}

//       <div className="relative z-10 text-center px-6 sm:px-12">
//         {/* Banner Text */}
//         <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
//           Welcome to TAMD Portal
//         </h1>
//         <p className="text-lg sm:text-xl mb-6">
//           Find the best doctors, clinics, and hospitals near you
//         </p>

//         {/* Search Bar */}
//         <div className="flex justify-center items-center bg-white p-4 rounded-lg shadow-lg max-w-4xl mx-auto">
//           <div className="flex flex-col sm:flex-row sm:space-x-4 w-full">
//             {/* Location Section */}
//             <div className="flex-1">
//               <select
//                 value={location}
//                 onChange={handleLocationChange}
//                 className="w-full p-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
//               >
//                 <option value="">Select Location</option>
//                 <option value="New York">New York</option>
//                 <option value="Los Angeles">Los Angeles</option>
//                 <option value="Chicago">Chicago</option>
//                 <option value="San Francisco">San Francisco</option>
//               </select>
//             </div>

//             {/* Doctor Type Section */}
//             <div className="flex-1 mt-4 sm:mt-0">
//               <select
//                 value={doctorType}
//                 onChange={handleDoctorTypeChange}
//                 className="w-full p-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
//               >
//                 <option value="">Select Type</option>
//                 <option value="Doctor">Doctor</option>
//                 <option value="Clinic">Clinic</option>
//                 <option value="Hospital">Hospital</option>
//               </select>
//             </div>

//             {/* Search Button */}
//             <button className="mt-4 sm:mt-0 sm:ml-4 bg-primary flex hover:bg-primary-dark text-white bg-blue-400 py-3 px-6 rounded-md text-lg transition duration-300">
//               <span className="my-auto mr-2">
//                 <IoIosSearch />
//               </span>
//               Search
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Banner;
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
    <div className="relative bg-cover bg-center min-h-[300px] md:min-h-[400px] lg:min-h-[500px] flex items-center justify-center text-black py-8 md:py-12 z-10">
      {/* Background Image */}
      {/* <div className="absolute inset-0 bg-black opacity-40"></div> */}

      <div className="relative z-10 text-center w-full px-4 sm:px-6 md:px-12 max-w-6xl mx-auto">
        {/* Banner Text */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-4">
          Welcome to TAMD Portal
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6">
          Find the best doctors, clinics, and hospitals near you
        </p>

        {/* Search Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 md:space-x-4 w-full">
            {/* Location Section */}
            <div className="flex-1 mb-3 sm:mb-0">
              <select
                value={location}
                onChange={handleLocationChange}
                className="w-full p-2 md:p-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary text-sm md:text-base"
                aria-label="Select location"
              >
                <option value="">Select Location</option>
                <option value="New York">New York</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Chicago">Chicago</option>
                <option value="San Francisco">San Francisco</option>
              </select>
            </div>

            {/* Doctor Type Section */}
            <div className="flex-1 mb-3 sm:mb-0">
              <select
                value={doctorType}
                onChange={handleDoctorTypeChange}
                className="w-full p-2 md:p-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary text-sm md:text-base"
                aria-label="Select provider type"
              >
                <option value="">Select Type</option>
                <option value="Doctor">Doctor</option>
                <option value="Clinic">Clinic</option>
                <option value="Hospital">Hospital</option>
              </select>
            </div>

            {/* Search Button */}
            <button 
              className="w-full sm:w-auto sm:flex-none bg-blue-500 hover:bg-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-md text-sm md:text-base transition duration-300 flex items-center justify-center"
              aria-label="Search for providers"
            >
              <span className="mr-2">
                <IoIosSearch size={18} />
              </span>
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;