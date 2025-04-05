import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, paymentTamdCoin } from "../redux/userSlice";
import { CoinsIcon as Coin, CreditCard, History,Wallet  } from "lucide-react";

const COIN_PRICE = 100; // ₹100 per coin

const Payments = () => {
  // State management
  const [state, setState] = useState({
    fetchedData: {},
    customerBalance: 0,
    tamdCoins: 0,
    coinsToBuy: 1,
    paymentMethod: "card",
    loading: false,
    error: "",
    activeTab: "balance",
    payments: [],
    paymentDropdownOpen: false
  });

  // Redux and hooks
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Derived values
  const totalPrice = COIN_PRICE * state.coinsToBuy;
  const insufficientBalance = state.customerBalance < totalPrice && state.paymentMethod === "wallet";

  // Data fetching
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/newuser/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = response.data.newuser;
      setState(prev => ({
        ...prev,
        fetchedData: userData,
        customerBalance: userData.walletBalance,
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
      paymentMode: state.paymentMethod === "card" ? "Credit Card" : "Wallet",
    };

    await dispatch(paymentTamdCoin({ paymentData }));
    await fetchUserData();
    setState(prev => ({ ...prev, loading: false }));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const togglePaymentDropdown = () => setState(prev => ({
    ...prev,
    paymentDropdownOpen: !prev.paymentDropdownOpen
  }));

  const setPaymentMethod = (method) => setState(prev => ({
    ...prev,
    paymentMethod: method,
    paymentDropdownOpen: false
  }));

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
          {sidebarLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`block py-2 px-3 rounded-lg hover:bg-gray-200 ${link.highlight ? "bg-red-100 text-red-700 font-bold" : ""}`}
              >
                {link.text}
              </Link>
            </li>
          ))}
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
            <BalanceTab customerBalance={state.customerBalance} />
          ) : (
            <CoinsTab
              {...state}
              totalPrice={totalPrice}
              insufficientBalance={insufficientBalance}
              setCoinsToBuy={(value) => setState(prev => ({ ...prev, coinsToBuy: value }))}
              setPaymentMethod={setPaymentMethod}
              togglePaymentDropdown={togglePaymentDropdown}
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
const BalanceTab = ({ customerBalance }) => (
  <div className="bg-white rounded-lg border shadow-sm">
    <div className="p-4 border-b">
      <h3 className="text-lg font-medium">Customer Balance</h3>
    </div>
    <div className="p-4">
      <p className="text-xl text-red-600 font-bold">₹{customerBalance.toFixed(2)}</p>
    </div>
  </div>
);

const CoinsTab = ({
  tamdCoins,
  coinsToBuy,
  paymentMethod,
  paymentDropdownOpen,
  loading,
  totalPrice,
  insufficientBalance,
  setCoinsToBuy,
  setPaymentMethod,
  togglePaymentDropdown,
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
                × ₹{COIN_PRICE} = ₹{totalPrice}
              </p>
            </div>
          </div>

          <PaymentMethodDropdown
            paymentMethod={paymentMethod}
            paymentDropdownOpen={paymentDropdownOpen}
            setPaymentMethod={setPaymentMethod}
            togglePaymentDropdown={togglePaymentDropdown}
          />

          <button
            onClick={handleCoinPurchase}
            disabled={loading || insufficientBalance}
            className={`hover:cursor-pointer w-full py-2 px-4 rounded-md font-medium text-white ${
              loading || insufficientBalance
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading
              ? "Processing..."
              : `Buy ${coinsToBuy} Tamd Coin${coinsToBuy > 1 ? "s" : ""}`}
          </button>

          {insufficientBalance && (
            <p className="text-sm text-red-600">
              Insufficient balance to complete this purchase.
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
);

const PaymentMethodDropdown = ({
  paymentMethod,
  paymentDropdownOpen,
  setPaymentMethod,
  togglePaymentDropdown
}) => (
  <div className="grid gap-2">
    <label htmlFor="payment-method" className="text-sm font-medium">
      Payment Method
    </label>
    <div className="relative">
      <button
        id="payment-method"
        className="flex items-center justify-between w-full px-3 py-2 border rounded-md bg-white"
        onClick={togglePaymentDropdown}
      >
        {paymentMethod === "card" ? (
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Credit/Debit Card
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Wallet />
            Wallet Balance
          </div>
        )}
        <ChevronDownIcon />
      </button>

      {paymentDropdownOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border">
          <div className="py-1">
            <PaymentMethodOption
              method="card"
              icon={<CreditCard className="h-4 w-4" />}
              label="Credit/Debit Card"
              setPaymentMethod={setPaymentMethod}
            />
            <PaymentMethodOption
              method="wallet"
              icon={<Wallet className="h-4 w-4" />}
              label="Wallet Balance"
              setPaymentMethod={setPaymentMethod}
            />
          </div>
        </div>
      )}
    </div>
  </div>
);

const PaymentMethodOption = ({ method, icon, label, setPaymentMethod }) => (
  <button
    className="flex items-center gap-2 px-4 py-2 text-sm w-full hover:bg-gray-100"
    onClick={() => setPaymentMethod(method)}
  >
    {icon}
    {label}
  </button>
);

const WalletIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
);

const ChevronDownIcon = () => (
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
                    <td className="border-b p-2 text-green-600">₹{payment.amount.toFixed(2)}</td>
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