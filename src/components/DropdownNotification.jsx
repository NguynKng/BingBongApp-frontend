import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { useGetNotifications } from "../hooks/useNotifications";
import useNotificationStore from "../store/notificationStore";
import { useEffect } from "react";
import SpinnerLoading from "./SpinnerLoading";
import Config from "../envVars";
import { formatTime } from "../utils/timeUtils";

function DropdownNotification() {
  const { sse } = useAuthStore();
  const { notifications, loading } = useGetNotifications();
  const { addNotification, markAsAllRead } = useNotificationStore();

  useEffect(() => {
    markAsAllRead();
    if (sse) {
      sse.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "new_post") {
          console.log("[SSE NEW NOTIFICATION]", data);
          addNotification(data.notification);
        }
      };
    }
  }, [sse, addNotification, markAsAllRead]);
  return (
    <div className="absolute right-0 top-[110%] w-96 bg-white rounded-xl shadow-xl z-50 p-4 custom-scroll overflow-y-auto h-[42rem] min-h-0 dark:bg-[rgb(35,35,35)]">
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
        notifications.map((noti) => (
          <Link
            to="#"
            key={noti._id}
            className={`
              flex items-start gap-3 py-3 border-b border-gray-100 last:border-none rounded-xl
              transition-all duration-300 ease-out transform
              hover:scale-[1.02] hover:shadow-lg dark:hover:bg-[rgb(56,56,56)]
            `}
          >
            <img
              src={noti.actor.avatar ? `${Config.BACKEND_URL}${noti.actor.avatar}` : "/user.png"}
              alt="avatar"
              className="size-11 rounded-full object-cover shadow-sm border border-blue-100"
            />
            <div className="flex-1">
              <p className="text-sm text-gray-800 leading-tight dark:text-white">
                {noti.content}
              </p>
              <span className="text-xs text-gray-500 dark:text-white">
                {formatTime(noti.createdAt)}
              </span>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

export default DropdownNotification;
