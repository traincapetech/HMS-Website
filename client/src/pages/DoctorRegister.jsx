import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerDoctor, clearError, clearDoctorState } from "../redux/doctorSlice";
import { logoutUser } from "../redux/userSlice";
import {
  FaUserMd,
  FaLock,
  FaExclamationCircle,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaIdCard,
  FaEye,
  FaEyeSlash,
  FaCity,
  FaMapMarkerAlt,
  FaGlobe,
  FaImage,
  FaFilePdf,
  FaExclamationTriangle,
} from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

// List of medical specialties for the dropdown
const specialtiesList = [
  "Covid Treatment",
  "Sexual Health",
  "Eye Specialist",
  "Womens Health",
  "Diet & Nutrition",
  "Skin & Hair",
  "Bones and Joints",
  "Child Specialist",
  "Dental Care",
  "Heart",
  "Kidney Issues",
  "Cancer",
  "Ayurveda",
  "General Physician",
  "Mental Wellness",
  "Homoeopath",
  "General Surgery",
  "Urinary Issues",
  "Lungs and Breathing",
  "Physiotherapy",
  "Ear, Nose, Throat",
  "Brain and Nerves",
  "Diabetes Management",
  "Veterinary",
];

// Role confirmation modal component
const RoleConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <div className="flex items-center text-yellow-600 mb-4">
          <FaExclamationTriangle className="h-6 w-6 mr-3" />
          <h3 className="text-lg font-bold">Switching Roles</h3>
        </div>
        
        <p className="mb-4 text-gray-700">
          You are currently logged in as a patient. Registering as a doctor will log you out of your patient account.
        </p>
        
        <p className="mb-6 text-gray-700">
          Do you want to continue with doctor registration?
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Continue as Doctor
          </button>
        </div>
      </div>
    </div>
  );
};

const DoctorRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.doctor);
  const { user: patientUser, token: patientToken } = useSelector((state) => state.user);
  const [showRoleConfirmation, setShowRoleConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Password: "",
    confirmPassword: "",
    Phone: "",
    Speciality: "",
    LicenseNo: "",
    Experience: "",
    Education: "",
    City: "",
    State: "",
    Country: "",
    image: null,
    document: null,
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Toggle handlers
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for phone numbers - only allow digits, +, -, and spaces
    if (name === "Phone") {
      const sanitizedValue = value.replace(/[^\d+\s()-]/g, '');
      setFormData((prev) => ({
        ...prev,
        [name]: sanitizedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Name validation - more strict
    if (!formData.Name) {
      errors.Name = "Name is required";
    } else if (formData.Name.trim().length < 3) {
      errors.Name = "Name must be at least 3 characters long";
    } else if (!/^[A-Za-z\s.'-]+$/.test(formData.Name)) {
      errors.Name = "Please enter a valid name (letters, spaces, and common punctuation only)";
    }
    
    // Email validation - more comprehensive 
    if (!formData.Email) {
      errors.Email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.Email)) {
      errors.Email = "Please enter a valid email address";
    }
    
    // Password validation - stronger requirements
    if (!formData.Password) {
      errors.Password = "Password is required";
    } else if (formData.Password.length < 8) {
      errors.Password = "Password must be at least 8 characters long";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.Password)) {
      errors.Password = "Password must include at least one uppercase letter, one lowercase letter, and one number";
    }
    
    // Confirm password
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.Password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    // Phone validation - now only numbers can be entered due to the handleChange function
    if (!formData.Phone) {
      errors.Phone = "Phone number is required";
    } else if (!/^(\+\d{1,3}[- ]?)?\d{10,15}$/.test(formData.Phone.replace(/[-()\s]/g, ''))) {
      errors.Phone = "Please enter a valid phone number (10-15 digits)";
    }
    
    // Speciality validation
    if (!formData.Speciality) {
      errors.Speciality = "Speciality is required";
    }
    
    // License number validation
    if (!formData.LicenseNo) {
      errors.LicenseNo = "License number is required";
    } else if (!/^[A-Z0-9-]{5,}$/.test(formData.LicenseNo)) {
      errors.LicenseNo = "Please enter a valid license number (minimum 5 characters, letters, numbers, and hyphens)";
    }
    
    // Experience validation
    if (!formData.Experience) {
      errors.Experience = "Years of Experience is required";
    } else if (isNaN(formData.Experience) || parseInt(formData.Experience) < 0) {
      errors.Experience = "Please enter a valid number of years";
    } else if (parseInt(formData.Experience) > 70) {
      errors.Experience = "Please verify your years of experience";
    }
    
    // Education validation
    if (!formData.Education) {
      errors.Education = "Education details are required";
    } else if (formData.Education.trim().length < 10) {
      errors.Education = "Please provide more details about your education";
    }
    
    // City validation
    if (!formData.City) {
      errors.City = "City is required";
    } else if (!/^[A-Za-z\s.-]{2,}$/.test(formData.City)) {
      errors.City = "Please enter a valid city name";
    }
    
    // State validation
    if (!formData.State) {
      errors.State = "State/Province is required";
    } else if (!/^[A-Za-z\s.-]{2,}$/.test(formData.State)) {
      errors.State = "Please enter a valid state/province name";
    }
    
    // Country validation
    if (!formData.Country) {
      errors.Country = "Country is required";
    } else if (!/^[A-Za-z\s.-]{2,}$/.test(formData.Country)) {
      errors.Country = "Please enter a valid country name";
    }
    
    // Image validation
    if (!formData.image) {
      errors.image = "Profile Image is required";
    } else {
      // Check file size (limit to 5MB)
      if (formData.image.size > 5 * 1024 * 1024) {
        errors.image = "Image size should be less than 5MB";
      }
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!allowedTypes.includes(formData.image.type)) {
        errors.image = "Please upload a valid image file (JPEG, JPG, PNG, or GIF)";
      }
    }
    
    // Document validation
    if (!formData.document) {
      errors.document = "Medical Credentials are required";
    } else {
      // Check file size (limit to 10MB)
      if (formData.document.size > 10 * 1024 * 1024) {
        errors.document = "Document size should be less than 10MB";
      }
      // Check file type
      if (formData.document.type !== 'application/pdf') {
        errors.document = "Please upload a PDF document";
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    // First, check if user is logged in as a patient
    if (patientToken && patientUser) {
      // Show the confirmation modal if user is logged in as patient
      setShowRoleConfirmation(true);
    }
    
    // Always clear any existing doctor state when visiting registration page
    dispatch(clearDoctorState());
    
    // Also check local storage and clear any stale doctor data
    if (localStorage.getItem('doctor') || localStorage.getItem('doctorToken')) {
      localStorage.removeItem('doctor');
      localStorage.removeItem('doctorToken');
      localStorage.removeItem('doctorEmail');
    }
    
    window.scrollTo(0, 0);
  }, [dispatch, patientToken, patientUser]);
  
  // Handle modal confirmation - user wants to logout as patient and continue as doctor
  const handleRoleChangeConfirm = () => {
    // Log out the user from patient role
    dispatch(logoutUser());
    
    // Close the modal
    setShowRoleConfirmation(false);
    
    // Show toast notification about the logout
    toast.info("You've been logged out as a patient. Continue with doctor registration.");
  };
  
  // Handle modal close - user wants to stay as patient
  const handleModalClose = () => {
    setShowRoleConfirmation(false);
    // Navigate back to home or patient dashboard
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      // Show toast for validation errors
      toast.error("Please fix the form errors before submitting.");
      return;
    }

    try {
      // Check and log files first
      logFileDetails();
      
      toast.info("Submitting your registration...", { autoClose: false, toastId: "registering" });
      console.log("FORMATTED DATA BEING SUBMITTED --->", formData);

      const result = await dispatch(registerDoctor(formData)).unwrap();
      
      // Close the info toast
      toast.dismiss("registering");
      
      // Show success message
      toast.success("Registration successful! Redirecting to login...");
      
      // Clear any doctor state to ensure a clean login
      dispatch(clearDoctorState());
      
      // Clear any stored doctor data to prevent auto-login
      localStorage.removeItem('doctor');
      localStorage.removeItem('doctorToken'); 
      localStorage.removeItem('doctorEmail');
      
      // Redirect after a short delay to let the user see the success message
      setTimeout(() => {
        navigate("/doctor/login");
      }, 2000);
    } catch (error) {
      // Close the info toast
      toast.dismiss("registering");
      
      console.error("Registration failed:", error);
      
      // Handle different error formats
      let errorMessage = "Registration failed. Please try again.";
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      // Display error toast
      toast.error(errorMessage);
      
      // Store validation error for rendering in the UI
      setValidationErrors(prev => ({ ...prev, general: errorMessage }));
    }
  };
  
  // Debug function to check file objects
  const logFileDetails = () => {
    if (formData.image) {
      console.log("Image file details:", {
        name: formData.image.name,
        type: formData.image.type,
        size: formData.image.size,
        lastModified: formData.image.lastModified
      });
    } else {
      console.warn("No image file selected");
    }
    
    if (formData.document) {
      console.log("Document file details:", {
        name: formData.document.name,
        type: formData.document.type,
        size: formData.document.size,
        lastModified: formData.document.lastModified
      });
    } else {
      console.warn("No document file selected");
    }
  };
  
  // Special file input handler
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    
    if (file) {
      console.log(`Selected ${name} file:`, file.name, file.type, file.size);
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
      
      // Clear validation error when user selects a file
      if (validationErrors[name]) {
        setValidationErrors(prev => ({
          ...prev,
          [name]: ""
        }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={5000} />
      
      {/* Role confirmation modal */}
      <RoleConfirmationModal 
        isOpen={showRoleConfirmation}
        onClose={handleModalClose}
        onConfirm={handleRoleChangeConfirm}
      />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <FaUserMd className="h-12 w-12 text-red-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register as a Doctor
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join our medical network
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserMd className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="Name"
                  name="Name"
                  type="text"
                  required
                  value={formData.Name}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${
                    validationErrors.Name ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter your full Name"
                />
              </div>
              {validationErrors.Name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {validationErrors.Name}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="Email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="Email"
                  name="Email"
                  type="email"
                  required
                  value={formData.Email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${
                    validationErrors.Email
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your Email"
                />
              </div>
              {validationErrors.Email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {validationErrors.Email}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="Phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="Phone"
                  name="Phone"
                  type="tel"
                  required
                  value={formData.Phone}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${
                    validationErrors.Phone
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter digits only (e.g., 1234567890)"
                />
              </div>
              {validationErrors.Phone && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {validationErrors.Phone}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="Speciality"
                className="block text-sm font-medium text-gray-700"
              >
                Specialization
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserMd className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="Speciality"
                  name="Speciality"
                  required
                  value={formData.Speciality}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${
                    validationErrors.Speciality
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select your specialization</option>
                  {specialtiesList.map((specialty, index) => (
                    <option key={index} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>
              {validationErrors.Speciality && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {validationErrors.Speciality}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="LicenseNo"
                className="block text-sm font-medium text-gray-700"
              >
                Medical License Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaIdCard className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="LicenseNo"
                  name="LicenseNo"
                  type="text"
                  required
                  value={formData.LicenseNo}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${
                    validationErrors.LicenseNo
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your medical license number"
                />
              </div>
              {validationErrors.LicenseNo && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {validationErrors.LicenseNo}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="Experience"
                className="block text-sm font-medium text-gray-700"
              >
                Years of Experience
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserMd className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="Experience"
                  name="Experience"
                  type="number"
                  required
                  min="0"
                  max="70"
                  value={formData.Experience}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    // Prevent typing negative sign
                    if (e.key === "-") {
                      e.preventDefault();
                    }
                  }}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${
                    validationErrors.Experience
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter years of Experience"
                />
              </div>
              {validationErrors.Experience && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {validationErrors.Experience}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="Education"
                className="block text-sm font-medium text-gray-700"
              >
                Education
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                  <FaGraduationCap className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="Education"
                  name="Education"
                  required
                  value={formData.Education}
                  onChange={handleChange}
                  rows={3}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm resize-none"
                  placeholder="Enter your educational qualifications"
                />
              </div>
              {validationErrors.Education && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {validationErrors.Education}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="City"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCity className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="City"
                  name="City"
                  type="text"
                  required
                  value={formData.City}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${
                    validationErrors.City ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter your City"
                />
              </div>
              {validationErrors.City && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {validationErrors.City}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="State"
                className="block text-sm font-medium text-gray-700"
              >
                State/Province
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="State"
                  name="State"
                  type="text"
                  required
                  value={formData.State}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${
                    validationErrors.State
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your State/province"
                />
              </div>
              {validationErrors.State && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {validationErrors.State}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="Country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaGlobe className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="Country"
                  name="Country"
                  type="text"
                  required
                  value={formData.Country}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${
                    validationErrors.Country
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your country"
                />
              </div>
              {validationErrors.Country && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {validationErrors.Country}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Profile Image (Max 5MB)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaImage className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${
                    validationErrors.image
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                />
              </div>
              {validationErrors.image && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {validationErrors.image}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="document"
                className="block text-sm font-medium text-gray-700"
              >
                Medical Credentials (PDF, Max 10MB)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilePdf className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="document"
                  name="document"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${
                    validationErrors.document
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                />
              </div>
              {validationErrors.document && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {validationErrors.document}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="Password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="Password"
                  name="Password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.Password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${
                    validationErrors.Password
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Create a Password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="hover:cursor-pointer h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5 hover:cursor-pointer" />
                    )}
                  </button>
                </div>
              </div>
              {validationErrors.Password && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {validationErrors.Password}
                </p>
              )}
            </div>
            {/* Confirm Password field with toggle */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${
                    validationErrors.confirmPassword
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Confirm your password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="hover:cursor-pointer h-5 w-5" />
                    ) : (
                      <FaEye className="hover:cursor-pointer h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>
            {validationErrors.general && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FaExclamationCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {validationErrors.general}
                    </h3>
                  </div>
                </div>
              </div>
            )}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/doctor/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sign in to your account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegister;