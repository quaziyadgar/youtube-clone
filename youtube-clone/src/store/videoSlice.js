import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchVideos = createAsyncThunk('videos/fetchVideos', async () => {
  const response = await axios.get('https://youtube-clone-server-sage.vercel.app/api/videos');
  return response.data;
});

export const fetchVideo = createAsyncThunk('videos/fetchVideo', async (videoId) => {
  const response = await axios.get(`https://youtube-clone-server-sage.vercel.app/api/videos/${videoId}`);
  return response.data;
});

export const fetchChannel = createAsyncThunk('videos/fetchChannel', async (channelId, { getState }) => {
  const { auth: { token } } = getState();
  const response = await axios.get(`https://youtube-clone-server-sage.vercel.app/api/channels/${channelId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
});

export const createVideo = createAsyncThunk('videos/createVideo', async (videoData, { getState }) => {
  const { auth: { token } } = getState();
  const response = await axios.post(
    'https://youtube-clone-server-sage.vercel.app/api/videos',
    videoData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
});

export const deleteVideo = createAsyncThunk('videos/deleteVideo', async (videoId, { getState }) => {
  const { auth: { token } } = getState();
  await axios.delete(`https://youtube-clone-server-sage.vercel.app/api/videos/${videoId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return videoId;
});

export const addComment = createAsyncThunk('videos/addComment', async ({ videoId, text }, { getState }) => {
  const { auth: { token } } = getState();
  const response = await axios.post(
    `https://youtube-clone-server-sage.vercel.app/api/videos/${videoId}/comments`,
    { text },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return { videoId, comment: response.data };
});

export const likeVideo = createAsyncThunk('videos/likeVideo', async (videoId, { getState }) => {
  const { auth: { token } } = getState();
  const response = await axios.put(
    `https://youtube-clone-server-sage.vercel.app/api/videos/${videoId}`,
    { likes: 1 },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
});

export const dislikeVideo = createAsyncThunk('videos/dislikeVideo', async (videoId, { getState }) => {
  const { auth: { token } } = getState();
  const response = await axios.put(
    `https://youtube-clone-server-sage.vercel.app/api/videos/${videoId}`,
    { dislikes: 1 },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
});

const videoSlice = createSlice({
  name: 'videos',
  initialState: { videos: [], currentVideo: null, channel: null, status: 'idle', filter: '', error: null },
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
      .addCase(fetchChannel.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChannel.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.channel = action.payload;
      })
      .addCase(fetchChannel.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createVideo.fulfilled, (state, action) => {
        state.videos.push(action.payload);
        if (state.channel) {
          state.channel.videos.push(action.payload);
        }
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.videos = state.videos.filter((v) => v.videoId !== action.payload);
        if (state.channel) {
          state.channel.videos = state.channel.videos.filter((v) => v.videoId !== action.payload);
        }
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
      })
      .addCase(likeVideo.fulfilled, (state, action) => {
        const video = state.videos.find((v) => v.videoId === action.payload.videoId);
        if (video) {
          video.likes = action.payload.likes;
        }
        if (state.currentVideo?.videoId === action.payload.videoId) {
          state.currentVideo.likes = action.payload.likes;
        }
      })
      .addCase(dislikeVideo.fulfilled, (state, action) => {
        const video = state.videos.find((v) => v.videoId === action.payload.videoId);
        if (video) {
          video.dislikes = action.payload.dislikes;
        }
        if (state.currentVideo?.videoId === action.payload.videoId) {
          state.currentVideo.dislikes = action.payload.dislikes;
        }
      });
  },
});

export const { setFilter } = videoSlice.actions;
export default videoSlice.reducer;