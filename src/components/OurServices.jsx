import React from "react";
import {
  FaHeartbeat,
  FaMedkit,
  FaShieldAlt,
  FaAmbulance,
  FaSmileBeam,
  FaVirus,
  FaUsers,
} from "react-icons/fa";
import { ImLab } from "react-icons/im";

const services = [
  {
    title: "Easy Online Consultations",
    description:
      "Over 25 specialities guided by best in class doctors for effective care around the clock.",
    icon: <FaHeartbeat className="text-8xl text-blue-500" />,
  },
  {
    title: "Online Pharmacy",
    description:
      "COVID-19 essentials and self-test kits provided, along with access to a large inventory for medicines.",
    icon: <FaMedkit className="text-8xl text-green-500" />,
  },
  {
    title: "Lab Tests at Home",
    description:
      "Discounts upto 20% on NABL-accredited lab tests and at-home tests in multiple cities.",
    icon: <ImLab className="text-8xl text-red-500" />,
  },
  {
    title: "Group Health Insurance",
    description:
      "Over 500+ day care procedures covered with a variety of payment options, for employees and family members.",
    icon: <FaShieldAlt className="text-8xl text-yellow-500" />,
  },
  {
    title: "SOS Ambulance Service",
    description:
      "24/7 round the clock Ambulatory services along with equipped medical staff.",
    icon: <FaAmbulance className="text-8xl text-orange-500" />,
  },
  {
    title: "Mental Wellbeing Solutions",
    description:
      "Specially focused Mental Wellness plans available with regular informative webinars and constant support.",
    icon: <FaSmileBeam className="text-8xl text-purple-500" />,
  },
  {
    title: "Covid Care Packages",
    description:
      "Covid-19 specific online consultations, lab tests, medical equipment, SOS assistance, and home care services.",
    icon: <FaVirus className="text-8xl text-pink-500" />,
  },
  {
    title: "Engagement Activities & Gamification",
    description:
      "Webinars and other knowledge-building sessions, peer-group challenges, and other employee engagement activities.",
    icon: <FaUsers className="text-8xl text-teal-500" />,
  },
];

const OurServices = () => {
  return (
    <div className=" mx-auto px-4 lg:px-16 xl:px-36 py-12 bg-gray-50">
      <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-800 mb-10">
        Our Services
      </h2>

      {/* Split into two parts: Left section and Right section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        <div className="flex flex-col space-y-4">
          {services.slice(0, 4).map((service, index) => (
            <div
              key={index}
              className="bg-white flex gap-5 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex justify-center my-auto bg-gray-100 rounded-full p-3">{service.icon}</div>
              <div>
                <h3 className="text-2xl font-semibold text-left text-gray-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-left">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col space-y-4">
          {services.slice(4).map((service, index) => (
            <div
            key={index}
            className="bg-white flex gap-5 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex justify-center my-auto bg-gray-100 rounded-full p-3">{service.icon}</div>
            <div>
              <h3 className="text-2xl font-semibold text-left text-gray-800 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 text-left">
                {service.description}
              </p>
            </div>
          </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurServices;