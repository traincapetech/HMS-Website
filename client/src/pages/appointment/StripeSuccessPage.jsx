import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get URL parameters
        const params = new URLSearchParams(location.search);
        const sessionId = params.get("session_id");
        const email = params.get("email");

        if (!sessionId || !email) {
          setError(
            "Missing payment information - please check your confirmation email"
          );
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:8080/api/payments/appointment-stripe-successful`,
          {
            params: {
              session_id: sessionId,
              email: email,
            },
            timeout: 10000, // 10 second timeout
          }
        );
        const updatedAppointmentData = {
            ...response.data.appointmentData,
            paymentId: response.data.transaction.transactionId,
            paymentStatus: response.data.appointmentData.Status,
            paymentAmount: response.data.appointmentData.amount,
            paymentMethod: response.data.transaction.paymentMethod,
          };
        if (response.data.success) {
          console.log(
            "The data received from backend success page is ---->",
            response.data
          );
          setMessage(
            response.data.message || "Appointment booking successful!"
          );

          if (response.data.transaction) {
            setAppointmentDetails(response.data.transaction);
          } else {
            console.warn("No appointment details in response");
          }
          // Redirect to a function that will create the appointment
          navigate("/process-appointment", {
       
            state: {
              appointmentData: updatedAppointmentData,
            //   files: appointmentData.files || [],
            },
          });
        } else {
          setError(response.data.message || "Payment verification failed");
        }
      } catch (err) {
        console.error("Payment verification error:", err);

        let errorMsg =
          err.response?.data?.message ||
          err.message ||
          "An error occurred while verifying payment";

        // Handle timeout specifically
        if (err.code === "ECONNABORTED") {
          errorMsg = "Request timed out - please check your confirmation email";
        }

        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location]);

  const formatDate = (dateString) => {
    if (!dateString) return "Processing...";
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-medium text-gray-700">
              Verifying your appointment booking...
            </p>
            <p className="text-sm text-gray-500">This may take a few moments</p>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Payment Verification Issue
            </h2>
            <p className="p-3 text-red-700 bg-red-100 rounded-md">{error}</p>

            {appointmentDetails && (
              <div className="p-4 mt-4 bg-blue-50 border border-blue-100 rounded-md">
                <h3 className="mb-2 text-lg font-medium text-gray-700">
                  Your Appointment Status
                </h3>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  {appointmentDetails.status}
                </p>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/Appointments")}
                className="flex-1 py-2 font-medium text-white transition-colors bg-red-600 rounded-md hover:bg-red-700"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 py-2 font-medium text-gray-700 transition-colors bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Go to Home
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Appointment Booked!
            </h2>
            <p className="text-gray-600">{message}</p>

            {appointmentDetails ? (
              <div className="p-4 mt-4 text-left bg-gray-50 border border-gray-200 rounded-md">
                <h3 className="mb-2 text-lg font-medium text-gray-700">
                  Appointment Details
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">ID:</span>{" "}
                    {appointmentDetails.transactionId}
                  </p>
                  <p>
                    <span className="font-medium">Amount Paid:</span> $
                    {appointmentDetails.amount}
                  </p>
                  <p>
                    <span className="font-medium">Appointment Date:</span>{" "}
                    {formatDate(appointmentDetails.appointmentDate)}
                  </p>
                  <p>
                    <span className="font-medium">Booked On:</span>{" "}
                    {formatDate(appointmentDetails.date)}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>
                    <span
                      className={`ml-2 font-medium ${
                        appointmentDetails.status === "confirmed"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {appointmentDetails.status}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 mt-4 text-yellow-800 bg-yellow-50 rounded-md">
                <p>
                  Appointment details are being processed. They will appear in
                  your account shortly.
                </p>
              </div>
            )}

            <button
              onClick={() => navigate("/UserProfile#MyAppointments")}
              className="w-full py-2 mt-4 font-medium text-white transition-colors bg-green-600 rounded-md hover:bg-green-700"
            >
              View My Appointments
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
