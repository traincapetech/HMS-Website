import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:8080");

const VideoCall = () => {
  const { appointmentId } = useParams();
  const [doctorId, setDoctorId] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);

  useEffect(() => {
    console.log("Appointment ID:", appointmentId);

    // Fetch doctor ID from API
    axios
      .get(`http://localhost:8080/api/appointments/${appointmentId}`)
      .then((res) => {
        if (res.data && res.data.doctorId) {
          console.log("Doctor ID from API:", res.data.doctorId);
          setDoctorId(res.data.doctorId);
        }
      })
      .catch((error) => {
        console.error("Error fetching doctor ID from API:", error);
      });

    return () => {
      socket.disconnect();
    };
  }, [appointmentId]);

  const startCall = async () => {
    if (!doctorId) {
      alert("Doctor ID not found. Please try again.");
      return;
    }

    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnection.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = stream;
    stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));

    // No session ID required for starting the call
    socket.emit("start-call", { doctorId, appointmentId });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">Live Video Call</h1>
      <p className="text-lg">Doctor ID: {doctorId ? doctorId : "Not Found"}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-5xl">
        <video ref={localVideoRef} autoPlay className="w-full rounded-lg border-2 border-green-500"></video>
        <video ref={remoteVideoRef} autoPlay className="w-full rounded-lg border-2 border-blue-500"></video>
      </div>
      <button onClick={startCall} className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg">Start Call</button>
    </div>
  );
};

export default VideoCall;
