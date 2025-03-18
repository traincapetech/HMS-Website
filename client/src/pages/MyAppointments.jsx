import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/userSlice";
import axios from "axios";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.Email) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("https://hms-backend-1-pngp.onrender.com/api/appoint/all");
      if (Array.isArray(response.data)) {
        const userAppointments = response.data.filter(
          (appointment) => appointment.Email === user.Email
        );
        setAppointments(userAppointments);
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      const response = await axios.delete(`https://hms-backend-1-pngp.onrender.com/api/appoint/${id}`);

      if (response.status === 200) {
        setAppointments(appointments.filter((appointment) => appointment._id !== id));
        alert("Appointment canceled successfully.");
      } else {
        alert("Failed to cancel appointment. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("Failed to cancel appointment. Please try again.");
    }
  };

  const handleReschedule = (appointment) => {
    navigate(
      `/appointments?speciality=${appointment.Speciality}&doctor=${appointment.Doctor}&date=${appointment.AppointDate}&time=${appointment.AppointTime}`
    );
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
          <li><Link to="/MyAppointments" className="block py-2 px-3 rounded-lg hover:bg-gray-200 font-bold">My Appointments</Link></li>
          <li><Link to="/MyTests" className="block py-2 px-3 rounded-lg hover:bg-gray-200">My Tests</Link></li>
          <li><Link to="/MyMedicalRecords" className="block py-2 px-3 rounded-lg hover:bg-gray-200">My Medical Records</Link></li>
          <li><Link to="/OnlineConsultations" className="block py-2 px-3 rounded-lg hover:bg-gray-200">My Online Consultations</Link></li>
          <li><Link to="/MyFeedback" className="block py-2 px-3 rounded-lg hover:bg-gray-200">My Feedback</Link></li>
          <li><Link to="/Profile" className="block py-2 px-3 rounded-lg hover:bg-gray-200">View / Update Profile</Link></li>
          <li><Link to="/Payments" className="block py-2 px-3 rounded-lg hover:bg-gray-200">Payments</Link></li>
          <li><button onClick={handleLogout} className="w-full text-left py-2 px-3 text-red-500 hover:bg-gray-200">Logout</button></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6">
        <h2 className="text-2xl font-bold mb-4">My Appointments</h2>

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
                  <th className="border border-gray-300 p-2">Appointment ID</th>
                  <th className="border border-gray-300 p-2">Date</th>
                  <th className="border border-gray-300 p-2">Time</th>
                  <th className="border border-gray-300 p-2">Doctor</th>
                  <th className="border border-gray-300 p-2">Speciality</th>
                  <th className="border border-gray-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id} className="text-center">
                    <td className="border border-gray-300 p-2">{appointment._id}</td>
                    <td className="border border-gray-300 p-2">{new Date(appointment.AppointDate).toLocaleDateString()}</td>
                    <td className="border border-gray-300 p-2">{appointment.AppointTime}</td>
                    <td className="border border-gray-300 p-2">{appointment.Doctor}</td>
                    <td className="border border-gray-300 p-2">{appointment.Speciality}</td>
                    <td className="border border-gray-300 p-2">
                      <button
                        onClick={() => handleReschedule(appointment)}
                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleDelete(appointment._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </td>
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