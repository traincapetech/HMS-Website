import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, paymentTamdCoin } from "../../../redux/userSlice";
import { CoinsIcon as Coin, CreditCard, History, Bitcoin } from "lucide-react";
import { CoinbaseCommerceButton } from '@iofate/react-coinbase-commerce';
import '@iofate/react-coinbase-commerce/dist/esm/index.css';


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
    paymentMethod: "card", // 'card' or 'crypto'
    selectedCrypto: "bitcoin", // 'bitcoin', 'ethereum', or 'litecoin'
    cryptoPayment: null,
    cryptoPrices: null,
    cryptoLoading: false,
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
      setState(prev => ({ ...prev, loading: true }));
      const response = await axios.get(
        `https://hms-backend-1-pngp.onrender.com/api/newuser/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userData = response.data.newuser;
      setState(prev => ({
        ...prev,
        loading: false,
        fetchedData: userData,
        payments: userData.transactions || [],
        tamdCoins: userData.coinQuantity,
      }));
    } catch (error) {
      setState(prev => ({ ...prev, error: "Failed to fetch user data", loading: false }));
    }
  };

  // Fetch crypto prices
  const fetchCryptoPrices = async () => {
    try {
      setState(prev => ({ ...prev, cryptoLoading: true }));
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price', 
        {
          params: {
            ids: 'bitcoin,ethereum,litecoin',
            vs_currencies: 'usd'
          }
        }
      );
      setState(prev => ({ 
        ...prev, 
        cryptoPrices: response.data,
        cryptoLoading: false
      }));
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      setState(prev => ({ 
        ...prev, 
        cryptoLoading: false,
        error: "Failed to fetch cryptocurrency prices" 
      }));
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchCryptoPrices();
    window.scrollTo(0, 0);
  }, []);

  // Handlers
  const handleCoinPurchase = async () => {
    if (state.paymentMethod === 'card') {
      setState(prev => ({ ...prev, loading: true }));

      const paymentData = {
        quantity: state.coinsToBuy || 1,
        date: new Date(),
        user: user,
        amount: totalPrice,
        paymentMode: "Credit Card",
      };

      await dispatch(paymentTamdCoin({ paymentData }));
      await fetchUserData();
      setState(prev => ({ ...prev, loading: false }));
    } else if (state.paymentMethod === 'crypto') {
      setState(prev => ({ ...prev, loading: true, error: "" }));
      
      try {
        const response = await axios.post(
          'https://hms-backend-1-pngp.onrender.com/api/payments/crypto',
          {
            email: user.Email,
            quantity: state.coinsToBuy || 1,
            cryptoCurrency: state.selectedCrypto
          }
        );
        
        if (response.data.success) {
          setState(prev => ({ 
            ...prev, 
            loading: false,
            cryptoPayment: response.data.charge 
          }));
        } else {
          // Handle unsuccessful response
          setState(prev => ({ 
            ...prev, 
            loading: false,
            error: response.data.message || "Failed to create cryptocurrency payment" 
          }));
        }
      } catch (error) {
        console.error('Error creating crypto payment:', error);
        setState(prev => ({ 
          ...prev, 
          loading: false,
          error: error.response?.data?.message || "Failed to connect to payment service. Please try again later." 
        }));
      }
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  // Calculate crypto amount based on selected currency
  const calculateCryptoAmount = () => {
    if (!state.cryptoPrices) return 'Loading...';
    
    const cryptoRate = state.cryptoPrices[state.selectedCrypto]?.usd;
    if (!cryptoRate) return 'Price unavailable';
    
    const cryptoAmount = totalPrice / cryptoRate;
    return cryptoAmount.toFixed(8);
  };

  // Handle payment success from Coinbase Commerce
  const handleCryptoPaymentSuccess = (data) => {
    console.log('Crypto payment successful:', data);
    fetchUserData(); // Refresh user data to get updated coin balance
    setState(prev => ({ ...prev, cryptoPayment: null }));
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
            setCoinsToBuy={(value) =>
              setState(prev => ({ ...prev, coinsToBuy: value }))
            }
            setPaymentMethod={(value) =>
              setState(prev => ({ ...prev, paymentMethod: value, cryptoPayment: null }))
            }
            setSelectedCrypto={(value) =>
              setState(prev => ({ ...prev, selectedCrypto: value }))
            }
            handleCoinPurchase={handleCoinPurchase}
            calculateCryptoAmount={calculateCryptoAmount}
            handleCryptoPaymentSuccess={handleCryptoPaymentSuccess}
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
  paymentMethod,
  selectedCrypto,
  cryptoPayment,
  cryptoPrices,
  cryptoLoading,
  setCoinsToBuy,
  setPaymentMethod,
  setSelectedCrypto,
  handleCoinPurchase,
  calculateCryptoAmount,
  handleCryptoPaymentSuccess
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
                  if (val === "") {
                    setCoinsToBuy("");
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
            <div className="grid grid-cols-2 gap-2">
              <div 
                className={`flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer ${
                  paymentMethod === 'card' 
                    ? 'bg-red-50 border-red-500 text-red-600' 
                    : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard className="h-4 w-4" />
                <span>Credit/Debit Card</span>
              </div>
              
              <div 
                className={`flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer ${
                  paymentMethod === 'crypto' 
                    ? 'bg-red-50 border-red-500 text-red-600' 
                    : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => setPaymentMethod('crypto')}
              >
                <Bitcoin className="h-4 w-4" />
                <span>Cryptocurrency</span>
              </div>
            </div>
          </div>

          {paymentMethod === 'crypto' && (
            <div className="grid gap-2">
              <label className="text-sm font-medium">Select Cryptocurrency</label>
              <div className="grid grid-cols-3 gap-2">
                {['bitcoin', 'ethereum', 'litecoin'].map((crypto) => (
                  <div 
                    key={crypto}
                    className={`flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer text-sm ${
                      selectedCrypto === crypto 
                        ? 'bg-red-50 border-red-500 text-red-600' 
                        : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedCrypto(crypto)}
                  >
                    <Bitcoin className="h-4 w-4" />
                    <span className="capitalize">{crypto}</span>
                  </div>
                ))}
              </div>
              
              {!cryptoLoading && cryptoPrices && (
                <div className="mt-2 text-sm text-gray-600">
                  <p>Approximate cost: {calculateCryptoAmount()} {selectedCrypto.toUpperCase()}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    1 {selectedCrypto.toUpperCase()} = ${cryptoPrices[selectedCrypto]?.usd.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}

          {cryptoPayment ? (
            <div className="mt-2">
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                <p className="text-green-800 font-medium">Your crypto payment is ready!</p>
                <p className="text-sm text-green-700 mt-1">Click the button below to complete your purchase using Coinbase Commerce.</p>
              </div>
              
              <CoinbaseCommerceButton
                chargeId={cryptoPayment.id}
                styled={true}
                onChargeSuccess={handleCryptoPaymentSuccess}
                onChargeFailure={(data) => console.log('Payment failed:', data)}
                onPaymentDetected={(data) => console.log('Payment detected:', data)}
                className="w-full py-2 px-4 rounded-md font-medium text-white bg-red-600 hover:bg-red-700"
              />
            </div>
          ) : (
            <button
              onClick={handleCoinPurchase}
              disabled={loading || coinsToBuy == ""}
              className={`hover:cursor-pointer w-full py-2 px-4 rounded-md font-medium text-white ${
                loading
                  ? "bg-red-300 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {loading
                ? "Processing..."
                : `Buy ${coinsToBuy} Tamd Coin${coinsToBuy > 1 ? "s" : ""} with ${paymentMethod === 'card' ? 'Card' : 'Crypto'}`}
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

const PaymentHistory = ({ payments, loading, error }) => (
  <div className="bg-white rounded-lg border shadow-sm">
    <div className="p-4 border-b">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <History className="h-5 w-5" />
        Payment History
      </h3>
    </div>
    <div className="p-4">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      ) : error ? (
        <div className="py-6 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : payments?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-right">Amount</th>
                <th className="px-4 py-2 text-right">Coins</th>
                <th className="px-4 py-2 text-right">Status</th>
                <th className="px-4 py-2 text-right">Payment Method</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payments.slice().reverse().map((payment, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">{payment.quantity}</td>
                  <td className="px-4 py-3 text-right">
                    <StatusBadge status={payment.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {payment.paymentMode || "Card"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-gray-500">No payment history found.</p>
        </div>
      )}
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const statusColors = {
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
    processing: "bg-blue-100 text-blue-800",
  };

  const resolvedStatus = status?.toLowerCase() || "pending";
  const colorClass = statusColors[resolvedStatus] || statusColors.pending;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
    >
      {resolvedStatus.charAt(0).toUpperCase() + resolvedStatus.slice(1)}
    </span>
  );
};

export default Payments;