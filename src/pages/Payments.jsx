import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [customerBalance, setCustomerBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch logged-in user details
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/payments"); // Change URL if needed
      setPayments(response.data.payments);
      setCustomerBalance(response.data.balance);
      setLoading(false);
    } catch (err) {
      setError("Error fetching payment data");
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-white p-6 shadow-md">
        <div className="flex items-center mb-6">
          <img
            src={user?.photo || "https://accounts.practo.com/profile_picture/22269865/medium_thumbnail"}
            alt="User"
            className="w-16 h-16 rounded-lg border-2 border-gray-300"
          />
          <div className="ml-3">
            <p className="font-semibold">{user?.UserName || "User"}</p>
            <p className="text-sm text-gray-500">{user?.Mobile || "No Mobile Number"}</p>
          </div>
        </div>

        <ul className="space-y-3">
          <li><Link to="/my-appointments" className="block py-2 px-3 rounded-lg hover:bg-gray-200">My Appointments</Link></li>
          <li><Link to="/my-tests" className="block py-2 px-3 rounded-lg hover:bg-gray-200">My Tests</Link></li>
          <li><Link to="/my-medical-records" className="block py-2 px-3 rounded-lg hover:bg-gray-200">My Medical Records</Link></li>
          <li><Link to="/my-online-consultations" className="block py-2 px-3 rounded-lg hover:bg-gray-200">My Online Consultations</Link></li>
          <li><Link to="/my-feedback" className="block py-2 px-3 rounded-lg hover:bg-gray-200">My Feedback</Link></li>
          <li><Link to="/profile" className="block py-2 px-3 rounded-lg hover:bg-gray-200">View / Update Profile</Link></li>
          
          {/* ✅ Payments Section Highlighted */}
          <li>
            <Link to="/payments" className="block py-2 px-3 rounded-lg bg-blue-100 text-blue-700 font-bold">
              Payments
            </Link>
          </li>
          <li>
            <button className="w-full text-left py-2 px-3 text-red-500 hover:bg-gray-200">
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6">
        <h2 className="text-2xl font-bold mb-4">Customer Payments</h2>

        {/* Customer Balance */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold">Customer Balance</h3>
          <p className="text-xl text-blue-600 font-bold">
            ₹{customerBalance.toFixed(2)}
          </p>
        </div>

        {/* Payment History */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Payment History</h3>

          {loading ? (
            <p>Loading payments...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Date</th>
                  <th className="border border-gray-300 p-2">Customer Name</th>
                  <th className="border border-gray-300 p-2">Amount</th>
                  <th className="border border-gray-300 p-2">Status</th>
                  <th className="border border-gray-300 p-2">Payment Mode</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-4">
                      No payments found.
                    </td>
                  </tr>
                ) : (
                  payments.map((payment, index) => (
                    <tr key={index} className="text-center">
                      <td className="border border-gray-300 p-2">
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {payment.customerName}
                      </td>
                      <td className="border border-gray-300 p-2 text-green-600">
                        ₹{payment.amount.toFixed(2)}
                      </td>
                      <td
                        className={`border border-gray-300 p-2 ${
                          payment.status === "Success"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {payment.status}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {payment.paymentMode}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;
