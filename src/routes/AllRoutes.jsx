import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import About from '../pages/About';
import Blog from '../pages/Blog';
import Careers from '../pages/Career';
import SearchForDoctors from '../pages/SearchForDoctors';
import ContactUs from '../pages/ContactUs';
import CovidHospitalListing from '../pages/CovidHospitalListing';
import HospitalList from '../pages/HospitalList';
import Appointment from '../components/Appointment';
import VideoConsult from '../pages/VideoConsult';
import ConsultationDetail from '../pages/ConsultationDetail';
import VideoCall from '../components/Videocall';
import SpecialtyDetail from '../pages/SpecialtyDetail';
import Specialties from '../components/Specialties';
import DoctorPage from '../pages/DoctorPage';
import Corporate from '../pages/Corporate';
import DoctorRegister from '../components/DoctorRegister';  

const AllRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/about' element={<About />} />
      <Route path='/blog' element={<Blog />} />
      <Route path='/careers' element={<Careers />} />
      <Route path='/search-for-doctors' element={<SearchForDoctors />} />
      <Route path='/contact-us' element={<ContactUs />} />
      <Route path='/covid-hospital-listing' element={<CovidHospitalListing />} />
      <Route path='/hospital-list' element={<HospitalList />} />
      <Route path='/hospitals/new-york' element={<HospitalList />} />
      <Route path='/appointments' element={<Appointment />} />
      <Route path='/video' element={<VideoConsult />} />
      <Route path='/consultation/:id' element={<ConsultationDetail />} />
      <Route path='/videocall' element={<VideoCall />} />
      <Route path='/specialties' element={<Specialties />} />
      <Route path='/specialty/:id' element={<SpecialtyDetail />} />
      <Route path='/doctor/:id' element={<DoctorPage />} /> 
      <Route path='/corporate' element={<Corporate />} /> 
      <Route path='/doctor-register' element={<DoctorRegister />} />  
    </Routes>
  );
};

export default AllRoutes;
