import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideos, setFilter } from '../store/videoSlice';

const VideoCard = lazy(() => import('../components/VideoCard'));

const HomePage = () => {
  const dispatch = useDispatch();
  const { videos, status, filter } = useSelector((state) => state.videos);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchVideos());
    }
  }, [status, dispatch]);

  // Memoize filtered videos
  const filteredVideos = useMemo(() => {
    if (!filter) return videos;
    return videos.filter((video) => video.title.toLowerCase().includes(filter.toLowerCase()));
  }, [videos, filter]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-2xl md:hidden"
          >
            ☰
          </button>
          <h1 className="text-2xl font-bold">YouTube Clone</h1>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search videos..."
            className="border p-2 rounded w-48 lg:w-96"
            onChange={(e) => dispatch(setFilter(e.target.value))}
          />
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Sign In
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 w-64 bg-gray-100 p-4 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:static md:translate-x-0 transition-transform duration-300`}
        >
          <ul className="space-y-2">
            <li className="p-2 rounded hover:bg-gray-200">Home</li>
            <li className="p-2 rounded hover:bg-gray-200">Subscriptions</li>
            <li className="p-2 rounded hover:bg-gray-200">Trending</li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4">
          {/* Filter Buttons */}
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {['All', 'Tutorials', 'Tech'].map((category) => (
              <button
                key={category}
                onClick={() => dispatch(setFilter(category === 'All' ? '' : category))}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 whitespace-nowrap"
              >
                {category}
              </button>
            ))}
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {status === 'loading' ? (
              <p className="col-span-full text-center">Loading...</p>
            ) : (
              filteredVideos.map((video) => (
                <Suspense
                  key={video.videoId}
                  fallback={<div className="h-40 bg-gray-200 rounded animate-pulse" />}
                >
                  <VideoCard video={video} />
                </Suspense>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;