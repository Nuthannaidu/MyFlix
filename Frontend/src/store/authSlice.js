import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create a dedicated Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Important: Sends cookies/sessions with every request
});

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      // Calls: BASE_URL/auth/me
      const response = await api.get('/auth/me');
      return response.data; // Expected: { user: {...} }
    } catch (err) {
      return rejectWithValue(null);
    }
  }
);

// B. LOGIN USER
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Calls: BASE_URL/auth/login
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (err) {
      // Return specific error message from backend
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

// C. REGISTER USER
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password, username }, { rejectWithValue }) => {
    try {
      // Calls: BASE_URL/auth/register
      const response = await api.post('/auth/register', {
        email,
        password,
        username
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

// D. LOGOUT USER
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  // Calls: BASE_URL/auth/logout
  await api.post('/auth/logout');
});


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: true, 
    error: null,
    message: null, 
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
        state.user = action.payload.user; // Ensure your backend returns { user: ... }
        state.message = action.payload.message || "Login Successful";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- REGISTER ---
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; 
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