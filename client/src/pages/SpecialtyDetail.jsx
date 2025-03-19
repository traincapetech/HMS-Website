// SpecialtyDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { specialties } from '../components/Specialties';
import { FaUser, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';

const SpecialtyDetail = () => {
  const { id } = useParams(); // Get the id from the URL params
  const specialty = specialties.find((spec) => spec.id === parseInt(id)); // Find the specialty by its id
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Sample doctors data for this specialty
  const specialtyDoctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: specialty ? specialty.name : '',
      experience: "15 years",
      location: "New York Medical Center",
      rating: 4.8,
      image: "https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg",
      availability: "Available Today",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: specialty ? specialty.name : '',
      experience: "12 years",
      location: "City Hospital",
      rating: 4.7,
      image: "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg",
      availability: "Next Available: Tomorrow",
    },
  ];

  // Sample content for different specialties
  const specialtyContent = {
    "Covid Treatment": {
      description: "COVID-19 treatment varies based on the severity of your symptoms. For those with mild symptoms, treatment may include rest, hydration, and over-the-counter medications to reduce fever and pain. For more severe cases, hospitalization and advanced medical care may be necessary.",
      commonConditions: ["COVID-19 infection", "Post-COVID syndrome", "Respiratory complications", "Secondary infections"],
      treatments: ["Antiviral medications", "Monoclonal antibody therapy", "Oxygen therapy", "Supportive care"],
    },
    "Sexual Health": {
      description: "Sexual health specialists diagnose and treat conditions affecting reproductive health and sexual function in both men and women, providing comprehensive care for intimate health concerns.",
      commonConditions: ["Erectile dysfunction", "Sexually transmitted infections", "Fertility issues", "Sexual dysfunction"],
      treatments: ["Medication therapy", "Behavioral therapy", "Surgical interventions", "Preventive care"],
    },
    "Eye Specialist": {
      description: "Ophthalmologists diagnose and treat diseases and disorders of the eye. They perform eye exams, prescribe glasses and contact lenses, and treat eye conditions such as glaucoma, cataracts, and macular degeneration.",
      commonConditions: ["Cataracts", "Glaucoma", "Macular degeneration", "Diabetic retinopathy", "Dry eye syndrome"],
      treatments: ["Corrective lenses", "Eye drops and medications", "Laser therapy", "Eye surgery"],
    },
    "Womens Health": {
      description: "Women's health specialists focus on health concerns specific to women, including reproductive health, pregnancy, menopause, and conditions affecting female organs.",
      commonConditions: ["Pregnancy", "Menopause", "Polycystic ovary syndrome", "Endometriosis", "Breast health issues"],
      treatments: ["Preventive screenings", "Hormonal therapy", "Surgical procedures", "Fertility treatments"],
    },
    "Diet & Nutrition": {
      description: "Nutritionists and dietitians help patients develop healthy eating habits, manage chronic diseases through diet, and address nutritional deficiencies.",
      commonConditions: ["Obesity", "Diabetes", "Food allergies", "Malnutrition", "Eating disorders"],
      treatments: ["Personalized meal plans", "Nutritional counseling", "Dietary supplementation", "Medical nutrition therapy"],
    },
    // Default content for other specialties
    "default": {
      description: "This medical specialty focuses on diagnosis, treatment, and prevention of diseases and conditions related to this field. Our specialists use advanced techniques and technologies to provide comprehensive care.",
      commonConditions: ["Various acute and chronic conditions", "Preventable diseases", "Inherited disorders", "Age-related conditions"],
      treatments: ["Medical treatment", "Surgical procedures", "Preventive care", "Follow-up management"],
    }
  };

  // Get content for the current specialty or use default
  const getSpecialtyContent = () => {
    if (!specialty) return specialtyContent.default;
    return specialtyContent[specialty.name] || specialtyContent.default;
  };

  const content = getSpecialtyContent();

  const handleBookAppointment = () => {
    setLoading(true);
    setTimeout(() => {
      navigate('/Appointments', { state: { selectedSpecialty: specialty ? specialty.name : '' } });
      setLoading(false);
    }, 500);
  };

  if (!specialty) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Specialty Not Found</h2>
          <p className="text-gray-600 mb-6">The specialty you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="inline-flex items-center px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-700">
            <FaArrowLeft className="mr-2" /> Return Home
          </Link>
        </div>
      </div>
    );
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Link to="/" className="text-red-800 hover:text-red-700">Home</Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-600">Specialties</span>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-800">{specialty.name}</span>
        </div>

        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-red-800 to-red-600 py-6 px-8">
            <div className="flex items-center justify-center">
              <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center">
                <span className="text-5xl text-red-800">
                  {specialty.icon}
                </span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-center text-white mt-4">{specialty.name}</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">About {specialty.name}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{content.description}</p>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">Common Conditions</h3>
              <ul className="list-disc pl-6 mb-4">
                {content.commonConditions.map((condition, index) => (
                  <li key={index} className="text-gray-700 mb-1">{condition}</li>
                ))}
              </ul>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">Treatments</h3>
              <ul className="list-disc pl-6">
                {content.treatments.map((treatment, index) => (
                  <li key={index} className="text-gray-700 mb-1">{treatment}</li>
                ))}
              </ul>
            </div>

            {/* Doctors Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Top Doctors in {specialty.name}</h2>
                <Link to="/doctor" className="text-red-800 hover:text-red-700 font-medium">View All</Link>
              </div>
              
              <div className="space-y-6">
                {specialtyDoctors.map((doctor) => (
                  <div key={doctor.id} className="flex flex-col md:flex-row border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <img 
                      src={doctor.image} 
                      alt={doctor.name} 
                      className="w-24 h-24 rounded-full object-cover mx-auto md:mx-0 mb-4 md:mb-0 md:mr-6"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{doctor.name}</h3>
                      <p className="text-gray-600 mb-2">{doctor.specialty} • {doctor.experience} experience</p>
                      <p className="text-gray-600 mb-2">{doctor.location}</p>
                      <div className="flex items-center mb-4">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span className="font-medium">{doctor.rating}</span>
                      </div>
                      <p className="text-green-600 font-medium">{doctor.availability}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Appointment & FAQs */}
          <div className="space-y-6">
            {/* Appointment Box */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-red-800">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Need a consultation?</h3>
              <p className="text-gray-600 mb-6">Book an appointment with a top {specialty.name} specialist today.</p>
              
              <div className="space-y-4">
                <button 
                  onClick={handleBookAppointment}
                  className="w-full flex justify-center items-center bg-red-800 text-white py-3 px-4 rounded-md hover:bg-red-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : (
                    <>
                      <FaCalendarAlt className="mr-2" />
                      Book Appointment
                    </>
                  )}
                </button>
                
                <Link 
                  to="/video" 
                  className="w-full flex justify-center items-center bg-white text-red-800 border border-red-800 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <FaUser className="mr-2" />
                  Virtual Consultation
                </Link>
              </div>
            </div>
            
            {/* FAQs Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">How do I prepare for my appointment?</h4>
                  <p className="text-gray-600">Bring your medical records, list of medications, and prepare questions for your doctor.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">What insurance is accepted?</h4>
                  <p className="text-gray-600">Most specialists accept major insurance plans. Contact the doctor's office for specific details.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">How long will my appointment last?</h4>
                  <p className="text-gray-600">First consultations typically last 30-60 minutes, while follow-ups are usually 15-30 minutes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
  
export default SpecialtyDetail;