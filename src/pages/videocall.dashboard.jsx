import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/appointment/")
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error("Error fetching appointments:", err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Appointments</h1>
      <table className="min-w-full bg-white border rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Doctor</th>
            <th className="py-2 px-4 border">Patient</th>
            <th className="py-2 px-4 border">Date</th>
            <th className="py-2 px-4 border">Time</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment._id}>
              <td className="py-2 px-4 border">{appointment.doctorId}</td>
              <td className="py-2 px-4 border">{appointment.patientId}</td>
              <td className="py-2 px-4 border">{appointment.date}</td>
              <td className="py-2 px-4 border">{appointment.time}</td>
              <td className="py-2 px-4 border">
                <Link
                  to={`/video-call/${appointment._id}`}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Start Video Call
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
