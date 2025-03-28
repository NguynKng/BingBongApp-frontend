import { useState } from "react";
import { Bell, CircleUserRound, House, Logs, MonitorPlay, Search, Store, UserRound, UsersRound } from "lucide-react";

function Header() {
    const [activeTab, setActiveTab] = useState("home");
    const [hoveredTab, setHoveredTab] = useState(null);

    const tabs = [
        { id: "home", icon: <House />, label: "Trang chủ" },
        { id: "friends", icon: <UsersRound />, label: "Bạn bè" },
        { id: "watch", icon: <MonitorPlay />, label: "Video" },
        { id: "marketplace", icon: <Store />, label: "Marketplace" },
        { id: "profile", icon: <CircleUserRound />, label: "Cá nhân" },
    ];

    return (
        <header className="fixed w-full min-h-[10vh] flex justify-between gap-2 items-center z-10 px-2 border-b-2 border-gray-200 bg-white">
            {/* Logo + Search */}
            <div className="flex items-center gap-2">
                <img src="/facebook-logo.webp" alt="facebook-logo" className="size-10 object-cover"/>
                <div className="relative w-[16rem]">
                    <Search className="absolute size-5 top-3 left-3 text-gray-500" />
                    <input type="text" placeholder="Tìm kiếm trên facebook" className="text-gray-700 w-full h-full py-3 pl-10 bg-gray-100 rounded-full focus:outline-none"/>
                </div>
            </div>

            {/* Tabs with Tooltip */}
            <div className="flex items-center gap-2 relative">
                {tabs.map((tab) => (
                    <div key={tab.id}
                        className={`relative py-4 px-12 cursor-pointer border-b-4 transition 
                            ${activeTab === tab.id ? "border-blue-500 text-blue-500 bg-transparent" : "border-transparent text-gray-500 hover:bg-gray-200 rounded-md"}`}
                        onClick={() => setActiveTab(tab.id)}
                        onMouseEnter={() => setHoveredTab(tab.id)}
                        onMouseLeave={() => setHoveredTab(null)}
                    >
                        {tab.icon}

                        {/* Tooltip */}
                        {hoveredTab === tab.id && (
                            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-3 py-2 rounded-full shadow-lg whitespace-nowrap">
                                {tab.label}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-2">
                <div className="bg-gray-200 hover:bg-gray-300 rounded-full size-10 p-2.5 flex items-center justify-center cursor-pointer">
                    <Logs />
                </div>
                <div className="bg-gray-200 hover:bg-gray-300 rounded-full size-10 p-2.5 cursor-pointer">
                    <img src="/messenger-icon.png" className="size-full object-cover" />
                </div>
                <div className="bg-gray-200 hover:bg-gray-300 rounded-full size-10 p-2.5 flex items-center justify-center cursor-pointer">
                    <Bell className="fill-black" />
                </div>
                <div className="bg-gray-200 hover:bg-gray-300 rounded-full size-10 flex items-center justify-center cursor-pointer">
                    <UserRound />
                </div>
            </div>
        </header>
    );
}

export default Header;
