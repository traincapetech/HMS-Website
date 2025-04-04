import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../app/api";

// Load doctor from localStorage on initial load
const initialDoctor = localStorage.getItem("doctor")
  ? JSON.parse(localStorage.getItem("doctor"))
  : null;

const initialState = {
  doctor: initialDoctor,
  isLoading: false,
  isAuthenticated: !!initialDoctor, // true if doctor exists, false otherwise
  error: null,
};

// Register doctor
export const registerDoctor = createAsyncThunk(
  "doctor/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.registerDoctor(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Login doctor
export const loginDoctor = createAsyncThunk(
  "doctor/login",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("Attempting login with:", { email: credentials.Email });
      
      const response = await api.loginDoctor(credentials);
      
      // The backend returns data in 'user' field
      const doctorData = response.data.user;
      
      // Store token
      if (response.data?.token) {
        localStorage.setItem("doctorToken", response.data.token);
        
        // Store doctor data (from the 'user' field)
        if (doctorData) {
          console.log("Doctor data received:", doctorData.Name);
          // Store the email separately for easy lookup
          localStorage.setItem("doctorEmail", doctorData.Email);
          localStorage.setItem("doctor", JSON.stringify(doctorData));
        } else {
          console.warn("No doctor data in response despite successful login");
        }
      }
      
      // Return the correct structure
      return {
        token: response.data.token,
        doctor: doctorData
      };
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || "Login failed";
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch doctor profile
export const fetchDoctorProfile = createAsyncThunk(
  "doctor/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("doctorToken");
      if (!token) {
        return rejectWithValue("No authentication token found");
      }
      
      const response = await api.getDoctorProfile();
      
      // Update the stored doctor data with the latest profile info
      if (response.data?.doctor) {
        localStorage.setItem("doctor", JSON.stringify(response.data.doctor));
      }
      
      return response.data;
    } catch (error) {
      console.log("Failed to fetch doctor profile:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

// Logout doctor
export const logoutDoctor = createAsyncThunk(
  "doctor/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Remove doctor data from localStorage
      localStorage.removeItem("doctorToken");
      localStorage.removeItem("doctor");
      return null;
    } catch (error) {
      return rejectWithValue("Logout failed");
    }
  }
);

const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(registerDoctor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerDoctor.fulfilled, (state, action) => {
        state.isLoading = false;
        // Don't automatically log in after registration
      })
      .addCase(registerDoctor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Registration failed";
      })
      
      // Login cases
      .addCase(loginDoctor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginDoctor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.doctor = action.payload.doctor;
        state.error = null;
      })
      .addCase(loginDoctor.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload || "Login failed";
      })
      
      // Fetch profile cases
      .addCase(fetchDoctorProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDoctorProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.doctor = action.payload.doctor;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchDoctorProfile.rejected, (state, action) => {
        state.isLoading = false;
        // Don't automatically log out on profile fetch error
        state.error = action.payload || "Failed to fetch profile";
      })
      
      // Logout cases
      .addCase(logoutDoctor.fulfilled, (state) => {
        state.doctor = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError } = doctorSlice.actions;
export default doctorSlice.reducer;