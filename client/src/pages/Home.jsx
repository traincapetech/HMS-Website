import React, { useEffect } from "react";
import Banner from "../components/Banner";
import ConsultTopDoctors from "../components/ConsultTopDoctors";
import { FaVideo, FaWhatsapp } from "react-icons/fa";
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
      buttonColor: "bg-blue-500 hover:bg-blue-600",
      url: "/video",
    },
    {
      id: 2,
      title: "Find Doctor Near Me",
      description:
        "Search for doctors near you and book an appointment quickly.",
      icon: <FaUserDoctor className="text-5xl text-green-500 mb-4 mx-auto" />,
      buttonText: "Find a Doctor",
      buttonColor: "bg-green-500 hover:bg-green-600",
      url: "/doctor",
    },
    {
      id: 3,
      title: "Surgeries",
      description:
        "Explore a wide range of surgical treatments with top specialists.",
      icon: <GiScalpel className="text-5xl text-red-500 mb-4 mx-auto" />,
      buttonText: "Explore Surgeries",
      buttonColor: "bg-red-500 hover:bg-red-600",
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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Banner />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 my-10">
        {services.map((service) => (
          <Link to={service.url} key={service.id}>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out transform">
              <div className="text-center mx-auto">
                {service.icon}
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Specialties />
      <ConsultTopDoctors />

      <div className="w-full py-6">
        <div className="text-4xl font-semibold text-gray-800 mb-4 w-full text-center">
          What Our Patients Say
        </div>
        <AutoPlay slides={reviews} />
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/+17879493280" // Replace with your WhatsApp number
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300"
      >
        <FaWhatsapp className="text-3xl" />
      </a>
    </>
  );
};

export default Home;
