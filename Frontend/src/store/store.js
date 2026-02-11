import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import contentReducer from './contentSlice';
import playerReducer from './playerSlice'; // <--- Import the new file

export const store = configureStore({
  reducer: {
    auth: authReducer,
    content: contentReducer,
    player: playerReducer, // <--- Add it here
  },
});