import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likeVideo, dislikeVideo, addComment, editComment, deleteComment } from '../store/videoSlice';

const VideoPlayer = ({ video, status }) => {
  const dispatch = useDispatch();
  const { id:loginId, user } = useSelector((state) => state.auth);
  // const channelName = useSelector((state) => state.videos.channelNames[video?.channelId])
  const [commentText, setCommentText] = useState('');
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');

  if (!video) return <div className="text-white">Loading video...</div>;
  if (!video.videoUrl) return <div className="text-white">Error: Video URL not found</div>;

  const embedUrl = video.videoUrl.replace('watch?v=', 'embed/');

  const handleLike = () => {
    if (user) dispatch(likeVideo(video.videoId));
    else alert('Please log in to like the video');
  };

  const handleDislike = () => {
    if (user) dispatch(dislikeVideo(video.videoId));
    else alert('Please log in to dislike the video');
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (user && commentText.trim()) {
      dispatch(addComment({ videoId: video.videoId, text: commentText }));
      setCommentText('');
    } else if (!user) {
      alert('Please log in to comment');
    }
  };

  const handleEditComment = (comment) => {
    setEditCommentId(comment.commentId);
    setEditCommentText(comment.text);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (user && editCommentText.trim()) {
      dispatch(editComment({ videoId: video.videoId, commentId: editCommentId, text: editCommentText }));
      setEditCommentId(null);
      setEditCommentText('');
    }
  };

  const handleDeleteComment = (commentId) => {
    if (user) {
      dispatch(deleteComment({ videoId: video.videoId, commentId }));
    }
  };

  console.log(loginId, user, video);

  return (
    <div className="bg-black py-10">
      <div className="max-w-5xl mx-auto bg-black">
        <div className="relative" style={{ aspectRatio: '16/9' }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src={embedUrl}
            title={video.title || 'Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <h2 className="text-xl font-semibold mt-4 text-white">{video.title || 'Untitled'}</h2>
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-gray-400">{video.views || 0} views • {new Date(video.uploadDate).toLocaleDateString()}</p>
          <div className="flex gap-2">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-sm text-gray-300 hover:text-white"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z" />
              </svg>
              {video.likes || video.likes.length || 0}
            </button>
            <button
              onClick={handleDislike}
              className="flex items-center gap-1 text-sm text-gray-300 hover:text-white"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15 3h-9c-1.1 0-2 .9-2 2v10c0 .55.22 1.05.59 1.41L1.41 23 7 16.59c.3.5 1 1.41 2 1.41h9c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm4 14c0 .55-.45 1-1 1H9l-3.59-3.59C5.22 14.05 5 13.55 5 13V5c0-.55.45-1 1-1h9c.55 0 1 .45 1 1v12z" />
              </svg>
              {video.dislikes || video.dislikes.length || 0}
            </button>
          </div>
        </div>
        <div className="mt-4 border-t border-gray-700 pt-4">
          <p className="text-sm text-gray-300">{video.description || 'No description'}</p>
          <p className="text-sm text-gray-400 mt-2">Channel: {video.uploader}</p>
        </div>
        {(status === "loading")?<div>loading...</div>:
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-black mb-4">Comments</h3>
          {user && (
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a public comment..."
                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                rows="3"
              ></textarea>
              <button
                type="submit"
                className="mt-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm"
              >
                Comment
              </button>
            </form>
          )}
          <div className="space-y-4">
            {video.comments && video.comments.length > 0 ? (
              video.comments.map((comment) => (
                <div key={comment.commentId} className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-black text-sm">
                    {comment?.userId}
                  </div>
                  <div className="flex-1">
                    {editCommentId == comment.commentId ? (
                      <form onSubmit={handleEditSubmit} className="mb-2">
                        <textarea
                          value={editCommentText}
                          onChange={(e) => setEditCommentText(e.target.value)}
                          className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                          rows="2"
                        ></textarea>
                        <div className="flex gap-2 mt-2">
                          <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditCommentId(null)}
                            className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded-lg text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <p className="text-sm text-white">{comment.userId} • {new Date(comment.timestamp).toLocaleDateString()}</p>
                        <p className="text-sm text-white">{comment.text}</p>
                        {user && localStorage.getItem(loginId) == comment.userId && (
                          <div className="flex gap-2 mt-1">
                            <button
                              onClick={() => handleEditComment(comment)}
                              className="text-xs text-white hover:text-blue-300"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment.commentId)}
                              className="text-xs text-red-400 hover:text-red-300"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No comments yet</p>
            )}
          </div>
        </div>}
      </div>
    </div>
  );
};

export default VideoPlayer;