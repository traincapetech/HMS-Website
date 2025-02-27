import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import AllRoutes from "./routes/AllRoutes";
import Home from "./pages/Home"; // ✅ Import Home Page
import VideocallHome from "./pages/videocallhome";
import VideocallRoom from "./pages/videocallroom";
import Dashboard from "./pages/videocall.dashboard";
import VideoCall from "./components/VideoCall";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        {/* ✅ Set Home.jsx as the Default Page */}
        <Route path="/" element={<Home />} />

        {/* Video Call Home */}
        <Route path="/videocall-home" element={<VideocallHome />} />

        {/* Video Call Room */}
        <Route path="/room/:channelName" element={<VideocallRoom />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Video Call Page for Appointments */}
        <Route path="/video-call/:appointmentId" element={<VideoCall />} />

        {/* Catch-All for Other Routes */}
        <Route path="/*" element={<AllRoutes />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
