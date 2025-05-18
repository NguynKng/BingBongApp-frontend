import { useState } from "react";
import { Send } from "lucide-react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Config from "../envVars";
import useAuthStore from "../store/authStore";
import { postAPI } from "../services/api";

function CommentInput({ postId, onSuccessRefresh }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const response = await postAPI.addComment(postId, content);
      if (response.success) {
        setContent("");
        if (onSuccessRefresh) {
          const refreshed = await postAPI.getComments(postId);
          if (refreshed.success) {
            onSuccessRefresh(refreshed.comments);
          }
        }
      } else {
        console.error("Thêm bình luận thất bại:", response.message);
      }
    } catch (error) {
      console.error("Lỗi khi thêm bình luận:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex items-center gap-2 sm:gap-3 w-full sm:flex-nowrap mt-4" onSubmit={handleSubmit}>
      <Link to={`/profile/${user._id}`} className="w-12 h-12 rounded-full">
        <img
          src={
            user?.avatar
              ? `${Config.BACKEND_URL}${user.avatar}`
              : "/user.png"
          }
          className="object-cover w-full h-full rounded-full"
        />
      </Link>
      <input
        type="text"
        placeholder="Viết bình luận..."
        className="py-2 px-4 rounded-full flex-1 min-w-0 w-full sm:w-auto bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out hover:bg-gray-200 dark:bg-[rgb(52,52,53)] dark:hover:bg-[rgb(56,56,56)]"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
      />
      <button
        type="submit"
        className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 ease-in-out flex items-center justify-center cursor-pointer"
        disabled={loading}
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}

CommentInput.propTypes = {
  postId: PropTypes.string.isRequired,
  onSuccessRefresh: PropTypes.func.isRequired,
};

export default CommentInput;
