import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ChevronDown, ChevronUp } from "lucide-react";
import { shortAPI } from "../services/api";
import toast from "react-hot-toast";
import { getBackendImgURL } from "../utils/helper";
import useAuthStore from "../store/authStore";

export default function ShortComment({
  comment,
  onCommentUpdate,
}) {
  const { user } = useAuthStore();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [localComment, setLocalComment] = useState(comment);

  useEffect(() => {
    setLocalComment(comment);
    setIsLiked(comment.likes?.includes(user?._id) || false);
  }, [comment, user]);

  const handleLike = async () => {
    try {
      const response = await shortAPI.toggleLikeComment(localComment._id);
      setIsLiked(!isLiked);
      setLocalComment({
        ...localComment,
        likes: response.data,
      });
      if (onCommentUpdate) {
        onCommentUpdate();
      }
    } catch (error) {
      console.error("Failed to like comment:", error);
      toast.error("Failed to like comment");
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      const response = await shortAPI.addReply(localComment._id, replyText.trim());
      if (response && response.success) {
        setLocalComment({
          ...localComment,
          replies: [...(localComment.replies || []), response.data],
        });
        setReplyText("");
        setShowReplyInput(false);
        setIsExpanded(true);
        toast.success("Reply added");
        if (onCommentUpdate) {
          onCommentUpdate();
        }
      }
    } catch (error) {
      console.error("Failed to reply:", error);
      toast.error("Failed to add reply");
    }
  };

  const handleDelete = async () => {
    try {
      await shortAPI.deleteComment(localComment._id);
      toast.success("Comment deleted");
      if (onCommentUpdate) {
        onCommentUpdate();
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  const handleReplySubmit = () => {
    handleReply();
  };

  return (
    <div className="animate-fadeIn">
      {/* Main Comment */}
      <div className="flex gap-3">
        <Link to={`/profile/${comment.user.slug}`}>
          <img
            src={getBackendImgURL(comment.user?.avatar) || "/default-avatar.png"}
            alt={comment.user?.fullName}
            className="w-9 h-9 rounded-full flex-shrink-0"
            onError={(e) => {
              e.target.src = "/default-avatar.png";
            }}
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link
              to={`/profile/${comment.user.slug}`}
              className="font-semibold text-sm text-gray-900 dark:text-white hover:underline"
            >
              {comment.user?.fullName}
            </Link>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed break-words mb-2">
            {comment.content}
          </p>

          {/* Comment Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 font-medium transition"
            >
              <Heart
                className={`w-3 h-3 ${
                  isLiked ? "fill-red-500 text-red-500" : ""
                }`}
              />
              {localComment.likes?.length || 0}
            </button>
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 font-medium transition"
            >
              Reply
            </button>
            {user?._id === localComment.user?._id && (
              <button
                onClick={handleDelete}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 font-medium transition"
              >
                Delete
              </button>
            )}
          </div>

          {/* Reply Input */}
          {showReplyInput && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-full text-xs text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                onClick={handleReplySubmit}
                disabled={!replyText.trim()}
                className="px-3 py-1.5 bg-blue-500 text-white rounded-full text-xs hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Reply
              </button>
              <button
                onClick={() => {
                  setShowReplyInput(false);
                  setReplyText("");
                }}
                className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Toggle Replies Button */}
          {localComment.replies && localComment.replies.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 flex items-center gap-1 text-xs text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 font-medium transition"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3" />
                  Hide {localComment.replies.length}{" "}
                  {localComment.replies.length === 1 ? "reply" : "replies"}
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" />
                  View {localComment.replies.length}{" "}
                  {localComment.replies.length === 1 ? "reply" : "replies"}
                </>
              )}
            </button>
          )}

          {/* Replies */}
          {localComment.replies && localComment.replies.length > 0 && isExpanded && (
            <div className="mt-3 space-y-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700 animate-fadeIn">
              {localComment.replies.map((reply) => (
                <div key={reply._id} className="flex gap-2">
                  <Link to={`/profile/${reply.user.slug}`}>
                    <img
                      src={
                        getBackendImgURL(reply.user?.avatar)
                      }
                      alt={reply.user?.fullName}
                      className="w-7 h-7 rounded-full flex-shrink-0"
                      onError={(e) => {
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        to={`/profile/${reply.user.slug}`}
                        className="font-semibold text-xs text-gray-900 dark:text-white hover:underline"
                      >
                        {reply.user?.fullName}
                      </Link>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed break-words">
                      {reply.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}