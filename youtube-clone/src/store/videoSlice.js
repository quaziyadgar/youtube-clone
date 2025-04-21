import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://youtube-clone-server-sage.vercel.app/api/videos';

export const fetchVideos = createAsyncThunk('videos/fetchVideos', async ({ search } = {}, { rejectWithValue }) => {
  try {
    const url = search ? `${API_URL}?search=${encodeURIComponent(search)}` : API_URL;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch videos');
  }
});

export const fetchVideo = createAsyncThunk('videos/fetchVideo', async (videoId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/${videoId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch video');
  }
});

export const createVideo = createAsyncThunk('videos/createVideo', async (videoData, { getState, rejectWithValue }) => {
  try {
    const { auth: { token } } = getState();
    const response = await axios.post(API_URL, videoData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to create video');
  }
});

export const likeVideo = createAsyncThunk('videos/likeVideo', async (videoId, { getState }) => {
  const { videos: { currentVideo } } = getState();
  return { videoId, likes: (currentVideo?.likes || 0) + 1 };
});

export const dislikeVideo = createAsyncThunk('videos/dislikeVideo', async (videoId, { getState }) => {
  const { videos: { currentVideo } } = getState();
  return { videoId, dislikes: (currentVideo?.dislikes || 0) + 1 };
});

export const addComment = createAsyncThunk('videos/addComment', async ({ videoId, text }, { getState, rejectWithValue }) => {
  try {
    const { auth: { token } } = getState();
    const response = await axios.post(
      `${API_URL}/${videoId}/comments`,
      { text },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { videoId, comment: response.data };
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to add comment');
  }
});

export const editComment = createAsyncThunk('videos/editComment', async ({ videoId, commentId, text }, { getState, rejectWithValue }) => {
  try {
    const { auth: { token, user } } = getState();
    const response = await axios.put(`${API_URL}/${videoId}/comments/${commentId}`, { text }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { ...response.data, userId: user.username };
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to edit comment');
  }
});

export const deleteComment = createAsyncThunk('videos/deleteComment', async ({ videoId, commentId }, { getState, rejectWithValue }) => {
  try {
    const { auth: { token } } = getState();
    await axios.delete(`${API_URL}/${videoId}/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { videoId, commentId };
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to delete comment');
  }
});

const videoSlice = createSlice({
  name: 'videos',
  initialState: {
    videos: [],
    filteredVideos: [],
    currentVideo: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    setFilter: (state, action) => {
      const query = action.payload.toLowerCase();
      console.log(query);
      state.filteredVideos = query
        ? state.videos.filter(video => video.title.toLowerCase().includes(query))
        : state.videos;
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
        state.filteredVideos = action.payload;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
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
        state.error = action.payload;
      })
      .addCase(createVideo.fulfilled, (state, action) => {
        state.videos.push(action.payload);
        state.filteredVideos.push(action.payload);
      })
      .addCase(likeVideo.fulfilled, (state, action) => {
        const video = state.videos.find(v => v.videoId === action.payload.videoId);
        const filteredVideo = state.filteredVideos.find(v => v.videoId === action.payload.videoId);
        const currentVideo = state.currentVideo?.videoId === action.payload.videoId ? state.currentVideo : null;
        if (video) video.likes = action.payload.likes;
        if (filteredVideo) filteredVideo.likes = action.payload.likes;
        if (currentVideo) currentVideo.likes = action.payload.likes;
      })
      .addCase(dislikeVideo.fulfilled, (state, action) => {
        const video = state.videos.find(v => v.videoId === action.payload.videoId);
        const filteredVideo = state.filteredVideos.find(v => v.videoId === action.payload.videoId);
        const currentVideo = state.currentVideo?.videoId === action.payload.videoId ? state.currentVideo : null;
        if (video) video.dislikes = action.payload.dislikes;
        if (filteredVideo) filteredVideo.dislikes = action.payload.dislikes;
        if (currentVideo) currentVideo.dislikes = action.payload.dislikes;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const video = state.videos.find(v => v.videoId === action.meta.arg.videoId);
        const filteredVideo = state.filteredVideos.find(v => v.videoId === action.meta.arg.videoId);
        const currentVideo = state.currentVideo?.videoId === action.meta.arg.videoId ? state.currentVideo : null;
        if (video) video.comments.push(action.payload);
        if (filteredVideo) filteredVideo.comments.push(action.payload);
        if (currentVideo) currentVideo.comments.push(action.payload);
      })
      .addCase(editComment.fulfilled, (state, action) => {
        const video = state.videos.find(v => v.videoId === action.meta.arg.videoId);
        const filteredVideo = state.filteredVideos.find(v => v.videoId === action.meta.arg.videoId);
        const currentVideo = state.currentVideo?.videoId === action.meta.arg.videoId ? state.currentVideo : null;
        if (video) {
          const comment = video.comments.find(c => c.commentId === action.payload.commentId);
          if (comment) {
            comment.text = action.payload.text;
            comment.timestamp = action.payload.timestamp;
          }
        }
        if (filteredVideo) {
          const comment = filteredVideo.comments.find(c => c.commentId === action.payload.commentId);
          if (comment) {
            comment.text = action.payload.text;
            comment.timestamp = action.payload.timestamp;
          }
        }
        if (currentVideo) {
          const comment = currentVideo.comments.find(c => c.commentId === action.payload.commentId);
          if (comment) {
            comment.text = action.payload.text;
            comment.timestamp = action.payload.timestamp;
          }
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const video = state.videos.find(v => v.videoId === action.payload.videoId);
        const filteredVideo = state.filteredVideos.find(v => v.videoId === action.payload.videoId);
        const currentVideo = state.currentVideo?.videoId === action.payload.videoId ? state.currentVideo : null;
        if (video) {
          video.comments = video.comments.filter(c => c.commentId !== action.payload.commentId);
        }
        if (filteredVideo) {
          filteredVideo.comments = filteredVideo.comments.filter(c => c.commentId !== action.payload.commentId);
        }
        if (currentVideo) {
          currentVideo.comments = currentVideo.comments.filter(c => c.commentId !== action.payload.commentId);
        }
      });
  },
});

export const { setFilter } = videoSlice.actions;
export default videoSlice.reducer;