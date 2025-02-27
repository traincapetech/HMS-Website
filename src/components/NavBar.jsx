// NavBar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import UserProfile from "./UserProfile"; // Import UserProfile component

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, token } = useSelector((state) => state.user);
  const profileRef = useRef(null); // Ref for profile button and dropdown
  const profileButtonRef = useRef(null); // Ref for the profile button


  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Close the profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="flex justify-between items-center bg-red-800 p-4">
      {/* Logo */}
      <div className="text-white flex items-center space-x-1">
        <a href="/" className="font-extrabold text-white text-4xl py-4 md:px-20">
          TAMD.
        </a>
        <div className="hidden md:flex text-white space-x-6 text-lg cursor-pointer ">
          <Link to="/doctorPage">
            <span className="border-b-2 border-transparent hover:border-white transition-colors duration-300">
              Find Doctor
            </span>
          </Link>
          <Link to="/video">
          <span className="border-b-2 border-transparent hover:border-white transition-colors duration-300">
            Video Consult
          </span>
          </Link>
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

        {token ? (
          <div className="relative" ref={profileRef}>
            <button
              ref={profileButtonRef} // Attach the ref to the button
              onClick={toggleProfile}
              className="text-white border px-4 py-1 rounded-2xl hover:bg-white hover:text-red-700"
            >
              {user?.UserName || "Profile"}
            </button>
            {isProfileOpen && (
              <div className="absolute right-0  mt-2 w-48 bg-white text-red-800 rounded-lg shadow-lg z-10">
                <UserProfile /> {/* Render UserProfile component */}
              </div>
            )}
          </div>
        ) : (
          <>
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
          </>
        )}
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
          <Link to="/doctorPage">
            <span className="border-b-2 border-transparent hover:border-white transition-colors duration-300">
              Find Doctor
            </span>
          </Link>
          <a href="#">Video Consult</a>
          <a href="#">Surgeries</a>
        </div>
        <div className="space-y-2 mt-4 flex border-b flex-col">
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
          <a href="#">Help</a>
        </div>
        <div className="mt-4 flex flex-col space-y-2">
          {token ? (
            <div className="relative">
              <button
                onClick={toggleProfile}
                className="text-white border px-4 py-1 rounded-2xl hover:bg-white hover:text-red-700"
              >
                {user?.UserName || "Profile"}
              </button>
              {isProfileOpen && (
                <div className="absolute   mt-2 w-48 bg-white text-red-800 rounded-lg shadow-lg z-10">
                  <UserProfile /> {/* Render UserProfile component */}
                </div>
              )}
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
