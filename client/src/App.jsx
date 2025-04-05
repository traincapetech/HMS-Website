import React from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import AllRoutes from "./routes/AllRoutes";
import Footer from "./components/Footer";
import BranchedChatbox from "./components/Chatbox/Chatbox";
import MyAppointments from "./pages/user/Appointment/MyAppointments";
import DoctorDashboard from "./pages/DoctorDashboard";
import ApiDiagnostics from "./pages/ApiDiagnostics";
import SEO from "./components/SEO";

const Layout = () => {
  const location = useLocation();

  // Define admin-related paths where NavBar should be hidden
  const hideNavbarRoutes = [
    "/admin/login",
    "/admin/dashboard",
    "/admin/doctors",
    "/admin/pricing",
    "/admin/patients",
    "/admin/analytics",
    "/admin/settings",
  ];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  // Set default SEO for pages that don't have their own SEO component
  const getDefaultSEO = () => {
    const path = location.pathname;
    
    // Route-based default titles and descriptions
    if (path === "/") {
      return {
        title: "TAMD Health | Your Health, Our Priority",
        description: "TAMD Health offers comprehensive healthcare services including consultations with specialists, appointments, and medical resources.",
        keywords: "healthcare, doctors, appointments, medical services, health specialists",
        canonicalUrl: "/"
      };
    } else if (path.startsWith("/doctor")) {
      return {
        title: "Doctors | TAMD Health",
        description: "Find and consult with top doctors in various specialties at TAMD Health.",
        keywords: "doctors, specialists, healthcare professionals, medical consultation",
        canonicalUrl: "/doctor"
      };
    }
    
    // Default fallback
    return {
      title: "TAMD Health",
      description: "TAMD Health - Transforming healthcare with comprehensive medical services and patient care.",
      keywords: "healthcare, medical services, patient care, doctors, appointments",
      canonicalUrl: path
    };
  };
  
  const seoProps = getDefaultSEO();

  return (
    <>
      {/* Default SEO that will be overridden by page-specific SEO components */}
      <SEO
        title={seoProps.title}
        description={seoProps.description}
        keywords={seoProps.keywords}
        canonicalUrl={seoProps.canonicalUrl}
      />
      
      {/* Show NavBar only if not on admin-related pages */}
      {!shouldHideNavbar && <NavBar />}
      <AllRoutes />
      <Footer /> {/* Footer is always visible */}
      <BranchedChatbox />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;