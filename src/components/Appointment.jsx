import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Appointments = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { user, token } = useSelector((state) => state.user); // Get logged-in user

  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redirect if not logged in
    }
  }, [token, navigate]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/doctor/all")
      .then((response) => {
        if (response.data && Array.isArray(response.data.doctor)) {
          setDoctors(response.data.doctor);
          const uniqueSpecialities = [...new Set(response.data.doctor.map((doc) => doc.Speciality))];
          setSpecialities(uniqueSpecialities);
        }
      })
      .catch((error) => console.error("Error fetching doctors:", error));
  }, []);

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSpeciality || !selectedDoctor || !appointmentDate || !appointmentTime) {
      alert("Please fill in all fields.");
      return;
    }

    if (appointmentDate < getTodayDate()) {
      alert("You cannot book an appointment for a past date.");
      return;
    }

    const doctorDetails = doctors.find((doc) => doc._id === selectedDoctor);
    const doctorName = doctorDetails ? doctorDetails.Name : "";

    const appointmentData = {
      Speciality: selectedSpeciality,
      Doctor: doctorName,
      Name: user?.UserName, // Auto-fill logged-in user name
      Email: user?.Email, // Auto-fill logged-in user email
      AppointDate: appointmentDate,
      AppointTime: appointmentTime,
    };

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/api/appoint/create", appointmentData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201 || response.status === 200) {
        alert("Appointment booked successfully!");

        // Fetch Zoom meeting details
        const zoomResponse = await axios.post("http://localhost:8080/api/zoom/ZoomMeeting", { email: user?.Email });

        if (zoomResponse.status === 200) {
          const { meetingLink } = zoomResponse.data;

          // Redirect to VideoCall page with meeting details
          navigate("/videocall", { state: { email: user?.Email, meetingLink } });
        } else {
          alert("Zoom meeting creation failed, but appointment is booked.");
          navigate("/videocall", { state: { email: user?.Email, meetingLink: null } });
        }
      } else {
        throw new Error("Failed to book appointment");
      }
    } catch (error) {
      console.error("Appointment Booking Error:", error.response?.data || error);
      alert("Error booking appointment: " + (error.response?.data?.message || "Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Book an Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Select Speciality:</label>
          <select
            value={selectedSpeciality}
            onChange={(e) => setSelectedSpeciality(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">-- Choose Speciality --</option>
            {specialities.map((speciality, index) => (
              <option key={index} value={speciality}>{speciality}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold">Select Doctor:</label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="w-full p-2 border rounded"
            required
            disabled={!selectedSpeciality}
          >
            <option value="">-- Choose a Doctor --</option>
            {doctors
              .filter((doctor) => doctor.Speciality === selectedSpeciality)
              .map((doctor) => (
                <option key={doctor._id} value={doctor._id}>{doctor.Name} - {doctor.Speciality}</option>
              ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold">Your Name:</label>
          <input
            type="text"
            value={user?.UserName || ""}
            className="w-full p-2 border rounded bg-gray-100"
            readOnly
          />
        </div>
        <div>
          <label className="block font-semibold">Your Email:</label>
          <input
            type="email"
            value={user?.Email || ""}
            className="w-full p-2 border rounded bg-gray-100"
            readOnly
          />
        </div>
        <div>
          <label className="block font-semibold">Appointment Date:</label>
          <input
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
            min={getTodayDate()} // Prevent past date selection
          />
        </div>
        <div>
          <label className="block font-semibold">Appointment Time:</label>
          <input
            type="time"
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-red-700 text-white py-2 rounded hover:bg-red-800 transition duration-300"
          disabled={loading}
        >
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </form>
    </div>
  );
};

export default Appointments;
