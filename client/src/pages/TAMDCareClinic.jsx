import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TAMDCareClinics = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Hero Section */}
      <header className="bg-blue-700 text-white text-center py-20 px-6">
        <h1 className="text-5xl font-extrabold">Your Health, Our Priority</h1>
        <p className="mt-4 text-lg">
          Comprehensive medical care at your fingertips
        </p>
        <button
          onClick={() => navigate("/Appointments")}
          className="hover:cursor-pointer mt-6 px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-md hover:bg-gray-200"
        >
          Book an Appointment
        </button>
      </header>

      {/* About Section */}
      <section className="max-w-5xl mx-auto text-center py-16 px-6">
        <h2 className="text-4xl font-bold text-blue-600">About Us</h2>
        <p className="mt-4 text-lg text-gray-700 leading-relaxed">
          TAMDCare Clinics is dedicated to providing quality healthcare services
          with a team of experienced professionals. Our goal is to ensure every
          patient receives personalized care in a comfortable and welcoming
          environment.
        </p>
      </section>

      {/* Services Section */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-blue-600">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold">General Checkups</h3>
              <p className="mt-2 text-gray-700">
                Routine health assessments and preventive care for all ages.
              </p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold">Emergency Care</h3>
              <p className="mt-2 text-gray-700">
                Round-the-clock medical assistance for urgent needs.
              </p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold">
                Specialist Consultations
              </h3>
              <p className="mt-2 text-gray-700">
                Expert advice from specialists across multiple disciplines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-100 py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-blue-600">
            What Our Patients Say
          </h2>
          <div className="mt-8 space-y-6">
            <blockquote className="text-lg italic text-gray-700">
              "TAMDCare Clinics provided exceptional care. The doctors were very
              attentive and understanding!" - Sarah K.
            </blockquote>
            <blockquote className="text-lg italic text-gray-700">
              "Quick and efficient service. Highly recommended for their
              professional approach." - John D.
            </blockquote>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-blue-600 text-white text-center py-16 px-6">
        <h2 className="text-4xl font-bold">Get in Touch</h2>
        <p className="mt-4 text-lg">Visit us or book an appointment online.</p>
        <p className="mt-2">📍 California</p>
        <p className="mt-2">📞 +1 (787) 949-3280</p>
        <button
          onClick={() => navigate("/contactUs")}
          className="hover:cursor-pointer mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-200"
        >
          Contact Us
        </button>
      </section>
    </div>
  );
};

export default TAMDCareClinics;
