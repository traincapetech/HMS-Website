import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const MyMedicalRecords = () => {
  const { user, token } = useSelector((state) => state.user);
  const [medicalRecords, setMedicalRecords] = useState([]);

  useEffect(() => {
    // Simulating API call to fetch user medical records
    const fetchMedicalRecords = async () => {
      try {
        const response = await fetch("/api/medical-records", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setMedicalRecords(data);
      } catch (error) {
        console.error("Error fetching medical records:", error);
      }
    };

    if (token) fetchMedicalRecords();
  }, [token]);

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
          <li><Link to="/my-appointments" className="block py-2 px-3 rounded-lg hover:bg-gray-200">My Appointments</Link></li>
          <li><Link to="/my-tests" className="block py-2 px-3 rounded-lg hover:bg-gray-200">My Tests</Link></li>
          <li><Link to="/my-medical-records" className="block py-2 px-3 rounded-lg hover:bg-gray-200 font-bold">My Medical Records</Link></li>
          <li><Link to="/my-online-consultations" className="block py-2 px-3 rounded-lg hover:bg-gray-200">My Online Consultations</Link></li>
          <li><Link to="/my-feedback" className="block py-2 px-3 rounded-lg hover:bg-gray-200">My Feedback</Link></li>
          <li><Link to="/profile" className="block py-2 px-3 rounded-lg hover:bg-gray-200">View / Update Profile</Link></li>
          <li><Link to="/payments" className="block py-2 px-3 rounded-lg hover:bg-gray-200">Payments</Link></li>
          <li><Link to="/settings" className="block py-2 px-3 rounded-lg hover:bg-gray-200">Settings</Link></li>
          <li><button className="w-full text-left py-2 px-3 text-red-500 hover:bg-gray-200">Logout</button></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6">
        <h2 className="text-2xl font-bold mb-4">My Medical Records</h2>
        {medicalRecords.length > 0 ? (
          <ul className="space-y-4">
            {medicalRecords.map((record) => (
              <li key={record.id} className="p-4 border rounded-lg">
                <p><strong>Record Type:</strong> {record.type}</p>
                <p><strong>Date:</strong> {record.date}</p>
                <p><strong>Doctor:</strong> {record.doctor}</p>
                <p><strong>Notes:</strong> {record.notes}</p>
                {record.file ? (
                  <a href={record.file} download className="text-blue-500 underline">Download File</a>
                ) : (
                  <p className="text-red-500"><strong>No File Available</strong></p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No medical records found.</p>
        )}
      </div>
    </div>
  );
};

export default MyMedicalRecords;
