import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {loadStripe} from '@stripe/stripe-js'
// Async Thunk for Login
export const loginUser = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://hms-backend-1-pngp.onrender.com/api/newuser/login",
        {
          Email: userData.email, // Match the backend's expected key
          Password: userData.password, // Match the backend's expected key
        }
      );

      const {token, user} = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return response.data; // Assuming the backend returns { message, token }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const paymentTamdCoin = createAsyncThunk(
  "user/payment",
  async ({paymentData}, { rejectWithValue }) => {
    try {
      console.log("Payment data received:", paymentData);
      let paymentResponse;
      
      // // Determine payment type and call appropriate API
      if (paymentData.paymentMode === "Credit Card") {
      //   // Call Stripe payment API
      const stripe = await loadStripe("pk_test_51RA7gzR4IpVwwNdkSnaCFniqyAdSIFkPIcztaYVwuIlmUImYiPtSS2UEnDQjMS9GF2BddzsU75t1PjRqiWh0aa1E00bBEJqgio")
        paymentResponse = await axios.post("http://localhost:8080/api/payments/stripe", {paymentData});
        const session=await respose.json()
        const result=stripe.redirectToCheckout({
          sessionId:session.id
        })
        if (result.error){
          console.log(result.error.message)
        }
      } else if (paymentData.paymentMode=== "Wallet") {
        //   // Call wallet payment API and update wallet balance in MongoDB
        paymentResponse = await axios.post("http://localhost:8080/api/payments/wallet", {paymentData});
      }
      else{
        console.log("invalid",paymentData.paymentMode)
      }
      
      // // If payment successful, update account regardless of payment method
      // if (paymentResponse && paymentResponse.status === 200) {
      //   const accountUpdate = await api.put("/user/account", {
      //     userId: paymentData.userId,
      //     transactionId: paymentResponse.data.transactionId,
      //     amount: paymentData.amount,
      //     quantity: paymentData.quantity
      //   });
      //   return accountUpdate.data;
      // }
      
      // throw new Error("Payment processing failed");
      
    } catch (error) {
      return rejectWithValue(error.response?.data || {
        message: "Payment processing failed",
        error: error.message
      });
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