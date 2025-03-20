import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // Added Link
import { FaBrain, FaHeartbeat, FaHandHoldingMedical, FaStethoscope, FaUsers, FaLungs, FaEye, FaPills, FaCalendarAlt, FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";

const ConsultationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const categories = [
    { 
      title: "General Physician", 
      icon: <FaBrain className="text-4xl text-blue-500" />, 
      price: "$50",
      specialtyId: 14,
      description: "Consult with a general physician for common health issues, preventive care, and comprehensive health assessments.",
      benefits: ["Treatment for common illnesses", "Health check-ups", "Preventive care advice", "Referrals to specialists if needed"]
    },
    { 
      title: "Sexology", 
      icon: <FaHeartbeat className="text-4xl text-blue-500" />, 
      price: "$70",
      specialtyId: 2,
      description: "Discuss intimate health concerns with a certified sexologist in a confidential and professional environment.",
      benefits: ["Sexual health guidance", "Treatment for sexual dysfunction", "Relationship counseling", "Confidential consultations"]
    },
    { 
      title: "Dermatology", 
      icon: <FaHandHoldingMedical className="text-4xl text-blue-500" />, 
      price: "$60",
      specialtyId: 6,
      description: "Get expert advice on skin, hair, and nail conditions from experienced dermatologists.",
      benefits: ["Skin condition diagnosis", "Acne treatment", "Hair loss solutions", "Cosmetic dermatology advice"]
    },
    { 
      title: "Gynecology", 
      icon: <FaStethoscope className="text-4xl text-blue-500" />, 
      price: "$80",
      specialtyId: 4,
      description: "Consult with gynecologists about women's health concerns, reproductive health, and family planning.",
      benefits: ["Reproductive health guidance", "Pregnancy planning", "Menstrual problem solutions", "Preventive screenings"]
    },
    { 
      title: "Cardiology", 
      icon: <FaHeartbeat className="text-4xl text-blue-500" />, 
      price: "$90",
      specialtyId: 10,
      description: "Discuss heart health concerns with experienced cardiologists and get personalized advice.",
      benefits: ["Heart health assessment", "ECG interpretation", "Lifestyle modification guidance", "Medication review"]
    },
    { 
      title: "Psychiatry", 
      icon: <FaUsers className="text-4xl text-blue-500" />, 
      price: "$85",
      specialtyId: 15,
      description: "Talk to mental health professionals about emotional well-being, stress, anxiety, and other mental health concerns.",
      benefits: ["Mental health assessment", "Therapy recommendations", "Medication management", "Coping strategies"]
    },
    { 
      title: "Pulmonology", 
      icon: <FaLungs className="text-4xl text-blue-500" />, 
      price: "$95",
      specialtyId: 19,
      description: "Consult with lung specialists about respiratory conditions, breathing difficulties, and lung health.",
      benefits: ["Respiratory condition diagnosis", "Asthma management", "COPD treatment", "Sleep apnea consultation"]
    },
    { 
      title: "Ophthalmology", 
      icon: <FaEye className="text-4xl text-blue-500" />, 
      price: "$75",
      specialtyId: 3,
      description: "Discuss eye health, vision problems, and eye conditions with qualified ophthalmologists.",
      benefits: ["Vision assessment", "Eye condition diagnosis", "Treatment recommendations", "Prevention advice"]
    },
    { 
      title: "Pharmacology", 
      icon: <FaPills className="text-4xl text-blue-500" />, 
      price: "$65",
      specialtyId: 11,
      description: "Get professional advice on medications, drug interactions, and pharmaceutical concerns.",
      benefits: ["Medication review", "Drug interaction checking", "Side effect management", "Prescription guidance"]
    },
  ];

  // Find the category based on the `id`
  const category = categories.find((cat, index) => index.toString() === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Function to handle Start Consultation button click
  const handleStartConsultation = () => {
    navigate("/appointments", { state: { selectedSpecialty: category?.title } });
  };

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto min-h-screen p-8 flex items-center justify-center">
        <div className="bg-white shadow-lg p-8 rounded-lg text-center">
          <FaInfoCircle className="text-red-600 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Consultation Not Found</h2>
          <p className="text-gray-700 mb-6">The consultation you're looking for doesn't exist or may have been removed.</p>
          <Link to="/video" className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-600 transition">
            Back to Consultations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <span className="mx-2 text-gray-500">/</span>
        <Link to="/video" className="text-blue-600 hover:underline">Consultations</Link>
        <span className="mx-2 text-gray-500">/</span>
        <span className="text-gray-800">{category.title}</span>
      </div>
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-white p-4 rounded-full mr-4">
                {category.icon}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{category.title} Consultation</h1>
                <p className="text-xl opacity-90">Online Video Consultation</p>
              </div>
            </div>
            <div className="text-3xl font-bold bg-white text-blue-600 py-2 px-6 rounded-lg shadow-md">
              {category.price}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Description Section */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold mb-4">About This Consultation</h2>
              <p className="text-lg text-gray-700 mb-6">{category.description}</p>
              
              <h3 className="text-xl font-semibold mb-3">Benefits</h3>
              <ul className="mb-8">
                {category.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start mb-2">
                    <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">How It Works</h3>
                <ol className="space-y-4">
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">1</span>
                    <div className="text-gray-700">Book your appointment by selecting a convenient time slot</div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">2</span>
                    <div className="text-gray-700">Make a secure payment to confirm your booking</div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">3</span>
                    <div className="text-gray-700">Receive a confirmation email with your Zoom meeting link</div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">4</span>
                    <div className="text-gray-700">Join the video call at your scheduled time for your consultation</div>
                  </li>
                </ol>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleStartConsultation}
                  className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-md hover:bg-blue-700 transition flex items-center"
                >
                  <FaCalendarAlt className="mr-2" />
                  Book Appointment
                </button>
                
                {category.specialtyId && (
                  <Link
                    to={`/specialty/${category.specialtyId}`}
                    className="bg-white border border-blue-600 text-blue-600 font-semibold py-3 px-8 rounded-md hover:bg-blue-50 transition flex items-center"
                  >
                    <FaInfoCircle className="mr-2" />
                    Learn More About {category.title}
                  </Link>
                )}
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Consultation Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">30 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform:</span>
                    <span className="font-medium">Zoom</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Language:</span>
                    <span className="font-medium">English</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Follow-up:</span>
                    <span className="font-medium">Available</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
                <p className="text-gray-700 mb-4">
                  If you have any questions about the consultation process or need assistance, our support team is here to help.
                </p>
                <Link to="/HelpPage" className="text-blue-600 hover:underline flex items-center">
                  Contact Support <FaInfoCircle className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationDetail;