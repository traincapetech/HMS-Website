// UserProfile.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/userSlice'; // Import the logout action
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const UserProfile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate

  const handleLogout = (e) => {
    e.stopPropagation(); // Prevent event propagation
    dispatch(logoutUser()); // Dispatch logout action
    navigate("/"); // Navigate to home page after logout
  };

  return (
    <div className="p-4 bg-white text-red-800 rounded-lg shadow-lg">
      <p>Name: {user?.FirstName} {user?.LastName}</p>
      <p>Email: {user?.Email}</p>
      {/* <p>Phone: {user?.Phone}</p> */}
      {/* Add other user details here */}
      <button
        onClick={handleLogout}
        className="mt-2 text-red-800 hover:text-red-600 cursor-pointer hover:bg-slate-200 text-left w-full border-t-2"
      >
        Logout
      </button>
    </div>
  );
};

export default UserProfile;