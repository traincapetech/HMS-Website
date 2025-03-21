import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return response.data; // Assuming the backend returns { message, token }
    } catch (error) {
      return rejectWithValue(error.response.data);
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

// Async Thunk for Updating User Profile (including photo)
export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (updatedData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:8080/api/newuser/67dd1fd49276c3d9f3b0fb69/image",
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local storage with the new user data
      localStorage.setItem("user", JSON.stringify(response.data.user));

      return response.data.user; // Return the updated user object
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update profile");
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
      })

      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
      })

      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Update the user object in the state
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update profile";
      });
  },
});

export const { clearError, logoutUser } = userSlice.actions;
export default userSlice.reducer;