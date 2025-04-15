import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChannel, createVideo, deleteVideo } from '../store/videoSlice';
import { Link } from 'react-router-dom';
import { Suspense, lazy } from 'react';

const VideoCard = lazy(() => import('../components/VideoCard'));

const Channel = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { channel, status, error } = useSelector((state) => state.videos);
  const [videoData, setVideoData] = useState({
    title: '',
    thumbnailUrl: '',
    description: '',
    channelId: user?.username || '',
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(fetchChannel(user.username));
    }
  }, [dispatch, isAuthenticated, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      await dispatch(createVideo({ ...videoData, channelId: user.username }));
      setVideoData({ title: '', thumbnailUrl: '', description: '', channelId: user.username });
      dispatch(fetchChannel(user.username));
    }
  };

  const handleDelete = async (videoId) => {
    if (isAuthenticated) {
      await dispatch(deleteVideo(videoId));
      dispatch(fetchChannel(user.username));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>
          Please <Link to="/login" className="text-blue-500 hover:underline">sign in</Link> to view your channel.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Your Channel: {user.username}</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4">Upload New Video</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={videoData.title}
              onChange={(e) => setVideoData({ ...videoData, title: e.target.value })}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
            <input
              type="url"
              value={videoData.thumbnailUrl}
              onChange={(e) => setVideoData({ ...videoData, thumbnailUrl: e.target.value })}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={videoData.description}
              onChange={(e) => setVideoData({ ...videoData, description: e.target.value })}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Upload Video
          </button>
        </form>

        <h3 className="text-xl font-semibold mb-4">Your Videos</h3>
        {status === 'loading' ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : channel?.videos.length === 0 ? (
          <p>No videos uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {channel.videos.map((video) => (
              <Suspense key={video.videoId} fallback={<div className="h-40 bg-gray-200 rounded animate-pulse" />}>
                <div className="relative">
                  <VideoCard video={video} />
                  <button
                    onClick={() => handleDelete(video.videoId)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </Suspense>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Channel;