import React, { useEffect, useState } from "react";
import axios from "../utils/api";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user-specific appointments (doctor or patient)
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`/api/appointments/${user._id}`);
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [user]);

  // Function to start a video call without session ID
  const startVideoCall = (appointmentId) => {
    // Redirect to a general video call page
    navigate(`/video-call`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>

        {appointments.length === 0 ? (
          <p className="text-gray-500">No upcoming appointments.</p>
        ) : (
          <ul>
            {appointments.map((appointment) => (
              <li key={appointment._id} className="p-4 border-b flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">
                    {appointment.patientName} with {appointment.doctorName}
                  </p>
                  <p className="text-gray-500">
                    Date: {new Date(appointment.date).toLocaleString()}
                  </p>
                </div>

                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  onClick={() => startVideoCall(appointment._id)}
                >
                  Start Call
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
