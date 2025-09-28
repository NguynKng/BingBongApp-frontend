import { Link, useLocation } from "react-router-dom";
import {
  ChevronLeft,
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
      className={`fixed top-0 left-0 flex flex-col h-screen z-60 bg-white
        border-r border-gray-300
        transition-all duration-300 ease-in-out
        ${
          isCloseSidebar
            ? "lg:w-20 lg:translate-x-0 -translate-x-full"
            : "lg:w-60 w-[50%] translate-x-0"
        }`}
    >
      <div
        className={`flex items-center ${
          isCloseSidebar ? "justify-center" : "justify-between"
        } h-[64px] p-2`}
      >
        {/* Logo */}
        {!isCloseSidebar && (
          <Link to="/" className="hover:bg-blue-500 rounded-xl">
            <img
              src="/images/ico/logo_bingbong1.ico"
              className="w-12 h-12 object-cover"
            />
          </Link>
        )}
        {/* Collapse Button */}
        <button
          className={`cursor-e-resize hover:bg-blue-500 hover:text-white py-3 px-4 rounded-xl`}
          onClick={() => setIsCloseSidebar(!isCloseSidebar)}
        >
          <PanelLeft />
        </button>
      </div>

      {/* Divider */}
      <div className={`border-t border-gray-300 w-full`}></div>

      <div
        className={`flex-1 w-full py-4 px-2 space-y-2 overflow-y-auto custom-scroll border-b border-gray-300 ${
          isCloseSidebar ? "flex flex-col items-center" : ""
        }`}
      >
        {navbarData.map((item, index) => {
          return (
            <Link
              to={item.link}
              key={index}
              className={`flex items-center gap-3 py-3 px-4 hover:bg-blue-500 hover:text-white rounded-xl transition-all group ${
                pathname === item.link
                  ? "bg-blue-500 text-white hover:bg-blue-600"
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
      <div className="p-2">
        <Link
          to={`/profile/${user._id}`}
          className={`flex items-center gap-3 py-2 cursor-pointer ${
            isCloseSidebar ? "px-2" : "px-4"
          } hover:bg-blue-500 hover:text-white rounded-xl transition-all ${
            isCloseSidebar ? "justify-center" : ""
          }`}
        >
          <img
            src={avatarUrl}
            className="w-10 h-10 object-cover rounded-full"
          />
          {!isCloseSidebar && (
            <span className="font-medium transition-colors">{fullName}</span>
          )}
        </Link>
      </div>
      <button
        type="button"
        className={`block lg:hidden rounded-r-md absolute top-1/2 right-0 translate-x-10 text-white px-1 py-4 bg-[#e91e63]`} // Đổi màu nút toggle
        onClick={() => setIsCloseSidebar(!isCloseSidebar)}
        aria-label="Toggle sidebar"
        title="Toggle sidebar"
      >
        <ChevronLeft className={`size-8 ${isCloseSidebar ? "rotate-180" : ""}`} />
      </button>
    </nav>
  );
}

export default Navbar;
