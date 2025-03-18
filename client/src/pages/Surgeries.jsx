import React, { useEffect, useState } from 'react';

const Surgeries = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const surgeryCategories = [
    'All',
    'Orthopedic',
    'Cardiac',
    'Neurosurgery',
    'General',
    'Cosmetic',
    'Eye',
    'Dental'
  ];

  const surgeries = [
    {
      id: 1,
      name: "Knee Replacement",
      category: "Orthopedic",
      description: "Total or partial knee replacement surgery to treat severe arthritis or injury",
      duration: "2-3 hours",
      recovery: "4-6 weeks",
      cost: "$15,000 - $25,000",
      image: "https://img.freepik.com/free-photo/knee-joint-replacement-implant-xray-image_1048-11419.jpg",
    },
    {
      id: 2,
      name: "Heart Bypass",
      category: "Cardiac",
      description: "Coronary artery bypass grafting (CABG) to improve blood flow to the heart",
      duration: "3-6 hours",
      recovery: "6-12 weeks",
      cost: "$30,000 - $50,000",
      image: "https://img.freepik.com/free-photo/doctor-examining-patient-with-stethoscope_1170-2363.jpg",
    },
    {
      id: 3,
      name: "Lasik Eye Surgery",
      category: "Eye",
      description: "Laser eye surgery to correct vision problems like myopia and hyperopia",
      duration: "30 minutes",
      recovery: "1-2 weeks",
      cost: "$2,000 - $3,000",
      image: "https://img.freepik.com/free-photo/ophthalmologist-checking-patient-s-vision-clinic_1170-2095.jpg",
    },
    {
      id: 4,
      name: "Appendectomy",
      category: "General",
      description: "Surgical removal of the appendix to treat appendicitis",
      duration: "1-2 hours",
      recovery: "2-4 weeks",
      cost: "$8,000 - $12,000",
      image: "https://img.freepik.com/free-photo/surgery-room_1170-2199.jpg",
    },
  ];
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const filteredSurgeries = selectedCategory === 'All' 
    ? surgeries 
    : surgeries.filter(surgery => surgery.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Surgical Procedures</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Explore our comprehensive range of surgical procedures performed by experienced surgeons using state-of-the-art technology.
        </p>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-wrap justify-center gap-4">
          {surgeryCategories.map((category) => (
            <button
              key={category}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                selectedCategory === category
                  ? 'bg-red-800 text-white'
                  : 'bg-white text-gray-700 hover:bg-red-100'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Surgeries Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSurgeries.map((surgery) => (
          <div key={surgery.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="h-48 overflow-hidden">
              <img
                src={surgery.image}
                alt={surgery.name}
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{surgery.name}</h3>
                  <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mt-1">
                    {surgery.category}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Starting from</p>
                  <p className="text-lg font-semibold text-red-800">{surgery.cost.split(' ')[0]}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">{surgery.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                <div>
                  <p className="font-medium">Duration</p>
                  <p>{surgery.duration}</p>
                </div>
                <div>
                  <p className="font-medium">Recovery Time</p>
                  <p>{surgery.recovery}</p>
                </div>
              </div>
              <button className="w-full bg-red-800 text-white py-2 rounded-lg hover:bg-red-700 transition-colors duration-300">
                Learn More & Book Consultation
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Surgeries; 