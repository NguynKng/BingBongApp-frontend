import { useState, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { shortAPI } from "../services/api";
import toast from "react-hot-toast";
import { getBackendImgURL } from "../utils/helper";
import { formatNumber } from "../utils/formattedFunction";
import useAuthStore from "../store/authStore";
import ShortComment from "./ShortComment";

export default function CommentsSidebar({
  shortId,
  onClose,
}) {
  const { user } = useAuthStore();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (shortId) {
      fetchComments();
    }
  }, [shortId]);

  const fetchComments = async () => {
    try {
      const response = await shortAPI.getComments(shortId);
      if (response && response.success) {
        setComments(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await shortAPI.addComment(shortId, newComment.trim());
      if (response && response.success) {
        setComments([response.data, ...comments]);
        setNewComment("");
        toast.success("Comment added");
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 z-30 animate-fadeIn"
        onClick={onClose}
      />

      {/* Comments Panel */}
      <div className="fixed top-0 right-0 h-full w-3/4 sm:w-[400px] md:w-[450px] bg-white dark:bg-gray-900 shadow-2xl z-40 flex flex-col animate-slideInRight">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            {formatNumber(comments.length)} Comments
          </h3>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-2 transition"
          >
            <X className="w-5 h-5 text-gray-900 dark:text-white" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No comments yet. Be the first to comment!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <div
                  key={comment._id}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ShortComment
                    comment={comment}
                    onCommentUpdate={fetchComments}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comment Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <form onSubmit={handleSubmit} className="flex gap-3 items-center">
            <img
              src={getBackendImgURL(user?.avatar) || "/default-avatar.png"}
              alt="Your avatar"
              className="w-9 h-9 rounded-full flex-shrink-0"
              onError={(e) => {
                e.target.src = "/default-avatar.png";
              }}
            />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-full text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!newComment.trim() || submitting}
                className="p-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}