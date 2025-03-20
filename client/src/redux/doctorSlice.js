import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../utils/app.api';

// Async thunks for API calls
export const registerDoctor = createAsyncThunk(
  'doctor/register',
  async (doctorData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/doctors/register', doctorData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginDoctor = createAsyncThunk(
  'doctor/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/doctors/login', credentials);
      localStorage.setItem('doctorToken', response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logoutDoctor = createAsyncThunk(
  'doctor/logout',
  async () => {
    localStorage.removeItem('doctorToken');
  }
);

export const getDoctorProfile = createAsyncThunk(
  'doctor/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/doctors/profile');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateDoctorProfile = createAsyncThunk(
  'doctor/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put('/api/doctors/profile', profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Doctor Slice
const doctorSlice = createSlice({
  name: "doctor",
  initialState: {
    doctor: null,
    token: localStorage.getItem('doctorToken'),
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerDoctor.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(registerDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Registration failed';
      })
      
      // Login
      .addCase(loginDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.doctor = action.payload.doctor;
        state.token = action.payload.token;
      })
      .addCase(loginDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      
      // Logout
      .addCase(logoutDoctor.fulfilled, (state) => {
        state.doctor = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      
      // Get Profile
      .addCase(getDoctorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.doctor = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch profile';
      })
      
      // Update Profile
      .addCase(updateDoctorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDoctorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.doctor = action.payload;
      })
      .addCase(updateDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update profile';
      });
  },
});

export const { clearError } = doctorSlice.actions;
export default doctorSlice.reducer;