import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
  return (
    <Link to={`/video/${video.videoId}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <img src={video.thumbnailUrl} alt={video.title} className="w-full h-40 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-semibold line-clamp-2">{video.title}</h3>
          <p className="text-sm text-gray-600">{video.uploader}</p>
          <p className="text-sm text-gray-500">{video.views} views • {new Date(video.uploadDate).toLocaleDateString()}</p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;