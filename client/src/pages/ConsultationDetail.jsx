import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaBrain, FaHeartbeat, FaHandHoldingMedical, FaStethoscope, FaUsers, FaLungs, FaEye, FaPills } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";

const ConsultationDetail = () => {
  // Get the ID from the URL parameters
  const { id } = useParams();

  const categories = [
    { title: "General Physics", icon: <FaBrain className="text-4xl text-blue-500" />, price: "$50" },
    { title: "Sexology", icon: <FaHeartbeat className="text-4xl text-blue-500" />, price: "$70" },
    { title: "Dermatology", icon: <FaHandHoldingMedical className="text-4xl text-blue-500" />, price: "$60" },
    { title: "Gynecology", icon: <FaStethoscope className="text-4xl text-blue-500" />, price: "$80" },
    { title: "Cardiology", icon: <FaHeartbeat className="text-4xl text-blue-500" />, price: "$90" },
    { title: "Psychiatry", icon: <FaUsers className="text-4xl text-blue-500" />, price: "$85" },
    { title: "Pulmonology", icon: <FaLungs className="text-4xl text-blue-500" />, price: "$95" },
    { title: "Ophthalmology", icon: <FaEye className="text-4xl text-blue-500" />, price: "$75" },
    { title: "Pharmacology", icon: <FaPills className="text-4xl text-blue-500" />, price: "$65" },
  ];

  // Find the category based on the `id`
  const category = categories.find((cat, index) => index.toString() === id);

  useEffect(()=>{
    window.scrollTo(0, 0);},[])

  return (
    <div className="max-w-4xl mx-auto h-screen p-8">
      <div className="bg-white shadow-lg p-8 rounded-lg   flex items-center space-x-8">
        {/* Content (Left Side) */}
        <div className="flex-1 ">
          <h2 className="text-3xl font-bold mb-4 flex gap-2">{category?.title} {category && category.icon}</h2>
          <p className="text-2xl text-green-500 mb-4">{category?.price}</p>
          
          <div className="space-y-4 w-2/3">
            <p className="text-lg text-gray-700">Get professional advice from a specialist in {category?.title}. Book your consultation now and receive personalized guidance tailored to your needs.</p>
            <button className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-600 transition w-fit">
              Start Consultation
            </button>
          </div>
        </div>

        {/* Doctor Icon (Right Side) */}
        <div className="flex-shrink-0">
          <div className="bg-gray-100 p-6 rounded-full shadow-lg">
            <FaUserDoctor className="text-red-700 text-9xl"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationDetail;