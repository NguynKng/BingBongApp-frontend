import PropTypes from "prop-types";
import { Heart, MessageCircle, Send } from "lucide-react";
import EmotionBar from "./EmotionBar";
import Config from "../envVars";
import { formatTime } from "../utils/timeUtils";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { postAPI } from "../services/api";
import SpinnerLoading from "./SpinnerLoading";
import useAuthStore from "../store/authStore";

function PostCard({ post }) {
  const [openComment, setOpenComment] = useState(false);
  const [comment, setComment] = useState("");
  const [userComments, setUserComments] = useState([]);
  const [loadingComment, setLoadingComment] = useState(false);
  const { user } = useAuthStore();
  useEffect(() => {
    if (!openComment) return;

    const fetchComments = async () => {
      setLoadingComment(true);
      try {
        const response = await postAPI.getComments(post._id);
        if (response.success) {
          setUserComments(response.comments);
        } else {
          console.error("Failed to fetch comments:", response.message);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoadingComment(false);
      }
    };

    fetchComments();
  }, [openComment, post._id]);

  const {
    createdAt,
    content,
    media,
    reactions,
    comments,
    author, // author là object
  } = post;

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const response = await postAPI.addComment(post._id, comment);
      if (response.success) {
        setComment(""); // clear input
        const refreshed = await postAPI.getComments(post._id);
        if (refreshed.success) {
          setUserComments(refreshed.comments);
        }
      } else {
        console.error("Failed to add comment:", response.message);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md mb-4">
      <div className="flex items-center space-x-2 mb-3">
        <Link to={`/profile/${author._id}`} className="w-10 h-10 rounded-full">
          <img
            src={
              author?.avatar
                ? `${Config.BACKEND_URL}${author.avatar}`
                : "/user-none.webp"
            }
            alt={author?.fullName}
            className="object-cover size-full rounded-full"
          />
        </Link>
        <div>
          <Link
            to={`/profile/${author._id}`}
            className="text-black font-semibold hover:underline underline-offset-2"
          >
            {author?.fullName}
          </Link>
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <span>{formatTime(createdAt)}</span>
            <span className="text-gray-400">•</span>
            <img src="/globe.png" className="size-4 object-cover" />
          </div>
        </div>
      </div>

      <p className="text-gray-800 mb-3">{content}</p>

      {media && media.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {media.slice(0, 4).map((img, index) => (
            <div
              key={index}
              className="relative"
              style={{
                flex:
                  media.length === 1 ? "1 1 100%" : "1 1 calc(50% - 0.5rem)",
                minHeight: "240px",
              }}
            >
              <img
                src={`${Config.BACKEND_URL}${img}`}
                alt={`post-img-${index}`}
                className="w-full h-full object-cover rounded-lg"
              />

              {/* If more than 4 images, show a "+n" on the last visible one */}
              {index === 3 && media.length > 4 && (
                <div className="absolute inset-0 bg-black/50 text-white text-2xl font-bold flex items-center justify-center rounded-lg">
                  +{media.length - 4}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between pt-3">
        <button className="flex items-center text-gray-600 hover:text-red-400 transition cursor-pointer relative group">
          <Heart className="w-5 h-5 mr-1" />
          <span>{`${reactions.length} Thích`}</span>
          <div className="absolute bottom-[120%] left-0 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all delay-300 z-30">
            <EmotionBar />
          </div>
        </button>
        <button
          className="flex items-center text-gray-600 cursor-pointer hover:text-blue-400 transition"
          onClick={() => setOpenComment(!openComment)}
        >
          <MessageCircle className="w-5 h-5 mr-1" />
          <span>{`${comments.length} Bình luận`}</span>
        </button>
      </div>
      {openComment && (
        <div className="py-2 px-4 border-t-2 mt-2 border-gray-200">
          <h1 className="text-lg">Tất cả bình luận</h1>
          <form
            className="flex gap-2 items-center mt-4"
            onSubmit={handleComment}
          >
            <Link
              to={`/profile/${user._id}`}
              className="w-10 h-10 rounded-full"
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
              placeholder={`Comment as ${user.fullName}`}
              className="py-2 px-4 rounded-full flex-1 bg-gray-200"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 cursor-pointer"
            >
              <Send className="size-4" />
            </button>
          </form>
          <div className="mt-6 space-y-2">
            {loadingComment ? (
              <SpinnerLoading />
            ) : (
              userComments.map((comment) => (
                <div className="flex gap-2">
                  <Link
                    to={`/profile/${comment.user._id}`}
                    className="size-10 rounded-full"
                  >
                    <img
                      src={`${Config.BACKEND_URL}${comment.user.avatar}`}
                      className="size-full object-cover rounded-full"
                    />
                  </Link>
                  <div className="space-y-1">
                    <div className="py-2 px-4 rounded-3xl bg-gray-200">
                      <div className="flex items-center gap-2">
                        <Link to={`/profile/${comment.user._id}`} className="text-[15px] font-semibold">
                          {comment.user.fullName}
                        </Link>
                        {comment.user._id === author._id && (
                          <span className="text-sm text-blue-500 font-medium">
                            Tác giả
                          </span>
                        )}
                      </div>
                      <p className="text-[15px]">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-2 px-3">
                      <span className="text-[13px]">
                        {formatTime(comment.createdAt)}
                      </span>
                      <button className="text-gray-500 hover:underline underline-offset-2 transition text-sm cursor-pointer">
                        Trả lời
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

PostCard.propTypes = {
  post: PropTypes.shape({
    likes: PropTypes.number,
    comments: PropTypes.array,
    createdAt: PropTypes.string,
    content: PropTypes.string,
    media: PropTypes.array,
    author: PropTypes.shape({
      fullName: PropTypes.string,
      avatar: PropTypes.string,
    }),
  }).isRequired,
};

export default PostCard;
