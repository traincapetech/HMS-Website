import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import About from '../pages/About'
import Blog from '../pages/Blog'
import Careers from '../pages/Career'
import ContactUs from '../pages/ContactUs'
import CovidHospitalListing from '../pages/CovidHospitalListing'
import HospitalList from '../pages/HospitalList'
import TAMDCareClinics from '../pages/TAMDCareClinic'
import ReadHealthArticles from '../pages/ReadHealthArticles'
import ReadAboutMedicines from '../pages/ReadAboutMedicines'
import TAMDDrive from '../pages/TAMDDrive'
import PractoHealthFeed from '../pages/PractoHealthFeed'
import WellnessPlans from '../pages/WellnessPlans'
import FAQPage from "../pages/FAQPage"
import InstaByTAMD from '../pages/InstaByTAMD'
import AutoPlay from '../components/AutoPlay'
import Banner from '../components/Banner'
import ConsultTopDoctors from '../components/ConsultTopDoctors'
import OldDoctorRegister from '../components/DoctorRegister'
import DoctorPage from '../pages/DoctorPage'
import VideoConsult from '../components/VideoConsult'
import ConsultationDetail from '../pages/ConsultationDetail'
import Appointments from '../components/Appointment'
import VideoCall from '../components/VideoCall'
import Dashboard from '../components/app.dashboard'
import VideoCallControls from '../components/videocallcontrols'
import MyAppointments from '../pages/MyAppointments'
import MyFeedback from '../pages/MyFeedback'
import MyMedicalRecords from '../pages/MyMedicalRecords'
import OnlineConsultations from '../pages/MyOnlineConsultations'
import MyTests from '../pages/MyTests'
import Payments from '../pages/Payments'
import Profile from '../pages/Profile'
import PrivacyPolicy from '../pages/PrivacyPolicy'
import TermsAndConditions from '../pages/Terms&Conditions'
import ShowDoctors from '../pages/showDoctors'
import SearchClinics from '../pages/SearchClinics'
import SearchHospitals from '../pages/SearchHospitals'
import ProfilePage from '../pages/ProfilePage'
import TAMDReachPage from '../pages/TAMDReachPage'
import HelpPage from '../pages/HelpPage'
import FindDoctor from '../pages/FindDoctor'
import Surgeries from '../pages/Surgeries'
import DoctorDashboard from '../pages/DoctorDashboard'
import DoctorPrescription from '../components/DoctorPrescription'
import DoctorConsultation from '../components/DoctorConsultation'
import DoctorLogin from '../pages/DoctorLogin'
import DoctorRegister from '../pages/DoctorRegister'
import ProtectedDoctorRoute from '../components/ProtectedDoctorRoute'

const AllRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/About' element={<About />} />
      <Route path='/Blog' element={<Blog />} />
      <Route path='/Careers' element={<Careers />} />
      <Route path='/doctor' element={<FindDoctor />} />
      <Route path='/surgeries' element={<Surgeries />} />

      <Route path='/ContactUs' element={<ContactUs />} />
      <Route path='/CovidHospitalListing' element={<CovidHospitalListing />} />
      <Route path='/HospitalList' element={<HospitalList />} />
      <Route path='/hospitals/NewYork' element={<HospitalList />} />
      <Route path='/hospitals/Los Angeles' element={<HospitalList />} />
      <Route path='/hospitals/Chicago' element={<HospitalList />} />
      <Route path='/hospitals/Houston' element={<HospitalList />} />
      <Route path='/hospitals/Phoenix' element={<HospitalList />} />
      <Route path='/hospitals/Philadelphia' element={<HospitalList />} />
      <Route path='/hospitals/San Antonio' element={<HospitalList />} />
      <Route path='/hospitals/San Diego' element={<HospitalList />} />
      <Route path='/hospitals/Dallas' element={<HospitalList />} />
      <Route path='/hospitals/San Jose' element={<HospitalList />} />
      <Route path='/ReadHealthArticles' element={<ReadHealthArticles />} />
      <Route path='/ReadAboutMedicines' element={<ReadAboutMedicines />} />
      <Route path='/TAMDCareClinics' element={<TAMDCareClinics />} />
      <Route path='/TAMDDrive' element={<TAMDDrive />} />
      <Route path='/PractoHealthFeed' element={<PractoHealthFeed />} />
      <Route path='/WellnessPlans' element={<WellnessPlans />} />
      <Route path='/FAQPage' element={<FAQPage />} />
      <Route path='/InstaByTAMD' element={<InstaByTAMD />} />
      <Route path='/AutoPlay' element={<AutoPlay />} />
      <Route path='/Banner' element={<Banner />} />
      <Route path='/doctorRegister' element={<OldDoctorRegister />} />
      <Route path='/doctorPage' element={<DoctorPage />} />
      {/* <Route path='/consultation' element={<Consultation/>}/> */}
      <Route path='/video' element={<VideoConsult />} />
      <Route path="/consultation/:id" element={<ConsultationDetail />} />
      <Route path='/ConsultTopDoctors' element={<ConsultTopDoctors />} />
      <Route path='/Appointments' element={<Appointments />} />
      <Route path='/VideoCall' element={<VideoCall />} />
      <Route path='/Dashboard' element={<Dashboard />} />
      <Route path='/VideoCallControls' element={<VideoCallControls />} />
      <Route path='/MyAppointments' element={<MyAppointments />} />
      <Route path='/MyFeedback' element={<MyFeedback />} />
      <Route path='/MyMedicalRecords' element={<MyMedicalRecords />} />
      <Route path='/OnlineConsultations' element={<OnlineConsultations />} />
      <Route path='/MyTests' element={<MyTests />} />
      <Route path='/Payments' element={<Payments />} />
      <Route path='/Profile' element={<Profile />} />
      <Route path='/PrivacyPolicy' element={<PrivacyPolicy />} />
      <Route path='/TermsAndConditions' element={<TermsAndConditions />} />
      <Route path='/ShowDoctors' element={<ShowDoctors />} />
      <Route path='/SearchClinics' element={<SearchClinics />} />
      <Route path='/SearchHospitals' element={<SearchHospitals />} />
      <Route path='/ProfilePage' element={<ProfilePage />} />
      <Route path='/TAMDReachPage' element={<TAMDReachPage />} />
      <Route path='/HelpPage' element={<HelpPage />} />

      {/* Doctor Panel Routes */}
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedDoctorRoute>
            <DoctorDashboard />
          </ProtectedDoctorRoute>
        }
      />
      <Route
        path="/doctor/prescriptions/new/:appointmentId?"
        element={
          <ProtectedDoctorRoute>
            <DoctorPrescription />
          </ProtectedDoctorRoute>
        }
      />
      <Route
        path="/doctor/consultations/new/:appointmentId?"
        element={
          <ProtectedDoctorRoute>
            <DoctorConsultation />
          </ProtectedDoctorRoute>
        }
      />

      {/* Doctor Authentication Routes */}
      <Route path="/doctor/login" element={<DoctorLogin />} />
      <Route path="/doctor/register" element={<DoctorRegister />} />
    </Routes>
  )
}

export default AllRoutes
