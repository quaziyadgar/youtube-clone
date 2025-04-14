import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchVideos = createAsyncThunk('videos/fetchVideos', async () => {
  const response = await axios.get('http://localhost:5000/api/videos');
  return response.data;
});

export const fetchVideo = createAsyncThunk('videos/fetchVideo', async (videoId) => {
  const response = await axios.get(`http://localhost:5000/api/videos/${videoId}`);
  return response.data;
});

export const addComment = createAsyncThunk('videos/addComment', async ({ videoId, text }, { getState }) => {
  const { auth: { token } } = getState();
  const response = await axios.post(
    `http://localhost:5000/api/videos/${videoId}/comments`,
    { text },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return { videoId, comment: response.data };
});

const videoSlice = createSlice({
  name: 'videos',
  initialState: { videos: [], currentVideo: null, status: 'idle', filter: '', error: null },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.videos = action.payload;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchVideo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVideo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentVideo = action.payload;
      })
      .addCase(fetchVideo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { videoId, comment } = action.payload;
        const video = state.videos.find((v) => v.videoId === videoId);
        if (video) {
          video.comments.push(comment);
        }
        if (state.currentVideo?.videoId === videoId) {
          state.currentVideo.comments.push(comment);
        }
      });
  },
});

export const { setFilter } = videoSlice.actions;
export default videoSlice.reducer;