import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const NavBar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const profileButtonRef = useRef(null);
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.user);

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    console.log("User logged out");
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center bg-red-800 p-4">
      <div className="text-white flex items-center space-x-1">
        <Link to="/" className="font-extrabold text-white text-4xl py-4 md:px-20">
          TAMD.
        </Link>
        <div className="hidden md:flex text-white space-x-6 text-lg cursor-pointer">
          <Link to="/doctorPage">Find Doctor</Link>
          <Link to="/video">Video Consult</Link>
          <span>Surgeries</span>
        </div>
      </div>

      <div className="hidden md:flex space-x-7 text-white items-center pr-8 cursor-pointer">
        <Link to="/doctorPage">For Doctor</Link>
        <Link to="/corporate">For Corporate</Link>
        <span>Help</span>

        {token ? (
          <div className="relative" ref={profileRef}>
            <button
              ref={profileButtonRef}
              onClick={toggleProfile}
              className="text-white border px-4 py-1 rounded-2xl hover:bg-white hover:text-red-700"
            >
              {user?.UserName || "Profile"}
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-red-800 rounded-lg shadow-lg z-10">
                <div className="flex items-center border-b p-4">
                  <img
                    src={user?.photo || "https://accounts.practo.com/profile_picture/22269865/medium_thumbnail"}
                    alt="User"
                    className="w-16 h-16 rounded-lg border-2 border-gray-300"
                  />
                  <div className="ml-3">
                    <p className="font-semibold">{user?.UserName || "User"}</p>
                    <p className="text-sm text-gray-500">{user?.Mobile || "No Mobile Number"}</p>
                  </div>
                </div>

                {/* Dropdown Menu Links */}
                <Link to="/my-appointments" className="block px-4 py-2 hover:bg-gray-100">My Appointments</Link>
                <Link to="/my-tests" className="block px-4 py-2 hover:bg-gray-100">My Tests</Link>
                <Link to="/my-medical-records" className="block px-4 py-2 hover:bg-gray-100">My Medical Records</Link>
                <Link to="/my-online-consultations" className="block px-4 py-2 hover:bg-gray-100">My Online Consultations</Link>
                <Link to="/my-feedback" className="block px-4 py-2 hover:bg-gray-100">My Feedback</Link>
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">View / Update Profile</Link>
                <Link to="/payments" className="block px-4 py-2 hover:bg-gray-100">Payments & Balance</Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                >
                  Logout
                </button>
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
    </nav>
  );
};

export default NavBar;
