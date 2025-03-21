import React, { useEffect } from "react";
import Slider from "react-slick";
import { Link, useNavigate } from "react-router-dom";
import banner from "../assets/banner.jpg";
import { MdVerified, MdPictureAsPdf, MdOutlineMessage } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import {
  FaBrain,
  FaHeartbeat,
  FaHandHoldingMedical,
  FaStethoscope,
  FaUsers,
  FaLungs,
  FaEye,
  FaPills,
} from "react-icons/fa";

// Custom Arrow Components
const PrevArrow = ({ onClick }) => (
  <button
    className="absolute left-0 top-1/2 transform -translate-y-1/2 text-2xl cursor-pointer z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
    onClick={onClick}
  >
    <IoIosArrowBack />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-2xl cursor-pointer bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
    onClick={onClick}
  >
    <IoIosArrowForward />
  </button>
);

// Slider Settings
const settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  prevArrow: <PrevArrow />,
  nextArrow: <NextArrow />,
  responsive: [
    {
      breakpoint: 1024, // iPad Mini and similar devices
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 768, // Tablets
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480, // Mobile devices
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const VideoConsult = () => {
  const navigate = useNavigate();

  const handleBookSession = () => {
    navigate("/Appointments");
  };

  const categories = [
    {
      title: "General Physician",
      icon: <FaBrain className="text-4xl text-blue-500 mx-auto" />,
      price: "$50",
      specialtyId: 14,
    },
    {
      title: "Sexology",
      icon: <FaHeartbeat className="text-4xl text-blue-500 mx-auto" />,
      price: "$70",
      specialtyId: 2,
    },
    {
      title: "Dermatology",
      icon: <FaHandHoldingMedical className="text-4xl text-blue-500 mx-auto" />,
      price: "$60",
      specialtyId: 6,
    },
    {
      title: "Gynecology",
      icon: <FaStethoscope className="text-4xl text-blue-500 mx-auto" />,
      price: "$80",
      specialtyId: 4,
    },
    {
      title: "Cardiology",
      icon: <FaHeartbeat className="text-4xl text-blue-500 mx-auto" />,
      price: "$90",
      specialtyId: 10,
    },
    {
      title: "Psychiatry",
      icon: <FaUsers className="text-4xl text-blue-500 mx-auto" />,
      price: "$85",
      specialtyId: 15,
    },
    {
      title: "Pulmonology",
      icon: <FaLungs className="text-4xl text-blue-500 mx-auto" />,
      price: "$95",
      specialtyId: 19,
    },
    {
      title: "Ophthalmology",
      icon: <FaEye className="text-4xl text-blue-500 mx-auto" />,
      price: "$75",
      specialtyId: 3,
    },
    {
      title: "Pharmacology",
      icon: <FaPills className="text-4xl text-blue-500 mx-auto" />,
      price: "$65",
      specialtyId: 11,
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {/* Banner Section */}
      <div
        className="relative flex items-center justify-between py-10 px-4 md:h-[70vh] h-screen"
        style={{
          backgroundImage: `url(${banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Black Opacity Overlay */}
        <div className="absolute inset-0 bg-black opacity-60"></div>

        {/* Content (Text) */}
        <div className="relative flex-1 md:pl-24 text-white z-10">
          <span className="text-4xl md:text-6xl font-bold mb-2">
            Skip the travel!
          </span>
          <br />
          <span className="text-2xl md:text-4xl leading-14 font-bold mb-2">
            Take Online Doctor Consultation
          </span>
          <p className="text-sm md:text-lg mb-4 md:w-1/2">
            Get expert advice from the comfort of your home. Schedule a video
            consultation with our professionals and receive personalized guidance.
          </p>
          <button
            onClick={handleBookSession}
            className="text-white bg-blue-500 font-semibold py-2 px-6 rounded-md hover:bg-blue-600 hover:text-white transition transform hover:scale-105"
          >
            Book a Session
          </button>
          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <span className="flex gap-2 items-center">
              <MdVerified className="text-blue-500 text-xl" />
              Verified Doctors
            </span>
            <span className="flex gap-2 items-center">
              <MdPictureAsPdf className="text-blue-500 text-xl" />
              Digital Prescription
            </span>
            <span className="flex gap-2 items-center">
              <MdOutlineMessage className="text-blue-500 text-xl" />
              Followup
            </span>
          </div>
        </div>
      </div>

      {/* Categories Slider Section */}
      <div className="py-16 px-4 bg-gray-50 mx-2 md:px-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-left">
          Available Consultations
        </h2>
        <span className="text-base md:text-lg font-semibold text-left text-slate-500">
          Consult with top doctors across specialities
        </span>
        <Slider {...settings}>
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-4 md:p-6 flex flex-col mt-10 items-center mx-auto justify-between transform hover:scale-105 transition-transform duration-300"
            >
              <div className="mb-4 mx-auto">{category.icon}</div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-center">
                {category.title}
              </h3>
              <p className="text-base md:text-lg text-blue-500 mb-4 text-center">
                {category.price}
              </p>
              {category.specialtyId ? (
                <Link to={`/specialty/${category.specialtyId}`}>
                  <button className="bg-blue-500 text-white font-semibold py-2 px-4 md:px-6 rounded-md hover:bg-blue-600 transition transform hover:scale-105 w-full">
                    View Details
                  </button>
                </Link>
              ) : (
                <Link to={`/consultation/${index}`}>
                  <button className="bg-blue-500 text-white font-semibold py-2 px-4 md:px-6 rounded-md hover:bg-blue-600 transition transform hover:scale-105 w-full">
                    Consult Now
                  </button>
                </Link>
              )}
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default VideoConsult;