import React from "react";
import {useNavigate } from "react-router-dom";
import {  XCircle, ArrowLeft, Home } from "lucide-react";

// Success Page Component


// Cancel Page Component
export const PaymentCancelPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-red-100 p-6 flex flex-col items-center">
          <XCircle className="h-16 w-16 text-red-600 mb-4" />
          <h1 className="text-2xl font-bold text-red-700">Payment Cancelled</h1>
          <p className="text-red-600 text-center mt-2">
            Your transaction was not completed
          </p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="text-gray-600">
              <p className="mb-2">
                Your payment has been cancelled and no charges have been made to your account.
              </p>
              <p>
                If you encountered any issues during the payment process or need assistance, 
                please contact our support team.
              </p>
            </div>
            
            <div className="flex flex-col space-y-3 mt-6">
              <button
                onClick={() => navigate("/Payments")}
                className="flex items-center justify-center gap-2 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Try Again
              </button>
              
              <button
                onClick={() => navigate("/")}
                className="flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Home className="h-4 w-4" />
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// You can add this to your routes like:
// <Route path="/payment/success" element={<PaymentSuccessPage />} />
// <Route path="/payment/cancel" element={<PaymentCancelPage />} />