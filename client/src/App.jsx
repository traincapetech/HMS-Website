import React from "react";
import { useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import AllRoutes from "./routes/AllRoutes";
import Footer from "./components/Footer";
import BranchedChatbox from "./components/Chatbox/Chatbox";
import WebsiteCounter from "./components/WebsiteCounter";
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
    "/admin/notifications",
    "/admin/sidebar",
    ];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {/* Show NavBar only if not on admin-related pages */}
      {!shouldHideNavbar && <NavBar />}
      <AllRoutes />
      <Footer /> {/* Footer is always visible */}
      <WebsiteCounter />
      <BranchedChatbox />
    </>
  );
};

function App() {
  return <Layout />;
}

export default App;