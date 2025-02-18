import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import About from '../pages/About'
import Blog from '../pages/Blog'
import Careers from '../pages/Career'
import SearchForDoctors from '../pages/SearchForDoctors'
import ContactUs from '../pages/ContactUs'
import CovidHospitalListing from '../pages/CovidHospitalListing'
import HospitalList from '../pages/HospitalList'
import TAMDCareClinics from '../pages/TAMDCareClinic'
import ReadHealthArticles from '../pages/ReadHealthArticles'
import ReadAboutMedicines from '../pages/ReadAboutMedicines'
import TAMDDrive from '../pages/TAMDDrive'
import PractoHealthFeed from '../pages/PractoHealthFeed'
const AllRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/About' element={<About />} />
      <Route path='/Blog' element={<Blog/>}/>
      <Route path='/Careers' element={<Careers/>}/>
      <Route path='SearchForDoctors' element={<SearchForDoctors/>}/>
      <Route path='/ContactUs' element={<ContactUs/>}/>
      <Route path='/CovidHospitalListing' element={<CovidHospitalListing/>}/>
      <Route path='/HospitalList' element={<HospitalList/>}/>
      <Route path='/hospitals/NewYork' element={<HospitalList/>}/>
      <Route path='/hospitals/Los Angeles' element={<HospitalList/>}/>
      <Route path='/hospitals/Chicago' element={<HospitalList/>}/>
      <Route path='/hospitals/Houston' element={<HospitalList/>}/>
      <Route path='/hospitals/Phoenix' element={<HospitalList/>}/>
      <Route path='/hospitals/Philadelphia' element={<HospitalList/>}/>
      <Route path='/hospitals/San Antonio' element={<HospitalList/>}/>
      <Route path='/hospitals/San Diego' element={<HospitalList/>}/>
      <Route path='/hospitals/Dallas' element={<HospitalList/>}/>
      <Route path='/hospitals/San Jose' element={<HospitalList/>}/>
      <Route path='/ReadHealthArticles' element={<ReadHealthArticles/>}/>
      <Route path='/ReadAboutMedicines' element={<ReadAboutMedicines/>}/>
      <Route path='/TAMDCareClinics' element={<TAMDCareClinics/>}/>
      <Route path='/TAMDDrive' element={<TAMDDrive/>}/>
      <Route path='/PractoHealthFeed' element={<PractoHealthFeed/>}/>
     
    </Routes>
  )
}

export default AllRoutes
