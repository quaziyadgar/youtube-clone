import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createVideo, fetchVideos, updateVideo, deleteVideo } from '../store/videoSlice';
import { fetchChannels } from '../store/channelSlice';
import VideoCard from '../components/VideoCard';

const Channel = () => {
  const { channelId } = useParams();
  const [editMode, setEditMode] = useState(false);
  const [editVideoId, setEditVideoId] = useState(null);
  const [userChannels, setUserChannels] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    channelId: channelId || '',
  });

  const dispatch = useDispatch();
  const { filteredVideos, status: videoStatus } = useSelector((state) => state.videos);
  const { channels, status: channelStatus } = useSelector((state) => state.channels);
  const { token, user } = useSelector((state) => state.auth);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to upload a video');
      return;
    }
    try {
      if (editMode) {
        console.log(editMode);
        await dispatch(updateVideo({ videoId: editVideoId, ...formData })).unwrap();
        alert('Video updated successfully');
      } else {
        await dispatch(createVideo(formData)).unwrap();
        alert('Video uploaded successfully');
      }
      setFormData({ title: '', description: '', videoUrl: '', channelId: channelId || '' });
      setEditMode(false);
      setEditVideoId(null);
    } catch (err) {
      alert(`Operation failed: ${err.error || 'Try again'}`);
    }
  };

  const handleEdit = (video) => {
    setEditMode(true);
    setEditVideoId(video.videoId);
    setFormData({
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      channelId: video.channelId,
    });
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    try {
      await dispatch(deleteVideo(videoId)).unwrap();
      alert('Video deleted successfully');
    } catch (err) {
      alert(`Deletion failed: ${err.error || 'Try again'}`);
    }
  };
  
  useEffect(() => {
    dispatch(fetchChannels());
    dispatch(fetchVideos());
    const userChannelsData = channels.filter((channel) => channel.userId === user?.userId);
    setUserChannels(userChannelsData);
  }, [dispatch]);

  // const channelVideos = filteredVideos.filter((video) => video.channelId === channelId);

  // console.log('Channel: Render', {
  //   user,
  //   token,
  //   userChannels,
  //   channelVideos,
  //   videoStatus,
  //   channelStatus,
  // });

  if (!user || !token) {
    return (
      <div className="max-w-6xl mx-auto p-4 bg-gray-900 text-white">
        <h1 className="text-3xl mb-4">Your Channels</h1>
        <p>Please log in to view or manage your channels.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-900 text-white">
      <h1 className="text-3xl mb-4">Your Channels</h1>
      {/* Upload/Edit Video Form */}
      {user && (
        <div className="mb-8">
          <h2 className="text-2xl mb-4">{editMode ? 'Edit Video' : 'Upload Video'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Channel</label>
              <select
                name="channelId"
                value={formData.channelId}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-800 rounded"
                required
              >
                <option value="">Select a channel</option>
                {userChannels.map((channel, idx) => (
                  <option key={channel.channelId || idx} value={channel.channelId}>
                    {channel.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-800 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-800 rounded"
                rows="4"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium">YouTube URL</label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-800 rounded"
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                disabled={videoStatus === 'loading'}
              >
                {editMode ? 'Update' : 'Upload'}
              </button>
              {editMode && (
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setEditVideoId(null);
                    setFormData({ title: '', description: '', videoUrl: '', channelId: '' });
                  }}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Display User Channels and Videos */}
      {channelStatus === 'loading' || videoStatus === 'loading' ? (
        <div>Loading...</div>
      ) : userChannels.length > 0 ? (
        userChannels.map((channel, idx) => (
          <div key={channel.channelId || idx} className="mb-8">
            <h2 className="text-2xl mb-2">{channel.name}</h2>
            <p className="text-gray-400 mb-4">{channel.description}</p>
            <h3 className="text-xl mb-4">Videos</h3>
            {filteredVideos.filter((video) => video.channelId === channel.channelId).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredVideos
                  .filter((video) => video.channelId === channel.channelId)
                  .map((video,idx) => (
                    <div key={video.videoId || idx} className="relative">
                      <VideoCard video={video} />
                      {user && user.userId === video.userId && (
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <button
                            onClick={() => handleEdit(video)}
                            className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(video.videoId)}
                            className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div>No videos found in this channel</div>
            )}
          </div>
        ))
      ) : (
        <div>No channels found. Create a channel to start uploading videos!</div>
      )}
    </div>
  );
};

export default Channel;