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
  const token = localStorage.getItem("token");

  // Derived values
  const totalPrice = COIN_PRICE * state.coinsToBuy;

  // Data fetching
  const fetchUserData = async () => {
    try {
      state.loading = true;
      const response = await axios.get(
        `https://hms-backend-1-pngp.onrender.com/api/newuser/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userData = response.data.newuser;
      state.loading = false;
      setState((prev) => ({
        ...prev,
        fetchedData: userData,
        payments: userData.transactions || [],
        tamdCoins: userData.coinQuantity,
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, error: "Failed to fetch user data" }));
    }
  };

  useEffect(() => {
    fetchUserData();
    window.scrollTo(0, 0);
  }, []);

  // Handlers
  const handleCoinPurchase = async () => {
    setState((prev) => ({ ...prev, loading: true }));

    const paymentData = {
      quantity: state.coinsToBuy || 1,
      date: new Date(),
      user: user,
      amount: totalPrice,
      paymentMode: "Credit Card",
    };

    await dispatch(paymentTamdCoin({ paymentData }));
    await fetchUserData();
    setState((prev) => ({ ...prev, loading: false }));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };
  return (
    <div className="w-full px-6 ">
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
              onClick={() => setState((prev) => ({ ...prev, activeTab: tab }))}
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
            setCoinsToBuy={(value) =>
              setState((prev) => ({ ...prev, coinsToBuy: value }))
            }
            handleCoinPurchase={handleCoinPurchase}
          />
        )}
      </div>

      {/* Payment History */}
      <PaymentHistory
        payments={state.payments}
        loading={state.loading}
        error={state.error}
      />
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
  handleCoinPurchase,
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
                onChange={(e) => {
                  const val = e.target.value;
              
                  // Allow empty string so user can type
                  if (val === '') {
                    setCoinsToBuy('');
                    return;
                  }
              
                  // Convert to number
                  const num = Number(val);
              
                  // Prevent zero or negative
                  if (num < 1) return;
              
                  setCoinsToBuy(num);
                }}
              
                className="w-24 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <p className="text-sm text-gray-500">
                × ${COIN_PRICE} = ${totalPrice}
              </p>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Payment Method</label>
            <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-white">
              <CreditCard className="h-4 w-4" />
              Credit/Debit Card
            </div>
          </div>

          <button
            onClick={handleCoinPurchase}
            disabled={loading || coinsToBuy == ''}
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

const PaymentHistory = ({ payments, loading, error }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate pagination
  const totalPages = Math.ceil(payments.length / itemsPerPage);
  const paginatedPayments = payments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="gap-2 p-4 border-b flex flex-row items-center justify-between">
        <h3 className="text-xs text-center md:text-lg font-medium flex items-center ">
          Payment History
        </h3>
        {payments.length > itemsPerPage && (
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-1 md:px-3 sm:py-1 border rounded disabled:opacity-50"
            >
              <span className="text-[8px] sm:text-xs text-center md:text-lg">
                Previous
              </span>
            </button>
            <span className="text-[8px] sm:text-xs text-center md:text-lg">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-1 md:px-3 sm:py-1 border rounded disabled:opacity-50"
            >
              <span className="text-[8px] sm:text-xs text-center md:text-lg">
                Next
              </span>
            </button>
          </div>
        )}
      </div>
      <div className="p-4">
        {loading ? (
          <p>Loading payments...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            {paginatedPayments.length === 0 ? (
              <div className="text-center p-4">No payments found.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    {["Date", "Amount", "Qty", "Status", "Method"].map(
                      (header) => (
                        <th
                          key={header}
                          className="p-2 font-medium whitespace-nowrap"
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {paginatedPayments.map((payment, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : ""}
                    >
                      <td className="p-2 whitespace-nowrap">
                        {new Date(payment.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-2 text-green-600 whitespace-nowrap">
                        ${payment.amount.toFixed(2)}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {payment.coinQuantity}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <StatusBadge status={payment.status} />
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {payment.paymentMethod}
                      </td>
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
};

// Updated StatusBadge to match smaller size
const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
      status === "completed"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {status}
  </span>
);
export default Payments;