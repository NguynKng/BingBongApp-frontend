import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Config from "../envVars";
import { Send } from "lucide-react";
import { formatTime } from "../utils/timeUtils";
import useAuthStore from "../store/authStore";
import { postAPI } from "../services/api";

function CommentItem({ comment, postAuthorId, onRefresh }) {
  const [replyingTo, setReplyingTo] = useState(null);
  const [openReplies, setOpenReplies] = useState(false);
  const [responseComment, setResponseComment] = useState("");
  const { user } = useAuthStore();

  const handleReply = async (e) => {
    e.preventDefault();
    if (!responseComment.trim()) return;

    try {
      const response = await postAPI.addReply(comment._id, responseComment);
      if (response.success) {
        setResponseComment("");
        setReplyingTo(null);
        onRefresh();
      }
    } catch (error) {
      console.error("Error replying to comment:", error);
    }
  };

  const toggleReplies = () => setOpenReplies((prev) => !prev);

  return (
    <div className="flex items-start gap-2 w-full max-w-full">
      <Link
        to={`/profile/${comment.user._id}`}
        className="size-10 rounded-full transition-transform duration-200 active:scale-95 hover:brightness-105"
      >
        <img
          src={
            comment.user?.avatar
              ? `${Config.BACKEND_URL}${comment.user.avatar}`
              : "/user.png"
          }
          className="size-full object-cover rounded-full"
        />
      </Link>

      <div className="space-y-1">
        <div className="py-2 px-4 rounded-3xl bg-gray-200 w-fit max-w-full dark:bg-[rgb(52,52,53)]">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to={`/profile/${comment.user._id}`}
              className="text-[16px] font-semibold hover:text-blue-600 transition-colors dark:text-white"
            >
              {comment.user.fullName}
            </Link>
            {comment.user._id === postAuthorId && (
              <span className="text-sm text-blue-500 font-medium">
                Tác giả
              </span>
            )}
          </div>
          <p className="text-base break-words dark:text-white">{comment.content}</p>
        </div>

        <div className="flex items-center gap-2 px-3 text-sm flex-wrap">
          <span className="text-sm text-gray-500 dark:text-gray-400">{formatTime(comment.createdAt)}</span>
          <button
            className="text-gray-500 hover:underline underline-offset-2 transition text-sm cursor-pointer"
            onClick={() => setReplyingTo(comment._id)}
          >
            Trả lời
          </button>
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <button
            className="text-sm text-blue-500 hover:underline w-fit cursor-pointer"
            onClick={toggleReplies}
          >
            {openReplies
              ? "Ẩn phản hồi"
              : `Xem ${comment.replies.length} phản hồi`}
          </button>
        )}

        {openReplies &&
          comment.replies.map((reply) => (
            <div key={reply._id} className="flex gap-2 mt-2 ml-4 sm:ml-6 w-full">
              <Link
                to={`/profile/${reply.user._id}`}
                className="size-9 rounded-full transition-transform duration-200 active:scale-95 hover:brightness-105 min-w-[36px]"
              >
                <img
                  src={
                    reply.user?.avatar
                      ? `${Config.BACKEND_URL}${reply.user.avatar}`
                      : "/user.png"
                  }
                  className="size-full object-cover rounded-full"
                />
              </Link>
              <div className="space-y-1 w-full">
                <div className="py-2 px-4 rounded-3xl bg-gray-100 w-fit max-w-full">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      to={`/profile/${reply.user._id}`}
                      className="text-[15px] font-semibold hover:text-blue-600 transition-colors"
                    >
                      {reply.user.fullName}
                    </Link>
                    {reply.user._id === postAuthorId && (
                      <span className="text-sm text-blue-500 font-medium">
                        Tác giả
                      </span>
                    )}
                  </div>
                  <p className="text-base break-words">{reply.content}</p>
                </div>
                <span className="text-sm px-3 text-gray-500">
                  {formatTime(reply.createdAt)}
                </span>
              </div>
            </div>
          ))}

        {replyingTo === comment._id && (
          <form className="flex gap-2 items-center" onSubmit={handleReply}>
            <Link
              to={`/profile/${user._id}`}
              className="w-10 h-10 rounded-full transition-transform duration-200 active:scale-95 hover:brightness-105"
            >
              <img
                src={
                  user?.avatar
                    ? `${Config.BACKEND_URL}${user.avatar}`
                    : "/user.png"
                }
                className="object-cover size-full rounded-full"
              />
            </Link>
            <input
              type="text"
              placeholder={`Reply to ${comment.user.fullName}`}
              className="py-2 px-4 rounded-full flex-1 bg-gray-200 text-base"
              value={responseComment}
              onChange={(e) => setResponseComment(e.target.value)}
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 cursor-pointer"
            >
              <Send className="size-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

CommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
  postAuthorId: PropTypes.string.isRequired,
  postId: PropTypes.string.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

export default CommentItem;
