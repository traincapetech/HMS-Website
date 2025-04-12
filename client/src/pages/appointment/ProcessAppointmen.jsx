import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
// import LoadingSpinner from "../components/LoadingSpinner";

const ProcessAppointmentPage = () => {
  const API_BASE_URL = "http://localhost:8080/api";
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Initializing");

  // Get the token
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Process appointment data after payment
    const createAppointment = async () => {
      if (!location.state || !location.state.appointmentData) {
        toast.error("No appointment data found");
        navigate("/Appointments");
        return;
      }

      const { appointmentData, files } = location.state;
      console.log("fetched data------->", appointmentData);
      try {
        setStatus("Creating appointment...");

        // Create a timestamp-based ID for local storage (fallback)
        const localAppointmentId = `local-${Date.now()}`;

        console.log(
          `Making API call to create appointment: ${API_BASE_URL}/appoint/create`
        );

        const response = await axios({
          method: "post",
          url: `${API_BASE_URL}/appoint/create`,
          data: appointmentData,
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          timeout: 10000,
        });

        console.log("API Response:", response);

        if (response && response.data) {
          console.log(
            "Successfully saved appointment to database:",
            response.data
          );

          // Get ID from response
          const serverAppointmentId =
            response.data.appointmentId ||
            response.data._id ||
            response.data.id;

          // Handle file uploads if needed
          if (files && files.length > 0 && serverAppointmentId) {
            setStatus("Uploading documents...");
            await uploadFiles(serverAppointmentId, files, token);
          }

          // Show success message
          toast.success("Appointment successfully booked!");

          // Redirect to confirmation page
          navigate("/appointment-confirmed", {
            state: {
              appointmentId: serverAppointmentId || localAppointmentId,
              doctorName: appointmentData.Doctor,
              appointmentDate:
                appointmentData.AppointDate || appointmentData.appointmentDate,
              appointmentTime:
                appointmentData.AppointTime || appointmentData.appointmentTime,
              offlineMode: false,
              pendingSync: false,
              hasDocuments: files && files.length > 0,
              paymentCompleted: true,
              paymentAmount: appointmentData.paymentAmount,
            },
          });
          return;
        }
      } catch (apiError) {
        console.error("Error creating appointment:", apiError);

        handleApiError(apiError, appointmentData, files, localAppointmentId);
      }
    };

    createAppointment();
  }, [location, navigate, token]);

  // Function to upload files
  const uploadFiles = async (appointmentId, files, authToken) => {
    try {
      console.log(
        `Uploading ${files.length} files for appointment ${appointmentId}`
      );

      const formData = new FormData();
      formData.append("appointmentId", appointmentId);

      files.forEach((fileObj, index) => {
        formData.append(`document_${index}`, fileObj.file);
      });

      const response = await axios({
        method: "post",
        url: `${API_BASE_URL}/documents/upload`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: authToken ? `Bearer ${authToken}` : "",
        },
        timeout: 30000,
      });

      console.log("Files uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.warning(
        "Appointment created but there was an issue uploading documents."
      );
    }
  };

  // Handle API errors with fallback to local storage
  const handleApiError = (
    error,
    appointmentData,
    files,
    localAppointmentId
  ) => {
    console.error("API error details:", error);

    if (error.response) {
      console.error("API response status:", error.response.status);
      console.error("API response data:", error.response.data);
    }

    // Create local appointment for fallback
    const localAppointment = {
      _id: localAppointmentId,
      doctorId: appointmentData.doctorId,
      doctorName: appointmentData.Doctor,
      specialty: appointmentData.Speciality,
      appointmentDate:
        appointmentData.AppointDate || appointmentData.appointmentDate,
      appointmentTime:
        appointmentData.AppointTime || appointmentData.appointmentTime,
      name: appointmentData.Name || appointmentData.fullName,
      email: appointmentData.Email || appointmentData.email,
      phone: appointmentData.Phone || appointmentData.phone,
      symptoms:
        appointmentData.Symptoms || appointmentData.symptoms || "Not specified",
      status: "Active",
      createdAt: new Date().toISOString(),
      hasDocuments: files && files.length > 0,
      paymentCompleted: true,
      paymentId: appointmentData.paymentId,
      paymentAmount: appointmentData.paymentAmount,
    };

    // Save to local storage
    saveLocalBooking(localAppointment);
    savePendingSync({
      ...appointmentData,
      fileCount: files ? files.length : 0,
    });

    // Show message
    toast.warning(
      "Could not connect to server. Appointment saved locally and will sync when connection is restored."
    );

    // Redirect to confirmation page with offline mode flag
    navigate("/appointment-confirmed", {
      state: {
        appointmentId: localAppointmentId,
        doctorName: appointmentData.Doctor,
        appointmentDate:
          appointmentData.AppointDate || appointmentData.appointmentDate,
        appointmentTime:
          appointmentData.AppointTime || appointmentData.appointmentTime,
        offlineMode: true,
        pendingSync: true,
        hasDocuments: files && files.length > 0,
        paymentCompleted: true,
        paymentAmount: appointmentData.paymentAmount,
      },
    });
  };

  // Function to save booking to local storage
  const saveLocalBooking = (booking) => {
    const existingBookings = JSON.parse(
      localStorage.getItem("localAppointments") || "[]"
    );
    existingBookings.push(booking);
    localStorage.setItem("localAppointments", JSON.stringify(existingBookings));
    console.log("Appointment saved to local storage:", booking);
  };

  // Function to save pending sync data
  const savePendingSync = (data) => {
    const pendingSyncs = JSON.parse(
      localStorage.getItem("pendingSyncs") || "[]"
    );
    pendingSyncs.push({
      type: "appointment",
      data: data,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("pendingSyncs", JSON.stringify(pendingSyncs));
    console.log("Added to pending sync queue:", data);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        {/* <LoadingSpinner size="large" /> */}
        <h2 className="text-xl font-semibold mt-4 mb-2">
          Processing Your Appointment
        </h2>
        <p className="text-gray-600 mb-2">{status}</p>
        <p className="text-sm text-gray-500">
          Please do not close this window...
        </p>
      </div>
    </div>
  );
};

export default ProcessAppointmentPage;
