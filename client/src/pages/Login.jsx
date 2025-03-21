import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/userSlice";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if coming from a specific page like appointments
  const fromPage = location.state?.from;
  const justRegistered = location.state?.justRegistered;

  // Access loading and error states from Redux store
  const { loading, error } = useSelector((state) => state.user);

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    // Dispatch the loginUser action with email and password
    const resultAction = await dispatch(loginUser({ email, password }));

    // If login is successful, navigate back to the original page if applicable
    if (loginUser.fulfilled.match(resultAction)) {
      if (fromPage === "appointments") {
        navigate("/Appointments");
      } else {
        navigate("/"); // Default: Redirect to home page
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-red-800 mb-6">
          Login to Your Account
        </h2>
        
        {/* Show message if redirected from appointments */}
        {fromPage === "appointments" && !justRegistered && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md">
            Please login to book your appointment. 
            New patient? Sign up for an account first.
          </div>
        )}
        
        {/* Show message if just registered from appointments */}
        {fromPage === "appointments" && justRegistered && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
            Registration successful! Please log in with your new account to complete your appointment booking.
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-lg text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-lg text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-800 text-white rounded-md hover:bg-red-700 transition duration-300"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Display error message if login fails */}
        {error && <div className="mt-4 text-center text-red-600">{error}</div>}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link 
              to={fromPage ? { pathname: "/signup", state: { from: fromPage } } : "/signup"} 
              className="text-red-600 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;