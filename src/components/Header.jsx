import { useState, useEffect } from "react";
import { Bell, CircleUserRound, Grip, House, MonitorPlay, Search, Store, ChevronDown, UsersRound, Gamepad2 } from "lucide-react";

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
    const isSearchingUser = query.length > 0; // Check if user is searching
    const { listUser, loading } = useGetProfileByName(query, { enabled: isSearchingUser }); // Get users and loading state
    const [activeTab, setActiveTab] = useState("home");
    const [dropdown, setDropdown] = useState({
        user: false,
        chat: false,
    });
    const { user } = useAuthStore();
    const location = useLocation();

    // Debounced function to delay fetch after user stops typing
    const debouncedSearch = debounce((query) => {
        setQuery(query);
    }, 500); // 500ms debounce

    // Update active tab based on location
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
        <header className="fixed top-0 left-0 h-[10vh] w-full z-50 bg-white border-b border-gray-200 shadow-md">
            <div className="container h-full flex justify-between items-center px-4">
                {/* Logo + Search */}
                <div className="flex items-center gap-2">
                    <Link to="/" className="size-10">
                        <img src="/images/ico/logo.ico" alt="facebook-logo" className="size-full object-cover" />
                    </Link>
                    <div className="relative w-[16rem]">
                        <Search className="absolute size-5 top-2.5 left-3 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm trên Facebook"
                            className="text-gray-700 w-full py-2 pl-10 bg-gray-100 rounded-full focus:outline-none"
                            onChange={(e) => debouncedSearch(e.target.value)} // Search triggered on input change
                        />
                        {query.length > 0 && (
                            <div className="absolute top-[110%] right-0 w-full max-h-96 overflow-y-auto shadow-lg bg-white z-50 p-2 rounded-b-md custom-scroll">
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
                                            className="w-full py-2 px-4 flex items-center justify-between gap-2 hover:bg-gray-100 rounded-md cursor-pointer"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="rounded-full bg-gray-200 p-2">
                                                    <Search className="size-5 text-gray-500" />
                                                </div>
                                                <span className="text-sm font-semibold">{user.fullName}</span>
                                            </div>
                                            <img
                                                src={user.avatar ? `${Config.BACKEND_URL}${user.avatar}` : "/user.png"}
                                                alt={user.fullName}
                                                className="size-8 object-cover rounded-lg"
                                            />
                                        </Link>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabs with Tooltip */}
                <div className="hidden md:flex items-center justify-center flex-1 gap-1">
                    {tabs.map((tab) => (
                        <Link
                            to={tab.link}
                            key={tab.id}
                            className={`relative py-4 px-12 cursor-pointer border-b-4 transition group 
                                ${activeTab === tab.id ? "border-blue-500 text-blue-500 bg-transparent" : "border-transparent text-gray-500 hover:bg-gray-200 rounded-md"}`}
                        >
                            {tab.icon}
                            <div
                                className={`absolute -bottom-10 left-1/2 transform -translate-x-1/2
                                    bg-gray-700 text-white text-xs px-3 py-2 rounded-full shadow-lg whitespace-nowrap
                                    transition-opacity duration-200 pointer-events-none hidden group-hover:block
                                `}
                            >
                                {tab.label}
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Right icons */}
                <div className="flex items-center gap-2">
                    <div className="relative bg-gray-200 hover:bg-gray-300 rounded-full size-10 p-2.5 flex items-center justify-center cursor-pointer group">
                        <Grip />
                        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-3 py-2 rounded-xl shadow-lg whitespace-nowrap group-hover:block hidden transition-opacity duration-500 delay-300 z-50">
                            Menu
                        </div>
                    </div>
                    <div className="relative bg-gray-200 hover:bg-gray-300 rounded-full size-10 p-2.5 cursor-pointer group" onClick={() => toggleDropdown("chat")}>
                        <img src="/messenger-icon.png" className="size-full object-cover" />
                        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-3 py-2 rounded-xl shadow-lg whitespace-nowrap group-hover:block hidden transition-opacity duration-500 delay-300 z-50">
                            Messenger
                        </div>
                    </div>
                    <div className="relative bg-gray-200 hover:bg-gray-300 rounded-full size-10 p-2.5 flex items-center justify-center cursor-pointer group">
                        <Bell className="fill-black" />
                        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-3 py-2 rounded-xl shadow-lg whitespace-nowrap group-hover:block hidden transition-opacity duration-500 delay-300 z-50">
                            Notifications
                        </div>
                    </div>
                    <div className="relative">
                        <div className="bg-gray-200 hover:bg-gray-300 rounded-full size-10 flex items-center justify-center cursor-pointer group" onClick={() => toggleDropdown("user")}>
                            <img src={user?.avatar ? `${Config.BACKEND_URL}${user.avatar}` : `/user.png`} className="size-full rounded-full object-cover" />
                            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-3 py-2 rounded-xl shadow-lg whitespace-nowrap hidden group-hover:block transition-opacity duration-500 delay-300 z-50">
                                Account
                            </div>
                            <div className="absolute rounded-full bottom-0 -right-0.5 bg-gray-100 size-4 flex items-center justify-center">
                                <ChevronDown className="size-3.5 text-black" />
                            </div>
                        </div>
                        {/* Dropdown User */}
                        {dropdown.user && (
                            <DropdownUser />
                        )}
                        {/* Dropdown Chat */}
                        {dropdown.chat && (
                            <DropdownChat onToggleChat={onToggleChat} />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;