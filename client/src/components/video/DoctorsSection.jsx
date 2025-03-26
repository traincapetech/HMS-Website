import React from "react";
import { BadgeCheck, MapPin, Clock } from "lucide-react";
function DoctorsSection() {
  const doctors = [
    {
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      experience: "10+ years",
      image: "assests/video/doctors/doctor1.jpeg",
      background: "bg-blue-50",
      accentColor: "text-blue-600",
    },
    {
      name: "Dr. Michael Chen",
      specialty: "Dermatologist",
      experience: "8+ years",
      image: "assests/video/doctors/doctor2.jpeg",
      background: "bg-green-50",
      accentColor: "text-green-600",
    },
    {
      name: "Dr. Emily Rodriguez",
      specialty: "Psychiatrist",
      experience: "12+ years",
      image: "assests/video/doctors/doctor3.jpeg",
      background: "bg-purple-50",
      accentColor: "text-purple-600",
    },
  ];
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {doctors.map((doctor, index) => (
          <div
            key={index}
            className={`
              ${doctor.background} 
              rounded-2xl 
              overflow-hidden 
              border 
              border-gray-100 
              shadow-sm 
              transform 
              transition-all 
              duration-300 
              hover:-translate-y-2 
              hover:shadow-2xl
            `}
          >
            <div className="p-6">
              <div className="flex items-center gap-5 mb-6">
                <div className="relative">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-white"
                  />
                  <BadgeCheck
                    className={`
                      absolute 
                      -bottom-1 
                      -right-1 
                      ${doctor.accentColor} 
                      w-6 
                      h-6 
                      bg-white 
                      rounded-full
                    `}
                  />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${doctor.accentColor}`}>
                    {doctor.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{doctor.specialty}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">
                    {doctor.experience} Experience
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">
                    Available for Online Consultation
                  </span>
                </div>
              </div>

              <button
                className={`
                  w-full 
                  ${doctor.accentColor} 
                  bg-opacity-10 
                  border 
                  ${`border-${doctor.accentColor.replace("text-", "")}`} 
                  py-3 
                  rounded-lg 
                  font-semibold 
                  hover:bg-opacity-20 
                  transition-all 
                  duration-300
                `}
              >
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorsSection;
