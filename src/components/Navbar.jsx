import { UsersRound } from "lucide-react"
import { useState } from "react";
import { Link } from "react-router-dom"
import { ChevronDown, ChevronUp } from "lucide-react";
import useAuthStore from "../store/authStore";
import Config from "../envVars";

function Navbar(){
    const [showAll, setShowAll] = useState(false);
    const { user } = useAuthStore();
    const avatarUrl = user?.avatar ? `${Config.BACKEND_URL}${user.avatar}` : "/user.png";
    const fullName = user?.fullName ? user?.fullName : "User";

    const navbarData = [
        { src: avatarUrl, text: fullName, link: "/profile" },
        { src: "/two-people.png", text: "Bạn bè", link: "/Friends" },
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
        { src: "/game-console.png", text: "Video chơi game", link: "#" },
        { src: "/messenger.png", text: "Messenger", link: "#" },
        { src: "/communication.png", text: "Messenger Kids", link: "#" },
        { src: "/contactless.png", text: "Đơn đặt hàng và thanh toán", link: "#" },
        { src: "/facebook-page.png", text: "Trang", link: "#" },
        { src: "/game.png", text: "Chơi game", link: "#" },
        { src: "/activity.png", text: "Hoạt động gần đây với quảng cáo", link: "#" },
        { src: "/reels.png", text: "Reels", link: "#" },
    ];
    const displayData = showAll
    ? navbarData
    : navbarData.slice(0, navbarData.findIndex((item) => item.text === "Bảng feed") + 1);
    return (
        <nav className="fixed top-[10vh] left-0 h-[90vh] w-[25%] bg-gray-100 px-4 py-4 overflow-y-auto z-40 hidden lg:block">
            <div className="space-y-2">
                {displayData.map((item, index) => (
                    <Link key={index} to={item.link}
                    className="flex gap-4 items-center hover:bg-gray-200 p-2 rounded-md cursor-pointer">
                        <img src={item.src} className={`size-8 object-cover ${index == 0 && 'rounded-full'}`} />
                        <span className="font-medium text-[15px]">{item.text}</span>
                    </Link>
                ))}
                {/* Toggle Button */}
                <button className="flex gap-4 items-center hover:bg-gray-200 p-2 rounded-md cursor-pointer w-full"
                    onClick={() => setShowAll((prev) => !prev)}>
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
                        {showAll ? <ChevronUp /> : <ChevronDown className="size-6" />}
                    </div>
                    <span className="font-medium text-[15px]">
                    {showAll ? "See less" : "See more"}
                    </span>
                </button>
            </div>
        </nav>
    )
}

export default Navbar