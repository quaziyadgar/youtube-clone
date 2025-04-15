import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideos, setFilter } from '../store/videoSlice';
import { Link } from 'react-router-dom';
import { logout } from '../store/authSlice';

const VideoCard = lazy(() => import('../components/VideoCard'));

const HomePage = () => {
  const dispatch = useDispatch();
  const { videos, status, filter } = useSelector((state) => state.videos);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchVideos());
    }
  }, [status, dispatch]);

  const filteredVideos = useMemo(() => {
    if (!filter) return videos;
    return videos.filter((video) => 
      video.title.toLowerCase().includes(filter.toLowerCase()) ||
      video.description.toLowerCase().includes(filter.toLowerCase())
    );
  }, [videos, filter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-2xl md:hidden"
          >
            ☰
          </button>
          <Link to="/">
            <h1 className="text-2xl font-bold">YouTube Clone</h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search videos..."
            className="border p-2 rounded w-48 lg:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => dispatch(setFilter(e.target.value))}
          />
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium">{user.username}</span>
              <Link to="/channel" className="text-blue-500 hover:underline">Channel</Link>
              <button
                onClick={() => dispatch(logout())}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </header>

      <div className="flex">
        <aside
          className={`fixed inset-y-0 left-0 w-64 bg-gray-100 p-4 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:static md:translate-x-0 transition-transform duration-300 z-50`}
        >
          <ul className="space-y-2">
            <li className="p-2 rounded hover:bg-gray-200">
              <Link to="/" onClick={() => setIsSidebarOpen(false)}>Home</Link>
            </li>
            <li className="p-2 rounded hover:bg-gray-200">
              <Link to="/subscriptions" onClick={() => setIsSidebarOpen(false)}>Subscriptions</Link>
            </li>
            <li className="p-2 rounded hover:bg-gray-200">
              <Link to="/trending" onClick={() => setIsSidebarOpen(false)}>Trending</Link>
            </li>
          </ul>
        </aside>

        <main className="flex-1 p-4">
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {['All', 'Tutorials', 'Tech', 'Gaming'].map((category) => (
              <button
                key={category}
                onClick={() => dispatch(setFilter(category === 'All' ? '' : category))}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 whitespace-nowrap transition-colors"
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {status === 'loading' ? (
              <p className="col-span-full text-center">Loading...</p>
            ) : filteredVideos.length === 0 ? (
              <p className="col-span-full text-center">No videos found</p>
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