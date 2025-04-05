import React from 'react';
import {   Search, 
    Stethoscope, 
    Shield, 
    HeartPulse, 
    Clipboard, 
    FileText , ArrowRight } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      title: "Symptom Analysis",
      description: "Select a speciality or symptom",
      icon: Search,
      color: "blue",
      gradient: "from-blue-50 to-blue-100"
    },
    {
      title: "Expert Diagnosis",
      description: "Connect with your doctor through our secure video platform",
      icon: Stethoscope,
      color: "green",
      gradient: "from-green-50 to-green-100"
    },
    {
      title: "Comprehensive Care",
      description: "Get a digital prescription & a free follow-up",
      icon: HeartPulse,
      color: "purple",
      gradient: "from-purple-50 to-purple-100"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          How Our Consultation Works
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We've simplified the healthcare consultation process to make it easy, convenient, and accessible.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div 
              key={index} 
              className={`
                bg-gradient-to-br 
                ${step.gradient}
                rounded-2xl 
                p-6 
                text-center 
                transform 
                transition-all 
                duration-300 
                hover:-translate-y-2 
                hover:shadow-2xl 
                border 
                border-gray-100
                relative
                overflow-hidden
              `}
            >
              {/* Step Number */}
              <div className={`
                absolute 
                top-4 
                left-4 
                text-4xl 
                font-bold 
                opacity-10 
                text-${step.color}-600
              `}>
                0{index + 1}
              </div>

              {/* Icon */}
              <div className={`
                mx-auto 
                w-20 
                h-20 
                mb-6 
                rounded-full 
                bg-white 
                shadow-md 
                flex 
                items-center 
                justify-center
                transform 
                transition-transform 
                group-hover:scale-110
              `}>
                <Icon className={`h-10 w-10 text-${step.color}-600`} />
              </div>

              {/* Content */}
              <h3 className={`text-xl font-semibold mb-3 text-${step.color}-800`}>
                {step.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {step.description}
              </p>

              {/* Learn More Link */}
              <button className={`
                flex 
                items-center 
                gap-2 
                mx-auto 
                text-${step.color}-600 
                hover:text-${step.color}-800 
                transition-colors
              `}>
                Learn More
                <ArrowRight className="h-5 w-5 transform transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HowItWorksSection;