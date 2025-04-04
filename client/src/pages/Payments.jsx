import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/userSlice";
import { CoinsIcon as Coin, CreditCard, History } from "lucide-react";
import { paymentTamdCoin } from "../redux/userSlice";
const Payments = () => {
  const [customerBalance, setCustomerBalance] = useState(5000);
  const [tamdCoins, setTamdCoins] = useState(0);
  const [coinsToBuy, setCoinsToBuy] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("balance");
  const [paymentDropdownOpen, setPaymentDropdownOpen] = useState(false);
  // Fetch logged-in user details
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const payments = [
    {
      date: new Date("2023-04-01"),
      amount: 1000,
      status: "Success",
      paymentMode: "Credit Card",
    },
    {
      date: new Date("2023-03-15"),
      amount: 2000,
      status: "Success",
      paymentMode: "UPI",
    },
    {
      date: new Date("2023-02-28"),
      amount: 500,
      status: "Failed",
      paymentMode: "Net Banking",
    },
  ];

  // Calculate coin price - you can adjust this logic
  const coinPrice = 100; // ₹100 per coin
  const totalPrice = coinPrice * coinsToBuy;

  const handleCoinPurchase = async () => {
    setLoading(true);

      // setTamdCoins((prev) => prev + coinsToBuy);
      // setCustomerBalance((prev) => prev - totalPrice);

      // Add to payment history (in a real app, this would come from the backend)
    const  paymentData = {
        quantity: coinsToBuy,
        date: new Date(),
        user: user,
        amount: totalPrice,
        paymentMode: paymentMethod === "card" ? "Credit Card" : "Wallet",
      };
      // console.log(check);
      const resultAction = await dispatch(paymentTamdCoin({paymentData }));
      console.log("The result action is--->s",resultAction)
      setLoading(false);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-white p-6 shadow-md">
        <div className="flex items-center mb-6">
          <img
            src={
              user?.photo ||
              "https://accounts.practo.com/profile_picture/22269865/medium_thumbnail"
            }
            alt="User"
            className="w-16 h-16 rounded-lg border-2 border-gray-300"
          />
          <div className="ml-3">
            <p className="font-semibold">{user?.UserName || "User"}</p>
            <p className="text-sm text-gray-500">
              {user?.Mobile || "No Mobile Number"}
            </p>
          </div>
        </div>

        <ul className="space-y-3">
          <li>
            <Link
              to="/MyAppointments"
              className="block py-2 px-3 rounded-lg hover:bg-gray-200"
            >
              My Appointments
            </Link>
          </li>
          <li>
            <Link
              to="/MyTests"
              className="block py-2 px-3 rounded-lg hover:bg-gray-200"
            >
              My Tests
            </Link>
          </li>
          <li>
            <Link
              to="/MyMedicalRecords"
              className="block py-2 px-3 rounded-lg hover:bg-gray-200"
            >
              My Medical Records
            </Link>
          </li>
          <li>
            <Link
              to="/OnlineConsultations"
              className="block py-2 px-3 rounded-lg hover:bg-gray-200"
            >
              My Online Consultations
            </Link>
          </li>
          <li>
            <Link
              to="/MyFeedback"
              className="block py-2 px-3 rounded-lg hover:bg-gray-200"
            >
              My Feedback
            </Link>
          </li>
          <li>
            <Link
              to="/Profile"
              className="block py-2 px-3 rounded-lg hover:bg-gray-200"
            >
              View / Update Profile
            </Link>
          </li>

          {/* ✅ Payments Section Highlighted */}
          <li>
            <Link
              to="/Payments"
              className="block py-2 px-3 rounded-lg bg-red-100 text-red-700 font-bold"
            >
              Payments
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="w-full text-left py-2 px-3 text-red-500 hover:bg-gray-200"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6">
        <h2 className="text-2xl font-bold mb-4">Customer Payments</h2>

        {/* Custom tabs implementation */}
        <div className="mb-6">
          <div className="flex border-b mb-4">
            <button
              className={`py-2 px-4 font-medium hover:cursor-pointer ${
                activeTab === "balance"
                  ? "border-b-2 border-red-500 text-red-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("balance")}
            >
              Balance
            </button>
            <button
              className={`py-2 px-4 font-medium hover:cursor-pointer ${
                activeTab === "coins"
                  ? "border-b-2 border-red-500 text-red-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("coins")}
            >
              Tamd Coins
            </button>
          </div>

          {/* Balance Tab Content */}
          {activeTab === "balance" && (
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-4 border-b">
                <h3 className="text-lg font-medium">Customer Balance</h3>
              </div>
              <div className="p-4">
                <p className="text-xl text-red-600 font-bold">
                  ₹{customerBalance.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {/* Coins Tab Content */}
          {activeTab === "coins" && (
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-4 border-b">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Coin className="h-5 w-5" />
                  Tamd Coins
                </h3>
              </div>
              <div className="p-4">
                <div className="grid gap-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Current Coin Balance:</p>
                    <p className="text-xl text-red-600 font-bold flex items-center gap-1">
                      <Coin className="h-4 w-4" />
                      {tamdCoins}
                    </p>
                  </div>

                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <label htmlFor="coins" className="text-sm font-medium">
                        Buy Tamd Coins
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="coins"
                          type="number"
                          min="1"
                          value={coinsToBuy}
                          onChange={(e) =>
                            setCoinsToBuy(Number.parseInt(e.target.value) || 1)
                          }
                          className="w-24 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                        <p className="text-sm text-gray-500">
                          × ₹{coinPrice} = ₹{totalPrice}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <label
                        htmlFor="payment-method"
                        className="text-sm font-medium"
                      >
                        Payment Method
                      </label>
                      <div className="relative">
                        <button
                          id="payment-method"
                          className="flex items-center justify-between w-full px-3 py-2 border rounded-md bg-white"
                          onClick={() =>
                            setPaymentDropdownOpen(!paymentDropdownOpen)
                          }
                        >
                          {paymentMethod === "card" ? (
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              Credit/Debit Card
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <svg
                                className="h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4 4h16v16H4V4z"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M4 8h16M8 12h8"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              Wallet Balance
                            </div>
                          )}
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        {paymentDropdownOpen && (
                          <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border">
                            <div className="py-1">
                              <button
                                className="flex items-center gap-2 px-4 py-2 text-sm w-full hover:bg-gray-100"
                                onClick={() => {
                                  setPaymentMethod("card");
                                  setPaymentDropdownOpen(false);
                                }}
                              >
                                <CreditCard className="h-4 w-4" />
                                Credit/Debit Card
                              </button>
                              <button
                                className="flex items-center gap-2 px-4 py-2 text-sm w-full hover:bg-gray-100"
                                onClick={() => {
                                  setPaymentMethod("wallet");
                                  setPaymentDropdownOpen(false);
                                }}
                              >
                                <svg
                                  className="h-4 w-4"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M4 4h16v16H4V4z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M4 8h16M8 12h8"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                Wallet Balance
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleCoinPurchase}
                      disabled={
                        loading ||
                        (customerBalance < totalPrice &&
                          paymentMethod === "wallet")
                      }
                      className={`hover:cursor-pointer w-full py-2 px-4 rounded-md font-medium text-white ${
                        loading ||
                        (customerBalance < totalPrice &&
                          paymentMethod === "wallet")
                          ? "bg-red-300 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {loading
                        ? "Processing..."
                        : `Buy ${coinsToBuy} Tamd Coin${
                            coinsToBuy > 1 ? "s" : ""
                          }`}
                    </button>

                    {customerBalance < totalPrice &&
                      paymentMethod === "wallet" && (
                        <p className="text-sm text-red-600">
                          Insufficient balance to complete this purchase.
                        </p>
                      )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-4 border-b flex flex-row items-center">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <History className="h-5 w-5" />
              Payment History
            </h3>
          </div>
          <div className="p-4">
            {loading ? (
              <p>Loading payments...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : (
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border-b p-2 text-left font-medium">
                        Date
                      </th>
                      <th className="border-b p-2 text-left font-medium">
                        Amount
                      </th>
                      <th className="border-b p-2 text-left font-medium">
                        Status
                      </th>
                      <th className="border-b p-2 text-left font-medium">
                        Payment Mode
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center p-4">
                          No payments found.
                        </td>
                      </tr>
                    ) : (
                      payments.map((payment, index) => (
                        <tr
                          key={index}
                          className={index % 2 === 0 ? "bg-gray-50" : ""}
                        >
                          <td className="border-b p-2">
                            {payment.date.toLocaleDateString()}
                          </td>

                          <td className="border-b p-2 text-green-600">
                            ₹{payment.amount.toFixed(2)}
                          </td>
                          <td className="border-b p-2">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                                payment.status === "Success"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {payment.status}
                            </span>
                          </td>
                          <td className="border-b p-2">
                            {payment.paymentMode}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
