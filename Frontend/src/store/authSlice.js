import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Ensure cookies (sessions) are sent with every request
axios.defaults.withCredentials = true;

const API_URL = 'http://localhost:5000/api/auth';

// 1. CHECK AUTH (Replaces fetchMe)
// This is called when the app loads to see if the user is already logged in (via Cookie)
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/me`);
      // Backend returns { user: { ... } }
      return res.data; 
    } catch (err) {
      return rejectWithValue(null);
    }
  }
);

// 2. LOGIN USER
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      return res.data;
    } catch (err) {
      // Return the specific error message from backend
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

// 3. REGISTER USER
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password, username }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/register`, {
        email,
        password,
        username
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

// 4. LOGOUT USER
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await axios.post(`${API_URL}/logout`);
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: true, // Start true to prevent "Login" button flicker on refresh
    error: null,
    message: null, // Added for Success Alerts
  },
  reducers: {
    clearAuth(state) {
      state.error = null;
      state.message = null;
    },
    logout(state) {
      state.user = null;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- CHECK AUTH ---
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        // The backend returns { user: {...} }, so we extract it
        state.user = action.payload.user; 
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
      })

      // --- LOGIN ---
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Set user data
        state.message = action.payload.message || "Login Successful"; // Set success message
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      })

      // --- REGISTER ---
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.message = action.payload.message || "Account created successfully";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- LOGOUT ---
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.message = null;
      });
  },
});

export const { clearAuth, logout } = authSlice.actions;
export default authSlice.reducer;