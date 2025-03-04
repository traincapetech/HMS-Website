import React from "react";
import Banner from "../components/Banner";
import ConsultTopDoctors from "../components/ConsultTopDoctors";
import { FaVideo } from "react-icons/fa";
import { GiScalpel } from "react-icons/gi";
import { FaUserDoctor } from "react-icons/fa6";
import AutoPlay from "../components/AutoPlay";
import { Link } from "react-router-dom";
import Specialties from "../components/Specialties";

const Home = () => {
  const services = [
    {
      id: 1,
      title: "Video Consultation",
      description:
        "Consult with experienced doctors from the comfort of your home.",
      icon: <FaVideo className="text-5xl text-blue-500 mb-4 mx-auto" />,
      buttonText: "Book a Session",
      url: "/video",
    },
    {
      id: 2,
      title: "Find Doctor Near Me",
      description:
        "Search for doctors near you and book an appointment quickly.",
      icon: <FaUserDoctor className="text-5xl text-green-500 mb-4 mx-auto" />,
      buttonText: "Find a Doctor",
      url: "/doctor",
    },
    {
      id: 3,
      title: "Surgeries",
      description:
        "Explore a wide range of surgical treatments with top specialists.",
      icon: <GiScalpel className="text-5xl text-red-500 mb-4 mx-auto" />,
      buttonText: "Explore Surgeries",
      url: "/surgeries",
    },
  ];

  // Reviews array
  const reviews = [
    {
      name: "John Doe",
      review:
        "Great experience! The doctor was very helpful and the consultation was seamless.",
    },
    {
      name: "Sarah Smith",
      review:
        "I found the right specialist near me in no time. Booking was simple and quick.",
    },
    {
      name: "Michael Johnson",
      review:
        "The surgery consultation was informative, and I feel confident about my upcoming procedure.",
    },
    {
      name: "Emily Brown",
      review:
        "The video consultation service was amazing. I felt like I was in the doctor's office!",
    },
  ];

  return (
    <>
      <Banner />
      
      {/* Services Section with Animation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 my-10">
        {services.map((service) => (
          <Link to={service.url} key={service.id}>
            <div className="relative bg-white p-6 rounded-lg shadow-lg group transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl">
              <div className="text-center mx-auto">
                {service.icon}
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
              </div>
              
              {/* Animated Button */}
              <div className="text-center">
                <button className="relative bg-blue-500 text-white px-5 py-2 rounded-full font-semibold overflow-hidden transition-all duration-300 group-hover:bg-blue-600 group-hover:scale-110">
                  {service.buttonText}
                  {/* Hover Effect */}
                  <span className="absolute inset-0 bg-blue-400 opacity-0 transition-opacity duration-300 group-hover:opacity-30"></span>
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Specialties />
      <ConsultTopDoctors />
      
      {/* Patient Reviews Section */}
      <div className="w-full py-6">
        <div className="text-4xl font-semibold text-gray-800 mb-4 w-full text-center">
          What Our Patients Say
        </div>
        <AutoPlay slides={reviews} />
      </div>
    </>
  );
};

export default Home;
