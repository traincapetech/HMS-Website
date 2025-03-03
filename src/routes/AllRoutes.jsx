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
import Appointment from '../components/appointment';
import VideoConsult from '../pages/VideoConsult';
import ConsultationDetail from '../pages/ConsultationDetail';
import VideoCall from '../components/Videocall';
import SpecialtyDetail from '../pages/SpecialtyDetail';
import Specialties from '../components/Specialties';
import DoctorPage from '../pages/DoctorPage';

const AllRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/About' element={<About />} />
      <Route path='/Blog' element={<Blog />} />
      <Route path='/Careers' element={<Careers />} />
      <Route path='/SearchForDoctors' element={<SearchForDoctors />} />
      <Route path='/ContactUs' element={<ContactUs />} />
      <Route path='/CovidHospitalListing' element={<CovidHospitalListing />} />
      <Route path='/HospitalList' element={<HospitalList />} />
      <Route path='/hospitals/NewYork' element={<HospitalList />} />
      <Route path='/appointments' element={<Appointment />} />
      <Route path='/video' element={<VideoConsult />} />
      <Route path='/consultation/:id' element={<ConsultationDetail />} />
      <Route path='/videocall' element={<VideoCall />} />
      <Route path='/specialties' element={<Specialties />} />
      <Route path='/specialty/:id' element={<SpecialtyDetail />} />
      <Route path='/doctor/:id' element={<DoctorPage />} /> {/* Added DoctorPage Route */}
    </Routes>
  );
};

export default AllRoutes;
