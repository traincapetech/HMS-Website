import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginDoctor, clearError } from "../redux/doctorSlice";
import { logoutUser } from "../redux/userSlice";
import { toast } from 'react-toastify';
import { FaUserMd, FaLock, FaExclamationCircle, FaEye, FaEyeSlash, FaExclamationTriangle } from "react-icons/fa";

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
          You are currently logged in as a patient. Logging in as a doctor will log you out of your patient account.
        </p>
        
        <p className="mb-6 text-gray-700">
          Do you want to continue with doctor login?
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

const DoctorLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { doctor, isLoading, error, isAuthenticated } = useSelector((state) => state.doctor);
  
  // Get patient user state to check if user is already logged in as patient
  const { user: patientUser, token: patientToken } = useSelector((state) => state.user);
  
  // State for confirmation modal
  const [showRoleConfirmation, setShowRoleConfirmation] = useState(false);
  
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempted, setLoginAttempted] = useState(false);

  // Check for patient login on component mount
  useEffect(() => {
    // First, check if user is logged in as a patient
    if (patientToken && patientUser) {
      // Show the confirmation modal if user is logged in as patient
      setShowRoleConfirmation(true);
    }
    
    // If doctor is already authenticated, redirect to dashboard
    if (isAuthenticated && doctor) {
      const from = location.state?.from?.pathname || "/doctor/dashboard";
      navigate(from);
    }
  }, [isAuthenticated, doctor, navigate, location, patientToken, patientUser]);

  // Handle modal confirmation - user wants to logout as patient and continue as doctor
  const handleRoleChangeConfirm = () => {
    // Log out the user from patient role
    dispatch(logoutUser());
    
    // Close the modal
    setShowRoleConfirmation(false);
    
    // Show toast notification about the logout
    toast.info("You've been logged out as a patient. Continue with doctor login.");
  };
  
  // Handle modal close - user wants to stay as patient
  const handleModalClose = () => {
    setShowRoleConfirmation(false);
    // Navigate back to home or patient dashboard
    navigate('/');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.Email || !formData.Password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    // Clear any previous errors
    dispatch(clearError());
    
    try {
      setLoginAttempted(true);
      console.log("Submitting login for:", formData.Email);
      
      // Show toast during login attempt
      toast.info("Logging in...", { 
        toastId: "login-attempt",
        autoClose: false
      });
      
      // Dispatch login action
      await dispatch(loginDoctor(formData)).unwrap();
      
      // Close the login toast
      toast.dismiss("login-attempt");
      
      // Show success message
      toast.success("Login successful!");
      
      // Get the from path from location state, or default to dashboard
      const from = location.state?.from?.pathname || "/doctor/dashboard";
      
      // Redirect after successful login
      setTimeout(() => {
        navigate(from);
      }, 500);
    } catch (error) {
      // Close the login toast
      toast.dismiss("login-attempt");
      
      // Show error toast
      toast.error(error || "Login failed. Please check your credentials.");
      console.error("Login error:", error);
    }
  };

  // Display toast for error if login was attempted
  useEffect(() => {
    if (error && loginAttempted) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch, loginAttempted]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
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
          Doctor Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to your doctor account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="Email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserMd className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="Email"
                  name="Email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.Email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
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
                  autoComplete="current-password"
                  required
                  value={formData.Password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="focus:outline-none"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember_me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-red-600 hover:text-red-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Signing in..." : "Sign in"}
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
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/doctor/register"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Register as a doctor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;