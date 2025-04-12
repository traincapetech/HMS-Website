import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MyAppointments from "./Appointment/MyAppointments";
import MyMedicalRecords from "./MedicalRecords/MyMedicalRecords";
import MyFeedback from "./Feedback/MyFeedback";
import Payments from "./Payments/Payments";
import Profile from "./View-UpdateProfile/Profile";
import { logoutUser } from "../../redux/userSlice";
import { useSelector, useDispatch } from "react-redux";

const UserPage = ({ user }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("MyAppointments");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  const sidebarLinks = [
    { to: "#MyAppointments", text: "My Appointments", id: "MyAppointments" },
    { to: "#MyTests", text: "My Tests", id: "MyTests" },
    {
      to: "#MyMedicalRecords",
      text: "My Medical Records",
      id: "MyMedicalRecords",
    },
    {
      to: "#OnlineConsultations",
      text: "My Online Consultations",
      id: "OnlineConsultations",
    },
    { to: "#MyFeedback", text: "My Feedback", id: "MyFeedback" },
    { to: "#Profile", text: "View / Update Profile", id: "Profile" },
    { to: "#Payments", text: "Payments", id: "Payments" },
  ];
  useEffect(() => {
    const hash = location.hash.split("/")[0].replace("#", "");
    console.log("HASH ELECMENT IS--->", hash);
    setActivePage(hash || "MyAppointments");
  }, [location]);
  const handleLinkClick = (id) => {
    setActivePage(id);
    navigate(`#${id}`);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  // Content for different pages
  const renderPageContent = () => {
    switch (activePage) {
      case "MyAppointments":
        return (
          <div className="p-6">
            <MyAppointments />
          </div>
        );
      case "MyTests":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">My Tests</h2>
            <div className="bg-white p-4 rounded-lg shadow">
              <p>Your medical tests and results will appear here.</p>
            </div>
          </div>
        );
      case "MyMedicalRecords":
        return (
          <div className="p-6">
            <MyMedicalRecords />
          </div>
        );
      case "OnlineConsultations":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Online Consultations</h2>
            <div className="bg-white p-4 rounded-lg shadow">
              <p>Your online consultation history will appear here.</p>
            </div>
          </div>
        );
      case "MyFeedback":
        return (
          <div className="p-6">
            <MyFeedback />
          </div>
        );
      case "Profile":
        return (
          <div className="p-6">
            <Profile />
          </div>
        );
      case "Payments":
        return (
          <div className="p-6">
            <Payments />
          </div>
        );
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">My Appointments</h2>
            <div className="bg-white p-4 rounded-lg shadow">
              <p>Your upcoming and past appointments will appear here.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row  bg-gray-100">
      {/* Mobile Sidebar Toggle Button */}
      <button
        className="md:hidden p-3 bg-gray-200 w-full text-left text-xl"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        ☰ Menu
      </button>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-100 p-6 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <button
          className="md:hidden text-right w-full text-gray-700 text-2xl"
          onClick={() => setIsSidebarOpen(false)}
        >
          ✕
        </button>
        <ul className="space-y-3">
          {sidebarLinks.map((link) => (
            <li key={link.to}>
              <button
                onClick={() => handleLinkClick(link.id)}
                className={`w-full text-left py-2 px-3 rounded-lg hover:bg-gray-200 ${
                  activePage === link.id ? "bg-blue-100 text-blue-700" : ""
                }`}
              >
                {link.text}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={handleLogout}
              className="w-full text-left py-2 px-3 text-red-500 hover:bg-gray-200 rounded-lg"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6">{renderPageContent()}</div>
    </div>
  );
};

export default UserPage;
