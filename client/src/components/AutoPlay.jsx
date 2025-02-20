import React from "react";
import Slider from "react-slick";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// Custom arrow components
const PrevArrow = ({ onClick }) => (
  <button
    className="absolute left-0 top-1/2 transform -translate-y-1/2 text-4xl text-slate-500"
    onClick={onClick}
  >
    <IoIosArrowBack /> {/* You can replace this with any icon or custom content */}
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-4xl text-slate-500"
    onClick={onClick}
  >
    <IoIosArrowForward /> {/* You can replace this with any icon or custom content */}
  </button>
);

const AutoPlay = ({ slides, settings }) => {
  // Default settings if no custom settings are provided
  const defaultSettings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 3000,
    cssEase: "linear",
    prevArrow: <PrevArrow />, // Custom left arrow
    nextArrow: <NextArrow />, // Custom right arrow
    ...settings, // Merge default settings with custom settings if provided
  };

  return (
    <div className="px-4 mx-10 py-10 relative">
      <Slider {...defaultSettings}>
        {/* Map over the slides data (reviews) and render each review */}
        {slides.map((review, index) => (
          <div key={index} className="p-4">
            <div className="w-1/2 mx-auto p-6 ">
              <h3 className="text-xl font-semibold text-center mb-4">{review.name}</h3>
              <p className="text-center text-gray-600">{review.review}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default AutoPlay;
