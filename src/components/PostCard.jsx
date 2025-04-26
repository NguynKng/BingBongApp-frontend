import PropTypes from "prop-types";
import { Heart, MessageCircle, Send } from "lucide-react";
import EmotionBar from "./EmotionBar";
import Config from "../envVars";
import { formatTime } from "../utils/timeUtils";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { postAPI } from "../services/api";
import SpinnerLoading from "./SpinnerLoading";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";

function PostCard({ post }) {
  const [openComment, setOpenComment] = useState(false);
  const [userComments, setUserComments] = useState([]);
  const [loadingComment, setLoadingComment] = useState(false);
  const [userReaction, setUserReaction] = useState(null); // Lưu cảm xúc của người dùng
  const [totalReactions, setTotalReactions] = useState(post.reactions.length); // Tổng số cảm xúc

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

  <EmotionBar
    onReact={(emotion) => {
      setUserReaction(emotion); // Cập nhật cảm xúc của người dùng
      setTotalReactions((prev) => prev + 1); // Tăng tổng số cảm xúc
    }}
  />

  const {
    createdAt,
    content,
    media,
    reactions,
    comments,
    author, // author là object
  } = post;

  if(!post){
    return (
        <div className="flex items-center justify-center">
            <SpinnerLoading />
        </div>
    )
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow-md mb-4">
      <div className="flex items-center space-x-2 mb-3">
        <Link to={`/profile/${author._id}`} className="w-10 h-10 rounded-full">
          <img
            src={
              author?.avatar
                ? `${Config.BACKEND_URL}${author.avatar}`
                : "/user.png"
            }
            alt={author.fullName}
            className="object-cover size-full rounded-full"
          />
        </Link>
        <div>
          <Link
            to={`/profile/${author._id}`}
            className="text-black font-semibold hover:underline underline-offset-2"
          >
            {author.fullName}
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
          <span>
            {userReaction ? (
              <div className="flex items-center gap-2">
                <img
                  src={userReaction.icon}
                  alt={userReaction.name}
                  className="w-5 h-5"
                />
                <span>{`Bạn đã thả ${userReaction.name}`}</span>
              </div>
            ) : (
              `${totalReactions} Thích`
            )}
          </span>
          <div className="absolute bottom-[120%] left-0 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all delay-300 z-30">
            <EmotionBar
              onReact={(emotion) => {
                setUserReaction(emotion);
                setTotalReactions((prev) => prev + 1);
              }}
            />
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
          <CommentInput
            postId={post._id}
            onSuccessRefresh={(updatedComments) =>
              setUserComments(updatedComments)
            }
          />
          <div className="mt-6 space-y-2">
            {loadingComment ? (
              <SpinnerLoading />
            ) : (
              userComments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  postAuthorId={author._id}
                  postId={post._id}
                  onRefresh={async () => {
                    const refreshed = await postAPI.getComments(post._id);
                    if (refreshed.success) {
                      setUserComments(refreshed.comments);
                    }
                  }}
                />
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
