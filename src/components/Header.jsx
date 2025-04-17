import { useState, useEffect } from "react";
import {
    Bell,
    CircleUserRound,
    Grip,
    House,
    MonitorPlay,
    Search,
    Store,
    ChevronDown,
    UsersRound,
    Gamepad2,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Config from "../envVars";
import DropdownUser from "./DropdownUser";
import DropdownChat from "./DropdownChat";
import { useGetProfileByName } from "../hooks/useProfile";
import debounce from "lodash.debounce";
import SpinnerLoading from "./SpinnerLoading";

function Header({ onToggleChat }) {
    const [query, setQuery] = useState("");
    const isSearchingUser = query.length > 0;
    const { listUser, loading } = useGetProfileByName(query, {
        enabled: isSearchingUser,
    });
    const [activeTab, setActiveTab] = useState("home");
    const [dropdown, setDropdown] = useState({ user: false, chat: false });
    const { user } = useAuthStore();
    const location = useLocation();

    const debouncedSearch = debounce((query) => {
        setQuery(query);
    }, 500);

    useEffect(() => {
        const path = location.pathname;
        if (path === "/") setActiveTab("home");
        else if (path.startsWith("/friends")) setActiveTab("friends");
        else if (path.startsWith("/watch")) setActiveTab("watch");
        else if (path.startsWith("/quiz")) setActiveTab("quiz");
        else if (path.startsWith("/profile")) setActiveTab("profile");
    }, [location.pathname]);

    const tabs = [
        { id: "home", icon: <House />, label: "Trang chủ", link: "/" },
        { id: "friends", icon: <UsersRound />, label: "Bạn bè", link: "/friends" },
        { id: "watch", icon: <MonitorPlay />, label: "Video", link: "#" },
        { id: "quiz", icon: <Gamepad2 />, label: "Quizz", link: "/quiz" },
        { id: "profile", icon: <CircleUserRound />, label: "Cá nhân", link: `/profile/${user._id}` },
    ];

    const toggleDropdown = (type) => {
        setDropdown((prev) => ({
            user: type === "user" ? !prev.user : false,
            chat: type === "chat" ? !prev.chat : false,
        }));
    };

    return (
        <header className="fixed top-0 left-0 h-[10vh] w-full z-50 bg-gradient-to-r from-white via-blue-300 to-purple-400 shadow-xl border-b border-white/30 backdrop-blur-md transition-all duration-300">
            <div className="container mx-auto h-full flex justify-between items-center px-4">
                {/* Logo + Search */}
                <div className="flex items-center gap-4">
                    <Link to="/" className="size-10 transform hover:scale-110 transition duration-300">
                        <img
                            src="/images/ico/logo.ico"
                            alt="logo"
                            className="size-full object-cover rounded-xl" // Xóa shadow-md và border
                        />
                    </Link>
                    <div className="relative w-[18rem]">
                        <Search className="absolute size-5 top-2.5 left-3 text-gray-600" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm trên Bing Bong"
                            className="text-gray-800 font-medium w-full py-2 pl-10 bg-white/70 rounded-full focus:outline-none shadow-sm focus:ring-2 focus:ring-blue-400 backdrop-blur-md"
                            onChange={(e) => debouncedSearch(e.target.value)}
                        />
                        {query.length > 0 && (
                            <div className="absolute top-[110%] right-0 w-full max-h-96 overflow-y-auto shadow-xl bg-white/90 rounded-lg z-50 p-2 custom-scroll">
                                {loading ? (
                                    <SpinnerLoading />
                                ) : listUser.length === 0 ? (
                                    <div className="text-center text-gray-500 py-2 px-4">
                                        Không tìm thấy người dùng
                                    </div>
                                ) : (
                                    listUser.map((user) => (
                                        <Link
                                            to={`/profile/${user._id}`}
                                            key={user._id}
                                            className="w-full py-2 px-4 flex items-center justify-between gap-2 hover:bg-blue-100/40 rounded-md transition duration-200"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="rounded-full bg-blue-100 p-2">
                                                    <Search className="size-5 text-blue-600" />
                                                </div>
                                                <span className="text-sm font-semibold text-gray-800">{user.fullName}</span>
                                            </div>
                                            <img
                                                src={user.avatar ? `${Config.BACKEND_URL}${user.avatar}` : "/user.png"}
                                                alt={user.fullName}
                                                className="size-8 object-cover rounded-lg shadow-sm"
                                            />
                                        </Link>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="hidden md:flex items-center justify-center flex-1 gap-2">
                    {tabs.map((tab) => (
                        <Link
                            to={tab.link}
                            key={tab.id}
                            className={`relative py-4 px-10 rounded-xl font-medium transition-all duration-300 group 
                ${activeTab === tab.id
                                    ? "bg-white/30 text-blue-700 shadow-md backdrop-blur-sm"
                                    : "text-gray-700 hover:bg-white/20"
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                {tab.icon}
                            </div>
                            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1 rounded-full shadow-md hidden group-hover:block">
                                {tab.label}
                            </div>
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full animate-pulse" />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Right icons */}
                <div className="flex items-center gap-3">
                    {/* Menu */}
                    <div className="relative size-10 p-2 bg-white/60 rounded-full flex items-center justify-center shadow-md hover:scale-105 transition cursor-pointer group">
                        <Grip className="text-gray-800" />
                        <div className="absolute -bottom-10 text-xs bg-black/80 text-white px-3 py-1 rounded shadow hidden group-hover:block">
                            Menu
                        </div>
                    </div>
                    {/* Messenger */}
                    <div
                        className="relative size-10 p-2 bg-white/60 rounded-full shadow-md hover:scale-105 transition cursor-pointer group"
                        onClick={() => toggleDropdown("chat")}
                    >
                        <img src="/messenger-icon.png" className="size-full object-contain" />
                        <div className="absolute -bottom-10 text-xs bg-black/80 text-white px-3 py-1 rounded shadow hidden group-hover:block">
                            Messenger
                        </div>
                    </div>
                    {/* Notifications */}
                    <div className="relative size-10 p-2 bg-white/60 rounded-full flex items-center justify-center shadow-md hover:scale-105 transition cursor-pointer group">
                        <Bell className="text-gray-800" />
                        <div className="absolute -bottom-10 text-xs bg-black/80 text-white px-3 py-1 rounded shadow hidden group-hover:block">
                            Notifications
                        </div>
                    </div>
                    {/* User Dropdown */}
                    <div className="relative">
                        <div
                            className="relative size-10 bg-white/60 rounded-full overflow-hidden shadow-md hover:scale-105 transition cursor-pointer group"
                            onClick={() => toggleDropdown("user")}
                        >
                            <img
                                src={user?.avatar ? `${Config.BACKEND_URL}${user.avatar}` : `/user.png`}
                                className="size-full object-cover"
                            />
                            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-xs bg-black/80 text-white px-3 py-1 rounded shadow hidden group-hover:block">
                                Account
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-white size-4 rounded-full flex items-center justify-center">
                                <ChevronDown className="size-3 text-black" />
                            </div>
                        </div>
                        {dropdown.user && <DropdownUser />}
                        {dropdown.chat && <DropdownChat onToggleChat={onToggleChat} />}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
