import { useMemo } from 'react';

const VideoCard = ({ video }) => {
  const { title, thumbnailUrl, uploader, views } = video;

  // Memoize card to prevent re-renders
  const cardContent = useMemo(() => (
    <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <img src={thumbnailUrl} alt={title} className="w-full h-40 object-cover rounded" />
      <h3 className="text-lg font-semibold mt-2 truncate">{title}</h3>
      <p className="text-sm text-gray-600">{uploader}</p>
      <p className="text-sm text-gray-600">{views} views</p>
    </div>
  ), [title, thumbnailUrl, uploader, views]);

  return cardContent;
};

export default VideoCard;