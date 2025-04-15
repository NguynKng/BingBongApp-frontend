import { useState, useEffect } from "react";
import { Bell, CircleUserRound, Grip, House, MonitorPlay, Search, Store, ChevronDown, UsersRound } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Config from "../envVars";

function Header() {
    const [activeTab, setActiveTab] = useState("home");
    const [hoveredTab, setHoveredTab] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { user, logout } = useAuthStore();
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        if (path === "/") setActiveTab("home");
        else if (path.startsWith("/friends")) setActiveTab("friends");
        else if (path.startsWith("/watch")) setActiveTab("watch");
        else if (path.startsWith("/marketplace")) setActiveTab("marketplace");
        else if (path.startsWith("/profile")) setActiveTab("profile");
    }, [location.pathname]);

    const handleLogout = async () => {
        await logout();
    };

    const tabs = [
        { id: "home", icon: <House />, label: "Trang chủ", link: "/" },
        { id: "friends", icon: <UsersRound />, label: "Bạn bè", link: "/friends" },
        { id: "watch", icon: <MonitorPlay />, label: "Video", link: "#" },
        { id: "marketplace", icon: <Store />, label: "Marketplace", link: "#" },
        { id: "profile", icon: <CircleUserRound />, label: "Cá nhân", link: "/profile" },
    ];

    const footerLinks = [
        "Privacy",
        "Terms",
        "Advertising",
        "Ad choices",
        "Cookies",
        "More",
        "Meta © 2025"
    ];
    
    return (
        <header className="fixed top-0 left-0 h-[10vh] w-full z-50 bg-white border-b border-gray-200 shadow-md">
            <div className="container mx-auto h-full flex justify-between items-center px-4">
                {/* Logo + Search */}
                <div className="flex items-center gap-2">
                    <Link to="/" className="size-10">
                        <img src="/images/ico/logo.ico" alt="facebook-logo" className="size-full object-cover"/>
                    </Link>
                    <div className="relative w-[16rem]">
                        <Search className="absolute size-5 top-2.5 left-3 text-gray-500" />
                        <input type="text" placeholder="Tìm kiếm trên Facebook" className="text-gray-700 w-full py-2 pl-10 bg-gray-100 rounded-full focus:outline-none"/>
                    </div>
                </div>

                {/* Tabs with Tooltip */}
                <div className="hidden md:flex items-center justify-center flex-1 gap-1">
                    {tabs.map((tab) => (
                        <Link to={tab.link} key={tab.id}
                            className={`relative py-4 px-12 cursor-pointer border-b-4 transition 
                                ${activeTab === tab.id ? "border-blue-500 text-blue-500 bg-transparent" : "border-transparent text-gray-500 hover:bg-gray-200 rounded-md"}`}
                            onMouseEnter={() => setHoveredTab(tab.id)}
                            onMouseLeave={() => setHoveredTab(null)}
                        >
                            {tab.icon}
                            {hoveredTab === tab.id && (
                                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-3 py-2 rounded-full shadow-lg whitespace-nowrap">
                                    {tab.label}
                                </div>
                            )}
                        </Link>
                    ))}
                </div>

                {/* Right icons */}
                <div className="flex items-center gap-2">
                    <div className="relative bg-gray-200 hover:bg-gray-300 rounded-full size-10 p-2.5 flex items-center justify-center cursor-pointer group">
                        <Grip />
                        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-3 py-2 rounded-xl shadow-lg whitespace-nowrap group-hover:opacity-100 opacity-0 transition-opacity duration-500 delay-300">
                            Menu
                        </div>
                    </div>
                    <div className="relative bg-gray-200 hover:bg-gray-300 rounded-full size-10 p-2.5 cursor-pointer group">
                        <img src="/messenger-icon.png" className="size-full object-cover" />
                        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-3 py-2 rounded-xl shadow-lg whitespace-nowrap group-hover:opacity-100 opacity-0 transition-opacity duration-500 delay-300">
                            Messenger
                        </div>
                    </div>
                    <div className="relative bg-gray-200 hover:bg-gray-300 rounded-full size-10 p-2.5 flex items-center justify-center cursor-pointer group">
                        <Bell className="fill-black" />
                        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-3 py-2 rounded-xl shadow-lg whitespace-nowrap group-hover:opacity-100 opacity-0 transition-opacity duration-500 delay-300">
                            Notifications
                        </div>
                    </div>
                    <div className="relative">
                        <div className="bg-gray-200 hover:bg-gray-300 rounded-full size-10 flex items-center justify-center cursor-pointer group" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                            <img src={user?.avatar ? `${Config.BACKEND_URL}${user.avatar}` : `user.png`} className="size-full rounded-full object-cover" />
                            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-3 py-2 rounded-xl shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300 z-50">
                                Account
                            </div>
                            <div className="absolute rounded-full bottom-0 -right-0.5 bg-gray-100 size-4 flex items-center justify-center">
                                <ChevronDown className="size-3.5 text-black" />
                            </div>
                        </div>
                        {isDropdownOpen && (
                            <div className="absolute top-[100%] right-0 min-w-92 rounded-lg shadow-lg border-2 border-gray-200 bg-white p-3">
                                <div className="shadow-lg p-1 w-full rounded-lg border-2 border-gray-200">
                                    <Link to="/profile" className="p-2 hover:bg-gray-100 w-full flex items-center gap-2 rounded-lg cursor-pointer">
                                        <img src={user?.avatar ? `${Config.BACKEND_URL}${user.avatar}`: `/user.png`} className="size-9 object-cover rounded-full border-2 border-gray-200" />
                                        <span className="text-[17px]">{user?.fullName}</span>
                                    </Link>
                                    <div className="w-full py-1 px-2">
                                        <div className="w-full border-1 border-gray-300"></div>
                                    </div>
                                    <div className="w-full p-2">
                                        <button className="rounded-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center gap-2 w-full cursor-pointer py-2 px-4">
                                            <img src="/change-account.png" className="size-5 object-cover" />
                                            <span className="font-medium">See all profiles</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="rounded-md hover:bg-gray-100 flex items-center gap-2 p-2 cursor-pointer">
                                        <div className="p-2 rounded-full bg-gray-300">
                                            <img src="/settings.png" className="size-5 object-cover" />
                                        </div>
                                        <span className="font-medium">Settings & privacy</span>
                                    </div>
                                    <div className="rounded-md hover:bg-gray-100 flex items-center gap-2 p-2 cursor-pointer">
                                        <div className="p-2 rounded-full bg-gray-300">
                                            <img src="/help-web-button.png" className="size-5 object-cover" />
                                        </div>
                                        <span className="font-medium">Help & support</span>
                                    </div>
                                    <div className="rounded-md hover:bg-gray-100 flex items-center gap-2 p-2 cursor-pointer">
                                        <div className="p-2 rounded-full bg-gray-300">
                                            <img src="/moon.png" className="size-5 object-cover" />
                                        </div>
                                        <span className="font-medium">Display and accessibility</span>
                                    </div>
                                    <div className="rounded-md hover:bg-gray-100 flex items-center gap-2 p-2 cursor-pointer">
                                        <div className="p-2 rounded-full bg-gray-300">
                                            <img src="/feedback.png" className="size-5 object-cover" />
                                        </div>
                                        <span className="font-medium">Give feedback</span>
                                    </div>
                                    <div className="rounded-md hover:bg-gray-100 flex items-center gap-2 p-2 cursor-pointer" onClick={handleLogout}>
                                        <div className="p-2 rounded-full bg-gray-300">
                                            <img src="/logout.png" className="size-5 object-cover" />
                                        </div>
                                        <span className="font-medium">Log out</span>
                                    </div>
                                </div>
                                <div className="mt-4 flex flex-wrap items-center gap-1 text-gray-500 text-[13px] leading-4">
                                {footerLinks.map((label, index) => (
                                    <div key={label} className="flex items-center">
                                        <Link to="#" className="hover:underline">{label}</Link>
                                        {index < footerLinks.length - 1 && (
                                            <span className="mx-1 text-gray-400">•</span>
                                        )}
                                    </div>
                                ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;