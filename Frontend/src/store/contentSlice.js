import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Change this line to import the default 'api' instance
import api from '../services/api'; 

export const fetchVideos = createAsyncThunk('content/fetchVideos', async (_, { rejectWithValue }) => {
  try {
    // Now call it directly from the api instance
    const response = await api.get('/videos'); 
    return response.data;
  } catch (error) {
    // Return the server's error message if available
    return rejectWithValue(error.response?.data?.message || error.message);
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
        state.error = null;
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