import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideo } from '../store/videoSlice';
import VideoPlayer from '../components/VideoPlayer';
import { useParams } from 'react-router-dom';

const VideoPage = () => {
  const { videoId } = useParams();
  const dispatch = useDispatch();
  const { currentVideo, status } = useSelector((state) => state.videos);

  useEffect(() => {
    dispatch(fetchVideo(videoId));
  }, [dispatch, videoId]);

  if (status === 'loading') return <div className='text-white'>Loading...</div>;
  if (status === 'failed' || !currentVideo) return <div className='text-white'>Video not found</div>;

  return <VideoPlayer video={currentVideo} />;
};

export default VideoPage;