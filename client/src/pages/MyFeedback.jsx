import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const MyFeedback = () => {
  const { user, token } = useSelector((state) => state.user);
  const [feedbacks, setFeedbacks] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [selectedType, setSelectedType] = useState("doctor");
  const [selectedId, setSelectedId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Fetch existing feedback
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch("/api/feedbacks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setFeedbacks(data);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    if (token) fetchFeedbacks();
  }, [token]);

  // Fetch doctors and hospitals for dropdown selection
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/doctors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    const fetchHospitals = async () => {
      try {
        const response = await fetch("/api/hospitals", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setHospitals(data);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };

    if (token) {
      fetchDoctors();
      fetchHospitals();
    }
  }, [token]);

  // Handle feedback submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedId) {
      alert("Please select a doctor or hospital to review.");
      return;
    }

    const feedbackData = {
      type: selectedType,
      entityId: selectedId,
      rating,
      comment,
      userId: user?.id,
    };

    try {
      const response = await fetch("/api/feedbacks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        const newFeedback = await response.json();
        setFeedbacks([newFeedback, ...feedbacks]); // Update UI immediately
        setSelectedId("");
        setRating(5);
        setComment("");
        alert("Feedback submitted successfully!");
      } else {
        alert("Error submitting feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
          <li><Link to="/my-medical-records" className="block py-2 px-3 rounded-lg hover:bg-gray-200">My Medical Records</Link></li>
          <li><Link to="/my-online-consultations" className="block py-2 px-3 rounded-lg hover:bg-gray-200">My Online Consultations</Link></li>
          <li><Link to="/my-feedback" className="block py-2 px-3 rounded-lg hover:bg-gray-200 font-bold">My Feedback</Link></li>
          <li><Link to="/profile" className="block py-2 px-3 rounded-lg hover:bg-gray-200">View / Update Profile</Link></li>
          <li><Link to="/payments" className="block py-2 px-3 rounded-lg hover:bg-gray-200">Payments</Link></li>
          <li><button className="w-full text-left py-2 px-3 text-red-500 hover:bg-gray-200">Logout</button></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6">
        <h2 className="text-2xl font-bold mb-4">Provide Feedback</h2>

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} className="p-4 border rounded-lg mb-6">
          <label className="block mb-2">Select Feedback Type:</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
          >
            <option value="doctor">Doctor</option>
        </select>

          <label className="block mb-2">Select {selectedType === "doctor" ? "Doctor" : "Hospital"}:</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
          >
            <option value="">Select</option>
            {selectedType === "doctor"
              ? doctors.map((doc) => <option key={doc.id} value={doc.id}>{doc.name}</option>)
              : hospitals.map((hos) => <option key={hos.id} value={hos.id}>{hos.name}</option>)
            }
          </select>

          <label className="block mb-2">Rating:</label>
          <input
            type="number"
            value={rating}
            min="1"
            max="5"
            onChange={(e) => setRating(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
          />

          <label className="block mb-2">Your Feedback:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
          ></textarea>

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Submit Feedback</button>
        </form>
      </div>
    </div>
  );
};

export default MyFeedback;