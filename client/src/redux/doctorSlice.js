import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../utils/app.api';

// Async thunks for API calls
export const registerDoctor = createAsyncThunk(
  'doctor/register',
  async (doctorData, { rejectWithValue }) => {
    try {
      // Create a FormData object to handle file uploads
      const formData = new FormData();
      
      // Add all fields to formData
      for (const key in doctorData) {
        // Skip null values
        if (doctorData[key] === null) continue;
        
        // Handle File objects specially
        if (key === 'image' || key === 'document') {
          if (doctorData[key] instanceof File) {
            formData.append(key, doctorData[key]);
            console.log(`Appending file ${key}:`, doctorData[key].name, doctorData[key].size);
          }
        } else {
          formData.append(key, doctorData[key]);
        }
      }
      
      // Log FormData entries for debugging
      console.log('FormData entries:');
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]);
      }
      
      // Override Content-Type header to allow multer to process the files correctly
      const response = await api.post('/doctors/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Doctor registration error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const loginDoctor = createAsyncThunk(
  'doctor/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('Attempting doctor login with:', { email: credentials.Email });
      
      const response = await api.post('/doctors/login', credentials);
      
      // Store the token in localStorage for authentication
      localStorage.setItem('doctorToken', response.data.token);
      
      // Store doctor info in localStorage for faster access (optional)
      if (response.data.user) {
        localStorage.setItem('doctorInfo', JSON.stringify(response.data.user));
      }
      
      console.log('Doctor login successful:', response.data.user?.Name || 'Unknown');
      return response.data;
    } catch (error) {
      console.error('Doctor login error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: error.message || 'Login failed' });
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
  async (_, { rejectWithValue, getState }) => {
    try {
      // Check if we have a token
      const token = localStorage.getItem('doctorToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Log the profile fetch attempt
      console.log('Fetching doctor profile...');
      
      // Get the doctor profile
      const response = await api.get('/doctors/profile');
      
      console.log('Doctor profile fetched successfully:', response.data.name);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch doctor profile:', error.response?.data || error.message);
      
      // If unauthorized (401), remove the token
      if (error.response?.status === 401) {
        localStorage.removeItem('doctorToken');
      }
      
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateDoctorProfile = createAsyncThunk(
  'doctor/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put('/doctors/profile', profileData);
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