import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch logged-in user details
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Fetch appointment history
  const fetchAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/appoint/all");
      console.log("Fetched Appointments:", response.data);
      
      if (Array.isArray(response.data)) {
        setAppointments(response.data);
      } else {
        setAppointments([]);
        setError("Unexpected data format received.");
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
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
          <li><Link to="/my-appointments" className="block py-2 px-3 rounded-lg hover:bg-gray-200 font-bold">My Appointments</Link></li>
          <li><Link to="/my-tests" className="block py-2 px-3 rounded-lg hover:bg-gray-200">My Tests</Link></li>
          <li><Link to="/my-medical-records" className="block py-2 px-3 rounded-lg hover:bg-gray-200">My Medical Records</Link></li>
          <li><Link to="/my-online-consultations" className="block py-2 px-3 rounded-lg hover:bg-gray-200">My Online Consultations</Link></li>
          <li><Link to="/my-feedback" className="block py-2 px-3 rounded-lg hover:bg-gray-200">My Feedback</Link></li>
          <li><Link to="/profile" className="block py-2 px-3 rounded-lg hover:bg-gray-200">View / Update Profile</Link></li>
          <li><Link to="/payments" className="block py-2 px-3 rounded-lg hover:bg-gray-200">Payments</Link></li>
          <li><button className="w-full text-left py-2 px-3 text-red-500 hover:bg-gray-200">Logout</button></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6">
        <h2 className="text-2xl font-bold mb-4">My Appointments</h2>

        {/* Appointment History */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Appointment History</h3>

          {loading ? (
            <p>Loading appointments...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : appointments.length === 0 ? (
            <p className="text-gray-600">No appointments found.</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Date</th>
                  <th className="border border-gray-300 p-2">Time</th>
                  <th className="border border-gray-300 p-2">Doctor</th>
                  <th className="border border-gray-300 p-2">Speciality</th>
                  <th className="border border-gray-300 p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment, index) => (
                  <tr key={index} className="text-center">
                    <td className="border border-gray-300 p-2">{new Date(appointment.AppointDate).toLocaleDateString()}</td>
                    <td className="border border-gray-300 p-2">{appointment.AppointTime}</td>
                    <td className="border border-gray-300 p-2">{appointment.Doctor}</td>
                    <td className="border border-gray-300 p-2">{appointment.Speciality}</td>
                    <td className="border border-gray-300 p-2 text-yellow-600">Pending</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;