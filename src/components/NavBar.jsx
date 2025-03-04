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
      {/* Left Side - Logo & Navigation */}
      <div className="text-white flex items-center space-x-6">
        <Link to="/" className="font-extrabold text-white text-4xl py-4 md:px-20">
          TAMD.
        </Link>
        <div className="hidden md:flex text-white space-x-6 text-lg">
          <Link to="/doctor" className="nav-link">Find Doctor</Link>
          <Link to="/video" className="nav-link">Video Consult</Link>
          <span className="nav-link">Surgeries</span>
        </div>
      </div>

      {/* Right Side - User Actions */}
      <div className="hidden md:flex space-x-7 text-white items-center pr-8">
        <Link to="/doctor" className="nav-link">For Doctor</Link>
        <Link to="/corporate" className="nav-link">For Corporate</Link>
        <span className="nav-link">Help</span>

        {token ? (
          <div className="relative" ref={profileRef}>
            <button
              ref={profileButtonRef}
              onClick={toggleProfile}
              className="nav-button"
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
                <Link to="/my-appointments" className="dropdown-link">My Appointments</Link>
                <Link to="/my-tests" className="dropdown-link">My Tests</Link>
                <Link to="/my-medical-records" className="dropdown-link">My Medical Records</Link>
                <Link to="/my-online-consultations" className="dropdown-link">My Online Consultations</Link>
                <Link to="/my-feedback" className="dropdown-link">My Feedback</Link>
                <Link to="/profile" className="dropdown-link">View / Update Profile</Link>
                <Link to="/payments" className="dropdown-link">Payments & Balance</Link>
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
              <button className="nav-button">Login</button>
            </Link>
            <Link to="/signup">
              <button className="nav-button">Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
