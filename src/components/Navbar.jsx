import { Link, useLocation } from "react-router-dom";
import {
  Gamepad2,
  House,
  Newspaper,
  PanelLeft,
  UserRound,
  UsersRound,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import Config from "../envVars";

function Navbar({ isCloseSidebar, setIsCloseSidebar }) {
  const { user } = useAuthStore();
  const location = useLocation();
  const pathname = location.pathname;
  const avatarUrl = user?.avatar
    ? `${Config.BACKEND_URL}${user.avatar}`
    : "/user.png";
  const fullName = user?.fullName || "User";

  const navbarData = [
    { src: House, text: "Trang chủ", link: "/" },
    { src: UserRound, text: "Cá nhân", link: `/profile/${user._id}` },
    { src: Gamepad2, text: "Quiz Game", link: "/quiz" },
    { src: Newspaper, text: "Tin tức", link: "/news" },
    { src: UsersRound, text: "Bạn bè", link: "/friends" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 flex flex-col h-screen p-2 z-60 bg-white
        border-r border-gray-300
        transition-all duration-300 ease-in-out
        ${isCloseSidebar ? "w-24" : "w-70"}`}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        {!isCloseSidebar && (
          <img
            src="/images/ico/logo_bingbong.ico"
            className="w-16 h-11 object-cover ml-22"
          />
        )}
        {/* Collapse Button */}
        <button
          className={`cursor-pointer ${isCloseSidebar ? "mx-auto" : ""}`}
          onClick={() => setIsCloseSidebar(!isCloseSidebar)}
        >
          <PanelLeft />
        </button>
      </div>

      {/* Divider */}
      <div
        className={`my-4 border-t border-gray-300 ${
          isCloseSidebar ? "w-full" : "w-[calc(100%-16px)]"
        }`}
      ></div>

      <div
        className={`flex-1 w-full space-y-2 overflow-y-auto custom-scroll mt-4 border-b border-gray-300 ${
          isCloseSidebar ? "flex flex-col items-center" : ""
        }`}
      >
        {navbarData.map((item, index) => {
          return (
            <Link
              to={item.link}
              key={index}
              className={`flex items-center gap-3 py-3 px-4 hover:bg-black hover:text-white rounded-xl transition-all group ${
                pathname === item.link
                  ? "bg-black text-white"
                  : "bg-transparent"
              } ${isCloseSidebar ? "justify-center" : ""}`}
            >
              <item.src />
              {/* Show/hide text when collapsed */}
              {!isCloseSidebar && (
                <span className="font-medium transition-colors">
                  {item.text}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div
        className={`flex items-center gap-3 py-2 px-4 mt-4 hover:bg-black hover:text-white rounded-xl transition-all ${
          isCloseSidebar ? "justify-center" : ""
        }`}
      >
        <img src={avatarUrl} className="w-10 h-10 object-cover rounded-full" />
        {!isCloseSidebar && (
          <span className="font-medium transition-colors">{fullName}</span>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
