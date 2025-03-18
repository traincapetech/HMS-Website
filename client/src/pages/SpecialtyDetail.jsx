// SpecialtyDetail.jsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { specialties } from '../components/Specialties';

const SpecialtyDetail = () => {
    const { id } = useParams(); // Get the id from the URL params
    const specialty = specialties.find((spec) => spec.id === parseInt(id)); // Find the specialty by its id
  
    if (!specialty) {
      return <div>Specialty not found</div>;
    }
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <div className="text-5xl text-blue-500 mb-4">{specialty.icon}</div>
          <h2 className="text-4xl font-bold text-gray-800">{specialty.name}</h2>
        </div>
  
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-2xl font-medium text-gray-900">About {specialty.name}</h3>
          <p className="mt-4 text-lg text-gray-700">
            Here you can add detailed information about the specialty: 
            its treatment methods, common conditions treated, doctors, and other relevant details.
          </p>
          {/* You can customize this content with actual details for each specialty */}
        </div>
      </div>
    );
  };
  
  export default SpecialtyDetail;