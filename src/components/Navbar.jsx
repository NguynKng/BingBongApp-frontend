import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import useAuthStore from "../store/authStore";
import Config from "../envVars";

function Navbar() {
    const [showAll, setShowAll] = useState(false);
    const { user } = useAuthStore();
    const avatarUrl = user?.avatar ? `${Config.BACKEND_URL}${user.avatar}` : "/user.png";
    const fullName = user?.fullName || "User";

    const navbarData = [
        { src: avatarUrl, text: fullName, link: `/profile/${user._id}` },
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

    return (
        <nav className="fixed top-[64px] left-0 h-[90vh] lg:w-[24rem] bg-white px-4 py-4 overflow-y-auto custom-scroll z-40 hidden lg:block">
            <div
                className={`w-full px-2 py-2 rounded-2xl space-y-2 overflow-hidden transition-colors duration-300 ${
                    showAll
                        ? "bg-gradient-to-br from-purple-100 via-white to-blue-100"
                        : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
                }`}
            >
                {visibleItems.map((item, index) => (
                    <Link
                        to={item.link}
                        key={index}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-blue-100 rounded-xl transition-all group"
                    >
                        <div className="bg-white p-2 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                            <img src={item.src} alt={item.text} className="w-8 h-8 object-cover rounded-full" />
                        </div>
                        <span className="text-blue-900 font-medium group-hover:text-blue-700">
                            {item.text}
                        </span>
                    </Link>
                ))}

                {/* Toggle show more / less */}
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="flex items-center gap-2 text-sm font-semibold text-blue-800 hover:text-blue-600 transition-all pl-3 pt-2 cursor-pointer"
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
