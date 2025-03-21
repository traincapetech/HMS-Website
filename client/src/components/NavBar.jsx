import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/userSlice";
import tamdLogo from "../assets/TAMD.png";

const NavBar = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const profileRef = useRef(null);
    const profileButtonRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, token } = useSelector((state) => state.user);

    const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

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
    },);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/login");
    };

    return (
        <nav className="flex justify-between items-center bg-red-800 p-4 relative">
            {/* Left Side - Logo & Navigation */}
            <div className="text-white flex items-center space-x-6">
                <Link to="/" className="flex items-center py-4 md:px-20">
                    <img src={tamdLogo} alt="TAMD Logo" className="h-16" />
                </Link>
                <div className="hidden md:flex text-white space-x-6 text-lg">
                    <Link to="/doctor" className="border-b-2 border-transparent hover:border-white transition-colors duration-300">Find Doctor</Link>
                    <Link to="/video" className="border-b-2 border-transparent hover:border-white transition-colors duration-300">Video Consult</Link>
                    <Link to="/surgeries" className="border-b-2 border-transparent hover:border-white transition-colors duration-300">Surgeries</Link>
                </div>
            </div>

            {/* Right Side - User Actions */}
            <div className="hidden md:flex space-x-7 text-white items-center pr-8">
                <Link to="/doctorPage" className="border-b-2 border-transparent hover:border-white transition-colors duration-300">For Doctor</Link>
                <Link to="/WellnessPlans" className="border-b-2 border-transparent hover:border-white transition-colors duration-300">For Corporate</Link>
                <Link to="/HelpPage" className="border-b-2 border-transparent hover:border-white transition-colors duration-300">Help</Link>
                
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
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-md z-10 focus:outline-none">
                                <div className="py-2">
                                    <div className="flex items-center px-4 py-3 border-b border-gray-200">
                                        <img
                                            src={user?.photo || "https://accounts.practo.com/profile_picture/22269865/medium_thumbnail"}
                                            alt="User"
                                            className="w-12 h-12 rounded-full object-cover border-2 border-red-800"
                                        />
                                        <div className="ml-3">
                                            <p className="font-semibold text-gray-800">{user?.UserName || "User"}</p>
                                            <p className="text-sm text-gray-600">{user?.Phone || "No Mobile Number"}</p>
                                        </div>
                                    </div>

                                    {/* Dropdown Menu Links */}
                                    <Link to="/MyAppointments" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200">My Appointments</Link>
                                    <Link to="/MyTests" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200">My Tests</Link>
                                    <Link to="/MyMedicalRecords" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200">My Medical Records</Link>
                                    <Link to="/OnlineConsultations" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200">My Online Consultations</Link>
                                    <Link to="/MyFeedback" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200">My Feedback</Link>
                                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200">View / Update Profile</Link>
                                    <Link to="/Payments" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200">Payments & Balance</Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 transition-colors duration-200"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <Link to="/login">
                            <button className="text-white border px-4 py-1 rounded-2xl hover:bg-white hover:text-red-700">Login</button>
                        </Link>
                        <Link to="/signup">
                            <button className="text-white border px-4 py-1 rounded-2xl hover:bg-white hover:text-red-700">Sign Up</button>
                        </Link>
                    </>
                )}
            </div>

            {/* Mobile Hamburger Menu Button */}
            <div className="md:hidden">
                <button 
                    className="text-white text-2xl focus:outline-none"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle mobile menu"
                >
                    {isMobileMenuOpen ? "✕" : "☰"}
                </button>
            </div>

            {/* Mobile Sidebar Menu */}
            <div 
                ref={mobileMenuRef}
                className={`fixed top-0 left-0 w-4/5 h-full bg-red-800 z-50 transform transition-transform duration-300 ease-in-out ${
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                } md:hidden`}
            >
                <div className="flex justify-between items-center p-4 border-b border-red-700">
                    <Link to="/" className="flex items-center">
                        <img src={tamdLogo} alt="TAMD Logo" className="h-14" />
                    </Link>
                    <button 
                        onClick={toggleMobileMenu} 
                        className="text-white text-2xl focus:outline-none"
                        aria-label="Close menu"
                    >
                        ✕
                    </button>
                </div>
                
                <div className="p-4">
                    <div className="text-white space-y-4 text-lg">
                        <Link 
                            to="/doctor" 
                            className="block py-2 border-b border-red-700 hover:bg-red-700 transition-colors duration-200"
                            onClick={toggleMobileMenu}
                        >
                            Find Doctor
                        </Link>
                        <Link 
                            to="/video" 
                            className="block py-2 border-b border-red-700 hover:bg-red-700 transition-colors duration-200"
                            onClick={toggleMobileMenu}
                        >
                            Video Consult
                        </Link>
                        <Link 
                            to="/surgeries" 
                            className="block py-2 border-b border-red-700 hover:bg-red-700 transition-colors duration-200"
                            onClick={toggleMobileMenu}
                        >
                            Surgeries
                        </Link>
                        <Link 
                            to="/doctorPage" 
                            className="block py-2 border-b border-red-700 hover:bg-red-700 transition-colors duration-200"
                            onClick={toggleMobileMenu}
                        >
                            For Doctor
                        </Link>
                        <Link 
                            to="/WellnessPlans" 
                            className="block py-2 border-b border-red-700 hover:bg-red-700 transition-colors duration-200"
                            onClick={toggleMobileMenu}
                        >
                            For Corporate
                        </Link>
                        <Link 
                            to="/HelpPage" 
                            className="block py-2 border-b border-red-700 hover:bg-red-700 transition-colors duration-200"
                            onClick={toggleMobileMenu}
                        >
                            Help
                        </Link>
                    </div>

                    <div className="mt-8">
                        {token ? (
                            <div className="text-white">
                                <div className="flex items-center py-4 border-b border-red-700">
                                    <img
                                        src={user?.photo || "https://accounts.practo.com/profile_picture/22269865/medium_thumbnail"}
                                        alt="User"
                                        className="w-12 h-12 rounded-full object-cover border-2 border-white"
                                    />
                                    <div className="ml-3">
                                        <p className="font-semibold">{user?.UserName || "User"}</p>
                                        <p className="text-sm opacity-80">{user?.Phone || "No Mobile Number"}</p>
                                    </div>
                                </div>
                                <div className="mt-4 space-y-2">
                                    <Link 
                                        to="/MyAppointments" 
                                        className="block py-2 text-white hover:bg-red-700 transition-colors duration-200"
                                        onClick={toggleMobileMenu}
                                    >
                                        My Appointments
                                    </Link>
                                    <Link 
                                        to="/profile" 
                                        className="block py-2 text-white hover:bg-red-700 transition-colors duration-200"
                                        onClick={toggleMobileMenu}
                                    >
                                        View Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            toggleMobileMenu();
                                        }}
                                        className="block w-full text-left py-2 text-white hover:bg-red-700 transition-colors duration-200"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Link 
                                    to="/login"
                                    onClick={toggleMobileMenu}
                                >
                                    <button className="w-full bg-white text-red-800 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200">
                                        Login
                                    </button>
                                </Link>
                                <Link 
                                    to="/signup"
                                    onClick={toggleMobileMenu}
                                >
                                    <button className="w-full border border-white text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200">
                                        Sign Up
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Overlay for mobile menu */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={toggleMobileMenu}
                ></div>
            )}
        </nav>
    );
};

export default NavBar;