import PropTypes from "prop-types";
import { Check, Earth, Ellipsis, MessageCircle, ThumbsUp, Trash2 } from "lucide-react";
import { formatTime } from "../utils/timeUtils";
import { Link } from "react-router-dom";
import { useState, useMemo, useCallback, useEffect, useRef, memo } from "react";
import { postAPI } from "../services/api";
import SpinnerLoading from "./SpinnerLoading";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";
import useAuthStore from "../store/authStore";
import emotions from "../data/emotion";
import { toast } from "react-hot-toast";
import InstagramCarousel from "./InstagramCarousel";
import {
  getBackendImgURL,
  getEquippedBadge,
  getProfileLink,
} from "../utils/helper";
import UserBadge from "./UserBadge";
import HoverWrapper from "./HoverWrapper";

const PostCard = memo(({ post, onDeletePost, showComment = false }) => {
  const [openComment, setOpenComment] = useState(showComment);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isOpenPostDropdown, setIsOpenPostDropdown] = useState(false);
  const { user } = useAuthStore();
  const { postedById, postedByType, author, createdAt, content, media } = post;
  const [userComments, setUserComments] = useState([]);
  const [hoveredEmotion, setHoveredEmotion] = useState(null);
  const [hoveredEmotionUser, setHoveredEmotionUser] = useState(null);
  const [reactions, setReactions] = useState(post.reactions);
  const equippedBadge = useMemo(() => getEquippedBadge(author), [author]);
  const hoverDataRef = useRef({
    type: null,
    slug: null,
  });

  // ✅ Ref để track post element và việc đã mark viewed
  const postRef = useRef(null);
  const hasMarkedViewed = useRef(false);

  const isShopPost = postedByType === "Shop";
  const isUserPost = postedByType === "User";
  const isGroupPost = postedByType === "Group";

  //   // ✅ Mark post as viewed khi user nhìn thấy bài viết
  //   useEffect(() => {
  //     if (!post?._id || !user || hasMarkedViewed.current) return;

  //     const observer = new IntersectionObserver(
  //       (entries) => {
  //         entries.forEach((entry) => {
  //           if (entry.isIntersecting) {
  //             // ✅ Đợi 3 giây trước khi mark viewed
  //             const timer = setTimeout(async () => {
  //               try {
  //                 await postAPI.markPostAsViewed(post._id);
  //                 hasMarkedViewed.current = true;
  //               } catch (error) {
  //                 console.error("❌ Failed to mark post as viewed:", error);
  //               }
  //             }, 3000);

  //             // Cleanup nếu user scroll đi trước 3 giây
  //             return () => clearTimeout(timer);
  //           }
  //         });
  //       },
  //       { threshold: 0.5 } // 50% bài viết hiển thị
  //     );

  //     if (postRef.current) {
  //       observer.observe(postRef.current);
  //     }

  //     return () => observer.disconnect();
  //   }, [post?._id, user]);

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
        toast.success("Post deleted successfully");
      } else {
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
          const updated = reactions.filter((r) => r.user._id !== user._id);
          setReactions(updated);
        } else if (myReaction) {
          const updated = reactions.map((r) =>
            r.user._id === user._id ? serverReaction : r
          );
          setReactions(updated);
        } else {
          setReactions([...reactions, serverReaction]);
        }
      } catch (error) {
        console.error("❌ Failed to react to post:", error);
        setReactions(prevReactions);
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

  return (
    <div
      ref={postRef}
      className="bg-white py-5 rounded-xl shadow-md mb-4 dark:bg-[#1b1f2b] dark:border dark:border-[#2b2b3d]"
    >
      <div className="flex items-start justify-between px-5 mb-3">
        <div className="flex items-center gap-2 relative">
          {/* Avatar */}
          {isUserPost && (
            <>
              <Link
                to={getProfileLink(postedById, postedByType)}
                className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 hover:opacity-80 shrink-0"
              >
                <img
                  src={getBackendImgURL(postedById.avatar)}
                  alt={postedById.name || postedById.fullName}
                  className="object-cover w-full h-full"
                />
              </Link>
            </>
          )}
          {(isShopPost || isGroupPost) && (
            <div className="relative w-11 h-11 rounded-lg border border-gray-200 dark:border-gray-700">
              <Link to={getProfileLink(postedById, postedByType)}>
                <img
                  src={getBackendImgURL(postedById.avatar)}
                  alt={postedById.name || postedById.fullName}
                  className="object-cover w-full h-full rounded-lg hover:opacity-80"
                  loading="lazy"
                />
              </Link>
              <div className="absolute bottom-0 right-0 w-7 h-7 translate-1 rounded-full border border-gray-200 dark:border-gray-700 hover:opacity-80">
                <Link to={`/profile/${author.slug}`}>
                  <img
                    src={getBackendImgURL(author.avatar)}
                    alt={author.avatar}
                    className="object-cover w-full h-full rounded-full"
                    loading="lazy"
                  />
                </Link>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="flex flex-col">
            {/* Tên chính */}
            <div className="flex gap-2 items-center">
              <HoverWrapper slug={postedById.slug} type={postedByType}>
                <Link
                  to={getProfileLink(postedById, postedByType)}
                  className="font-semibold text-base hover:underline dark:text-white leading-tight"
                  onMouseEnter={() => {
                    hoverDataRef.current = {
                      type: postedByType,
                      slug: postedById.slug,
                    };
                  }}
                >
                  {isShopPost || isGroupPost
                    ? postedById.name
                    : postedById.fullName}
                </Link>
              </HoverWrapper>

              {postedById.isVerifiedAccount && (
                <div className="p-1 rounded-full bg-green-500">
                  <Check className="text-white size-3" />
                </div>
              )}

              {equippedBadge && <UserBadge badge={equippedBadge} mode="mini" />}
            </div>

            {/* Thời gian */}
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              {(isShopPost || isGroupPost) && (
                <>
                  <Link
                    to={`/profile/${author.slug}`}
                    className="hover:underline"
                  >
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
              className="p-2 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-[rgb(56,56,56)]"
              onClick={() => setIsOpenPostDropdown(!isOpenPostDropdown)}
            >
              <Ellipsis className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            {isOpenPostDropdown && (
              <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-[rgb(36,36,36)] border border-gray-200 dark:border-gray-700 rounded-xl shadow-md z-50">
                <ul className="p-1">
                  <li
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-[rgb(64,64,64)] rounded-lg cursor-pointer dark:text-white"
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

      <InstagramCarousel media={media} postId={post._id} />

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
                  onMouseEnter={() => setHoveredEmotion(emotion.name)}
                  onMouseLeave={() => setHoveredEmotion(null)}
                  onClick={() => handleReactPost(emotion.name)}
                >
                  <img
                    src={emotion.icon}
                    alt={emotion.name}
                    className="w-full h-full object-contain"
                  />
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
          <span>Comment</span>
        </button>
      </div>
      {openComment && (
        <div className="py-2 px-4 border-t-2 mt-2 border-gray-200 dark:border-gray-700">
          <h1 className="text-lg dark:text-gray-400">All comments</h1>
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
});

PostCard.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string,
    likes: PropTypes.number,
    comments: PropTypes.array,
    reactions: PropTypes.array,
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
  onDeletePost: PropTypes.func,
  showComment: PropTypes.bool,
};

export default PostCard;
