import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Send } from "lucide-react";
import { formatTime } from "../utils/timeUtils";
import useAuthStore from "../store/authStore";
import { postAPI } from "../services/api";
import { getBackendImgURL } from "../utils/helper";

function CommentItem({
  comment,
  postAuthorId,
  onRefresh,
  postedByType,
}) {
  const [replyingTo, setReplyingTo] = useState(null);
  const [openReplies, setOpenReplies] = useState(false);
  const [responseComment, setResponseComment] = useState("");
  const { user } = useAuthStore();

  // ✅ Check if the comment belongs to the shop owner
  const isShopAuthor = (userId) =>
    postedByType === "Shop" && userId === postAuthorId;

  const getProfileLink = (entity, type, isShopOwner = false) => {
    if (!entity?.slug) return "#";

    switch (type) {
      case "User":
        return `/profile/${entity.slug}`;
      case "Shop":
        return isShopOwner ? `/shop/${entity.slug}` : `/profile/${entity.slug}`;
      case "Group":
        return `/group/${entity.slug}`;
      default:
        return `/profile/${entity.slug}`;
    }
  };

  // ✅ Get avatar from backend
  const getAvatar = (entity) => getBackendImgURL(entity?.avatar) || "/user.png";

  const handleReply = async (e) => {
    e.preventDefault();
    if (!responseComment.trim()) return;

    try {
      const response = await postAPI.addReply(comment._id, responseComment);
      if (response.success) {
        setOpenReplies(true);
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
      {/* ✅ Avatar */}
      <Link
        to={getProfileLink(comment?.user, postedByType, isShopAuthor(comment?.user?._id))}
        className="size-10 rounded-full transition-transform duration-200 active:scale-95 hover:brightness-105"
      >
        <img
          src={getAvatar(comment?.user)}
          alt="avatar"
          className="size-full object-cover rounded-full"
        />
      </Link>

      <div className="space-y-1 flex-1">
        {/* ✅ Comment content */}
        <div className="py-2 px-4 rounded-3xl bg-gray-200 w-fit max-w-full dark:bg-[rgb(52,52,53)]">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to={getProfileLink(comment?.user, postedByType, isShopAuthor(comment?.user?._id))}
              className="text-[16px] font-semibold hover:text-blue-600 transition-colors dark:text-white"
            >
              {comment?.user?.name || comment?.user?.fullName}
            </Link>

            {comment?.user?._id === postAuthorId && (
              <span className="text-sm text-blue-500 font-medium">Author</span>
            )}
          </div>
          <p className="text-base break-words dark:text-white">
            {comment.content}
          </p>
        </div>

        {/* ✅ Time + Reply button */}
        <div className="flex items-center gap-2 px-3 text-sm flex-wrap">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatTime(comment.createdAt)}
          </span>
          <button
            className="text-gray-500 hover:underline underline-offset-2 transition text-sm cursor-pointer"
            onClick={() =>
              setReplyingTo((prev) => (prev === comment._id ? null : comment._id))
            }
          >
            Reply
          </button>
        </div>

        {/* ✅ View replies button */}
        {comment.replies?.length > 0 && (
          <button
            className="text-sm text-blue-500 hover:underline w-fit cursor-pointer"
            onClick={toggleReplies}
          >
            {openReplies
              ? "Hide replies"
              : `View ${comment.replies.length} replies`}
          </button>
        )}

        {/* ✅ Replies list */}
        {openReplies &&
          comment.replies.map((reply) => {
            return (
              <div key={reply._id} className="flex gap-2 mt-2 ml-1 w-full">
                <Link
                  to={getProfileLink(reply?.user, "User", isShopAuthor(reply?.user?._id))}
                  className="size-9 rounded-full transition-transform duration-200 active:scale-95 hover:brightness-105 min-w-[36px]"
                >
                  <img
                    src={getAvatar(reply?.user)}
                    alt="reply avatar"
                    className="size-full object-cover rounded-full"
                  />
                </Link>
                <div className="space-y-1 w-full">
                  <div className="py-2 px-4 rounded-3xl bg-gray-100 dark:bg-[rgb(52,52,53)] w-fit max-w-full">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        to={getProfileLink(reply?.user, "User", isShopAuthor(reply?.user?._id))}
                        className="text-[15px] font-semibold hover:text-blue-600 transition-colors dark:text-white"
                      >
                        {reply?.user?.name || reply?.user?.fullName}
                      </Link>

                      {reply?.user?._id === postAuthorId && (
                        <span className="text-sm text-blue-500 font-medium">
                          Author
                        </span>
                      )}
                    </div>
                    <p className="text-base break-words dark:text-white">
                      {reply.content}
                    </p>
                  </div>
                  <span className="text-sm px-3 text-gray-500">
                    {formatTime(reply.createdAt)}
                  </span>
                </div>
              </div>
            );
          })}

        {/* ✅ Reply form */}
        {replyingTo === comment._id && (
          <form className="flex gap-2 items-center mt-2" onSubmit={handleReply}>
            <Link
              to={`/profile/${user.slug}`}
              className="w-10 h-10 rounded-full transition-transform duration-200 active:scale-95 hover:brightness-105"
            >
              <img
                src={getBackendImgURL(user?.avatar) || "/user.png"}
                alt="your avatar"
                className="object-cover size-full rounded-full"
              />
            </Link>
            <input
              type="text"
              placeholder={`Reply to ${comment.user.name || comment.user.fullName}...`}
              className="py-2 px-4 rounded-full flex-1 bg-gray-200 text-base dark:bg-[rgb(52,52,53)] dark:text-white"
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
  onRefresh: PropTypes.func.isRequired,
  postedByType: PropTypes.string,
  postedBy: PropTypes.object,
};

export default CommentItem;
