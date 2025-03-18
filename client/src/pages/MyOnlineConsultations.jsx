import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const OnlineConsultations = () => {
  const { user, token } = useSelector((state) => state.user);
  const [consultations, setConsultations] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulating API call to fetch user online consultations
    const fetchConsultations = async () => {
      try {
        const response = await fetch("/api/online-consultations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setConsultations(data);
      } catch (error) {
        console.error("Error fetching consultations:", error);
      }
    };

    if (token) fetchConsultations();
  }, [token]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };
  
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-6">
        <div className="flex items-center mb-6">
          <img
            src={user?.photo || "https://accounts.practo.com/profile_picture/22269865/medium_thumbnail"}
            alt="User"
            className="w-16 h-16 rounded-lg border-2 border-gray-300"
          />
          <div className="ml-3">
            <p className="font-semibold">{user?.UserName || "User"}</p>
            <p className="text-sm text-gray-500">{user?.Mobile || "No Mobile Number"}</p>
          </div>
        </div>
        <ul className="space-y-3">
          <li><Link to="/MyAppointments" className="block py-2 px-3 rounded-lg hover:bg-gray-200">My Appointments</Link></li>
          <li><Link to="/MyTests" className="block py-2 px-3 rounded-lg hover:bg-gray-200">My Tests</Link></li>
          <li><Link to="/MyMedicalRecords" className="block py-2 px-3 rounded-lg hover:bg-gray-200">My Medical Records</Link></li>
          <li><Link to="/OnlineConsultations" className="block py-2 px-3 rounded-lg hover:bg-gray-200 font-bold">My Online Consultations</Link></li>
          <li><Link to="/MyFeedback" className="block py-2 px-3 rounded-lg hover:bg-gray-200">My Feedback</Link></li>
          <li><Link to="/Profile" className="block py-2 px-3 rounded-lg hover:bg-gray-200">View / Update Profile</Link></li>
          <li><Link to="/Payments" className="block py-2 px-3 rounded-lg hover:bg-gray-200">Payments</Link></li>
          <li><button onClick={handleLogout} className="w-full text-left py-2 px-3 text-red-500 hover:bg-gray-200">Logout</button></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6">
        <h2 className="text-2xl font-bold mb-4">My Online Consultations</h2>
        {consultations.length > 0 ? (
          <ul className="space-y-4">
            {consultations.map((consultation) => (
              <li key={consultation.id} className="p-4 border rounded-lg">
                <p><strong>Doctor:</strong> {consultation.doctorName}</p>
                <p><strong>Date:</strong> {consultation.date}</p>
                <p><strong>Time:</strong> {consultation.time}</p>
                <p><strong>Status:</strong> {consultation.status}</p>
                <p><strong>Type:</strong> {consultation.isPaid ? "Paid" : "Free"}</p>
                {consultation.isPaid && (
                  <p><strong>Amount Paid:</strong> ₹{consultation.amount}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No online consultations found.</p>
        )}
      </div>
    </div>
  );
};

export default OnlineConsultations;