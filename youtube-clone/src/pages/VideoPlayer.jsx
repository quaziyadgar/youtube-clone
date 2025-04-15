import { useEffect, useState, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideo, addComment, likeVideo, dislikeVideo } from '../store/videoSlice';
import { useParams, Link } from 'react-router-dom';

const Comment = lazy(() => import('../components/Comment'));

const VideoPlayer = () => {
  const { videoId } = useParams();
  const dispatch = useDispatch();
  const { currentVideo, status, error } = useSelector((state) => state.videos);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    dispatch(fetchVideo(videoId));
  }, [dispatch, videoId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (commentText.trim() && isAuthenticated) {
      await dispatch(addComment({ videoId, text: commentText }));
      setCommentText('');
    }
  };

  if (status === 'loading') return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!currentVideo) return <p className="text-center">Video not found</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-4">
          {/* <video
            controls
            src="https://www.youtube.com/embed/eILUmCJhl64?si=DJzIJwe3y5UoRiBX"
            className="w-full rounded-md"
          /> */}
          <iframe className="w-full rounded-md h-150" src={currentVideo.thumbnailUrl} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          <h2 className="text-2xl font-bold mt-4">{currentVideo.title}</h2>
          <div className="flex justify-between items-center mt-2">
            <div>
              <p className="text-sm text-gray-600">{currentVideo.uploader}</p>
              <p className="text-sm text-gray-500">
                {currentVideo.views} views • {new Date(currentVideo.uploadDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => isAuthenticated && dispatch(likeVideo(videoId))}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                disabled={!isAuthenticated}
              >
                👍 {currentVideo.likes}
              </button>
              <button
                onClick={() => isAuthenticated && dispatch(dislikeVideo(videoId))}
                className="flex items-center gap-2 text-gray-600 hover:text-red-500"
                disabled={!isAuthenticated}
              >
                👎 {currentVideo.dislikes}
              </button>
            </div>
          </div>
          <p className="mt-4 text-gray-700">{currentVideo.description}</p>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Comments</h3>
          {isAuthenticated ? (
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              />
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={!commentText.trim()}
              >
                Comment
              </button>
            </form>
          ) : (
            <p className="mb-4">
              <Link to="/login" className="text-blue-500 hover:underline">Sign in</Link> to comment
            </p>
          )}
          <div className="space-y-4">
            {currentVideo.comments.map((comment) => (
              <Suspense key={comment.commentId} fallback={<div className="h-10 bg-gray-200 rounded animate-pulse" />}>
                <Comment comment={comment} />
              </Suspense>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;