import React, { useEffect } from 'react'
import { Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import ForgotPassword from '../pages/ForgotPassword'
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
import AppointmentConfirmed from '../pages/AppointmentConfirmed'
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
import SpecialtyDetail from '../pages/SpecialtyDetail'
import AdminLogin from '../pages/AdminLogin'
import AdminDashboard from '../pages/admin/AdminDashboard/AdminDashboard'
import AdminDoctors from '../pages/admin/AdminDoctors/AdminDoctors'
import AdminPricing from '../pages/admin/AdminPricings/AdminPricings'
import AdminPatients from '../pages/admin/AdminPatients/AdminPatients'
import AdminAnalytics from '../pages/admin/AdminAnalytics/AdminAnalytics'
import AdminSidebar from '../pages/admin/AdminSidebar'
import AdminSettings from '../pages/AdminSettings'
import ProtectedAdminRoute from '../components/ProtectedAdminRoute'
import TAMDHealthFeed from '../pages/TAMDHealthFeed'
import ApiDiagnostics from '../pages/ApiDiagnostics'
import DoctorProfile from '../pages/DoctorProfile'
import PaymentCancel from '../pages/stripe/Cancel'
import PaymentSuccess from '../pages/stripe/Success'
import UserPage from '../pages/user/UserPage'
import DoctorPatients from '../pages/DoctorPatients'
import DoctorAppointments from '../pages/DoctorAppointments'
import AppointmentPayment from '../pages/appointment/AppointmentPayment'
import AppointmentProcess from '../pages/appointment/ProcessAppointmen'

// Simple Debug Component to help diagnose route issues
const RouteDebugger = () => {
  const location = useLocation();
  
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Route Debugger</h1>
      
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-lg font-semibold mb-2">Current Route Information</h2>
        <div className="text-sm bg-gray-50 p-3 rounded">
          <p><strong>Current Path:</strong> {location.pathname}</p>
          <p><strong>Search Params:</strong> {location.search || 'None'}</p>
          <p><strong>Location State:</strong> {JSON.stringify(location.state) || 'None'}</p>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-lg font-semibold mb-2">Authentication Status</h2>
        <div className="text-sm bg-gray-50 p-3 rounded">
          <p><strong>User Token:</strong> {localStorage.getItem('token') ? 'Present' : 'Missing'}</p>
          <p><strong>Doctor Token:</strong> {localStorage.getItem('doctorToken') ? 'Present' : 'Missing'}</p>
          <p><strong>Admin Token:</strong> {localStorage.getItem('adminToken') ? 'Present' : 'Missing'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Doctor Routes</h2>
          <ul className="text-sm space-y-2">
            <li><a href="/doctor/login" className="text-blue-600 hover:underline">Doctor Login</a></li>
            <li><a href="/doctor/register" className="text-blue-600 hover:underline">Doctor Register</a></li>
            <li><a href="/doctor/dashboard" className="text-blue-600 hover:underline">Doctor Dashboard</a></li>
            <li><a href="/doctor/patients" className="text-blue-600 hover:underline">Doctor Patients</a></li>
            <li><a href="/doctor/appointments" className="text-blue-600 hover:underline">Doctor Appointments</a></li>
          </ul>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Debug Actions</h2>
          <div className="space-y-2">
            <button 
              onClick={() => localStorage.clear()}
              className="bg-red-100 text-red-800 px-4 py-2 rounded text-sm w-full"
            >
              Clear All Local Storage
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-100 text-blue-800 px-4 py-2 rounded text-sm w-full"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component to prevent accessing auth pages when already logged in
const RequireNotAuth = ({ children }) => {
  const isLoggedIn = localStorage.getItem("token") && localStorage.getItem("user");
  const location = useLocation();
  
  if (isLoggedIn) {
    // If user has a desired destination after login, send them there
    const returnUrl = location.state?.returnUrl || "/";
    return <Navigate to={returnUrl} state={location.state} replace />;
  }
  
  return children;
};

// Protected route component that requires authentication
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("token") && localStorage.getItem("user");
  const location = useLocation();
  
  if (!isLoggedIn) {
    // Redirect to login page with return URL
    return <Navigate to="/login" state={{ returnUrl: location.pathname }} replace />;
  }
  
  return children;
};

const AllRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={
        <RequireNotAuth>
          <Login />
        </RequireNotAuth>
      } />
      <Route path='/signup' element={
        <RequireNotAuth>
          <Signup />
        </RequireNotAuth>
      } />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/About' element={<About />} />
      <Route path='/Blog' element={<Blog />} />
      <Route path='/Careers' element={<Careers />} />
      <Route path='/doctor' element={<FindDoctor />} />
      <Route path='/surgeries' element={<Surgeries />} />
      <Route path='/specialty/:id' element={<SpecialtyDetail />} />

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
      <Route path='/TAMDHealthFeed' element={<TAMDHealthFeed />} />
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
      <Route path='/doctor/:id' element={<DoctorProfile />} />
      <Route path='/ConsultTopDoctors' element={<ConsultTopDoctors />} />
      <Route path='/Appointments' element={<Appointments />} />
      <Route path='/appointment-confirmed' element={<AppointmentConfirmed />} />
      <Route path='/VideoCall' element={<VideoCall />} />
      <Route path='/Dashboard' element={<Dashboard />} />
      <Route path='/VideoCallControls' element={<VideoCallControls />} />
      <Route path='/MyAppointments' element={<MyAppointments />} />
      <Route path='/api-diagnostics' element={<ApiDiagnostics />} />
      <Route path='/route-debug' element={<RouteDebugger />} />
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
      <Route path='/AdminLogin' element={<AdminLogin />} />
      <Route path='/payment/cancel' element={<PaymentCancel />} />
      <Route path='/payment/success' element={<PaymentSuccess />} />
      <Route path='/UserProfile' element={<UserPage/>} />
      <Route path='/appointment-payment' element={<AppointmentPayment />} />
      <Route path='/process-appointment' element={<AppointmentProcess />} />
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
        path="/doctor/patients"
        element={
          <ProtectedDoctorRoute>
            <DoctorPatients />
          </ProtectedDoctorRoute>
        }
      />
      <Route
        path="/doctor/appointments"
        element={
          <ProtectedDoctorRoute>
            <DoctorAppointments />
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

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/sidebar"
        element={
          <ProtectedAdminRoute>
            <AdminSidebar />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/doctors"
        element={
          <ProtectedAdminRoute>
            <AdminDoctors />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/pricing"
        element={
          <ProtectedAdminRoute>
            <AdminPricing />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/patients"
        element={
          <ProtectedAdminRoute>
            <AdminPatients />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedAdminRoute>
            <AdminAnalytics />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedAdminRoute>
            <AdminSettings />
          </ProtectedAdminRoute>
        }
      />
    </Routes>
  )
}

export default AllRoutes;
