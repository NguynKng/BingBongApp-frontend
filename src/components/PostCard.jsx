import PropTypes from "prop-types";
import { Earth, Ellipsis, MessageCircle, ThumbsUp, Trash2 } from "lucide-react";
import Config from "../envVars";
import { formatTime } from "../utils/timeUtils";
import { Link } from "react-router-dom";
import { useState, useMemo, useCallback, useEffect } from "react";
import { postAPI } from "../services/api";
import SpinnerLoading from "./SpinnerLoading";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";
import useAuthStore from "../store/authStore";
import emotions from "../data/emotion";
import { toast } from "react-hot-toast";
import InstagramCarousel from "./InstagramCarousel";
import { getBackendImgURL } from "../utils/helper";

function PostCard({ post, onDeletePost, showComment = false }) {
  const [openComment, setOpenComment] = useState(showComment);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isOpenPostDropdown, setIsOpenPostDropdown] = useState(false);
  const { user } = useAuthStore();
  const { postedById, postedByType, author, createdAt, content, media } = post;
  const [userComments, setUserComments] = useState([]);
  const [hoveredEmotion, setHoveredEmotion] = useState(null);
  const [hoveredEmotionUser, setHoveredEmotionUser] = useState(null);
  const [reactions, setReactions] = useState(post.reactions);

  const isShopPost = postedByType === "Shop";
  const isUserPost = postedByType === "User";
  const isGroupPost = postedByType === "Group";

  useEffect(() => {
    if (!post) return;
    const fetchComments = async () => {
      setIsLoadingComments(true);
      try {
        const response = await postAPI.getComments(post._id);
        if (response.success) {
          setUserComments(response.comments);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsLoadingComments(false);
      }
    };
    if (openComment && userComments.length === 0) {
      fetchComments();
    }
  }, [post, openComment, userComments.length]);

  const filteredReactions = hoveredEmotionUser
    ? reactions.filter((r) => r.type === hoveredEmotionUser)
    : [];

  const myReaction = useMemo(
    () => reactions.find((reaction) => reaction?.user?._id === user?._id),
    [reactions, user]
  );

  const isReacted = useMemo(() => !!myReaction, [myReaction]);

  const handleDeletePost = async () => {
    if (!user) return;

    try {
      const response = await postAPI.deletePost(post._id);
      if (response.success) {
        if (onDeletePost) {
          onDeletePost(post._id);
        }
        // Xử lý sau khi xóa thành công, ví dụ: thông báo cho người dùng
        toast.success("Post deleted successfully");
      } else {
        // Xử lý nếu có lỗi xảy ra
        toast.error("Failed to delete post");
      }
    } catch (error) {
      console.error("❌ Failed to delete post:", error);
    }
  };

  const handleReactPost = useCallback(
    async (type) => {
      if (!user) return;

      const prevReactions = [...reactions];

      try {
        const response = await postAPI.reactToPost(post._id, type);
        if (!response.success) return;

        const serverReaction = response.data;

        if (myReaction?.type === type) {
          // Nếu cùng loại → xóa
          const updated = reactions.filter((r) => r.user._id !== user._id);
          setReactions(updated);
        } else if (myReaction) {
          // Nếu đã từng react khác loại → cập nhật
          const updated = reactions.map((r) =>
            r.user._id === user._id ? serverReaction : r
          );
          setReactions(updated);
        } else {
          // Nếu chưa react → thêm mới
          setReactions([...reactions, serverReaction]);
        }
      } catch (error) {
        console.error("❌ Failed to react to post:", error);
        setReactions(prevReactions); // rollback nếu lỗi
      }
    },
    [post._id, user, reactions, myReaction]
  );

  if (!post) {
    return (
      <div className="flex items-center justify-center">
        <SpinnerLoading />
      </div>
    );
  }

  // ✅ Helper: link profile theo loại
  const getProfileLink = (entity, type) => {
    if (!entity?.slug) return "#";
    switch (type) {
      case "User":
        return `/profile/${entity.slug}`;
      case "Shop":
        return `/shop/${entity.slug}`;
      case "Group":
        return `/group/${entity.slug}`;
      default:
        return "#";
    }
  };

  return (
    <div className="bg-white py-5 rounded-xl shadow-md mb-4 dark:bg-[#1b1f2b] dark:border dark:border-[#2b2b3d]">
      <div className="flex items-start justify-between px-5 mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {isUserPost && (
            <>
              <Link
                to={getProfileLink(postedById, postedByType)}
                className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 hover:opacity-80 shrink-0"
              >
                <img
                  src={getBackendImgURL(postedById.avatar)}
                  alt={postedById.name || postedById.fullName}
                  className="object-cover w-full h-full"
                />
              </Link>
            </>
          )}
          {isShopPost && (
            <div className="relative w-11 h-11 rounded-lg border border-gray-200">
              <Link to={getProfileLink(postedById, postedByType)}>
                <img
                  src={getBackendImgURL(postedById.avatar)}
                  alt={postedById.name || postedById.fullName}
                  className="object-cover w-full h-full hover:opacity-80"
                />
              </Link>
              <div className="absolute bottom-0 right-0 w-7 h-7 translate-1 rounded-full  border border-gray-200 hover:opacity-80">
                <Link to={`/profile/${author.slug}`}>
                  <img
                    src={getBackendImgURL(author.avatar)}
                    alt={author.avatar}
                    className="object-cover w-full h-full rounded-full"
                  />
                </Link>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="flex flex-col">
            {/* Tên chính */}
            <Link
              to={getProfileLink(postedById, postedByType)}
              className="font-semibold text-base hover:underline dark:text-white leading-tight"
            >
              {postedByType === "Shop" ? postedById.name : postedById.fullName}
            </Link>

            {/* Thời gian */}
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
              {isShopPost && (
                <>
                  <Link to={`/profile/${author.slug}`}>
                    {author._id === user?._id ? "Bạn" : author.fullName}
                  </Link>
                  <span>•</span>
                </>
              )}
              <span>{formatTime(createdAt)}</span>
              <span>•</span>
              <Earth className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Dropdown */}
        {author?._id === user?._id && (
          <div className="relative">
            <button
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[rgb(56,56,56)]"
              onClick={() => setIsOpenPostDropdown(!isOpenPostDropdown)}
            >
              <Ellipsis className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            {isOpenPostDropdown && (
              <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-[rgb(36,36,36)] border border-gray-200 dark:border-gray-700 rounded-xl shadow-md z-50">
                <ul className="p-1">
                  <li
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-[rgb(64,64,64)] rounded-lg cursor-pointer"
                    onClick={handleDeletePost}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Xoá bài viết</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-gray-800 dark:text-white break-words whitespace-pre-wrap px-5">
        {content}
      </p>

      <InstagramCarousel media={media} />

      {reactions.length > 0 && (
        <div className="flex items-center mt-3 px-5">
          <div className="flex items-center relative group">
            {emotions.reduce((acc, emotion) => {
              if (reactions.some((r) => r.type === emotion.name)) {
                const visibleIndex = acc.length;
                acc.push(
                  <div
                    key={emotion.id}
                    onMouseEnter={() => setHoveredEmotionUser(emotion.name)}
                    onMouseLeave={() => setHoveredEmotionUser(null)}
                    className="relative"
                  >
                    <img
                      src={emotion.icon}
                      className={`size-6 object-cover cursor-pointer ${
                        visibleIndex !== 0 ? "-ml-2" : ""
                      } relative z-[${10 - visibleIndex}]`}
                    />
                    {hoveredEmotionUser === emotion.name && (
                      <div className="absolute -bottom-15 mb-2 left-0 -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded shadow-lg whitespace-nowrap z-50">
                        <h3 className="font-medium">{hoveredEmotionUser}</h3>
                        <div className="flex flex-col mt-1">
                          {filteredReactions.map((reaction) => (
                            <span
                              key={reaction._id}
                            >{`${reaction.user.fullName}`}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              return acc;
            }, [])}
          </div>
          <span className="text-gray-600 dark:text-gray-400">
            {reactions.length}
          </span>
        </div>
      )}
      <div className="flex items-center justify-between pt-3 px-5">
        <div className="flex items-center text-gray-600 hover:text-red-400 transition cursor-pointer relative group">
          {!isReacted ? (
            <button
              className="size-full flex items-center justify-center gap-1 text-gray-500 rounded-md cursor-pointer dark:text-gray-400"
              onClick={() => handleReactPost("Like")}
            >
              <ThumbsUp className={`size-5`} />
              <span>Like</span>
            </button>
          ) : (
            <div
              className="size-full flex items-center justify-center gap-1 text-gray-500 rounded-md cursor-pointer"
              onClick={() => handleReactPost(myReaction?.type)}
            >
              <img
                src={
                  emotions.find((emotion) => emotion.name === myReaction?.type)
                    ?.icon
                }
                className="size-6 object-cover"
              />
              <span
                className={`font-medium`}
                style={{
                  color: `${
                    emotions.find((emotion) => emotion.name === myReaction.type)
                      .color
                  }`,
                }}
              >
                {
                  emotions.find((emotion) => emotion.name === myReaction?.type)
                    ?.name
                }
              </span>
            </div>
          )}

          <div className="absolute bottom-[120%] left-0 z-50 invisible group-hover:visible transition-all delay-200">
            <div className="flex bg-white rounded-full shadow-md border dark:bg-[rgb(35,35,35)] dark:border-gray-600 border-gray-200 relative z-50">
              {emotions.map((emotion) => (
                <div
                  key={emotion.id}
                  className="relative size-12 transition-transform transform hover:scale-125 cursor-pointer"
                  onMouseEnter={() => setHoveredEmotion(emotion.name)} // Show tooltip on hover
                  onMouseLeave={() => setHoveredEmotion(null)}
                  onClick={() => handleReactPost(emotion.name)} // Handle click event
                >
                  <img
                    src={emotion.icon}
                    alt={emotion.name}
                    className="w-full h-full object-contain"
                  />
                  {/* Tooltip */}

                  {/* Tooltip */}
                  {hoveredEmotion === emotion.name && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 opacity-100 transition-all bg-black text-gray-300 text-xs px-2 py-1 rounded-md whitespace-nowrap pointer-events-none">
                      {emotion.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <button
          className="flex items-center gap-1 text-gray-600 cursor-pointer hover:text-blue-400 transition dark:text-gray-400"
          onClick={() => setOpenComment(!openComment)}
        >
          <MessageCircle className="w-5 h-5" />
          {post.comments && post.comments.length > 0 && (
            <span>{post.comments.length}</span>
          )}
          <span>Bình luận</span>
        </button>
      </div>
      {openComment && (
        <div className="py-2 px-4 border-t-2 mt-2 border-gray-200 dark:border-gray-500">
          <h1 className="text-lg dark:text-gray-400">Tất cả bình luận</h1>
          <CommentInput
            postId={post._id}
            onSuccessRefresh={(updatedComments) =>
              setUserComments(updatedComments)
            }
          />
          <div className="mt-6 space-y-2">
            {isLoadingComments ? (
              <SpinnerLoading />
            ) : (
              userComments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  postAuthorId={author._id}
                  postedByType={postedByType}
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
    postedByType: PropTypes.string,
    postedById: PropTypes.object,
    author: PropTypes.shape({
      _id: PropTypes.string,
      fullName: PropTypes.string,
      avatar: PropTypes.string,
    }),
  }).isRequired,
};

export default PostCard;
