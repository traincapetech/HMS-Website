import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

// Get user from localStorage safely to avoid JSON parse errors
const getUserFromStorage = () => {
  try {
    const userData = localStorage.getItem("user");
    if (!userData) return null;
    return JSON.parse(userData);
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    // Clear invalid data
    localStorage.removeItem("user");
    return null;
  }
};

// Get API base URL from env-config.js or use fallback
const API_BASE_URL = window.ENV_CONFIG?.REACT_APP_API_URL || "https://hms-backend-1-pngp.onrender.com/api";
console.log("Using API URL:", API_BASE_URL);

// Async Thunk for Login
export const loginUser = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/newuser/login`,
        {
          Email: userData.email,
          Password: userData.password,
        }
      );

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Login failed" });
    }
  }
);

// Payment thunk for initiating payment
export const paymentTamdCoin = createAsyncThunk(
  "user/payment",
  async ({ paymentData }, { rejectWithValue }) => {
    try {
      console.log("Payment data received:", paymentData);

      if (paymentData.paymentMode === "Credit Card") {
        const stripe = await loadStripe(
          "pk_test_51RA7gzR4IpVwwNdkSnaCFniqyAdSIFkPIcztaYVwuIlmUImYiPtSS2UEnDQjMS9GF2BddzsU75t1PjRqiWh0aa1E00bBEJqgio"
        );

        const body = {
          products: paymentData,
        };
        
        const response = await axios.post(
          `${API_BASE_URL}/payments/stripe`,
          body,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Stripe response:", response.data);

        // Use the URL directly for more reliable redirection
        if (response.data.url) {
          window.location.href = response.data.url;
          return { redirecting: true, sessionId: response.data.sessionId };
        } else {
          // Fall back to redirectToCheckout if no URL
          const result = await stripe.redirectToCheckout({
            sessionId: response.data.sessionId,
          });

          if (result.error) {
            throw new Error(result.error.message);
          }
          return { redirecting: true, sessionId: response.data.sessionId };
        }
      } else if (paymentData.paymentMode === "Wallet") {
        const response = await axios.post(`${API_BASE_URL}/payments/wallet`, {
          paymentData,
        });
        return response.data;
      }
    } catch (error) {
      console.error("Payment error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: error.message || "Payment failed" });
    }
  }
);

// New thunk for checking payment status
export const checkPaymentStatus = createAsyncThunk(
  "user/checkPaymentStatus",
  async ({ sessionId, email }, { rejectWithValue }) => {
    try {
      if (!sessionId) {
        throw new Error("Session ID is required");
      }
      
      if (!email) {
        throw new Error("Email is required");
      }
      
      const response = await axios.get(
        `${API_BASE_URL}/payments/success?session_id=${sessionId}&email=${encodeURIComponent(email)}`
      );
      
      return response.data;
    } catch (error) {
      console.error("Payment status check error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: error.message || "Failed to check payment status" });
    }
  }
);

// Async Thunk for User Registration
export const registerUser = createAsyncThunk(
  "user/register",
  async (formData, { rejectWithValue }) => {
    try {
      console.log("Attempting to register user with FormData");
      
      // Check if formData is an instance of FormData
      const isFormData = formData instanceof FormData;
      
      let requestBody;
      
      // If it's already FormData, use it directly
      if (isFormData) {
        requestBody = formData;
        console.log("Using FormData object directly for multipart upload");
      } else {
        // Otherwise, create a FormData object from the plain object
        requestBody = new FormData();
        
        // Add all form fields to FormData
        Object.keys(formData).forEach(key => {
          if (key === 'image' && formData[key]) {
            requestBody.append('image', formData[key]);
          } else {
            requestBody.append(key, formData[key]);
          }
        });
        console.log("Created FormData object from plain object");
      }

      // Log some debug information - but don't log all FormData contents 
      // as that could be sensitive
      console.log("Form data keys being sent:", 
        [...requestBody.entries()].map(entry => entry[0]));

      const response = await axios.post(
        `${API_BASE_URL}/newuser/register`,
        requestBody,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error("Error Response:", error.response?.data || error.message); // Debugging line
      return rejectWithValue(error.response?.data || { message: "Registration failed" });
    }
  }
);

// Async thunk for user send otp
export const sendOTPToEmail = createAsyncThunk(
  "user/sendOTPToEmail",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://hms-backend-1-pngp.onrender.com/api/newuser/sendOTPToEmail",
        { email }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { msg: "OTP Failed to be Sent" });
    }
  }
);

// Async thunk for user verify otp
export const verifyOtp = createAsyncThunk(
  "user/verifyOtp",
  async ({ otp, email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://hms-backend-1-pngp.onrender.com/api/newuser/verifyOtp",
        { otp, email }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { msg: "OTP Failed to be Verified" });
    }
  }
);

// Async thunk for password reset
export const reset_password = createAsyncThunk(
  "user/reset_password",
  async ({ otp, email, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
       "https://hms-backend-1-pngp.onrender.com/api/newuser/reset_password",
        { otp, email, newPassword }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { msg: "New Password Failed to be Changed" });
    }
  }
);


const userSlice = createSlice({
  name: "user",
  initialState: {
    user: getUserFromStorage(),
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    paymentLoading: false,
    paymentError: null,
    paymentSuccess: false,
    sessionId: null,
    paymentStatus: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.paymentError = null;
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    resetPaymentState: (state) => {
      state.paymentLoading = false;
      state.paymentError = null;
      state.paymentSuccess = false;
      state.sessionId = null;
      state.paymentStatus = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })      
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })
      
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
      })
      
      // Handle OTP sending
      .addCase(sendOTPToEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOTPToEmail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendOTPToEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to send OTP";
      })

      // Handle OTP verification
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "OTP verification failed";
      })

      // Handle password reset
      .addCase(reset_password.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reset_password.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(reset_password.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Password reset failed";
      })

      // Payment
      .addCase(paymentTamdCoin.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
        state.paymentSuccess = false;
      })
      .addCase(paymentTamdCoin.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.paymentSuccess = true;
        if (action.payload?.sessionId) {
          state.sessionId = action.payload.sessionId;
        }
        // If it's a wallet payment and we get updated user data
        if (action.payload?.user) {
          state.user = action.payload.user;
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        }
      })
      .addCase(paymentTamdCoin.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentError = action.payload?.message || "Payment failed";
      })
      
      // Check Payment Status
      .addCase(checkPaymentStatus.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
      })
      .addCase(checkPaymentStatus.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.paymentStatus = action.payload.status;
        // If payment successful, update user data
        if (action.payload.status === 'success' && action.payload.user) {
          state.user = action.payload.user;
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        }
      })
      .addCase(checkPaymentStatus.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentError = action.payload?.message || "Failed to check payment status";
      });
  },
});

export const { clearError, logoutUser, resetPaymentState } = userSlice.actions;
export default userSlice.reducer;