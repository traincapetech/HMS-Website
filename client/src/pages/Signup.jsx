import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { decrementStep, incremetStep, updateFormData } from "../redux/userSlice";

const Signup = () => {

  const dispatch = useDispatch();

  const {formData, currentStep} = useSelector((state) => state.user);


  const handleChange = (e) => {
    const { name, value } = e.target;
   dispatch(updateFormData({name, value}))
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    dispatch(incremetStep())
  };

  const handlePrevStep = (e) => {
    e.preventDefault();
    dispatch(decrementStep())
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Handle the form submission here (e.g., send data to backend)
    console.log("Form submitted with data:", formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full sm:w-3xl">
        <h2 className="text-3xl font-bold text-center text-red-800 mb-6">Sign Up</h2>

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

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-lg text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Confirm your password"
                  required
                />
              </div>

              {/* Step 1 Button */}
              <div className="flex w-full">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full  py-3 px-8 bg-red-800 text-white rounded-md hover:bg-red-700 transition duration-300"
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
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
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
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;