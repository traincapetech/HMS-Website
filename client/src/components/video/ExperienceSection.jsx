import React from 'react';
import { Play, Eye } from 'lucide-react';

const ExperienceSection = () => {
  const experiences = [
    {
      title: "Pediatric Consultation",
      image:"assests/video/experience/pediatric-consultation.jpeg",
      background: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Dermatology Consultation",
      image: "assests/video/experience/dermatology-consultation.jpeg",
      background: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      title: "General Physician Consultation",
      image: "assests/video/experience/physician-consultation.jpeg",
      background: "bg-purple-50",
      iconColor: "text-purple-600"
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {experiences.map((experience, index) => (
          <div 
            key={index} 
            className={`
              ${experience.background}
              rounded-2xl 
              overflow-hidden 
              shadow-sm 
              transform 
              transition-all 
              duration-300 
              hover:-translate-y-2 
              hover:shadow-2xl 
              border 
              border-gray-100
            `}
          >
            <div className="relative h-56 overflow-hidden group">
              <img
                src={experience.image}
                alt={experience.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className={`
                  h-16 
                  w-16 
                  rounded-full 
                  bg-white 
                  bg-opacity-90 
                  flex 
                  items-center 
                  justify-center 
                  cursor-pointer 
                  ${experience.iconColor}
                  hover:scale-110 
                  transition-transform
                `}>
                  <Play className="h-8 w-8 fill-current opacity-80" />
                </div>
              </div>
            </div>
            
            <div className="p-5">
              <h3 className={`
                font-semibold 
                text-lg 
                ${experience.iconColor}
              `}>
                {experience.title}
              </h3>
              <div className="mt-3 flex items-center gap-2">
                <Eye className={`w-5 h-5 ${experience.iconColor} opacity-70`} />
                <span className="text-sm text-gray-600">View Consultation Details</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceSection;