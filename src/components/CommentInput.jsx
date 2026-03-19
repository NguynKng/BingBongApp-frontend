import { useState } from "react";
import { Send, Smile } from "lucide-react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { postAPI } from "../services/api";
import { getBackendImgURL } from "../utils/helper";
import EmojiPicker from "emoji-picker-react";

function CommentInput({ postId, onSuccessRefresh }) {
  const { user, theme } = useAuthStore();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);

  const handleEmojiClick = (emojiData) => {
    setContent((prev) => prev + emojiData.emoji);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const response = await postAPI.addComment(postId, content);
      if (response.success) {
        setContent("");
        setShowEmoji(false);

        if (onSuccessRefresh) {
          const refreshed = await postAPI.getComments(postId);
          if (refreshed.success) {
            onSuccessRefresh(refreshed.comments);
          }
        }
      }
    } catch (error) {
      console.error("Error while adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="flex items-center gap-2 sm:gap-3 w-full mt-4 relative"
      onSubmit={handleSubmit}
    >
      <Link to={`/profile/${user.slug}`} className="w-12 h-12 rounded-full">
        <img
          src={getBackendImgURL(user?.avatar)}
          className="object-cover w-full h-full rounded-full"
        />
      </Link>

      {/* Input */}
      <input
        type="text"
        placeholder="Write a comment..."
        className="py-2 px-4 rounded-full flex-1 bg-gray-100 text-gray-700 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition dark:bg-[rgb(52,52,53)]"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
      />

      {/* Emoji button */}
      <button
        type="button"
        onClick={() => setShowEmoji(!showEmoji)}
        className="p-2 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        <Smile className="w-5 h-5 text-gray-500" />
      </button>

      {/* Emoji picker */}
      {showEmoji && (
        <div className="absolute bottom-14 right-12 z-50">
          <EmojiPicker
            theme={theme}
            onEmojiClick={handleEmojiClick}
          />
        </div>
      )}

      {/* Send */}
      <button
        type="submit"
        className="p-2.5 cursor-pointer bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
        disabled={loading}
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
}


CommentInput.propTypes = {
  postId: PropTypes.string.isRequired,
  onSuccessRefresh: PropTypes.func.isRequired
};

export default CommentInput;
