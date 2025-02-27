// doctorSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunk for Doctor Registration
export const registerDoctor = createAsyncThunk(
  "doctor/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/doctor/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure proper content type for file uploads
          },
        }
      );
      return response.data; // Assuming the backend returns { message, doctor }
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

// Doctor Slice
const doctorSlice = createSlice({
  name: "doctor",
  initialState: {
    doctor: null,
    loading: false,
    error: null,
    errors: {},
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.errors = {};
    },
    clearDoctor: (state) => {
      state.doctor = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register Doctor
      .addCase(registerDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.doctor = action.payload.doctor; // Store doctor data upon success
      })
      .addCase(registerDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Doctor registration failed";
      });
  },
});

export const { clearError, clearDoctor } = doctorSlice.actions;
export default doctorSlice.reducer;
