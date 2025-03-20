import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginDoctor, clearError } from '../redux/doctorSlice';
import { FaUserMd, FaLock, FaExclamationCircle } from 'react-icons/fa';

const DoctorLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.doctor);
  const [formData, setFormData] = useState({
    email: 'doctor@test.com',
    password: 'password123',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [autoLogin, setAutoLogin] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/doctor/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // TEMPORARY: Quick access option
  useEffect(() => {
    if (autoLogin) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        // Manual dispatch to update Redux state
        dispatch({
          type: 'doctor/login/fulfilled',
          payload: {
            token: 'temp-token-for-testing',
            doctor: {
              id: 'temp-id',
              name: 'Test Doctor',
              email: 'doctor@test.com',
              specialization: 'General Medicine'
            }
          }
        });
        navigate('/doctor/dashboard');
      }
    }
  }, [autoLogin, countdown, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // TEMPORARY: Direct login for testing
    dispatch({
      type: 'doctor/login/fulfilled',
      payload: {
        token: 'temp-token-for-testing',
        doctor: {
          id: 'temp-id',
          name: 'Test Doctor',
          email: formData.email,
          specialization: 'General Medicine'
        }
      }
    });
    navigate('/doctor/dashboard');

    // Original code (commented out)
    // try {
    //   await dispatch(loginDoctor(formData)).unwrap();
    //   navigate('/doctor/dashboard');
    // } catch (error) {
    //   console.error('Login failed:', error);
    // }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <FaUserMd className="h-12 w-12 text-red-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Doctor Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Access your medical dashboard
        </p>
      </div>

      {/* TEMPORARY: Quick access option */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mt-4">
        <button 
          onClick={() => setAutoLogin(true)}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {autoLogin 
            ? `Auto-login in ${countdown} seconds...` 
            : 'Quick Access (for testing)'}
        </button>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserMd className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${
                    validationErrors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${
                    validationErrors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {validationErrors.password}
                </p>
              )}
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FaExclamationCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
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
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Signing in...' : 'Sign in'}
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
                Register as a Doctor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin; 