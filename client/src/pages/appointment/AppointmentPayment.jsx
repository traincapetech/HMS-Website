import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
const PaymentPage = () => {
  const API_BASE_URL = "http://localhost:8080/api";
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [appointmentData, setAppointmentData] = useState(null);

  // Get the token
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Check if appointment data was passed to this page
    if (location.state && location.state.appointmentData) {
      setAppointmentData(location.state.appointmentData);
    } else {
      // No data was passed, redirect back to the appointment form
      toast.error(
        "No appointment data found. Please fill the appointment form."
      );
      navigate("/book-appointment");
    }
  }, [location, navigate]);

  const processPaymentWithStripe = async () => {
    try {

      const selectedDoctor = appointmentData.selectedDoctor;

      // Prepare payment data for Stripe
      const paymentData = {
        ...appointmentData,
        selectedDoctorname:appointmentData.selectedDoctor,
        amount: selectedDoctor?.ConsultationFee || 50,
        currency: "USD",
        description: `Appointment with Dr. ${
          selectedDoctor?.Name || "Unknown"
        } on ${appointmentData.appointmentDate} at ${
          appointmentData.appointmentTime
        }`,
        customerEmail: appointmentData.email,
        customerName: appointmentData.fullName,
        paymentMethod: "stripe",
        appointmentDetails: {
          doctorId: appointmentData.doctorId,
          appointmentDate: appointmentData.appointmentDate,
          appointmentTime: appointmentData.appointmentTime,
        },
      };

      console.log("Processing Stripe payment...", paymentData);
      const stripe = await loadStripe(
        "pk_test_51RA7gzR4IpVwwNdkSnaCFniqyAdSIFkPIcztaYVwuIlmUImYiPtSS2UEnDQjMS9GF2BddzsU75t1PjRqiWh0aa1E00bBEJqgio"
      );
      // Make Stripe payment API call
      const paymentResponse = await axios({
        method: "post",
        url: `${API_BASE_URL}/payments/appointment-stripe`,
        data: paymentData,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        timeout: 15000,
      });
      console.log("PAYMENT RESPONSE---->", paymentResponse);
      if (paymentResponse.data.url) {
        window.location.href = paymentResponse.data.url;
        return { redirecting: true, sessionId: paymentResponse.data.sessionId };
      } else {
        // Fall back to redirectToCheckout if no URL
        const result = await stripe.redirectToCheckout({
          sessionId: paymentResponse.data.sessionId,
        });

        if (result.error) {
          throw new Error(result.error.message);
        }
        return { redirecting: true, sessionId: response.data.sessionId };
      }
    } catch (error) {
      console.error("Stripe payment processing error:", error);

      if (error.response) {
        toast.error(
          error.response.data.message ||
            "Stripe payment failed. Please try again."
        );
      } else {
        toast.error("Payment service unavailable. Please try again later.");
      }

      return false;
    }
  };

  const processPaymentWithTamd = async () => {
    try {
      const selectedDoctor = appointmentData.selectedDoctor;

      // Prepare payment data for TAMD
      const paymentData = {
        amount: selectedDoctor?.ConsultationFee || 50,
        currency: "USD",
        description: `Appointment with Dr. ${
          selectedDoctor?.Name || "Unknown"
        } on ${appointmentData.appointmentDate} at ${
          appointmentData.appointmentTime
        }`,
        customerEmail: appointmentData.email,
        customerName: appointmentData.fullName,
        paymentMethod: "tamd",
        appointmentDetails: {
          doctorId: appointmentData.doctorId,
          appointmentDate: appointmentData.appointmentDate,
          appointmentTime: appointmentData.appointmentTime,
        },
      };

      console.log("Processing TAMD payment...", paymentData);

      // Make TAMD payment API call
      const paymentResponse = await axios({
        method: "post",
        url: `${API_BASE_URL}/payments/appointment-tamd`,
        data: paymentData,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        timeout: 15000,
      });

      if (!paymentResponse.data.success) {
        console.log(
          paymentResponse.data.message ||
            "TAMD payment failed. Please try again."
        );
        return false;
      }
      // Return payment information
      console.log("TAMD Payment Response:", paymentResponse.data);
      return {
        paymentId: paymentResponse.data.transactionId,
        paymentStatus: "Completed",
        paymentAmount: paymentData.amount,
        paymentMethod: "tamd",
      };
    } catch (error) {
      console.error("TAMD payment processing error:", error);

      if (error.response) {
        toast.error(
          error.response.data.message ||
            "TAMD payment failed. Please try again."
        );
      } else {
        toast.error("Payment service unavailable. Please try again later.");
      }

      return false;
    }
  };

  const handlePaymentSubmit = async () => {
    setLoading(true);

    let paymentResult;

    // Process payment based on selected method
    if (paymentMethod === "stripe") {
     await processPaymentWithStripe();
     return;
    } else if (paymentMethod === "tamd") {
      paymentResult = await processPaymentWithTamd();
    }

    if (paymentResult) {
      // Payment successful, add payment info to appointment data
      const updatedAppointmentData = {
        ...appointmentData,
        paymentId: paymentResult.paymentId,
        paymentStatus: paymentResult.paymentStatus,
        paymentAmount: paymentResult.paymentAmount,
        paymentMethod: paymentResult.paymentMethod,
      };

      console.log(
        `${paymentMethod.toUpperCase()} payment successful. Proceeding with appointment creation...`
      );
      console.log("Payment processed successfully!", updatedAppointmentData);

      // Redirect to a function that will create the appointment
      navigate("/process-appointment", {
        state: {
          appointmentData: updatedAppointmentData,
          files: appointmentData.files || [],
        },
      });
    }

    setLoading(false);
  };

  if (!appointmentData) {
    return (
      <div className="flex justify-center items-center h-screen">
        loading......
      </div>
    );
  }

  const selectedDoctor = appointmentData.selectedDoctor || {};
  const appointmentFee = selectedDoctor.ConsultationFee || 50; // Default $50 if fee not available

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Complete Your Payment
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Appointment Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600">Doctor:</p>
            <p className="font-medium">
              {selectedDoctor.Name || "Selected Doctor"}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Specialty:</p>
            <p className="font-medium">{appointmentData.Speciality}</p>
          </div>
          <div>
            <p className="text-gray-600">Date:</p>
            <p className="font-medium">{appointmentData.appointmentDate}</p>
          </div>
          <div>
            <p className="text-gray-600">Time:</p>
            <p className="font-medium">{appointmentData.appointmentTime}</p>
          </div>
          <div>
            <p className="text-gray-600">Patient:</p>
            <p className="font-medium">{appointmentData.fullName}</p>
          </div>
          <div>
            <p className="text-gray-600">Email:</p>
            <p className="font-medium">{appointmentData.email}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Consultation Fee:</span>
            <span className="text-xl font-bold text-primary">
              ${appointmentFee.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

        <div className="flex flex-wrap gap-4 mb-6">
          <button
            type="button"
            className={`flex items-center px-4 py-2 border rounded-md ${
              paymentMethod === "stripe"
                ? "border-primary bg-primary/10"
                : "border-gray-300"
            }`}
            onClick={() => setPaymentMethod("stripe")}
          >
            Stripe Payment
          </button>

          <button
            type="button"
            className={`flex items-center px-4 py-2 border rounded-md ${
              paymentMethod === "tamd"
                ? "border-primary bg-primary/10"
                : "border-gray-300"
            }`}
            onClick={() => setPaymentMethod("tamd")}
          >
            TAMD Coins
          </button>
        </div>

        <div className="text-center ">
          {paymentMethod === "stripe" && (
            <p className="mb-4">
              You'll be redirected to Stripe's secure payment gateway to
              complete your payment.
            </p>
          )}

          {paymentMethod === "tamd" && (
            <p className="mb-4">You'll pay using your TAMD Coins balance.</p>
          )}

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/Appointments")}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>

            <button
              onClick={handlePaymentSubmit}
              disabled={loading}
              className={`px-6 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 ${"bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `Pay $${appointmentFee.toFixed(2)} with ${
                  paymentMethod === "stripe" ? "Stripe" : "TAMD Coins"
                }`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
