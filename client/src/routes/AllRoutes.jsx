import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import About from '../pages/About'
import Blog from '../pages/Blog'
import Careers from '../pages/Career'
import SearchForDoctors from '../pages/SearchForDoctors'
import DoctorRegister from '../components/DoctorRegister'
import DoctorPage from '../pages/DoctorPage'
import Corporate from '../pages/Corporate'
import VideoConsult from '../pages/VideoConsult'
import ConsultationDetail from '../pages/ConsultationDetail'
const AllRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/About' element={<About />} />
      <Route path='/Blog' element={<Blog/>}/>
      <Route path='/Careers' element={<Careers/>}/>
      <Route path='/SearchForDoctors' element={<SearchForDoctors/>}/>
      <Route path='/doctorRegister' element={<DoctorRegister/>}/>
      <Route path='/doctorPage' element={<DoctorPage/>}/>
      <Route path='/corporate' element={<Corporate/>}/>
      <Route path='/video' element={<VideoConsult/>}/>
      <Route path="/consultation/:id" element={<ConsultationDetail />} />
    </Routes>
  )
}

export default AllRoutes
