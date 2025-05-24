import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import useAuthStore from "../store/authStore";
import Config from "../envVars";

function Navbar() {
  const [showAll, setShowAll] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const { user } = useAuthStore();
  const avatarUrl = user?.avatar
    ? `${Config.BACKEND_URL}${user.avatar}`
    : "/user.png";
  const fullName = user?.fullName || "User";

  const navbarData = [
    { src: avatarUrl, text: fullName, link: `/profile/${user._id}` },
    { src: "/newspaper.png", text: "Tin tức", link: "/news" },
    { src: "/answer.png", text: "Quiz Game", link: "/quiz" },
    { src: "/two-people.png", text: "Bạn bè", link: "/friends" },
    { src: "/clock.png", text: "Kỷ niệm", link: "#" },
    { src: "/bookmark.png", text: "Đã lưu", link: "#" },
    { src: "/group.png", text: "Nhóm", link: "#" },
    { src: "/video.png", text: "Video", link: "#" },
    { src: "/shops.png", text: "Marketplace", link: "#" },
    { src: "/feed.png", text: "Bảng feed", link: "#" },
    { src: "/analytics.png", text: "Trình quản lý quảng cáo", link: "#" },
    { src: "/present.png", text: "Sinh nhật", link: "#" },
    { src: "/earth.png", text: "Trung tâm khoa học khí hậu", link: "#" },
    { src: "/star.png", text: "Sự kiện", link: "#" },
    { src: "/heart.png", text: "Chiến dịch gây quỹ", link: "#" },
  ];

  const visibleItems = showAll ? navbarData : navbarData.slice(0, 6);

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightIndex((prev) => (prev + 1) % visibleItems.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [visibleItems.length]);

  return (
    <nav
      className={`fixed top-[64px] left-0 h-[92vh] lg:w-[24rem] px-4 py-4 overflow-y-auto custom-scroll z-40 hidden lg:block transition-colors duration-300
      ${showAll
          ? "bg-gradient-to-br from-[#f0f4ff] to-[#fff1f7] dark:from-[#1c1f2a] dark:to-[#2a2e3d]"
          : "bg-gradient-to-br from-[#f6f9ff] to-[#fef7ff] dark:from-[#1c1f2a] dark:to-[#2a2e3d]"
        }`}
    >
      <div className="w-full px-2 py-2 rounded-2xl space-y-2 overflow-hidden">
        {visibleItems.map((item, index) => {
          const isHighlighted = index === highlightIndex;

          return (
            <Link
              to={item.link}
              key={index}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all group
                ${isHighlighted
                  ? "bg-[#e1ebff] dark:bg-[#2d3748]"
                  : "hover:bg-[#e1ebff] dark:hover:bg-[#2d3748]"
                }`}
            >
              <div
                className={`bg-white dark:bg-[#2a2e3d] p-2 rounded-full shadow-sm transition-transform ${isHighlighted ? "scale-110" : "group-hover:scale-110"
                  }`}
              >
                <img
                  src={item.src}
                  alt={item.text}
                  className="w-8 h-8 object-cover rounded-full"
                />
              </div>
              <span
                className={`text-[#1e2a3a] dark:text-gray-200 font-medium transition-colors
                  ${isHighlighted
                    ? "text-blue-700 dark:text-gray-300"
                    : "group-hover:text-blue-700 dark:group-hover:text-gray-300"
                  }`}
              >
                {item.text}
              </span>
            </Link>
          );
        })}

        {/* Toggle show more / less */}
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-2 text-sm font-semibold text-blue-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-gray-400 transition-all pl-3 pt-2 cursor-pointer"
        >
          {showAll ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Thu gọn
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Xem thêm
            </>
          )}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
