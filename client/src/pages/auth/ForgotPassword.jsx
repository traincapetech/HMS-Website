import React, { useEffect, useState } from "react";
import banner from "../../assets/TAMD.png";
import logo from "../../assets/TAMD.png";
import {
  FaRegEyeSlash,
  FaEye,
  FaEnvelope,
  FaLock,
  FaShieldAlt,
  FaKey,
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import {
  reset_password,
  sendOTPToEmail,
  verifyOtp,
} from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

// Simple loading component
const Loading = () => (
  <div className="flex justify-center items-center h-full">
    <div className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
  </div>
);

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const [error, setError] = useState(false);
  const [showEmail, setShowEmail] = useState(true);
  const [successMessage, setSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    email: "",
    otp: ["", "", "", "", "", ""],
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const inputRefs = React.useRef([]);

  // Handle OTP input focus and navigation
  const handleInput = (e, index) => {
    const value = e.target.value;
    // Update the otp array
    const newOtp = [...payload.otp];
    newOtp[index] = value;
    setPayload({ ...payload, otp: newOtp });

    // Auto-focus to next input if value entered
    if (value.length > 0 && index < inputRefs.current.length - 1)
      inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0)
      inputRefs.current[index - 1].focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");

    // Only take the first 6 characters
    const newOtp = [...payload.otp];

    pasteArray.forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char;
        if (inputRefs.current[index]) {
          inputRefs.current[index].value = char;
        }
      }
    });

    setPayload({ ...payload, otp: newOtp });

    // Focus the last filled input or the next empty one
    const lastIndex = Math.min(5, pasteArray.length - 1);
    if (lastIndex < 5 && pasteArray.length < 6) {
      inputRefs.current[lastIndex + 1]?.focus();
    }
  };

  const [showOtp, setShowOtp] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleChange = (e) => {
    setPayload({
      ...payload,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      setSuccessMessage(false);

      if (!payload.email.trim()) {
        setError("Email is required");
        setLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(payload.email)) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }

      console.log("Sending OTP to:", payload.email);
      const result = await dispatch(sendOTPToEmail({ email: payload.email }));
      console.log("OTP response:", result);

      if (result?.payload?.success) {
        setShowOtp(true);
        setShowEmail(false);
        setLoading(false);
        setSuccessMessage(
          result.payload.message ||
            "OTP sent successfully. Please check your email."
        );
        // Don't modify the OTP array here - no need to reset it
      } else {
        // Safe error handling
        const errorMessage =
          result?.payload?.message ||
          result?.error?.message ||
          "Failed to send OTP. Please try again later.";

        setError(errorMessage);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      setError("Server error. Please try again later.");
      console.error("Email submit error:", e);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setSuccessMessage(false);

    // Get values from the refs instead of state to ensure we have the latest input
    const otpArray = inputRefs.current.map((el) => el?.value || "");
    const otp = otpArray.join("");

    if (otp.trim() === "" || otp.length !== 6) {
      setError("Please enter a complete 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      console.log("Submitting OTP:", otp);
      const result = await dispatch(
        verifyOtp({
          otp,
          email: payload.email,
        })
      );
      console.log("OTP verification result:", result);

      if (result?.payload?.success) {
        setShowNewPassword(true);
        setShowOtp(false);
        setLoading(false);
        setSuccessMessage("OTP verified successfully. Enter your new password");
      } else {
        // Safe error handling
        let errorMessage = "Invalid OTP. Please try again.";

        if (result?.payload?.message) {
          errorMessage = result.payload.message;
        } else if (typeof result?.payload === "string") {
          if (result.payload.includes("Invalid OTP")) {
            errorMessage =
              "The OTP you entered is incorrect. Please try again.";
          } else if (result.payload.includes("expired")) {
            errorMessage = "The OTP has expired. Please request a new one.";
          }
        }

        setError(errorMessage);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      setError("Server error. Please try again later.");
      console.error("OTP verify error:", e);
    }
  };

  const handleResetPassword = async (e) => {
    setSuccessMessage(false);
    setError(false);
    e.preventDefault();

    // Password validation
    if (!payload.newPassword) {
      setError("Please enter a new password");
      return;
    }

    if (payload.newPassword !== payload.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (payload.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      setLoading(true);
      console.log("Reset password payload:", {
        email: payload.email,
        newPassword: payload.newPassword,
      });

      const result = await dispatch(
        reset_password({
          email: payload.email,
          newPassword: payload.newPassword,
        })
      );
      console.log("Password reset result:", result);

      if (result?.payload?.success) {
        setLoading(false);

        // Show success message first
        setSuccessMessage(
          "Password changed successfully! You will be redirected to login in a moment."
        );

        // Set a timeout to redirect after showing the success message
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        // Safe error handling
        let errorMessage = "Failed to reset password. Please try again.";

        if (result?.payload?.message) {
          errorMessage = result.payload.message;
        } else if (typeof result?.payload === "string") {
          if (result.payload.includes("not found")) {
            errorMessage =
              "User account not found. Please try with a different email.";
          }
        }

        setError(errorMessage);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      setError("Server error. Please try again later.");
      console.error("Password reset error:", e);
    }
  };

  return (
    <div
      className="w-full min-h-screen relative flex items-center justify-center p-4"
    >
      <div className="relative z-10 w-full max-w-4xl">
        {loading ? (
          <div className="bg-white rounded-xl shadow-2xl p-8 flex justify-center items-center">
            <Loading />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="md:flex">
              {/* Left side - Brand/Logo */}
              <div className="bg-gradient-to-br from-blue-900 to-indigo-800 p-8 text-white md:w-2/5 flex flex-col justify-between">
                <div>
                  <div className="mb-8">
                    <img
                      src={logo}
                      alt="TAMD Health"
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Password Recovery</h2>
                  <p className="opacity-80 mb-6">
                    Forgot your password? No problem. We'll help you reset it
                    securely and get back to your account.
                  </p>
                </div>

                <div>
                  <div className="border-t border-white/20 pt-4 mt-auto">
                    <p className="text-sm opacity-70">
                      Remember your password?{" "}
                      <Link
                        to="/login"
                        className="font-medium text-white hover:underline"
                      >
                        Back to Login
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              {/* Right side - Form */}
              <div className="p-8 md:w-3/5">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                  {showEmail
                    ? "Forgot Password"
                    : showOtp
                    ? "Verify OTP"
                    : "Set New Password"}
                </h1>

                {error && (
                  <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {error}
                    </div>
                  </div>
                )}

                {successMessage && (
                  <div className="mb-6 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {successMessage}
                    </div>
                  </div>
                )}

                <form className="space-y-6">
                  {/* Email Form */}
                  {showEmail && (
                    <div>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Email Address
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaEnvelope className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={payload.email}
                              onChange={handleChange}
                              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder="Enter your email address"
                            />
                          </div>
                          <p className="mt-2 text-sm text-gray-500">
                            We'll send a one-time password to this email
                            address.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleEmailSubmit}
                        className="hover:cursor-pointer w-full mt-6 inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <FaShieldAlt className="mr-2" />
                        Send Reset OTP
                      </button>
                    </div>
                  )}

                  {/* OTP Form */}
                  {showOtp && (
                    <div>
                      <p className="text-gray-600 mb-6">
                        Enter the 6-digit OTP sent to{" "}
                        <span className="font-semibold">{payload.email}</span>
                      </p>

                      <div className="mb-6">
                        <label
                          htmlFor="otp"
                          className="block text-sm font-medium text-gray-700 mb-3"
                        >
                          Verification Code
                        </label>
                        <div
                          onPaste={handlePaste}
                          className="flex justify-between space-x-2"
                        >
                          {Array(6)
                            .fill(0)
                            .map((_, index) => (
                              <input
                                type="text"
                                maxLength="1"
                                key={index}
                                className="w-12 h-12 text-center text-2xl border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                ref={(e) => (inputRefs.current[index] = e)}
                                onChange={(e) => handleInput(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                              />
                            ))}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-4">
                        <button
                          type="button"
                          onClick={handleOtpSubmit}
                          className="hover:cursor-pointer w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <FaKey className="mr-2" />
                          Verify OTP
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setShowOtp(false);
                            setShowEmail(true);
                            setError(false);
                            setSuccessMessage(false);
                          }}
                          className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Back to Email
                        </button>
                      </div>
                    </div>
                  )}

                  {/* New Password Form */}
                  {showNewPassword && (
                    <div>
                      <p className="text-gray-600 mb-6">
                        Create a new password for your account
                      </p>

                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="newPassword"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            New Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaLock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type={passwordVisible ? "text" : "password"}
                              id="newPassword"
                              name="newPassword"
                              value={payload.newPassword}
                              onChange={(e) =>
                                setPayload({
                                  ...payload,
                                  newPassword: e.target.value,
                                })
                              }
                              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              onClick={() =>
                                setPasswordVisible(!passwordVisible)
                              }
                            >
                              {passwordVisible ? (
                                <FaRegEyeSlash className="h-5 w-5 text-gray-400" />
                              ) : (
                                <FaEye className="h-5 w-5 text-gray-400" />
                              )}
                            </button>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            Password must be at least 8 characters long
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Confirm Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaLock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="password"
                              id="confirmPassword"
                              name="confirmPassword"
                              value={payload.confirmPassword}
                              onChange={(e) =>
                                setPayload({
                                  ...payload,
                                  confirmPassword: e.target.value,
                                })
                              }
                              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder="Confirm new password"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleResetPassword}
                        className="hover:cursor-pointer w-full mt-6 inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Reset Password
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
