import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import useAuthStore from "../store/authStore";

const socket = io("http://localhost:8000", { withCredentials: true });

function DropdownNotification() {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user?._id) return;

    // Tham gia room riêng theo userId
    socket.emit("setup", user._id);

    // Lắng nghe thông báo mới
    socket.on("notification", (noti) => {
      setNotifications((prev) => [noti, ...prev]);
    });

    return () => {
      socket.off("notification");
    };
  }, [user?._id]);

  return (
    <div className="absolute right-0 top-[110%] w-96 bg-white rounded-xl shadow-xl z-50 p-4 border border-blue-300 custom-scroll max-h-96 overflow-y-auto">
      <div className="font-semibold text-lg text-blue-800 mb-3">Thông báo</div>
      {notifications.length === 0 ? (
        <div className="text-center text-gray-500 py-4">Không có thông báo mới</div>
      ) : (
        notifications.map((noti, idx) => (
          <Link
            to="#"
            key={noti.id || idx}
            className={`
              flex items-start gap-3 py-3 border-b border-gray-100 last:border-none rounded-xl
              transition-all duration-300 ease-out transform
              hover:scale-[1.02] hover:shadow-lg
              hover:bg-gradient-to-r hover:from-blue-50 hover:via-purple-50 hover:to-pink-50
            `}
          >
            <img
              src={noti.avatar || "/user.png"}
              alt="avatar"
              className="size-11 rounded-full object-cover shadow-sm border border-blue-100"
            />
            <div className="flex-1">
              <p className="text-sm text-gray-800 leading-tight">{noti.content}</p>
              <span className="text-xs text-gray-500">{noti.time}</span>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

export default DropdownNotification;