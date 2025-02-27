import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/userSlice.js"; // Import Redux action
import { useNavigate } from "react-router-dom"; // For navigation

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

  const [formError, setFormError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.user);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Move to next step
  const handleNextStep = () => {
    if (!formData.userName || !formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
      setFormError("Please fill in all required fields before proceeding.");
      return;
    }
    setFormError(""); 
    setCurrentStep(2);
  };

  // Move to previous step
  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(""); 

    console.log("Submitting Form Data:", formData); // Debugging step

    const resultAction = await dispatch(registerUser(formData));

    if (registerUser.fulfilled.match(resultAction)) {
      console.log("Registration Successful:", resultAction.payload);
      navigate("/login"); 
    } else {
      console.error("Registration Failed:", resultAction.payload);
    }
    if (registerUser.fulfilled.match(resultAction)) {
      alert("User successfully registered!"); // ✅ Show alert on success
      navigate("/login"); // Redirect to login page
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full sm:w-3xl">
        <h2 className="text-3xl font-bold text-center text-red-800 mb-6">Sign Up</h2>

        {formError && <p className="text-center text-red-600 mb-4">{formError}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && (
            <>
              <InputField label="Username" name="userName" value={formData.userName} onChange={handleChange} required />
              <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
              <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
              <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required />
              <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
              <InputField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />

              <button type="button" onClick={handleNextStep} className="w-full py-3 px-8 bg-red-800 text-white rounded-md hover:bg-red-700 transition duration-300">
                Next
              </button>
            </>
          )}

          {currentStep === 2 && (
            <>
              <InputField label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} required />
              <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={["Male", "Female", "Other"]} required />
              <InputField label="Country" name="country" value={formData.country} onChange={handleChange} required />
              <InputField label="State" name="state" value={formData.state} onChange={handleChange} required />
              <InputField label="City" name="city" value={formData.city} onChange={handleChange} required />
              
              <div>
                <label htmlFor="address" className="block text-lg text-gray-700 mb-2">Address</label>
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

              <div className="flex justify-between">
                <button type="button" onClick={handlePrevStep} className="py-3 px-8 bg-gray-500 text-white rounded-md hover:bg-gray-400 transition duration-300">
                  Back
                </button>
                <button type="submit" className="py-3 px-8 bg-red-800 text-white rounded-md hover:bg-red-700 transition duration-300" disabled={loading}>
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </>
          )}
        </form>

        {error && <div className="mt-4 text-center text-red-600">{error}</div>}
      </div>
    </div>
  );
};

const InputField = ({ label, name, type = "text", value, onChange, required }) => (
  <div>
    <label htmlFor={name} className="block text-lg text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
      placeholder={`Enter your ${label.toLowerCase()}`}
      required={required}
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, required }) => (
  <div>
    <label htmlFor={name} className="block text-lg text-gray-700 mb-2">{label}</label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
      required={required}
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
);

export default Signup;
