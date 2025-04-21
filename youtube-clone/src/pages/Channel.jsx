import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createVideo, fetchVideos } from '../store/videoSlice';
import VideoCard from '../components/VideoCard';

const Channel = () => {
  const { channelId } = useParams();
  const dispatch = useDispatch();
  const { filteredVideos, status, error } = useSelector((state) => state.videos);
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    channelId,
  });

  useEffect(() => {
    dispatch(fetchVideos());
  }, [dispatch]);

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
      await dispatch(createVideo(formData)).unwrap();
      setFormData({ title: '', description: '', videoUrl: '', channelId });
      alert('Video uploaded successfully');
    } catch (err) {
      alert(`Upload failed: ${err.error || 'Try again'}`);
    }
  };

  const channelVideos = filteredVideos.filter((video) => video.channelId === channelId);

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-900 text-white">
      <h1 className="text-3xl mb-4">Channel</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {user && (
        <div className="mb-8">
          <h2 className="text-2xl mb-4">Upload Video</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
              disabled={status === 'loading'}
            >
              Upload
            </button>
          </form>
        </div>
      )}
      <h2 className="text-2xl mb-4">Videos</h2>
      {status === 'loading' ? (
        <div>Loading...</div>
      ) : channelVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {channelVideos.map((video) => (
            <VideoCard key={video.videoId} video={video} />
          ))}
        </div>
      ) : (
        <div>No videos found</div>
      )}
    </div>
  );
};

export default Channel;