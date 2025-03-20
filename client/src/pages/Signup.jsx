import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../redux/userSlice.js"; // Import Redux actions
import { useNavigate, useLocation, Link } from "react-router-dom"; // For navigation after registration

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

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if coming from a specific page like appointments
  const fromPage = location.state?.from;

  // Access loading and error states from Redux store
  const { loading, error } = useSelector((state) => state.user);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle next step in the form
  const handleNextStep = () => {
    setCurrentStep(2);
  };

  // Handle previous step in the form
  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Dispatch the registerUser action with form data
    const resultAction = await dispatch(registerUser(formData));

    // If registration is successful, navigate to the appropriate page
    if (registerUser.fulfilled.match(resultAction)) {
      if (fromPage === "appointments") {
        // If coming from appointments, tell user to login first
        navigate("/login", { 
          state: { 
            from: fromPage, 
            justRegistered: true 
          } 
        });
      } else {
        // Otherwise go to login page
        navigate("/login");
      }
    }
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full sm:w-3xl">
        <h2 className="text-3xl font-bold text-center text-red-800 mb-6">Sign Up</h2>
        
        {/* Show message if redirected from appointments */}
        {fromPage === "appointments" && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md">
            Create an account to book appointments. After registration, you'll be able to book your appointment.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1 - Basic Information */}
          {currentStep === 1 && (
            <>
              {/* Username */}
              <div>
                <label htmlFor="userName" className="block text-lg text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter your username"
                  required
                />
              </div>

              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-lg text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter your first name"
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-lg text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter your last name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-lg text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-lg text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-lg text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter your password"
                  required
                />
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
                <label htmlFor="dateOfBirth" className="block text-lg text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-lg text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Country, State, City */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="country" className="block text-lg text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Country"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-lg text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="State"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-lg text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="City"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-lg text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter your address"
                  rows="3"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex flex-col space-y-2">
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
        {error && <div className="mt-4 text-center text-red-600">{error}</div>}
      </div>
    </div>
  );
};

export default Signup;