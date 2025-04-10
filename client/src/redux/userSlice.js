import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
// Async Thunk for Login
export const loginUser = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/newuser/login",
        {
          Email: userData.email, // Match the backend's expected key
          Password: userData.password, // Match the backend's expected key
        }
      );

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return response.data; // Assuming the backend returns { message, token }
    } catch (error) {
      return rejectWithValue(error.response.data);
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
          "http://localhost:8080/api/payments/stripe",
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
        const response = await axios.post("http://localhost:8080/api/payments/wallet", {
          paymentData,
        });
        return response.data;
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// New thunk for checking payment status
export const checkPaymentStatus = createAsyncThunk(
  "user/checkPaymentStatus",
  async ({ sessionId, email }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/payments/success?session_id=${sessionId}&email=${encodeURIComponent(email)}`
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// Async Thunk for User Registration
export const registerUser = createAsyncThunk(
  "user/register",
  async (formData, { rejectWithValue }) => {
    try {
      const requestBody = {
        UserName: formData.userName,
        FirstName: formData.firstName,
        LastName: formData.lastName,
        Email: formData.email,
        Phone: formData.phone,
        Password: formData.password,
        DOB: formData.dateOfBirth,
        Gender: formData.gender,
        Country: formData.country,
        State: formData.state,
        City: formData.city,
        Address: formData.address,
      };

      console.log("Request Body:", requestBody); // Debugging line

      const response = await axios.post(
        "https://hms-backend-1-pngp.onrender.com/api/newuser/register",
        requestBody
      );

      return response.data;
    } catch (error) {
      console.error("Error Response:", error.response?.data); // Debugging line
      return rejectWithValue(error.response?.data || "Unknown Error");
    }
  }
);



// Async thunk for user send otp
export const sendOTPToEmail = createAsyncThunk(
  "user/sendOTPToEmail",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/newuser/sendOTPToEmail",
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
        "http://localhost:8080/api/newuser/verifyOtp",
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
       "http://localhost:8080/api/newuser/reset_password",
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
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
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
      });
  },
});

export const { clearError, logoutUser } = userSlice.actions;
export default userSlice.reducer;
