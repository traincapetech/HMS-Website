import React, { useState, useEffect } from 'react'
import { ArrowRight, ArrowLeft } from 'lucide-react'

function HealthConcern() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [cardsToShow, setCardsToShow] = useState(3);

  const healthConcerns = [
    {
      title: "Cough & Cold",
      image: "assests/video/health-concerns/cough-and-cold.jpeg",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Skin Problems",
      image: "assests/video/health-concerns/skin-problems.jpeg",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Headache",
      image: "assests/video/health-concerns/headache.jpeg",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Fever",
      image: "assests/video/health-concerns/fever.jpeg",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      title: "Mental Health",
      image: "assests/video/health-concerns/mental-health.jpeg",
      bgColor: "bg-teal-50",
      iconColor: "text-teal-600",
    },
    {
      title: "Period Problems",
      image: "assests/video/health-concerns/period-problems.jpeg",
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600",
    },
    {
      title: "Sexual Performance",
      image: "assests/video/health-concerns/sexual-performance.jpeg",
      bgColor: "bg-rose-50",
      iconColor: "text-rose-600",
    },
    {
      title: "Vaginal Health",
      image: "assests/video/health-concerns/vaginal-health.jpeg",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      title: "Weight Management",
      image: "assests/video/health-concerns/weight-management.jpeg",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Hair & Scalp",
      image: "assests/video/health-concerns/hair-and-scalp.jpeg",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Digestive Issues",
      image: "assests/video/health-concerns/digestive-issues.jpeg",
      bgColor: "bg-lime-50",
      iconColor: "text-lime-600",
    },
    {
      title: "Sleep Disorders",
      image: "assests/video/health-concerns/sleep-disorders.jpeg",
      bgColor: "bg-cyan-50",
      iconColor: "text-cyan-600",
    }
  ];

  // Responsive cards calculation
  useEffect(() => {
    const calculateCardsToShow = () => {
      const width = window.innerWidth;
      if (width >= 1280) return 4; // Extra large screens
      if (width >= 1024) return 3; // Large screens
      if (width >= 768) return 2; // Medium screens
      return 1; // Small screens
    };

    const handleResize = () => {
      setCardsToShow(calculateCardsToShow());
    };

    // Set initial cards to show
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + cardsToShow) % healthConcerns.length
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 
        ? healthConcerns.length - (healthConcerns.length % cardsToShow || cardsToShow)
        : Math.max(0, prevIndex - cardsToShow)
    );
  };

  // Get the cards to display
  const displayedConcerns = healthConcerns.slice(
    currentIndex, 
    currentIndex + cardsToShow
  );

  return (
    <div className="relative w-full max-w-7xl mx-auto">
      <div className="relative px-4 md:px-10">
        {/* Navigation Buttons - Positioned outside the cards */}
        <div className="absolute top-1/2 -left-10 -translate-y-1/2 z-20 hidden md:block">
          <button 
            onClick={handlePrev}
            className="
              bg-white/50 
              hover:bg-white/75 
              rounded-full 
              p-2 
              shadow-md
              z-20
              relative
            "
          >
            <ArrowLeft className="h-5 w-5 md:h-6 md:w-6 text-gray-700" />
          </button>
        </div>
        <div className="absolute top-1/2 -right-10 -translate-y-1/2 z-20 hidden md:block">
          <button 
            onClick={handleNext}
            className="
              bg-white/50 
              hover:bg-white/75 
              rounded-full 
              p-2 
              shadow-md
              z-20
              relative
            "
          >
            <ArrowRight className="h-5 w-5 md:h-6 md:w-6 text-gray-700" />
          </button>
        </div>

        {/* Mobile Navigation - Positioned within the container */}
        <div className="flex md:hidden justify-between absolute inset-0 items-center z-20 pointer-events-none">
          <button 
            onClick={handlePrev}
            className="
              bg-white/50 
              hover:bg-white/75 
              rounded-full 
              p-2 
              m-2 
              shadow-md
              pointer-events-auto
            "
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <button 
            onClick={handleNext}
            className="
              bg-white/50 
              hover:bg-white/75 
              rounded-full 
              p-2 
              m-2 
              shadow-md
              pointer-events-auto
            "
          >
            <ArrowRight className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* Cards Container */}
        <div className="flex space-x-4 overflow-hidden">
          {displayedConcerns.map((concern, index) => (
            <div
              key={index}
              className={`
                flex-shrink-0 
                w-full 
                md:w-1/2 
                lg:w-1/3 
                xl:w-1/4 
                p-2
                ${concern.bgColor} 
                rounded-xl 
                overflow-hidden 
                transform 
                transition-all 
                duration-300 
                hover:-translate-y-2 
                hover:shadow-2xl 
                border 
                border-gray-100
                group
                relative
                z-10
              `}
              onMouseEnter={() => setHoveredIndex(currentIndex + index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative h-48 md:h-60 overflow-hidden">
                <img
                  src={concern.image || "/placeholder.svg"}
                  alt={concern.title}
                  className={`
                    absolute 
                    inset-0 
                    w-full 
                    h-full 
                    object-cover 
                    transition-all 
                    duration-300
                    brightness-90 
                    ${hoveredIndex === (currentIndex + index)
                      ? 'scale-105 brightness-100' 
                      : 'scale-100 brightness-90'
                    }
                  `}
                />
              </div>
              <div className="p-3 md:p-5">
                <h3
                  className={`
                    font-semibold 
                    text-base 
                    md:text-lg 
                    mb-2 
                    md:mb-3 
                    ${concern.iconColor}
                    group-hover:opacity-80
                    transition-opacity
                  `}
                >
                  {concern.title}
                </h3>
                <button
                  className={`
                    ${concern.iconColor} 
                    flex 
                    items-center 
                    gap-2 
                    font-medium 
                    text-sm 
                    md:text-base
                    hover:underline 
                    transition-colors
                    group-hover:opacity-80
                  `}
                >
                  Consult now
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5 transform transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HealthConcern