import { configureStore } from '@reduxjs/toolkit';
import videoReducer from './videoSlice';
import authReducer from './authSlice';
import channelSlice from './channelSlice';

export const store = configureStore({
  reducer: {
    videos: videoReducer,
    auth: authReducer,
    channels: channelSlice
  },
});