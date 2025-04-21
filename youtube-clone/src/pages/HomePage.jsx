import { Suspense, lazy, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideos, setFilter } from '../store/videoSlice';
import { Sidebar } from '../components/Sidebar';

const VideoCard = lazy(() => import('../components/VideoCard'));

const HomePage = (props) => {
  const dispatch = useDispatch();
  const { status, filteredVideos } = useSelector((state) => state.videos);
  const {isSidebarOpen, setIsSidebarOpen} = props;

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchVideos());
    }
  }, [status, dispatch]);

  // const filteredVideos = useMemo(() => {
  //   if (!filter) return videos;
  //   return videos.filter((video) =>
  //     video.title.toLowerCase().includes(filter.toLowerCase()) ||
  //     video.description.toLowerCase().includes(filter.toLowerCase())
  //   );
  // }, [videos, filter]);

  return (
    <div className={`${isSidebarOpen && 'ml-64'} min-h-screen`}>
      <div className="flex">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 p-4">
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {['All', 'Songs', 'Tech', 'Gaming'].map((category) => (
              <button
                key={category}
                onClick={() => dispatch(setFilter(category === 'All' ? '' : category))}
                className="px-4 py-2 bg-red-700 cursor-pointer text-white rounded hover:bg-red-800 whitespace-nowrap transition-colors"
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {status === 'loading' ? (
              <p className="col-span-full text-center text-white">Loading...</p>
            ) : filteredVideos.length === 0 ? (
              <p className="col-span-full text-center text-white">No videos found</p>
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