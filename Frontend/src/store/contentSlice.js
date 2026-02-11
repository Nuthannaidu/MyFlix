import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../services/api';

export const fetchVideos = createAsyncThunk('content/fetchVideos', async (_, { rejectWithValue }) => {
  try {
    const response = await api.getVideos();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const contentSlice = createSlice({
  name: 'content',
  initialState: {
    videos: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default contentSlice.reducer;