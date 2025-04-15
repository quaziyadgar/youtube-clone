const Comment = ({ comment }) => {
    return (
      <div className="flex gap-4 py-2 border-b">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div>
          <p className="text-sm font-medium">{comment.userId}</p>
          <p className="text-sm">{comment.text}</p>
          <p className="text-xs text-gray-500">{new Date(comment.timestamp).toLocaleString()}</p>
        </div>
      </div>
    );
  };
  
  export default Comment;