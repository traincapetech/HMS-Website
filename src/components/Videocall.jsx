import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const VideoCall = () => {
  const { appointmentId } = useParams();
  const [meetingData, setMeetingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/zoom/meeting/${appointmentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.join_url) {
          setMeetingData(data);
        } else {
          setError("Failed to fetch Zoom meeting details.");
        }
      })
      .catch((error) => {
        console.error("Error fetching Zoom meeting:", error);
        setError("Unable to connect to the server.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [appointmentId]);

  if (loading) return <p className="text-white">Loading meeting details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">Zoom Video Call</h1>

      <p className="text-lg mb-4">Meeting ID: {meetingData.id}</p>

      {/* Open Zoom in a new tab */}
      <a
        href={meetingData.join_url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg"
      >
        Join Meeting
      </a>
    </div>
  );
};

export default VideoCall;
