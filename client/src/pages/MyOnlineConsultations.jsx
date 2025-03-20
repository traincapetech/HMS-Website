import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/userSlice";
import axios from "axios";

const MyOnlineConsultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle state
  
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.Email) {
      fetchConsultations();
    }
  }, [user]);

  const fetchConsultations = async () => {
    try {
      // Assuming you have an endpoint for online consultations
      const response = await axios.get("https://hms-backend-1-pngp.onrender.com/api/consultations/all");
      if (Array.isArray(response.data)) {
        const userConsultations = response.data.filter(
          (consultation) => consultation.Email === user.Email
        );
        setConsultations(userConsultations);
      } else {
        setConsultations([]);
        setError("Unexpected data format received.");
      }
    } catch (err) {
      console.error("Error fetching consultations:", err);
      setError("No online consultations found.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinConsultation = (consultationId) => {
    // Navigate to the video consultation room
    navigate(`/consultation-room/${consultationId}`);
  };

  const handleCancelConsultation = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this online consultation?")) {
      return;
    }

    try {
      const response = await axios.delete(`https://hms-backend-1-pngp.onrender.com/api/consultations/${id}`);

      if (response.status === 200) {
        setConsultations(consultations.filter((consultation) => consultation._id !== id));
        alert("Online consultation canceled successfully.");
      } else {
        alert("Failed to cancel consultation. Please try again.");
      }
    } catch (error) {
      console.error("Error canceling consultation:", error);
      alert("Failed to cancel consultation. Please try again.");
    }
  };

  const handleReschedule = (consultation) => {
    navigate(
      `/book-consultation?speciality=${consultation.Speciality}&doctor=${consultation.Doctor}&date=${consultation.ConsultDate}&time=${consultation.ConsultTime}`
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
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle Button */}
      <button
        className="md:hidden p-3 bg-gray-200 w-full text-left text-xl"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        ☰ Menu
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-100 p-6 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <button
          className="md:hidden text-right w-full text-gray-700 text-2xl"
          onClick={() => setIsSidebarOpen(false)}
        >
          ✕
        </button>

        {/* <div className="flex items-center mb-6">
          <img
            src={user?.photo || "https://accounts.practo.com/profile_picture/22269865/medium_thumbnail"}
            alt="User"
            className="w-16 h-16 rounded-lg border-2 border-gray-300"
          />
          <div className="ml-3">
            <p className="font-semibold">{user?.UserName || "User"}</p>
            <p className="text-sm text-gray-500">{user?.Mobile || "No Mobile Number"}</p>
          </div>
        </div> */}
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
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">My Online Consultations</h2>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Online Consultation History</h3>

          {loading ? (
            <p>Loading online consultations...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : consultations.length === 0 ? (
            <p className="text-gray-600">No online consultations found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-2">Consultation ID</th>
                    <th className="border border-gray-300 p-2">Date</th>
                    <th className="border border-gray-300 p-2">Time</th>
                    <th className="border border-gray-300 p-2">Doctor</th>
                    <th className="border border-gray-300 p-2">Speciality</th>
                    <th className="border border-gray-300 p-2">Status</th>
                    <th className="border border-gray-300 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {consultations.map((consultation) => {
                    const consultDate = new Date(consultation.ConsultDate);
                    const consultTime = consultation.ConsultTime;
                    const [hours, minutes] = consultTime.split(':').map(Number);
                    
                    consultDate.setHours(hours, minutes);
                    const isUpcoming = consultDate > new Date();
                    const status = isUpcoming ? "Upcoming" : "Completed";
                    
                    return (
                      <tr key={consultation._id} className="text-center">
                        <td className="border border-gray-300 p-2">{consultation._id}</td>
                        <td className="border border-gray-300 p-2">{new Date(consultation.ConsultDate).toLocaleDateString()}</td>
                        <td className="border border-gray-300 p-2">{consultation.ConsultTime}</td>
                        <td className="border border-gray-300 p-2">{consultation.Doctor}</td>
                        <td className="border border-gray-300 p-2">{consultation.Speciality}</td>
                        <td className={`border border-gray-300 p-2 ${isUpcoming ? "text-green-600" : "text-gray-600"}`}>
                          {status}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {isUpcoming && (
                            <div className="flex flex-col md:flex-row gap-2 justify-center">
                              <button
                                onClick={() => handleJoinConsultation(consultation._id)}
                                className="bg-green-500 text-white px-3 py-1 rounded"
                              >
                                Join
                              </button>
                              <button
                                onClick={() => handleReschedule(consultation)}
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                              >
                                Reschedule
                              </button>
                              <button
                                onClick={() => handleCancelConsultation(consultation._id)}
                                className="bg-red-500 text-white px-3 py-1 rounded"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                          {!isUpcoming && (
                            <button
                              onClick={() => navigate(`/consultation-summary/${consultation._id}`)}
                              className="bg-blue-500 text-white px-3 py-1 rounded"
                            >
                              View Summary
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOnlineConsultations;