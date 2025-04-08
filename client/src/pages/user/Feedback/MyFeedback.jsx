import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../../redux/userSlice";

const MyFeedback = () => {
  const { user, token } = useSelector((state) => state.user);
  const [feedbacks, setFeedbacks] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [selectedType, setSelectedType] = useState("doctor");
  const [selectedId, setSelectedId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        const response = await fetch(
          "https://hms-backend-1-pngp.onrender.com/api/doctor/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      {/* Main Content */}
      <div className="w-full p-6">
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

          <label className="block mb-2">
            Select {selectedType === "doctor" ? "Doctor" : "Hospital"}:
          </label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
          >
            <option value="">Select</option>
            {selectedType === "doctor"
              ? doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))
              : hospitals.map((hos) => (
                  <option key={hos.id} value={hos.id}>
                    {hos.name}
                  </option>
                ))}
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

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default MyFeedback;
