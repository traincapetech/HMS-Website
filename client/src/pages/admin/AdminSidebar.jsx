import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import AdminDoctors from "./AdminDoctors/AdminDoctors";
import AdminPatients from "./AdminPatients/AdminPatients";
import AdminPricing from "./AdminPricing/AdminPricing";
import AdminAnalytics from "./AdminAnalytics/AdminAnalytics";
import { FiMenu, FiX, FiLogOut, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { 
  MdDashboard, 
  MdPeople, 
  MdLocalHospital, 
  MdAttachMoney, 
  MdAnalytics 
} from "react-icons/md";

const AdminSidebar = ({ admin }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarLinks = [
    { to: "#Dashboard", text: "Dashboard", id: "Dashboard", icon: <MdDashboard /> },
    { to: "#Doctors", text: "Doctors", id: "Doctors", icon: <MdLocalHospital /> },
    { to: "#Patients", text: "Patients", id: "Patients", icon: <MdPeople /> },
    { to: "#Pricing", text: "Pricing", id: "Pricing", icon: <MdAttachMoney /> },
    { to: "#Analytics", text: "Analytics", id: "Analytics", icon: <MdAnalytics /> },
  ];

  useEffect(() => {
    const hash = location.hash.split("/")[0].replace("#", "");
    setActivePage(hash || "Dashboard");
  }, [location]);

  const handleLinkClick = (id) => {
    setActivePage(id);
    navigate(`#${id}`);
    setIsMobileSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate("/admin/login");
  };

  const toggleDesktopSidebar = () => {
    setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const renderPageContent = () => {
    switch (activePage) {
      case "Dashboard":
        return <AdminDashboard sidebarOpen={!isDesktopSidebarCollapsed} toggleMobileSidebar={toggleMobileSidebar} />;
      case "Doctors":
        return <AdminDoctors sidebarOpen={!isDesktopSidebarCollapsed} toggleMobileSidebar={toggleMobileSidebar} />;
      case "Patients":
        return <AdminPatients sidebarOpen={!isDesktopSidebarCollapsed} toggleMobileSidebar={toggleMobileSidebar} />;
      case "Pricing":
        return <AdminPricing sidebarOpen={!isDesktopSidebarCollapsed} toggleMobileSidebar={toggleMobileSidebar} />;
      case "Analytics":
        return <AdminAnalytics sidebarOpen={!isDesktopSidebarCollapsed} toggleMobileSidebar={toggleMobileSidebar} />;
      default:
        return <AdminDashboard sidebarOpen={!isDesktopSidebarCollapsed} toggleMobileSidebar={toggleMobileSidebar} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Mobile Sidebar Toggle Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-gray-800 text-white">
        <button
          className="p-4 w-full text-left flex items-center"
          onClick={toggleMobileSidebar}
        >
          <FiMenu className="mr-2 text-xl" />
          <span className="text-lg font-medium">Admin Menu</span>
        </button>
      </div>
      
      {/* Sidebar - Desktop: collapsible, Mobile: toggle visibility */}
      <div
        className={`bg-gray-800 text-white transition-all duration-300 ease-in-out z-20
          ${isMobileSidebarOpen ? "w-64 fixed inset-y-0 left-0 shadow-xl" : "hidden"} 
          md:block md:relative md:shadow-none
          ${isDesktopSidebarCollapsed ? "md:w-16" : "md:w-64"}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            {/* Modified this line to always show the title on mobile when sidebar is open */}
            {(!isDesktopSidebarCollapsed || isMobileSidebarOpen) && <h2 className="text-xl font-bold">Admin Panel</h2>}
            <button
              className="md:hidden text-white text-xl"
              onClick={toggleMobileSidebar}
            >
              <FiX />
            </button>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-2">
            <ul className="space-y-1">
              {sidebarLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleLinkClick(link.id)}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors
                      ${activePage === link.id ? "bg-blue-600 text-white" : "hover:bg-gray-700"}
                      ${isDesktopSidebarCollapsed && !isMobileSidebarOpen ? "md:justify-center" : ""}`}
                    title={isDesktopSidebarCollapsed && !isMobileSidebarOpen ? link.text : ""}
                  >
                    <span className={`text-lg ${isDesktopSidebarCollapsed && !isMobileSidebarOpen ? "" : "mr-3"}`}>{link.icon}</span>
                    {/* Modified this line to always show text on mobile when sidebar is open */}
                    {(!isDesktopSidebarCollapsed || isMobileSidebarOpen) && <span>{link.text}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-700">
            
          </div>
        </div>
      </div>

      {/* Desktop Sidebar Toggle Button */}
      <button
        className="hidden md:flex md:items-center md:justify-center bg-gray-800 text-white border-l border-gray-700 w-6 h-12 absolute top-20 z-10 transition-all duration-300"
        style={{ 
          left: isDesktopSidebarCollapsed ? "64px" : "256px",
          borderTopRightRadius: "8px", 
          borderBottomRightRadius: "8px" 
        }}
        onClick={toggleDesktopSidebar}
      >
        {isDesktopSidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
      </button>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isDesktopSidebarCollapsed ? 'md:ml-0' : 'md:ml-0'}`}>
        {/* Mobile header spacer */}
        <div className="md:hidden h-16"></div>
        
        {/* Content container */}
        <div className="flex-1 overflow-auto">
          <div className="h-full">
            {renderPageContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;