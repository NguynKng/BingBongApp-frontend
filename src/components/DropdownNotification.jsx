import { Link } from "react-router-dom";
import { useGetNotifications } from "../hooks/useNotifications";
import useNotificationStore from "../store/notificationStore";
import { useEffect } from "react";
import SpinnerLoading from "./SpinnerLoading";
import Config from "../envVars";
import { formatTime } from "../utils/timeUtils";

function DropdownNotification() {
  const { markAsAllRead } = useNotificationStore();
  const { loading, loadMore, hasMore, notifications } = useGetNotifications();

  const getLink = (noti) => {
    const enumPostType = ["new_post", "comment_post", "react_post"];
    const enumFriendType = ["friend_request", "accepted_request"];
    if (enumPostType.includes(noti.type)) {
        return `/posts/${noti.post}`;
    } else if (enumFriendType.includes(noti.type) && noti.actor) {
        return `/profile/${noti.actor._id}`;
    } else {
        return "#"
    }
  };

  useEffect(() => {
    markAsAllRead();
  }, [markAsAllRead]);

  return (
    <div className="absolute right-0 top-[110%] w-92 bg-white rounded-xl shadow-xl z-50 p-4 custom-scroll overflow-y-auto h-[42rem] min-h-0 dark:bg-[rgb(35,35,35)]">
      <div className="font-semibold text-lg text-blue-800 mb-3 dark:text-white">
        Thông báo
      </div>

      {loading ? (
        <SpinnerLoading />
      ) : notifications.length === 0 ? (
        <div className="text-center text-gray-500 py-4 dark:text-white">
          Không có thông báo mới
        </div>
      ) : (
        <>
          {notifications.map((noti) => (
            <Link
              to={getLink(noti)}
              key={noti._id}
              className="flex items-start gap-3 py-3 px-2 last:border-none rounded-xl transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-lg dark:hover:bg-[rgb(56,56,56)]"
            >
              <img
                src={
                  noti.actor.avatar
                    ? `${Config.BACKEND_URL}${noti.actor.avatar}`
                    : "/user.png"
                }
                alt="avatar"
                className="size-13 rounded-full object-cover shadow-sm border border-blue-100"
              />
              <div className="flex-1">
                <p className="text-base leading-tight">
                  <span className="dark:text-white font-medium">{`${noti.actor.fullName} `}</span>
                  <span className="dark:text-gray-300 text-gray-800">{`${noti.content}`}</span>
                </p>
                <span className="text-xs text-gray-500 dark:text-white">
                  {formatTime(noti.createdAt)}
                </span>
              </div>
            </Link>
          ))}

          {hasMore && (
            <div className="flex justify-center mt-3 w-full">
              <button
                onClick={loadMore}
                className="w-full px-4 py-2 font-medium text-base bg-gray-200 text-black dark:text-white rounded-lg hover:bg-gray-300 cursor-pointer transition dark:bg-gray-600 dark:hover:bg-gray-500"
              >
                Xem thêm thông báo
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DropdownNotification;
