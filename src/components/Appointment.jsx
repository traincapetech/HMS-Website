import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Appointments = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [patientName, setPatientName] = useState("");
  const [email, setEmail] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/doctor/all")
      .then((response) => {
        if (response.data && Array.isArray(response.data.doctor)) {
          setDoctors(response.data.doctor);
          const uniqueSpecialities = [
            ...new Set(response.data.doctor.map((doc) => doc.Speciality)),
          ];
          setSpecialities(uniqueSpecialities);
        } else {
          setDoctors([]);
        }
      })
      .catch(() => {
        setDoctors([]);
      });
  }, []);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoctor || !patientName || !email || !appointmentDate || !appointmentTime) {
      alert("Please fill in all fields.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Prevent booking on past dates
    if (appointmentDate < getTodayDate()) {
      alert("You cannot book an appointment for a past date.");
      return;
    }

    const appointmentData = {
      doctorId: selectedDoctor,
      patientName,
      email,
      date: appointmentDate,
      time: appointmentTime,
    };

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/api/appointments/book", appointmentData);

      if (response.status === 201 || response.status === 200) {
        alert("Appointment booked successfully!");
        navigate("/appointments"); // Redirect to appointments list
      } else {
        throw new Error("Failed to book appointment");
      }
    } catch (error) {
      alert("Error booking appointment. Please try again.");
      console.error("Appointment Booking Error:", error);
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
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your name"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Your Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your email"
            required
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
            min={getTodayDate()} // Disable past dates
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
