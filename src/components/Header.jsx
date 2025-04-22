// [GIỮ NGUYÊN IMPORT GỐC]
import { useState, useMemo } from "react";
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
    const [dropdown, setDropdown] = useState({ user: false, chat: false });
    const { user } = useAuthStore();
    const location = useLocation();

    const debouncedSearch = debounce((query) => {
        setQuery(query);
    }, 500);

    const activeTab = useMemo(() => {
        const path = location.pathname;
        if (path.startsWith("/friends")) return "friends";
        else if (path.startsWith("/watch")) return "watch";
        else if (path.startsWith("/quiz")) return "quiz";
        else if (path.startsWith("/profile")) return "profile";
        else if (path === "/") return "home";
        return "home"; // default case
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
        <header className="fixed top-0 left-0 w-full h-[64px] z-50 bg-gradient-to-r from-blue-100 via-blue-200 to-purple-200 backdrop-blur-xl shadow-md border-b border-blue-300">
            <div className="w-full h-full flex items-center px-4 justify-start">
                {/* Logo + Search */}
                <div className="flex items-center gap-4 mr-8">
                    <Link to="/" className="size-15 hover:scale-110 transition-transform duration-300">
                        <img
                            src="/images/ico/logo.ico"
                            alt="logo"
                            className="size-full object-cover rounded-xl"
                        />
                    </Link>

                    <div className="relative w-[18rem]">
                        <Search className="absolute size-5 top-2.5 left-3 text-blue-700" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm trên Bing Bong"
                            className="text-blue-800 font-medium w-full py-2 pl-10 bg-white/80 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md transition-all duration-300"
                            onChange={(e) => debouncedSearch(e.target.value)}
                        />
                        {query.length > 0 && (
                            <div className="absolute top-[110%] right-0 w-full max-h-96 overflow-y-auto shadow-xl bg-white rounded-lg z-50 p-2 custom-scroll">
                                {loading ? (
                                    <SpinnerLoading />
                                ) : listUser.length === 0 ? (
                                    <div className="text-center text-gray-500 py-2 px-4">Không tìm thấy người dùng</div>
                                ) : (
                                    listUser.map((user) => (
                                        <Link
                                            to={`/profile/${user._id}`}
                                            key={user._id}
                                            className="w-full py-2 px-4 flex items-center justify-between gap-2 hover:bg-blue-100 rounded-md transition duration-200"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="rounded-full bg-blue-200 p-2">
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
                            className={`relative px-6 py-3 rounded-xl font-medium group transition-all duration-300 overflow-hidden
                                ${activeTab === tab.id
                                    ? "bg-blue-600 text-white shadow-md scale-105"
                                    : "bg-white/30 text-blue-800 hover:bg-blue-200 hover:text-blue-900"
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">{tab.icon}</div>
                            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1 rounded-full shadow-md hidden group-hover:block">
                                {tab.label}
                            </div>
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full animate-pulse" />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Right Icons */}
                <div className="flex items-center gap-3">
                    {/* Menu Icon */}
                    <div className="relative size-10 p-2 bg-white/70 rounded-full flex items-center justify-center shadow-md hover:scale-110 hover:ring-2 ring-blue-300 transition-all cursor-pointer group">
                        <Grip className="text-blue-800" />
                        <div className="absolute -bottom-10 text-xs bg-black/80 text-white px-3 py-1 rounded shadow hidden group-hover:block">
                            Menu
                        </div>
                    </div>

                    {/* Messenger Icon */}
                    <div
                        className="relative size-10 p-2 bg-white/70 rounded-full shadow-md hover:scale-110 hover:ring-2 ring-blue-300 transition-all cursor-pointer group"
                        onClick={() => toggleDropdown("chat")}
                    >
                        <img src="/messenger-icon.png" className="size-full object-contain" />
                        <div className="absolute -bottom-10 text-xs bg-black/80 text-white px-3 py-1 rounded shadow hidden group-hover:block">
                            Messenger
                        </div>
                    </div>

                    {/* Bell Icon */}
                    <div className="relative size-10 p-2 bg-white/70 rounded-full flex items-center justify-center shadow-md hover:scale-110 hover:ring-2 ring-blue-300 transition-all cursor-pointer group">
                        <Bell className="text-blue-800" />
                        <div className="absolute -bottom-10 text-xs bg-black/80 text-white px-3 py-1 rounded shadow hidden group-hover:block">
                            Thông báo
                        </div>
                    </div>

                    {/* User Dropdown */}
                    <div className="relative">
                        <div
                            className="relative size-10 bg-white/70 rounded-full shadow-md hover:scale-110 hover:ring-2 ring-blue-300 transition-all cursor-pointer group"
                            onClick={() => toggleDropdown("user")}
                        >
                            <img
                                src={user?.avatar ? `${Config.BACKEND_URL}${user.avatar}` : `/user.png`}
                                className="size-full object-cover rounded-full"
                            />
                            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-xs bg-black/80 text-white px-3 py-1 rounded shadow hidden group-hover:block">
                                Tài khoản
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
