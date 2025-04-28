import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://youtube-clone-server-sage.vercel.app/api';

// Fetch all channels (or user-specific channels)
export const fetchChannels = createAsyncThunk(
  'channels',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      console.log(token);
      const response = await axios.get(`${API_URL}/channels`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch channels');
    }
  }
);

// Create channel
export const createChannel = createAsyncThunk(
  'channels/createChannel',
  async ({ name }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/channels/createChannel`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create channel');
    }
  }
);

const channelSlice = createSlice({
  name: 'channel',
  initialState: {
    channels: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Channels
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        // console.log('channels', action.payload);
        state.status = 'succeeded';
        state.channels = action.payload;
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Create Channel
    builder
      .addCase(createChannel.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.channels.push(action.payload);
        state.error = null;
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default channelSlice.reducer;