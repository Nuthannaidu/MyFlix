import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api'; 

// Async thunk to fetch video details from backend
export const fetchVideoById = createAsyncThunk(
  'player/fetchVideoById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/videos/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const playerSlice = createSlice({
  name: 'player',
  initialState: {
    currentVideo: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetPlayer: (state) => {
      state.currentVideo = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVideo = action.payload;
      })
      .addCase(fetchVideoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to load video';
      });
  },
});

export const { resetPlayer } = playerSlice.actions;
export default playerSlice.reducer;