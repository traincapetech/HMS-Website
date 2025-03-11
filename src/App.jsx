import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import AllRoutes from "./routes/AllRoutes";
import Home from "./pages/Home"; 
import VideocallHome from "./pages/videocallhome";
import VideocallRoom from "./pages/videocallroom";
import Dashboard from "./pages/videocall.dashboard";
import VideoCall from "./components/Videocall";
import MyAppointments from "./pages/MyAppointments"; 
import MyTests from "./pages/MyTests"; 
import MyMedicalRecords from "./pages/MyMedicalRecords"; 
import MyOnlineConsultations from "./pages/MyOnlineConsultations";
import MyFeedback from "./pages/MyFeedback";
import Profile from "./pages/Profile";
import Payments from "./pages/Payments";  
import DoctorPage from "./pages/DoctorPage";
import Corporate from "./pages/Corporate";  
import DoctorRegister from "./components/DoctorRegister"; 
import ContactUs from "./pages/ContactUs";  

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/videocall-home" element={<VideocallHome />} />
        <Route path="/room/:channelName" element={<VideocallRoom />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/video-call/:appointmentId" element={<VideoCall />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/my-tests" element={<MyTests />} />
        <Route path="/my-medical-records" element={<MyMedicalRecords />} />
        <Route path="/my-online-consultations" element={<MyOnlineConsultations />} />
        <Route path="/my-feedback" element={<MyFeedback />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/payments" element={<Payments />} />  
        <Route path="/doctor" element={<DoctorPage />} />  
        <Route path="/corporate" element={<Corporate />} />  
        <Route path="/doctor-register" element={<DoctorRegister />} />  
        <Route path="/contact" element={<ContactUs />} />  
        <Route path="/*" element={<AllRoutes />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
