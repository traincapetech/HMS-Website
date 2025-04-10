import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/userSlice";
import tamdLogo from "../assets/TAMD.png";

// Define API base URL
const API_BASE_URL = "https://hms-backend-1-pngp.onrender.com/api";

const NavBar = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const profileRef = useRef(null);
    const profileButtonRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, token } = useSelector((state) => state.user);

    const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    // Helper function to get image URL with cache-busting parameter
    const getImageUrl = (photoUrl) => {
        if (!photoUrl) return "https://accounts.practo.com/profile_picture/22269865/medium_thumbnail";
        // Add a cache-busting parameter to force re-render of image
        return `${photoUrl}?v=${new Date().getTime()}`;
    };
    
    // Default fallback image - guaranteed to work
    const fallbackImage = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.UserName || "User") + "&background=random";
    
    // Skip trying to fetch from the backend since it's not working
    useEffect(() => {
        if (!user) return;
        
        console.log("User data in NavBar:", user);
        // Just use a reliable avatar service that generates images from names
        setProfileImage("https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.UserName || "User") + "&background=random&color=fff");
        
    }, [user]);

    // Handle clicks outside the profile dropdown to close it
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

    // Close mobile menu when screen size changes
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle logout
    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/login");
    };

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMobileMenuOpen]);

    return (
        <nav className="flex justify-between items-center bg-red-800 p-2 sm:p-3 md:p-4 relative z-50">
            {/* Left Side - Logo & Navigation */}
            <div className="text-white flex items-center space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-6">
                <Link to="/" className="flex items-center py-2 sm:py-2 md:py-3 pl-2 sm:pl-3 md:pl-4 lg:pl-6">
                    <img src={tamdLogo} alt="TAMD Logo" className="h-8 sm:h-10 md:h-12 lg:h-16 w-auto" />
                </Link>
                <div className="hidden md:flex text-white space-x-1 lg:space-x-6 text-xs sm:text-sm lg:text-lg">
                    <Link to="/doctor" className="nav-link px-1 lg:px-2 whitespace-nowrap">Find Doctor</Link>
                    <Link to="/video" className="nav-link px-1 lg:px-2 whitespace-nowrap">Video Consult</Link>
                    <Link to="/surgeries" className="nav-link px-1 lg:px-2 whitespace-nowrap">Surgeries</Link>
                </div>
            </div>

            {/* Right Side - User Actions */}
            <div className="hidden md:flex space-x-1 lg:space-x-3 text-white items-center pr-2 lg:pr-6 text-xs lg:text-base">
                <Link to="/doctorPage" className="nav-link px-1 lg:px-2 whitespace-nowrap">For Doctor</Link>
                <Link to="/WellnessPlans" className="nav-link px-1 lg:px-2 whitespace-nowrap">For Corporate</Link>
                <Link to="/HelpPage" className="nav-link px-1 lg:px-2 whitespace-nowrap">Help</Link>
                
                {token ? (
                    <div className="relative" ref={profileRef}>
                        <button
                            ref={profileButtonRef}
                            onClick={toggleProfile}
                            className="text-white border px-2 sm:px-3 py-1 rounded-2xl hover:bg-white hover:text-red-700 text-xs sm:text-sm lg:text-base whitespace-nowrap"
                        >
                            {user?.UserName || "Profile"}
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-md z-50 focus:outline-none">
                                <div className="py-2">
                                    {/* Profile Section */}
                                    <div className="flex items-center px-4 py-2 border-b border-gray-200" onClick={()=>{
                                        navigate('/UserProfile');
                                    }}>
                                        <img
                                            src={getImageUrl(user?.photo)}
                                            alt="User"
                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-red-800"
                                            key={`profile-img-${user?.photo}`} // Add key to force re-render
                                            onError={(e) => {
                                                console.error("Image load error in navbar");
                                                e.target.onerror = null; // Prevent infinite loop
                                                e.target.src = fallbackImage;
                                            }}
                                        />
                                        <div className="ml-2 sm:ml-3">
                                            <p className="font-semibold text-gray-800 text-sm sm:text-base">{user?.UserName || "User"}</p>
                                            <p className="text-xs sm:text-sm text-gray-600">{user?.Phone || "No Mobile Number"}</p>
                                        </div>
                                    </div>

                                    {/* Dropdown Menu Links */}
                                    <Link to="/UserProfile#MyAppointments" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">My Appointments</Link>
                                    <Link to="/UserProfile#MyTests" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">My Tests</Link>
                                    <Link to="/UserProfile#MyMedicalRecords" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">My Medical Records</Link>
                                    <Link to="/UserProfile#OnlineConsultations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">My Online Consultations</Link>
                                    <Link to="/UserProfile#MyFeedback" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">My Feedback</Link>
                                    <Link to="/UserProfile#profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">View / Update Profile</Link>
                                    <Link to="/UserProfile#Payments" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">Payments & Balance</Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 transition-colors duration-200"
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
                            <button className="text-white border px-2 sm:px-3 py-1 rounded-2xl hover:bg-white hover:text-red-700 text-xs sm:text-sm lg:text-base whitespace-nowrap">Login</button>
                        </Link>
                        <Link to="/signup">
                            <button className="text-white border px-2 sm:px-3 py-1 rounded-2xl hover:bg-white hover:text-red-700 text-xs sm:text-sm lg:text-base whitespace-nowrap">Sign Up</button>
                        </Link>
                    </>
                )}
            </div>

            {/* Mobile Hamburger Menu Button */}
            <div className="md:hidden pr-4">
                <button 
                    className="text-white text-2xl focus:outline-none"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle mobile menu"
                >
                    {isMobileMenuOpen ? "✕" : "☰"}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={toggleMobileMenu}
                ></div>
            )}

            {/* Mobile Sidebar Menu */}
            <div 
                ref={mobileMenuRef}
                className={`fixed top-0 left-0 w-4/5 h-full bg-red-800 z-50 transform transition-transform duration-300 ease-in-out ${
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                } md:hidden overflow-hidden flex flex-col`}
            >
                <div className="flex justify-between items-center p-4 border-b border-red-700">
                    <Link to="/" className="flex items-center" onClick={toggleMobileMenu}>
                        <img src={tamdLogo} alt="TAMD Logo" className="h-10" />
                    </Link>
                    <button 
                        onClick={toggleMobileMenu} 
                        className="text-white text-2xl focus:outline-none"
                        aria-label="Close menu"
                    >
                        ✕
                    </button>
                </div>
                
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="text-white space-y-4 text-base">
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
                        
                        {/* Mobile Profile Links */}
                        {token ? (
                            <>
                                <div className="py-2 border-b border-red-700">
                                    <div className="flex items-center" onClick={()=>{
                                        navigate('/UserProfile');
                                    }}>
                                        <img
                                            src={getImageUrl(user?.photo)}
                                            alt="User"
                                            className="w-10 h-10 rounded-full object-cover border-2 border-white"
                                            onError={(e) => {
                                                console.error("Image load error in mobile menu");
                                                e.target.onerror = null; // Prevent infinite loop
                                                e.target.src = fallbackImage;
                                            }}
                                        />
                                        <div className="ml-3">
                                            <p className="font-semibold text-white">{user?.UserName || "User"}</p>
                                            <p className="text-xs text-gray-200">{user?.Phone || "No Mobile Number"}</p>
                                        </div>
                                    </div>
                                </div>

                                <Link to="/UserProfile#MyAppointments" className="block py-2 border-b border-red-700 hover:bg-red-700 transition-colors duration-200" onClick={toggleMobileMenu}>
                                    My Appointments
                                </Link>
                                <Link to="/UserProfile#MyTests" className="block py-2 border-b border-red-700 hover:bg-red-700 transition-colors duration-200" onClick={toggleMobileMenu}>
                                    My Tests
                                </Link>
                                <Link to="/UserProfile#MyMedicalRecords" className="block py-2 border-b border-red-700 hover:bg-red-700 transition-colors duration-200" onClick={toggleMobileMenu}>
                                    My Medical Records
                                </Link>
                                <Link to="/UserProfile#OnlineConsultations" className="block py-2 border-b border-red-700 hover:bg-red-700 transition-colors duration-200" onClick={toggleMobileMenu}>
                                    My Online Consultations
                                </Link>
                                <Link to="/UserProfile#Profile" className="block py-2 border-b border-red-700 hover:bg-red-700 transition-colors duration-200" onClick={toggleMobileMenu}>
                                    View / Update Profile
                                </Link>
                                <Link to="/UserProfile#Payments" className="block py-2 border-b border-red-700 hover:bg-red-700 transition-colors duration-200" onClick={toggleMobileMenu}>
                                    Payments
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        toggleMobileMenu();
                                    }}
                                    className="block w-full text-left py-2 border-b border-red-700 hover:bg-red-700 transition-colors duration-200 text-white"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col space-y-3 mt-4">
                                <Link to="/login" className="block" onClick={toggleMobileMenu}>
                                    <button className="w-full bg-white text-red-800 font-medium py-2 px-4 rounded-md hover:bg-gray-100 transition-colors duration-200">
                                        Login
                                    </button>
                                </Link>
                                <Link to="/signup" className="block" onClick={toggleMobileMenu}>
                                    <button className="w-full border border-white text-white font-medium py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200">
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
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleMobileMenu}
                ></div>
            )}
        </nav>
    );
};

export default NavBar;