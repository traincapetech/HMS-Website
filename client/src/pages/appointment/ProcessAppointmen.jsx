import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import api, { API_BASE_URL } from '../../utils/app.api';
// import LoadingSpinner from "../components/LoadingSpinner";

const ProcessAppointmentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Initializing");
  // Define localAppointmentId at component level for global access
  const localAppointmentId = `local-${Date.now()}`;

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
        // If the backend requires files, create a dummy file if none exists
        const processedFiles = files && files.length > 0 ? files : [
          { 
            file: new File(["dummy content"], "dummy.txt", { type: "text/plain" }),
            name: "dummy.txt" 
          }
        ];
        
        setStatus("Creating appointment...");

        // Create form data with all appointment fields and files
        const formData = new FormData();
        
        // Add all appointment data fields
        Object.keys(appointmentData).forEach(key => {
          formData.append(key, appointmentData[key]);
        });
        
        // Add files to the form data
        processedFiles.forEach((fileObj, index) => {
          formData.append(`document_${index}`, fileObj.file);
        });
        
        console.log(`Using localAppointmentId: ${localAppointmentId}`);
        console.log(`Making API call to create appointment: ${API_BASE_URL}/appoint/create`);

        const response = await axios({
          method: "post",
          url: `${API_BASE_URL}/appoint/create`,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token ? `Bearer ${token}` : "",
          },
          timeout: 20000, // Increase timeout for larger uploads
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
              hasDocuments: processedFiles.length > 0,
              paymentCompleted: true,
              paymentAmount: appointmentData.paymentAmount,
            },
          });
          return;
        }
      } catch (apiError) {
        console.error("Error creating appointment:", apiError);
        
        try {
          // Log detailed error information
          if (apiError.response) {
            console.error("Error response data:", apiError.response.data);
            console.error("Error response status:", apiError.response.status);
          }
          
          // Call handleApiError with current localAppointmentId
          handleApiError(apiError, appointmentData, files || [], localAppointmentId);
        } catch (fallbackError) {
          console.error("Error in error handler:", fallbackError);
          
          // Ultimate fallback - navigate to home with error message
          toast.error("Could not process appointment. Please try again later.");
          navigate("/");
        }
      }
    };

    createAppointment();
  }, [location, navigate, token]); // Removed localAppointmentId from dependencies

  // Handle API errors with fallback to local storage
  const handleApiError = (
    error,
    appointmentData,
    files,
    appointmentId
  ) => {
    console.error("API error details:", error);

    // Use the provided appointmentId or fall back to localAppointmentId
    const idToUse = appointmentId || localAppointmentId;

    // Create local appointment for fallback
    const localAppointment = {
      _id: idToUse,
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
        appointmentId: idToUse,
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