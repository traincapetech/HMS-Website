import React, { useEffect } from "react";
import {
  FaUserMd,
  FaHeartbeat,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaChartLine,
  FaMobile,
  FaShieldAlt,
  FaUserFriends,
  FaLaptopMedical,
  FaClipboardList,
  FaComments,
  FaStar,
  FaCheck,
  FaArrowRight
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import doctorImage from "../assets/TAMD.png"; // Replace with a relevant doctor image

const DoctorPage = () => {
  const navigate = useNavigate();

  const handleJoinAsDoctor = () => {
    navigate("/doctor/register");
  };

  const benefits = [
    {
      id: 1,
      icon: <FaUserFriends className="w-12 h-12 text-blue-500 mx-auto" />,
      title: "Expand Your Patient Base",
      description: "Connect with thousands of patients seeking medical expertise in your specialty area."
    },
    {
      id: 2,
      icon: <FaMoneyBillWave className="w-12 h-12 text-green-500 mx-auto" />,
      title: "Increase Your Revenue",
      description: "Our platform offers competitive rates with timely payments and zero overhead costs."
    },
    {
      id: 3,
      icon: <FaCalendarAlt className="w-12 h-12 text-red-500 mx-auto" />,
      title: "Flexible Scheduling",
      description: "Practice on your terms - set your own availability and maintain work-life balance."
    },
    {
      id: 4,
      icon: <FaLaptopMedical className="w-12 h-12 text-purple-500 mx-auto" />,
      title: "Digital Healthcare Tools",
      description: "Access to state-of-the-art telemedicine platform, digital prescriptions, and medical record management."
    },
    {
      id: 5,
      icon: <FaShieldAlt className="w-12 h-12 text-yellow-500 mx-auto" />,
      title: "Secure Platform",
      description: "HIPAA-compliant platform with end-to-end encryption ensuring patient data security."
    },
    {
      id: 6,
      icon: <FaChartLine className="w-12 h-12 text-indigo-500 mx-auto" />,
      title: "Professional Growth",
      description: "Connect with peers, access continuing medical education, and grow your professional network."
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      specialty: "Cardiologist",
      image: "https://ui-avatars.com/api/?name=Priya+Sharma&background=random&color=fff",
      stars: 5,
      quote: "Joining TAMD has transformed my practice. I've connected with patients across the country and increased my income by 35% while maintaining full control of my schedule."
    },
    {
      id: 2,
      name: "Dr. Rajiv Patel",
      specialty: "Pediatrician",
      image: "https://ui-avatars.com/api/?name=Rajiv+Patel&background=random&color=fff",
      stars: 5,
      quote: "The platform is intuitive and the support team is excellent. I've been able to help patients even during the pandemic, maintaining continuity of care when it was most needed."
    },
    {
      id: 3,
      name: "Dr. Ananya Reddy",
      specialty: "Dermatologist",
      image: "https://ui-avatars.com/api/?name=Ananya+Reddy&background=random&color=fff",
      stars: 5,
      quote: "TAMD has helped me build a nationwide reputation. The digital tools are fantastic, especially the diagnostic image sharing feature which is essential for my specialty."
    }
  ];

  const stats = [
    { id: 1, value: "20,000+", label: "Patient Consultations Monthly" },
    { id: 2, value: "1,500+", label: "Doctors Nationwide" },
    { id: 3, value: "4.8/5", label: "Average Doctor Rating" },
    { id: 4, value: "30%", label: "Average Revenue Increase" }
  ];

  const howItWorks = [
    { id: 1, title: "Register", description: "Complete your profile with qualifications and specialties." },
    { id: 2, title: "Verification", description: "Our team verifies your credentials within 48 hours." },
    { id: 3, title: "Set Schedule", description: "Define your availability for in-person or virtual consultations." },
    { id: 4, title: "Start Practice", description: "Begin receiving patient bookings and conducting consultations." }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-800 to-red-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Grow Your Practice with TAMD</h1>
            <p className="text-xl mb-8">Join thousands of doctors who've expanded their practice, increased their income, and made quality healthcare more accessible.</p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleJoinAsDoctor}
                className="bg-white text-red-800 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition duration-300 text-lg flex items-center"
              >
                Join as a Doctor <FaArrowRight className="ml-2" />
              </button>
              <a href="#how-it-works" className="border-2 border-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-red-800 transition duration-300 text-lg">
                Learn More
              </a>
            </div>
          </div>
          <div className="lg:w-2/5">
            <img 
              src={doctorImage} 
              alt="Doctor using telehealth platform" 
              className="rounded-lg shadow-2xl w-full h-auto max-w-md mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map(stat => (
              <div key={stat.id} className="bg-red-50 p-6 rounded-lg">
                <h3 className="text-3xl md:text-4xl font-bold text-red-800">{stat.value}</h3>
                <p className="text-gray-700 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gray-50" id="benefits">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Doctors Choose TAMD</h2>
            <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
              Our platform is designed by doctors, for doctors, to make your practice more efficient and rewarding.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map(benefit => (
              <div key={benefit.id} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                {benefit.icon}
                <h3 className="text-xl font-semibold mt-4 text-center">{benefit.title}</h3>
                <p className="text-gray-600 mt-2 text-center">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-white" id="how-it-works">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How It Works</h2>
            <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
              Getting started with TAMD is simple and straightforward
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {howItWorks.map((step, index) => (
              <div key={step.id} className="relative">
                <div className="bg-red-800 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
                  {step.id}
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-red-200"></div>
                )}
                <h3 className="text-xl font-semibold text-center mb-2">{step.title}</h3>
                <p className="text-gray-600 text-center">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Doctors Say</h2>
            <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
              Hear from medical professionals who have transformed their practice with TAMD
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="bg-white p-8 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                    <p className="text-gray-600">{testimonial.specialty}</p>
                    <div className="flex text-yellow-400 mt-1">
                      {[...Array(testimonial.stars)].map((_, i) => (
                        <FaStar key={i} className="mr-1" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features/Specialties Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Platform Features</h2>
            <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
              Everything you need to deliver exceptional care and grow your practice
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <FaCalendarAlt className="text-red-800 text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Smart Scheduling</h3>
                <p className="text-gray-600 mt-2">Integrated calendaring system with automated reminders to reduce no-shows.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <FaLaptopMedical className="text-red-800 text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">HD Video Consultations</h3>
                <p className="text-gray-600 mt-2">Secure, high-definition video platform optimized for medical consultations.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <FaClipboardList className="text-red-800 text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Digital Prescriptions</h3>
                <p className="text-gray-600 mt-2">E-prescribing system connected to pharmacies nationwide.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <FaMobile className="text-red-800 text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Mobile App Access</h3>
                <p className="text-gray-600 mt-2">Practice on the go with our dedicated doctor mobile application.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <FaComments className="text-red-800 text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Follow-up Care</h3>
                <p className="text-gray-600 mt-2">Secure messaging system for post-consultation care and clarifications.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <FaHeartbeat className="text-red-800 text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Specialty Support</h3>
                <p className="text-gray-600 mt-2">Specialized tools and interfaces for different medical specialties.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-800 to-red-600 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Practice?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join the TAMD network of medical professionals and start expanding your practice today.
          </p>
          <button 
            onClick={handleJoinAsDoctor}
            className="bg-white text-red-800 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition duration-300 text-lg"
          >
            Join as a Doctor
          </button>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-left">
            <div className="flex items-center">
              <FaCheck className="text-white mr-2" />
              <span>Free registration</span>
            </div>
            <div className="flex items-center">
              <FaCheck className="text-white mr-2" />
              <span>Verified profile badge</span>
            </div>
            <div className="flex items-center">
              <FaCheck className="text-white mr-2" />
              <span>24/7 support</span>
            </div>
            <div className="flex items-center">
              <FaCheck className="text-white mr-2" />
              <span>No long-term contracts</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorPage;