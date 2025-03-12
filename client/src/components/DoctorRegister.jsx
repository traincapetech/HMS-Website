import React, { useState } from "react";
import validator from "validator";
import { useDispatch, useSelector } from "react-redux";
import { registerDoctor, clearError } from "../redux/doctorSlice.js";
import { useNavigate } from "react-router-dom";

const DoctorRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.doctor);

  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Password: "",
    Phone: "",
    countryCode: "US",
    DOB: "",
    Expertise: "",
    Speciality: "",
    Experience: "",
    Hospital: "",
    ConsultType: "",
    Fees: "",
    Gender: "Male",
    City: "",
    State: "",
    Country: "",
    Address: "",
    document: null,
    image: null,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0], // Store the file object
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.Name) newErrors.Name = "Name is required";
    if (!formData.Email || !validator.isEmail(formData.Email))
      newErrors.Email = "Please enter a valid email";
    if (!formData.Phone || !validator.isMobilePhone(formData.Phone))
      newErrors.Phone = "Please enter a valid Phone number";
    if (!formData.DOB) newErrors.DOB = "Date of Birth is required";
    if (!formData.City) newErrors.City = "City is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) {
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(clearError());

    if (!validateStep1()) {
      return;
    }

    // Create FormData object for file uploads
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    // Dispatch the registerDoctor action
    dispatch(registerDoctor(data))
    .unwrap()  // We use unwrap to handle success/failure
    .then((result) => {
      // Display success message and navigate to homepage
      alert("Doctor successfully registered!");
      navigate("/");  // Navigate to home page after successful registration
    })
    .catch((err) => {
      // Handle error case if any
      console.error("Registration failed:", err);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">
          Doctor Registration
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <>
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
                {errors.Name && (
                  <p className="text-red-500 text-sm mt-1">{errors.Name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
                {errors.Email && (
                  <p className="text-red-500 text-sm mt-1">{errors.Email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="Password"
                  value={formData.Password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  name="Phone"
                  value={formData.Phone}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
                {errors.Phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.Phone}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="DOB"
                  value={formData.DOB}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                  max={new Date().toISOString().split("T")[0]}
                />
                {errors.DOB && (
                  <p className="text-red-500 text-sm mt-1">{errors.DOB}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  name="Gender"
                  value={formData.Gender}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Country Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Country Code
                </label>
                <input
                  type="text"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <input
                  type="text"
                  name="Country"
                  value={formData.Country}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="City"
                  value={formData.City}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
                {errors.City && (
                  <p className="text-red-500 text-sm mt-1">{errors.City}</p>
                )}
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  type="text"
                  name="State"
                  value={formData.State}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  name="Address"
                  value={formData.Address}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              {/* Next Step Button */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-red-800 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  Next Step
                </button>
              </div>
            </>
          )}

          {/* Step 2: Professional Information */}
          {currentStep === 2 && (
            <>
              {/* Expertise */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Expertise
                </label>
                <input
                  type="text"
                  name="Expertise"
                  value={formData.Expertise}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              {/* Speciality */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Speciality
                </label>
                <input
                  type="text"
                  name="Speciality"
                  value={formData.Speciality}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Experience (in years)
                </label>
                <input
                  type="number"
                  name="Experience"
                  value={formData.Experience}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              {/* Hospital */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hospital
                </label>
                <input
                  type="text"
                  name="Hospital"
                  value={formData.Hospital}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              {/* Consultation Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Consultation Type
                </label>
                <select
                  name="ConsultType"
                  value={formData.ConsultType}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                >
                  <option value="">Select</option>
                  <option value="Video">Video Consult</option>
                  <option value="InClinic">In Clinic</option>
                  <option value="Both">Both</option>
                </select>
              </div>

              {/* Consultation Fee */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Consultation Fee
                </label>
                <input
                  type="number"
                  name="Fees"
                  value={formData.Fees}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              {/* Upload Document PDF */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload Document (PDF)
                </label>
                <input
                  type="file"
                  name="document"
                  accept=".pdf"
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              {/* Upload Image JPG */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload Image (JPEG)
                </label>
                <input
                  type="file"
                  name="image"
                  accept=".jpeg"
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              {/* Previous/Submit */}
              <div className="flex flex-col w-full gap-2 justify-between mt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-full bg-gray-300 py-2 px-4 rounded-md hover:bg-gray-200"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="w-full bg-red-800 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
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

export default DoctorRegister;