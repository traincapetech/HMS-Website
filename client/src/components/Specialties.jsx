// Specialties.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import the Link component for routing
import {
  FaHeartbeat,
  FaUserMd,
  FaBone,
  FaBriefcaseMedical,
  FaAppleAlt,
  FaSun,
  FaPills,
  FaChild,
  FaTooth,
  FaLungs,
  FaBrain,
  FaHome,
  FaHands,
  FaDog,
  FaEye,
  FaToilet,
} from "react-icons/fa";
import { GiCancer } from "react-icons/gi";
import { GrRestroomWomen } from "react-icons/gr";
import { FaVirusCovid } from "react-icons/fa6";

// Export specialties with a numeric ID
export const specialties = [
  {
    id: 1,
    name: "Covid Treatment",
    icon: <FaVirusCovid className="mx-auto" />,
  },
  {
    id: 2,
    name: "Sexual Health",
    icon: <FaUserMd className="mx-auto" />,
  },
  {
    id: 3,
    name: "Eye Specialist",
    icon: <FaEye className="mx-auto" />,
  },
  {
    id: 4,
    name: "Womens Health",
    icon: <GrRestroomWomen className="mx-auto text-6xl" />,
  },
  {
    id: 5,
    name: "Diet & Nutrition",
    icon: <FaAppleAlt className="mx-auto" />,
  },
  {
    id: 6,
    name: "Skin & Hair",
    icon: <FaSun className="mx-auto" />,
  },
  {
    id: 7,
    name: "Bones and Joints",
    icon: <FaBone className="mx-auto" />,
  },
  {
    id: 8,
    name: "Child Specialist",
    icon: <FaChild className="mx-auto" />,
  },
  {
    id: 9,
    name: "Dental Care",
    icon: <FaTooth className="mx-auto" />,
  },
  {
    id: 10,
    name: "Heart",
    icon: <FaHeartbeat className="mx-auto" />,
  },
  {
    id: 11,
    name: "Kidney Issues",
    icon: <FaPills className="mx-auto" />,
  },
  {
    id: 12,
    name: "Cancer",
    icon: <GiCancer className="mx-auto" />,
  },
  {
    id: 13,
    name: "Ayurveda",
    icon: <FaHome className="mx-auto" />,
  },
  {
    id: 14,
    name: "General Physician",
    icon: <FaUserMd className="mx-auto" />,
  },
  {
    id: 15,
    name: "Mental Wellness",
    icon: <FaBrain className="mx-auto" />,
  },
  {
    id: 16,
    name: "Homoeopath",
    icon: <FaHands className="mx-auto" />,
  },
  {
    id: 17,
    name: "General Surgery",
    icon: <FaBriefcaseMedical className="mx-auto" />,
  },
  {
    id: 18,
    name: "Urinary Issues",
    icon: <FaToilet className="mx-auto" />,
  },
  {
    id: 19,
    name: "Lungs and Breathing",
    icon: <FaLungs className="mx-auto" />,
  },
  {
    id: 20,
    name: "Physiotherapy",
    icon: <FaHands className="mx-auto" />,
  },
  {
    id: 21,
    name: "Ear, Nose, Throat",
    icon: <FaUserMd className="mx-auto" />,
  },
  {
    id: 22,
    name: "Brain and Nerves",
    icon: <FaBrain className="mx-auto" />,
  },
  {
    id: 23,
    name: "Diabetes Management",
    icon: <FaAppleAlt className="mx-auto" />,
  },
  {
    id: 24,
    name: "Veterinary",
    icon: <FaDog className="mx-auto" />,
  },
];


const Specialties = () => {
  const [showAll, setShowAll] = useState(false);

  const handleClick = () => {
    setShowAll(!showAll);
  };

  const specialtiesToDisplay = showAll ? specialties : specialties.slice(0, 6);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-4xl font-bold text-gray-800">
          Our Medical Specialties
        </h2>
        <button
          onClick={handleClick}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg text-lg font-semibold transition-all duration-300 hover:bg-blue-600"
        >
          {showAll ? "View Less" : "View All"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {specialtiesToDisplay.map((specialty, index) => (
          <Link
            key={index}
            to={`/specialty/${specialty.id}`}
            className="text-center"
          >
            <div className="bg-white shadow-lg rounded-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="text-5xl text-blue-500 mb-4">
                {specialty.icon}
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {specialty.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Specialties;
