import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import useAuthStore from "../store/authStore";

<<<<<<< HEAD
const socket = io("http://localhost:8000", { withCredentials: true });
=======
const notifications = [
  {
    id: 1,
    content: "Người dùng Nguyễn Văn A vừa theo dõi bạn.",
    time: "2 phút trước",
    avatar: "/user.png",
  },
  {
    id: 2,
    content: "Bạn có lời mời kết bạn mới.",
    time: "10 phút trước",
    avatar: "/user.png",
  },
  {
    id: 3,
    content: "Bài viết của bạn vừa nhận được 5 lượt thích.",
    time: "1 giờ trước",
    avatar: "/user.png",
  },
  {
    id: 4,
    content: "Người dùng Trần Thị B bình luận về bài viết của bạn.",
    time: "2 giờ trước",
    avatar: "/user.png",
  },
  {
    id: 5,
    content: "Tài khoản của bạn đã được cập nhật thành công.",
    time: "3 giờ trước",
    avatar: "/user.png",
  },
  {
    id: 6,
    content: "Bình luận của bạn vừa nhận được phản hồi.",
    time: "4 giờ trước",
    avatar: "/user.png",
  },
  {
    id: 7,
    content: "Hôm nay là sinh nhật của bạn. Chúc mừng sinh nhật 🎉",
    time: "5 giờ trước",
    avatar: "/user.png",
  },
  {
    id: 8,
    content: "Có người đã đề cập đến bạn trong một bài viết.",
    time: "6 giờ trước",
    avatar: "/user.png",
  },
  {
    id: 9,
    content: "Có người đã đề cập đến bạn trong một bài viết.",
    time: "6 giờ trước",
    avatar: "/user.png",
  },
  {
    id: 10,
    content: "Có người đã đề cập đến bạn trong một bài viết.",
    time: "6 giờ trước",
    avatar: "/user.png",
  },
];
>>>>>>> e1d16cf706aa7e3d08bbdceefee6838cafc448df

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
    <div className="absolute right-0 top-[110%] w-96 bg-white rounded-xl shadow-xl z-50 p-4 custom-scroll overflow-y-auto h-[42rem] min-h-0 dark:bg-[rgb(35,35,35)]">
      <div className="font-semibold text-lg text-blue-800 mb-3 dark:text-white">Thông báo</div>
      {notifications.length === 0 ? (
        <div className="text-center text-gray-500 py-4 dark:text-white">Không có thông báo mới</div>
      ) : (
        notifications.map((noti, idx) => (
          <Link
            to="#"
            key={noti.id || idx}
            className={`
              flex items-start gap-3 py-3 border-b border-gray-100 last:border-none rounded-xl
              transition-all duration-300 ease-out transform
              hover:scale-[1.02] hover:shadow-lg dark:hover:bg-[rgb(56,56,56)]
            `}
          >
            <img
              src={noti.avatar || "/user.png"}
              alt="avatar"
              className="size-11 rounded-full object-cover shadow-sm border border-blue-100"
            />
            <div className="flex-1">
              <p className="text-sm text-gray-800 leading-tight dark:text-white">{noti.content}</p>
              <span className="text-xs text-gray-500 dark:text-white">{noti.time}</span>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

export default DropdownNotification;