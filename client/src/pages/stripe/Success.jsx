import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [coinBalance, setCoinBalance] = useState(0);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get URL parameters
        const params = new URLSearchParams(location.search);
        const sessionId = params.get('session_id');
        const email = params.get('email');

        if (!sessionId || !email) {
          setError('Missing payment information - please check your confirmation email');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `https://hms-backend-1-pngp.onrender.com/api/payments/success`,
          {
            params: {
              session_id: sessionId,
              email: email
            },
            timeout: 10000 // 10 second timeout
          }
        );

        if (response.data.success) {
          setMessage(response.data.message || 'Payment successful!');
          setCoinBalance(response.data.newCoinQuantity);
          
          if (response.data.transaction) {
            setTransactionDetails(response.data.transaction);
          } else {
            console.warn("No transaction details in response");
          }
        } else {
          setError(response.data.message || 'Payment verification failed');
          // If we have balance info even in error, show it
          if (response.data.newCoinQuantity !== undefined) {
            setCoinBalance(response.data.newCoinQuantity);
          }
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        
        let errorMsg = err.response?.data?.message || 
                      err.message || 
                      'An error occurred while verifying payment';
        
        // Handle timeout specifically
        if (err.code === 'ECONNABORTED') {
          errorMsg = "Request timed out - please check your account balance";
        }
        
        setError(errorMsg);
        
        // If we have partial response data, use it
        if (err.response?.data?.newCoinQuantity !== undefined) {
          setCoinBalance(err.response.data.newCoinQuantity);
        }
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Processing...';
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
            <p className="text-lg font-medium text-gray-700">Verifying your payment...</p>
            <p className="text-sm text-gray-500">This may take a few moments</p>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800">Payment Verification Issue</h2>
            <p className="p-3 text-red-700 bg-red-100 rounded-md">{error}</p>
            
            {(coinBalance > 0 || transactionDetails) && (
              <div className="p-4 mt-4 bg-blue-50 border border-blue-100 rounded-md">
                <h3 className="mb-2 text-lg font-medium text-gray-700">Your Current Status</h3>
                {coinBalance > 0 && (
                  <p className="mb-2">
                    <span className="font-medium">Coin Balance:</span> {coinBalance}
                  </p>
                )}
                {transactionDetails && (
                  <p>
                    <span className="font-medium">Transaction Status:</span> {transactionDetails.status}
                  </p>
                )}
              </div>
            )}
            
            <div className="flex space-x-4">
              <button 
                onClick={() => navigate('/Payments')} 
                className="flex-1 py-2 font-medium text-white transition-colors bg-red-600 rounded-md hover:bg-red-700"
              >
                Try Again
              </button>
              <button 
                onClick={() => navigate('/')} 
                className="flex-1 py-2 font-medium text-gray-700 transition-colors bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Go to Homr
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
            <p className="text-gray-600">{message}</p>
            
            <div className="p-4 mt-2 bg-green-50 border border-green-100 rounded-md">
              <p className="text-lg font-medium text-gray-700">Your current coin balance:</p>
              <p className="text-3xl font-bold text-green-600">{coinBalance}</p>
            </div>

            {transactionDetails ? (
              <div className="p-4 mt-4 text-left bg-gray-50 border border-gray-200 rounded-md">
                <h3 className="mb-2 text-lg font-medium text-gray-700">Transaction Details</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">ID:</span> {transactionDetails.transactionId}</p>
                  <p><span className="font-medium">Amount:</span> ${transactionDetails.amount}</p>
                  <p><span className="font-medium">Coins Added:</span> {transactionDetails.coinQuantity}</p>
                  <p><span className="font-medium">Completed:</span> {formatDate(transactionDetails.completedAt)}</p>
                  <p><span className="font-medium">Status:</span> 
                    <span className={`ml-2 font-medium ${
                      transactionDetails.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {transactionDetails.status}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 mt-4 text-yellow-800 bg-yellow-50 rounded-md">
                <p>Transaction details are being processed. They will appear in your account shortly.</p>
              </div>
            )}
            
            <button 
              onClick={() => navigate('UserProfile#Payments')} 
              className="w-full py-2 mt-4 font-medium text-white transition-colors bg-green-600 rounded-md hover:bg-green-700"
            >
              Go to Payments
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;