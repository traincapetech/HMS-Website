import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../app/api";

// Debug function to check doctor data structure
const validateDoctorData = (doctorData, source) => {
  if (!doctorData) {
    console.warn(`[DEBUG] No doctor data from ${source}`);
    return null;
  }
  
  console.log(`[DEBUG] Doctor data from ${source}:`, {
    id: doctorData._id || doctorData.id || 'missing',
    email: doctorData.Email || doctorData.email || 'missing',
    name: doctorData.Name || doctorData.name || 'missing',
    fields: Object.keys(doctorData)
  });
  
  return doctorData;
};

// Enhanced function to load doctor from localStorage
const loadDoctorFromStorage = () => {
  const storedDoctor = localStorage.getItem("doctor");
  if (!storedDoctor) {
    console.log("[DEBUG] No doctor data in localStorage");
    return null;
  }
  
  try {
    const doctorData = JSON.parse(storedDoctor);
    return validateDoctorData(doctorData, "localStorage");
  } catch (error) {
    console.error("[DEBUG] Error parsing doctor data from localStorage:", error);
    // Invalid data, clear it
    localStorage.removeItem("doctor");
    return null;
  }
};

// Load doctor from localStorage on initial load with validation
const initialDoctor = loadDoctorFromStorage();

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

// Login doctor with enhanced error handling and data validation
export const loginDoctor = createAsyncThunk(
  "doctor/login",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("[DEBUG] Attempting login with:", { email: credentials.Email });
      
      const response = await api.loginDoctor(credentials);
      console.log("[DEBUG] Login response:", response.data);
      
      // The backend returns data in 'user' field
      const doctorData = response.data.user;
      
      // Store token
      if (response.data?.token) {
        localStorage.setItem("doctorToken", response.data.token);
        
        // Examine token structure
        try {
          const tokenParts = response.data.token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log("[DEBUG] Token payload:", payload);
          }
        } catch (e) {
          console.warn("[DEBUG] Could not parse token:", e);
        }
        
        // Store doctor data (from the 'user' field)
        if (doctorData) {
          // Validate doctor has necessary fields
          validateDoctorData(doctorData, "login response");
          
          // Add ID field if missing but available in a different format
          const doctorToStore = { ...doctorData };
          if (!doctorToStore._id && doctorToStore.id) {
            doctorToStore._id = doctorToStore.id;
            console.log("[DEBUG] Added _id field from id:", doctorToStore._id);
          }
          
          // Store the email separately for easy lookup
          localStorage.setItem("doctorEmail", doctorToStore.Email || doctorToStore.email);
          localStorage.setItem("doctor", JSON.stringify(doctorToStore));
          
          console.log("[DEBUG] Doctor data stored in localStorage");
        } else {
          console.warn("[DEBUG] No doctor data in response despite successful login");
        }
      } else {
        console.warn("[DEBUG] No token in login response");
      }
      
      // Return the correct structure
      return {
        token: response.data.token,
        doctor: doctorData
      };
    } catch (error) {
      console.error("[DEBUG] Login error:", error);
      const errorMessage = error.response?.data?.message || "Login failed";
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch doctor profile with validation
export const fetchDoctorProfile = createAsyncThunk(
  "doctor/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("doctorToken");
      if (!token) {
        console.warn("[DEBUG] No authentication token found for profile fetch");
        return rejectWithValue("No authentication token found");
      }
      
      console.log("[DEBUG] Fetching doctor profile with token");
      const response = await api.getDoctorProfile();
      console.log("[DEBUG] Profile response:", response.data);
      
      // Update the stored doctor data with the latest profile info
      if (response.data?.doctor) {
        const doctorToStore = { ...response.data.doctor };
        
        // Validate doctor has necessary fields
        validateDoctorData(doctorToStore, "profile response");
        
        // Add ID field if missing but available in a different format
        if (!doctorToStore._id && doctorToStore.id) {
          doctorToStore._id = doctorToStore.id;
          console.log("[DEBUG] Added _id field from id:", doctorToStore._id);
        }
        
        localStorage.setItem("doctor", JSON.stringify(doctorToStore));
        console.log("[DEBUG] Updated doctor profile in localStorage");
      } else {
        console.warn("[DEBUG] No doctor data in profile response");
      }
      
      return response.data;
    } catch (error) {
      console.log("[DEBUG] Failed to fetch doctor profile:", error);
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
      localStorage.removeItem("doctorEmail");
      console.log("[DEBUG] Doctor logout: cleared localStorage");
      return null;
    } catch (error) {
      console.error("[DEBUG] Logout error:", error);
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
    clearDoctorState: (state) => {
      state.doctor = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
    },
    // Add a new reducer to manually update doctor state if needed
    updateDoctorState: (state, action) => {
      state.doctor = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        validateDoctorData(action.payload, "manual update");
      }
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
        console.log("[DEBUG] Doctor login successful, updated Redux state");
      })
      .addCase(loginDoctor.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload || "Login failed";
        console.warn("[DEBUG] Doctor login failed:", action.payload);
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
        console.log("[DEBUG] Doctor profile fetch successful, updated Redux state");
      })
      .addCase(fetchDoctorProfile.rejected, (state, action) => {
        state.isLoading = false;
        // Don't automatically log out on profile fetch error
        state.error = action.payload || "Failed to fetch profile";
        console.warn("[DEBUG] Doctor profile fetch failed:", action.payload);
      })
      
      // Logout cases
      .addCase(logoutDoctor.fulfilled, (state) => {
        state.doctor = null;
        state.isAuthenticated = false;
        state.error = null;
        console.log("[DEBUG] Doctor logout successful, cleared Redux state");
      });
  },
});

export const { clearError, clearDoctorState, updateDoctorState } = doctorSlice.actions;
export default doctorSlice.reducer;