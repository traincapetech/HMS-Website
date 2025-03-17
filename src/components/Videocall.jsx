import React from "react";
import { useLocation } from "react-router-dom";

const VideoCall = () => {
  const location = useLocation();
  const { email, meetingLink } = location.state || {};

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2> Appointment Confirmed!</h2>
      {email ? (
        <>
          <p><strong>Meeting Link Sent To:</strong> {email}</p>
          <p>Check your email for the Zoom meeting details.</p>
          {meetingLink ? (
            <p>
              <strong>Or click below to join now:</strong>
              <br />
              <a 
                href={meetingLink} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: "10px",
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "5px",
                  fontSize: "16px",
                  fontWeight: "bold"
                }}
              >
                Join Meeting
              </a>
            </p>
          ) : (
            <p><strong>Meeting details will be available in your email.</strong></p>
          )}
        </>
      ) : (
        <p><strong>Error:</strong> No email provided.</p>
      )}
    </div>
  );
};

export default VideoCall;
