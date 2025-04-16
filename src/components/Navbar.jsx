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

    const displayData = showAll
    ? navbarData
    : navbarData.slice(0, navbarData.findIndex((item) => item.text === "Bảng feed") + 1);
    return (
        <nav className="fixed top-[10vh] left-0 h-[90vh] lg:w-1/4 bg-gray-100 px-4 py-4 overflow-y-auto custom-scroll z-40 hidden lg:block">
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