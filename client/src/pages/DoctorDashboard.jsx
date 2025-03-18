import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaUser, FaClipboardList, FaCalendarCheck, FaFilePrescription, FaNotesMedical, FaSignature, FaUserMd } from "react-icons/fa";

const DoctorDashboard = () => {
  const { doctor } = useSelector((state) => state.doctor) || {};
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingPrescriptions: 0,
  });
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulating API calls
    const fetchAppointments = async () => {
      try {
        // Replace with actual API call
        // const response = await api.get("/api/doctor/appointments");
        // setAppointments(response.data);
        
        // Mock data
        setAppointments([
          {
            id: 1,
            patientName: "John Smith",
            patientEmail: "john@example.com",
            date: "2023-07-15",
            time: "10:00 AM",
            status: "Completed",
            reason: "Regular checkup",
          },
          {
            id: 2,
            patientName: "Sarah Johnson",
            patientEmail: "sarah@example.com",
            date: "2023-07-16",
            time: "11:30 AM",
            status: "Pending",
            reason: "Fever and headache",
          },
          {
            id: 3,
            patientName: "Mike Wilson",
            patientEmail: "mike@example.com",
            date: "2023-07-16",
            time: "2:00 PM",
            status: "Pending",
            reason: "Follow-up after surgery",
          },
        ]);

        // Mock stats
        setStats({
          totalPatients: 45,
          todayAppointments: 8,
          pendingPrescriptions: 3,
        });
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const renderDashboard = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-100 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-green-600">Total Patients</p>
              <p className="text-2xl font-bold text-green-800">{stats.totalPatients}</p>
            </div>
            <FaUser className="text-4xl text-green-500" />
          </div>
        </div>
        
        <div className="bg-blue-100 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-blue-600">Today's Appointments</p>
              <p className="text-2xl font-bold text-blue-800">{stats.todayAppointments}</p>
            </div>
            <FaCalendarCheck className="text-4xl text-blue-500" />
          </div>
        </div>
        
        <div className="bg-yellow-100 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending Prescriptions</p>
              <p className="text-2xl font-bold text-yellow-800">{stats.pendingPrescriptions}</p>
            </div>
            <FaFilePrescription className="text-4xl text-yellow-500" />
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-4">Upcoming Appointments</h3>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                      <div className="text-sm text-gray-500">{appointment.patientEmail}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{appointment.date}</div>
                  <div className="text-sm text-gray-500">{appointment.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{appointment.reason}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    appointment.status === "Completed" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {appointment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button 
                    onClick={() => navigate(`/doctor/prescriptions/new/${appointment.id}`)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Prescribe
                  </button>
                  <button 
                    onClick={() => navigate(`/doctor/consultations/new/${appointment.id}`)}
                    className="text-green-600 hover:text-green-900"
                  >
                    Add Notes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <FaUserMd className="h-8 w-8 text-red-700" />
                <span className="ml-2 text-2xl font-bold text-red-700">TAMD Doctor Portal</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-2">Dr. {doctor?.Name || "User"}</span>
              <button className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-1/5 bg-white p-4 rounded-lg shadow mb-6 md:mb-0 md:mr-6">
            <ul>
              <li>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full text-left mb-2 p-3 flex items-center rounded-md ${
                    activeTab === "dashboard" ? "bg-red-100 text-red-700" : "hover:bg-gray-100"
                  }`}
                >
                  <FaClipboardList className="mr-3" />
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("prescriptions")}
                  className={`w-full text-left mb-2 p-3 flex items-center rounded-md ${
                    activeTab === "prescriptions" ? "bg-red-100 text-red-700" : "hover:bg-gray-100"
                  }`}
                >
                  <FaFilePrescription className="mr-3" />
                  Prescriptions
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("consultations")}
                  className={`w-full text-left mb-2 p-3 flex items-center rounded-md ${
                    activeTab === "consultations" ? "bg-red-100 text-red-700" : "hover:bg-gray-100"
                  }`}
                >
                  <FaNotesMedical className="mr-3" />
                  Consultation Notes
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("signature")}
                  className={`w-full text-left mb-2 p-3 flex items-center rounded-md ${
                    activeTab === "signature" ? "bg-red-100 text-red-700" : "hover:bg-gray-100"
                  }`}
                >
                  <FaSignature className="mr-3" />
                  E-Signature
                </button>
              </li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-4/5 bg-white p-6 rounded-lg shadow">
            {activeTab === "dashboard" && renderDashboard()}
            {activeTab === "prescriptions" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Prescriptions</h2>
                <Link 
                  to="/doctor/prescriptions/new"
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 inline-block mb-6"
                >
                  Create New Prescription
                </Link>
                <p className="text-gray-600">Use this section to manage your patient prescriptions. Click on "Create New Prescription" to create a new prescription for a patient.</p>
              </div>
            )}
            {activeTab === "consultations" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Consultation Notes</h2>
                <Link 
                  to="/doctor/consultations/new"
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 inline-block mb-6"
                >
                  Create New Consultation Note
                </Link>
                <p className="text-gray-600">Create and manage detailed consultation notes for patient visits. These notes can help track patient progress over time.</p>
              </div>
            )}
            {activeTab === "signature" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">E-Signature Setup</h2>
                <div className="mb-6 p-4 border border-gray-300 rounded-lg">
                  <p className="text-gray-700 mb-4">Upload or create your digital signature to use on prescriptions and medical documents.</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Upload Signature Image</button>
                    <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Draw Signature</button>
                  </div>
                </div>
                <p className="text-gray-600">Your signature will be securely stored and used to authenticate prescriptions and other medical documents you issue.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard; 