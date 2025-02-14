import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="flex justify-between items-center bg-red-800 p-4">
      {/* Logo */}
      <div className="text-white flex items-center space-x-1">
        <a href="/" className="font-extrabold text-white text-4xl py-4 md:px-20">
          TAMD.
        </a>
        <div className="hidden md:flex text-white space-x-6 text-lg cursor-pointer ">
          <a className="border-b-2 border-transparent hover:border-white transition-colors duration-300">
            Find Doctor
          </a>
          <a className="border-b-2 border-transparent hover:border-white transition-colors duration-300">
            Video Consult
          </a>
          <a className="border-b-2 border-transparent hover:border-white transition-colors duration-300">
            Surgeries
          </a>
        </div>
      </div>

      {/* Desktop Right-side links */}
      <div className="hidden md:flex space-x-7 text-white items-center pr-8 cursor-pointer">
        <Link to="/doctorPage">
        <span className="border-b-2 border-transparent hover:border-white transition-colors duration-300">
          For Doctor
        </span>
        </Link>
        <Link to="/corporate">
        <span className="border-b-2 border-transparent hover:border-white transition-colors duration-300">
          For Corporate
        </span>
        </Link>
        <a className="border-b-2 border-transparent hover:border-white transition-discrete duration-300">
          Help
        </a>

        {/* Use Link component for navigation */}
        <Link to="/login">
          <button className="text-white border px-4 py-1 rounded-2xl hover:bg-white hover:text-red-700">
            Login
          </button>
        </Link>
        <Link to="/signup">
        <button className="text-white border px-4 py-1 rounded-2xl hover:bg-white hover:text-red-700">
          Sign Up
        </button>
        </Link>
      </div>

      {/* Hamburger Icon for Mobile */}
      <div className="md:hidden flex items-center">
        <button onClick={toggleMenu} className="text-white text-2xl">
          &#9776;
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } absolute z-20 top-20 left-0 w-full bg-red-800 h-screen text-white p-6 space-y-4 md:hidden`}
      >
        <div className="space-y-2 flex-col border-b flex">
          <a href="#">Find Doctor</a>
          <a href="#">Video Consult</a>
          <a href="#">Surgeries</a>
        </div>
        <div className="space-y-2 mt-4 flex border-b  flex-col">
        <Link to="/doctorRegister">
        <span className="border-b-2 border-transparent hover:border-white transition-colors duration-300">
          For Doctor
        </span>
        </Link>
          <a href="#">For Corporate</a>
          <a href="#">Help</a>
        </div>
        <div className="mt-4 flex flex-col space-y-2">
          {/* Mobile Login link */}
          <Link to="/login">
            <button className="text-white border px-4 py-1 rounded-2xl hover:bg-white hover:text-red-700">
              Login
            </button>
          </Link>
          <Link to="/signup">
          <button className="text-white border px-4 py-1 rounded-2xl hover:bg-white hover:text-red-700">
            Sign Up
          </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
