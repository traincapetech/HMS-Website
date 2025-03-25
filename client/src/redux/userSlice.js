// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // Async Thunk for Login
// export const loginUser = createAsyncThunk(
//   "user/login",
//   async (userData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         "https://hms-backend-1-pngp.onrender.com/api/newuser/login",
//         {
//           Email: userData.email,
//           Password: userData.password,
//         }
//       );
//       const { token, user } = response.data;
      
//       // Set token in localStorage and axios headers
//       localStorage.setItem("token", token);
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
//       // Store user data
//       localStorage.setItem("user", JSON.stringify(user));
      
//       return { token, user };
//     } catch (error) {
//       return rejectWithValue({
//         message: error.response?.data?.message || error.message,
//         status: error.response?.status
//       });
//     }
//   }
// );

// // Async Thunk for User Registration
// export const registerUser = createAsyncThunk(
//   "user/register",
//   async (formData, { rejectWithValue }) => {
//     try {
//       const requestBody = {
//         UserName: formData.userName,
//         FirstName: formData.firstName,
//         LastName: formData.lastName,
//         Email: formData.email,
//         Phone: formData.phone,
//         Password: formData.password,
//         DOB: formData.dateOfBirth,
//         Gender: formData.gender,
//         Country: formData.country,
//         State: formData.state,
//         City: formData.city,
//         Address: formData.address,
//       };

//       const response = await axios.post(
//         "https://hms-backend-1-pngp.onrender.com/api/newuser/register",
//         requestBody
//       );

//       // Handle login after successful registration
//       const loginResponse = await axios.post(
//         "https://hms-backend-1-pngp.onrender.com/api/newuser/login",
//         {
//           Email: formData.email,
//           Password: formData.password,
//         }
//       );

//       const { token, user } = loginResponse.data;
//       localStorage.setItem("token", token);
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       localStorage.setItem("user", JSON.stringify(user));

//       return { token, user };
//     } catch (error) {
//       return rejectWithValue({
//         message: error.response?.data?.message || error.message,
//         status: error.response?.status
//       });
//     }
//   }
// );

// // Async Thunk for Updating User Profile (including photo)
// export const updateUserProfile = createAsyncThunk(
//   "user/updateProfile",
//   async (updatedData, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.put(
//         "http://localhost:8080/api/newuser/67dd1fd49276c3d9f3b0fb69/image",
//         updatedData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // Update local storage with the new user data
//       localStorage.setItem("user", JSON.stringify(response.data.user));
      
//       return response.data.user;
//     } catch (error) {
//       return rejectWithValue({
//         message: error.response?.data?.message || error.message,
//         status: error.response?.status
//       });
//     }
//   }
// );

// const userSlice = createSlice({
//   name: "user",
//   initialState: {
//     user: JSON.parse(localStorage.getItem("user")) || null,
//     token: localStorage.getItem("token") || null,
//     loading: false,
//     error: null,
//     status: "idle", // Added status state
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     logoutUser: (state) => {
//       state.user = null;
//       state.token = null;
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       delete axios.defaults.headers.common['Authorization'];
//       state.status = "idle";
//     },
//     resetStatus: (state) => {
//       state.status = "idle";
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Login User
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.status = "loading";
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.token = action.payload.token;
//         state.user = action.payload.user;
//         state.status = "succeeded";
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.status = "failed";
//       })
//       // Register User
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.status = "loading";
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//         state.status = "succeeded";
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.status = "failed";
//       })
//       // Update User Profile
//       .addCase(updateUserProfile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.status = "loading";
//       })
//       .addCase(updateUserProfile.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//         state.status = "succeeded";
//       })
//       .addCase(updateUserProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.status = "failed";
//       });
//   },
// });

// export const { clearError, logoutUser, resetStatus } = userSlice.actions;
// export default userSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://hms-backend-1-pngp.onrender.com/api/newuser";

// Helper function to handle auth headers
const setAuthHeaders = (token) => {
  localStorage.setItem("token", token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Async Thunk for Login
export const loginUser = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        Email: userData.email,
        Password: userData.password,
      });
      
      const { token, user } = response.data;
      setAuthHeaders(token);
      localStorage.setItem("user", JSON.stringify(user));
      
      return { token, user };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status
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

      await axios.post(`${API_BASE_URL}/register`, requestBody);

      // Auto-login after registration
      const loginResponse = await axios.post(`${API_BASE_URL}/login`, {
        Email: formData.email,
        Password: formData.password,
      });

      const { token, user } = loginResponse.data;
      setAuthHeaders(token);
      localStorage.setItem("user", JSON.stringify(user));

      return { token, user };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status
      });
    }
  }
);

// Async Thunk for Updating User Profile
export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async ({ formData, userId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !userId) {
        throw new Error("Authentication required");
      }

      const response = await axios.put(
        `${API_BASE_URL}/${userId}/image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data.user;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status
      });
    }
  }
);

// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
  status: "idle" // 'idle' | 'loading' | 'succeeded' | 'failed'
};

// Create the slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete axios.defaults.headers.common['Authorization'];
      state.status = "idle";
    },
    resetStatus: (state) => {
      state.status = "idle";
    },
    updateUserLocal: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    }
  },
  extraReducers: (builder) => {
    builder
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.status = "succeeded";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      })

      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      })

      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.status = "succeeded";
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      });
  }
});

// Export actions
export const { 
  clearError, 
  logoutUser, 
  resetStatus, 
  updateUserLocal 
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;