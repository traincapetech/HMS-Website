import React from "react";
import { FaChartLine, FaUsers, FaClipboardCheck, FaCogs, FaStar, FaQuoteLeft } from "react-icons/fa";

const InstaByTAMD = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <div className="relative flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-16">
        <div className="max-w-2xl text-center md:text-left">
          <h1 className="text-5xl font-extrabold">Insta by TAMD</h1>
          <h2 className="mt-4 text-2xl font-medium">
            Monitor & Control Your Hospital with Ease
          </h2>
          <p className="mt-3 text-lg leading-relaxed">
            Increase your hospital’s productivity by efficiently managing
            departments, patients, and staff. Enhance patient experience with
            intelligent decision-making tools.
          </p>
          <button className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-200 transition duration-300">
            Request a Free Demo
          </button>
        </div>
        <div className="mt-8 md:mt-0">
          <img src="/images/hospital-puzzle.png" alt="Hospital Puzzle" className="w-full max-w-md" />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-8">
        <h2 className="text-3xl font-bold text-center text-blue-600">
          Key Features
        </h2>
        <p className="text-center mt-2 max-w-2xl mx-auto">
          Our platform offers powerful features to streamline hospital operations.
        </p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <FaChartLine className="text-blue-600 text-4xl" />,
              title: "Real-time Analytics",
              desc: "Track hospital performance with powerful data insights."
            },
            {
              icon: <FaUsers className="text-blue-600 text-4xl" />,
              title: "Patient & Staff Management",
              desc: "Effortlessly handle patient records and staff assignments."
            },
            {
              icon: <FaClipboardCheck className="text-blue-600 text-4xl" />,
              title: "Appointment Scheduling",
              desc: "Seamlessly book and manage patient appointments."
            },
            {
              icon: <FaCogs className="text-blue-600 text-4xl" />,
              title: "Automated Workflows",
              desc: "Reduce manual work and streamline hospital processes."
            },
            {
              icon: <FaUsers className="text-blue-600 text-4xl" />,
              title: "Secure Data Management",
              desc: "Protect patient information with advanced security."
            },
            {
              icon: <FaChartLine className="text-blue-600 text-4xl" />,
              title: "Billing & Insurance",
              desc: "Simplify payments with integrated billing systems."
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Insta Section */}
      <div className="bg-blue-100 py-16 px-8 text-center">
        <h2 className="text-3xl font-bold text-blue-700">Why Choose Insta?</h2>
        <p className="mt-3 max-w-2xl mx-auto">
          Designed to simplify hospital operations and enhance patient experience.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            "Increase Efficiency & Reduce Errors",
            "Seamless Integration with Existing Systems",
            "User-friendly & Intuitive Design",
            "24/7 Support & Assistance",
            "Improves Patient Care & Satisfaction",
            "Comprehensive Reporting & Insights"
          ].map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">{item}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 px-8">
        <h2 className="text-3xl font-bold text-center text-blue-600">What Our Clients Say</h2>
        <p className="text-center mt-2 max-w-2xl mx-auto">
          Hear from hospitals that have improved operations with Insta.
        </p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[
            {
              quote: "Insta has completely transformed our hospital's workflow. The analytics and automation features have saved us hours of work every day.",
              name: "Dr. Ankit Sharma",
              role: "Chief Medical Officer"
            },
            {
              quote: "With Insta, we now manage patient appointments and billing seamlessly. Our staff efficiency has improved significantly.",
              name: "Ms. Priya Menon",
              role: "Hospital Administrator"
            }
          ].map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <FaQuoteLeft className="text-blue-600 text-3xl mb-4" />
              <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              <div className="mt-4">
                <h3 className="font-semibold">{testimonial.name}</h3>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-blue-600 text-white py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Hospital?</h2>
        <p className="mb-6 text-lg">Schedule a free demo and see Insta in action.</p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-200 transition duration-300">
          Get a Free Demo Now 
        </button>
      </div>
    </div>
  );
};

export default InstaByTAMD;
