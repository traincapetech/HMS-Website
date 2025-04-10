import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../redux/userSlice.js"; // Import Redux actions
import { useNavigate } from "react-router-dom"; // For navigation after registration
import { FaExclamationCircle, FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    dateOfBirth: "",
    gender: "",
    country: "",
    state: "",
    city: "",
    address: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "Password strength: None",
    color: "text-gray-500"
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Access loading and error states from Redux store
  const { loading, error } = useSelector((state) => state.user);

  // Generate today's date string to use as max date for DOB
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate minimum date (must be at least 18 years old)
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  const minAdultDate = eighteenYearsAgo.toISOString().split('T')[0];

  // Validate form fields
  const validateField = (name, value) => {
    let fieldError = "";
    
    switch (name) {
      case "userName":
        if (value.length < 3) {
          fieldError = "Username must be at least 3 characters";
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          fieldError = "Username can only contain letters, numbers and underscore";
        }
        break;
        
      case "firstName":
      case "lastName":
        if (value.length < 2) {
          fieldError = `${name === "firstName" ? "First" : "Last"} name must be at least 2 characters`;
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          fieldError = `${name === "firstName" ? "First" : "Last"} name can only contain letters`;
        }
        break;
        
      case "email":
        if (!/^\S+@\S+\.\S+$/.test(value)) {
          fieldError = "Please enter a valid email address";
        }
        break;
        
      case "phone":
        if (!/^\d+$/.test(value)) {
          fieldError = "Phone number can only contain digits";
        } else if (value.length < 10 || value.length > 15) {
          fieldError = "Phone number must be between 10-15 digits";
        }
        break;
        
      case "password":
        if (value.length < 8) {
          fieldError = "Password must be at least 8 characters";
        } else if (!/[A-Z]/.test(value)) {
          fieldError = "Password must contain at least one uppercase letter";
        } else if (!/[a-z]/.test(value)) {
          fieldError = "Password must contain at least one lowercase letter";
        } else if (!/[0-9]/.test(value)) {
          fieldError = "Password must contain at least one number";
        } else if (!/[^A-Za-z0-9]/.test(value)) {
          fieldError = "Password must contain at least one special character";
        }
        
        // Calculate password strength
        let score = 0;
        if (value.length >= 8) score++;
        if (value.length >= 10) score++;
        if (/[A-Z]/.test(value)) score++;
        if (/[a-z]/.test(value)) score++;
        if (/[0-9]/.test(value)) score++;
        if (/[^A-Za-z0-9]/.test(value)) score++;
        
        let strengthMessage = "Password strength: ";
        let strengthColor = "";
        
        if (score <= 2) {
          strengthMessage += "Weak";
          strengthColor = "text-red-500";
        } else if (score <= 4) {
          strengthMessage += "Medium";
          strengthColor = "text-yellow-500";
        } else {
          strengthMessage += "Strong";
          strengthColor = "text-green-500";
        }
        
        setPasswordStrength({
          score,
          message: strengthMessage,
          color: strengthColor
        });
        break;
        
      case "dateOfBirth":
        const dob = new Date(value);
        const now = new Date();
        if (dob > now) {
          fieldError = "Date of birth cannot be in the future";
        }
        
        // Check if user is at least 18 years old
        const age = now.getFullYear() - dob.getFullYear();
        const monthDiff = now.getMonth() - dob.getMonth();
        if (age < 18 || (age === 18 && monthDiff < 0) || 
            (age === 18 && monthDiff === 0 && now.getDate() < dob.getDate())) {
          fieldError = "You must be at least 18 years old to register";
        }
        break;
        
      case "gender":
        if (!value) {
          fieldError = "Please select your gender";
        }
        break;
        
      case "country":
      case "state":
      case "city":
        if (value.length < 2) {
          fieldError = `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least 2 characters`;
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          fieldError = `${name.charAt(0).toUpperCase() + name.slice(1)} can only contain letters`;
        }
        break;
        
      case "address":
        if (value.length < 5) {
          fieldError = "Address must be at least 5 characters";
        }
        break;
        
      default:
        break;
    }
    
    return fieldError;
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For phone field, only allow digit input
    if (name === "phone" && !/^\d*$/.test(value)) {
      return; // Don't update state if non-digit is entered
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Validate the field
    const fieldError = validateField(name, value);
    setErrors({
      ...errors,
      [name]: fieldError
    });
  };

  // Validate step before proceeding
  const validateStep = (step) => {
    const stepErrors = {};
    let isValid = true;
    
    if (step === 1) {
      // Validate first step fields
      ["userName", "firstName", "lastName", "email", "phone", "password"].forEach(field => {
        const fieldError = validateField(field, formData[field]);
        if (fieldError) {
          stepErrors[field] = fieldError;
          isValid = false;
        }
      });
    } else if (step === 2) {
      // Validate second step fields
      ["dateOfBirth", "gender", "country", "state", "city", "address"].forEach(field => {
        const fieldError = validateField(field, formData[field]);
        if (fieldError) {
          stepErrors[field] = fieldError;
          isValid = false;
        }
      });
    }
    
    setErrors({...errors, ...stepErrors});
    return isValid;
  };

  // Handle next step in the form
  const handleNextStep = () => {
    if (validateStep(1)) {
      setCurrentStep(2);
      window.scrollTo(0, 0);
    }
  };

  // Handle previous step in the form
  const handlePrevStep = () => {
    setCurrentStep(1);
    window.scrollTo(0, 0);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate final step
    if (!validateStep(2)) {
      return;
    }

    // Dispatch the registerUser action with form data
    const resultAction = await dispatch(registerUser(formData));

    // If registration is successful, navigate to the login page
    if (registerUser.fulfilled.match(resultAction)) {
      navigate("/login"); // Redirect to login page
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(clearError()); // Clear any previous errors when component mounts
  }, [dispatch]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full sm:w-3xl">
        <h2 className="text-3xl font-bold text-center text-red-800 mb-6">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1 - Basic Information */}
          {currentStep === 1 && (
            <>
              {/* Username */}
              <div>
                <label
                  htmlFor="userName"
                  className="block text-lg text-gray-700 mb-2"
                >
                  Username *
                </label>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className={`w-full p-3 border ${errors.userName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                  placeholder="Enter your username"
                  required
                />
                {errors.userName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaExclamationCircle className="mr-1" /> {errors.userName}
                  </p>
                )}
              </div>

              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-lg text-gray-700 mb-2"
                >
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full p-3 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                  placeholder="Enter your first name"
                  required
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaExclamationCircle className="mr-1" /> {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-lg text-gray-700 mb-2"
                >
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full p-3 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                  placeholder="Enter your last name"
                  required
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaExclamationCircle className="mr-1" /> {errors.lastName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-lg text-gray-700 mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                  placeholder="Enter your email"
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaExclamationCircle className="mr-1" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-lg text-gray-700 mb-2"
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full p-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                  placeholder="Enter your phone number (digits only)"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  required
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaExclamationCircle className="mr-1" /> {errors.phone}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-lg text-gray-700 mb-2"
                >
                  Password *
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full p-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="hover:cursor-pointer absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 hover:text-gray-800"
                  >
                    {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                  </button>
                </div>
                
                {formData.password && (
                  <div className="mt-2">
                    <p className={`text-sm ${passwordStrength.color}`}>{passwordStrength.message}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div 
                        className={`h-2.5 rounded-full ${
                          passwordStrength.score <= 2 ? 'bg-red-500' : 
                          passwordStrength.score <= 4 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(100, passwordStrength.score * 16.6)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaExclamationCircle className="mr-1" /> {errors.password}
                  </p>
                )}
              </div>

              {/* Step 1 Button */}
              <div className="flex w-full">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full py-3 px-8 bg-red-800 text-white rounded-md hover:bg-red-700 transition duration-300"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 2 - Additional Information */}
          {currentStep === 2 && (
            <>
              {/* Date of Birth */}
              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-lg text-gray-700 mb-2"
                >
                  Date of Birth *
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  max={today}
                  className={`w-full p-3 border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                  required
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaExclamationCircle className="mr-1" /> {errors.dateOfBirth}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">You must be at least 18 years old to register</p>
              </div>

              {/* Gender */}
              <div>
                <label
                  htmlFor="gender"
                  className="block text-lg text-gray-700 mb-2"
                >
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full p-3 border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaExclamationCircle className="mr-1" /> {errors.gender}
                  </p>
                )}
              </div>

              {/* Country, State, City */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="country"
                    className="block text-lg text-gray-700 mb-2"
                  >
                    Country *
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full p-3 border ${errors.country ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                    placeholder="Country"
                    required
                  />
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FaExclamationCircle className="mr-1" /> {errors.country}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="block text-lg text-gray-700 mb-2"
                  >
                    State *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full p-3 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                    placeholder="State"
                    required
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FaExclamationCircle className="mr-1" /> {errors.state}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="block text-lg text-gray-700 mb-2"
                  >
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full p-3 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                    placeholder="City"
                    required
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FaExclamationCircle className="mr-1" /> {errors.city}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-lg text-gray-700 mb-2"
                >
                  Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full p-3 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                  placeholder="Enter your address"
                  rows="3"
                  required
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaExclamationCircle className="mr-1" /> {errors.address}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-full sm:w-auto py-3 px-8 bg-gray-500 text-white rounded-md hover:bg-gray-400 transition duration-300"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto py-3 px-8 bg-red-800 text-white rounded-md hover:bg-red-700 transition duration-300"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </>
          )}
        </form>

        {/* Display error message if registration fails */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
            <FaExclamationCircle className="mr-2" /> {error}
          </div>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="hover:cursor-pointer text-red-600 hover:underline"
            >
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;