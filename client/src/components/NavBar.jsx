// import React, { useState, useRef, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import UserProfile from "./UserProfile"; // Import UserProfile component

// const NavBar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const { user, token } = useSelector((state) => state.user);
//   const profileRef = useRef(null); // Ref for profile button and dropdown
//   const profileButtonRef = useRef(null); // Ref for the profile button


//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
//   const toggleProfile = () => {
//     setIsProfileOpen(!isProfileOpen);
//   };

//   // Close the profile dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         profileRef.current &&
//         !profileRef.current.contains(event.target) &&
//         !profileButtonRef.current.contains(event.target)
//       ) {
//         setIsProfileOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <nav className="flex justify-between items-center bg-red-800 p-4">
//       {/* Logo */}
//       <div className="text-white flex items-center space-x-1">
//         <a href="/" className="font-extrabold text-white text-4xl py-4 md:px-20">
//           TAMD.
//         </a>
//         <div className="hidden md:flex text-white space-x-6 text-lg cursor-pointer ">
//           <Link to="/doctorPage">
//             <span className="border-b-2 border-transparent hover:border-white transition-colors duration-300">
//               Find Doctor
//             </span>
//           </Link>
//           <Link to="/video">
//           <span className="border-b-2 border-transparent hover:border-white transition-colors duration-300">
//             Video Consult
//           </span>
//           </Link>
//           <a className="border-b-2 border-transparent hover:border-white transition-colors duration-300">
//             Surgeries
//           </a>
//         </div>
//       </div>

//       {/* Desktop Right-side links */}
//       <div className="hidden md:flex space-x-7 text-white items-center pr-8 cursor-pointer">
//         <Link to="/doctorPage">
//           <span className="border-b-2 border-transparent hover:border-white transition-colors duration-300">
//             For Doctor
//           </span>
//         </Link>
//         <Link to="/corporate">
//           <span className="border-b-2 border-transparent hover:border-white transition-colors duration-300">
//             For Corporate
//           </span>
//         </Link>
//         <a className="border-b-2 border-transparent hover:border-white transition-discrete duration-300">
//           Help
//         </a>

//         {token ? (
//           <div className="relative" ref={profileRef}>
//             <button
//               ref={profileButtonRef} // Attach the ref to the button
//               onClick={toggleProfile}
//               className="text-white border px-4 py-1 rounded-2xl hover:bg-white hover:text-red-700"
//             >
//               {user?.UserName || "Profile"}
//             </button>
//             {isProfileOpen && (
//               <div className="absolute right-0  mt-2 w-48 bg-white text-red-800 rounded-lg shadow-lg z-10">
//                 <UserProfile /> {/* Render UserProfile component */}
//               </div>
//             )}
//           </div>
//         ) : (
//           <>
//             <Link to="/login">
//               <button className="text-white border px-4 py-1 rounded-2xl hover:bg-white hover:text-red-700">
//                 Login
//               </button>
//             </Link>
//             <Link to="/signup">
//               <button className="text-white border px-4 py-1 rounded-2xl hover:bg-white hover:text-red-700">
//                 Sign Up
//               </button>
//             </Link>
//           </>
//         )}
//       </div>

//       {/* Hamburger Icon for Mobile */}
//       <div className="md:hidden flex items-center">
//         <button onClick={toggleMenu} className="text-white text-2xl">
//           &#9776;
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       <div
//         className={`${
//           isMenuOpen ? "block" : "hidden"
//         } absolute z-20 top-20 left-0 w-full bg-red-800 h-screen text-white p-6 space-y-4 md:hidden`}
//       >
//         <div className="space-y-2 flex-col border-b flex">
//           <Link to="/doctorPage">
//             <span className="border-b-2 border-transparent hover:border-white transition-colors duration-300">
//               Find Doctor
//             </span>
//           </Link>
//           <a href="#">Video Consult</a>
//           <a href="#">Surgeries</a>
//         </div>
//         <div className="space-y-2 mt-4 flex border-b flex-col">
//           <Link to="/doctorPage">
//             <span className="border-b-2 border-transparent hover:border-white transition-colors duration-300">
//               For Doctor
//             </span>
//           </Link>
//           <Link to="/corporate">
//             <span className="border-b-2 border-transparent hover:border-white transition-colors duration-300">
//               For Corporate
//             </span>
//           </Link>
//           <a href="#">Help</a>
//         </div>
//         <div className="mt-4 flex flex-col space-y-2">
//           {token ? (
//             <div className="relative">
//               <button
//                 onClick={toggleProfile}
//                 className="text-white border px-4 py-1 rounded-2xl hover:bg-white hover:text-red-700"
//               >
//                 {user?.UserName || "Profile"}
//               </button>
//               {isProfileOpen && (
//                 <div className="absolute   mt-2 w-48 bg-white text-red-800 rounded-lg shadow-lg z-10">
//                   <UserProfile /> {/* Render UserProfile component */}
//                 </div>
//               )}
//             </div>
//           ) : (
//             <>
//               <Link to="/login">
//                 <button className="text-white border px-4 py-1 rounded-2xl hover:bg-white hover:text-red-700">
//                   Login
//                 </button>
//               </Link>
//               <Link to="/signup">
//                 <button className="text-white border px-4 py-1 rounded-2xl hover:bg-white hover:text-red-700">
//                   Sign Up
//                 </button>
//               </Link>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default NavBar;
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
    },);

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
                <Link to="/doctorPage" className="nav-link">For Doctor</Link>
                <Link to="/WellnessPlans" className="nav-link">For Corporate</Link>
                <Link to="/HelpPage" className="nav-link">Help</Link>
                

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
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-md z-10 focus:outline-none"  /* Dropdown container */
                            >
                                <div className="py-2"> {/* Padding for the content */}
                                    <div className="flex items-center px-4 py-3 border-b border-gray-200"> {/* User Info */}
                                        <img
                                            src={user?.photo || "https://accounts.practo.com/profile_picture/22269865/medium_thumbnail"}
                                            alt="User"
                                            className="w-12 h-12 rounded-full object-cover border-2 border-red-800"
                                        />
                                        <div className="ml-3">
                                            <p className="font-semibold text-gray-800">{user?.UserName || "User"}</p>
                                            <p className="text-sm text-gray-600">{user?.Mobile || "No Mobile Number"}</p>
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