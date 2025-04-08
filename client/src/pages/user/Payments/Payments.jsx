import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, paymentTamdCoin } from "../../../redux/userSlice";
import { CoinsIcon as Coin, CreditCard, History } from "lucide-react";

const COIN_PRICE = 2; // $2 per coin

const Payments = () => {
  // State management
  const [state, setState] = useState({
    fetchedData: {},
    tamdCoins: 0,
    coinsToBuy: 1,
    loading: false,
    error: "",
    activeTab: "balance",
    payments: [],
  });

  // Redux and hooks
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Derived values
  const totalPrice = COIN_PRICE * state.coinsToBuy;

  // Data fetching
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`https://hms-backend-1-pngp.onrender.com/api/newuser/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = response.data.newuser;
      setState(prev => ({
        ...prev,
        fetchedData: userData,
        payments: userData.transactions || [],
        tamdCoins: userData.coinQuantity
      }));
    } catch (error) {
      setState(prev => ({ ...prev, error: "Failed to fetch user data" }));
    }
  };

  useEffect(() => {
    fetchUserData();
    window.scrollTo(0, 0);
  }, []);

  // Handlers
  const handleCoinPurchase = async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    const paymentData = {
      quantity: state.coinsToBuy,
      date: new Date(),
      user: user,
      amount: totalPrice,
      paymentMode: "Credit Card",
    };

    await dispatch(paymentTamdCoin({ paymentData }));
    await fetchUserData();
    setState(prev => ({ ...prev, loading: false }));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  // Sidebar links data
  const sidebarLinks = [
    { to: "/MyAppointments", text: "My Appointments" },
    { to: "/MyTests", text: "My Tests" },
    { to: "/MyMedicalRecords", text: "My Medical Records" },
    { to: "/OnlineConsultations", text: "My Online Consultations" },
    { to: "/MyFeedback", text: "My Feedback" },
    { to: "/Profile", text: "View / Update Profile" },
    { to: "/Payments", text: "Payments", highlight: true },
  ];

  return (
    <div className="">
  

      {/* Main Content */}
      <div className="w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Customer Payments</h2>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex border-b mb-4">
            {["balance", "coins"].map((tab) => (
              <button
                key={tab}
                className={`py-2 px-4 font-medium hover:cursor-pointer ${
                  state.activeTab === tab
                    ? "border-b-2 border-red-500 text-red-500"
                    : "text-gray-500"
                }`}
                onClick={() => setState(prev => ({ ...prev, activeTab: tab }))}
              >
                {tab === "balance" ? "Balance" : "Tamd Coins"}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {state.activeTab === "balance" ? (
            <BalanceTab customerCoinBalance={state.tamdCoins} />
          ) : (
            <CoinsTab
              {...state}
              totalPrice={totalPrice}
              setCoinsToBuy={(value) => setState(prev => ({ ...prev, coinsToBuy: value }))}
              handleCoinPurchase={handleCoinPurchase}
            />
          )}
        </div>

        {/* Payment History */}
        <PaymentHistory payments={state.payments} loading={state.loading} error={state.error} />
      </div>
    </div>
  );
};

// Extracted components for better readability
const BalanceTab = ({ customerCoinBalance }) => (
  <div className="bg-white rounded-lg border shadow-sm">
    <div className="p-4 border-b">
      <h3 className="text-lg font-medium">Customer Coin Balance</h3>
    </div>
    <div className="p-4">
      <p className="text-xl text-red-600 font-bold">{customerCoinBalance}</p>
    </div>
  </div>
);

const CoinsTab = ({
  tamdCoins,
  coinsToBuy,
  loading,
  totalPrice,
  setCoinsToBuy,
  handleCoinPurchase
}) => (
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
                onChange={(e) => setCoinsToBuy(Number(e.target.value) || 1)}
                className="w-24 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <p className="text-sm text-gray-500">
                × ${COIN_PRICE} = ${totalPrice}
              </p>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">
              Payment Method
            </label>
            <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-white">
              <CreditCard className="h-4 w-4" />
              Credit/Debit Card
            </div>
          </div>

          <button
            onClick={handleCoinPurchase}
            disabled={loading}
            className={`hover:cursor-pointer w-full py-2 px-4 rounded-md font-medium text-white ${
              loading
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading
              ? "Processing..."
              : `Buy ${coinsToBuy} Tamd Coin${coinsToBuy > 1 ? "s" : ""}`}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const PaymentHistory = ({ payments, loading, error }) => (
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
          {payments.length === 0 ? (
            <div className="text-center p-4">No payments found.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  {["Date", "Amount", "Quantity", "Status", "Payment Mode"].map((header) => (
                    <th key={header} className="border-b p-2 text-left font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="border-b p-2">
                      {new Date(payment.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                      })}
                    </td>
                    <td className="border-b p-2 text-green-600">${payment.amount.toFixed(2)}</td>
                    <td className="border-b p-2 text-green-600">{payment.coinQuantity}</td>
                    <td className="border-b p-2">
                      <StatusBadge status={payment.status} />
                    </td>
                    <td className="border-b p-2">{payment.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  </div>
);

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
      status === "completed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
    }`}
  >
    {status}
  </span>
);

export default Payments;