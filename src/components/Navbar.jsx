import { Link, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  Film,
  Gamepad2,
  Handshake,
  House,
  Newspaper,
  PanelLeft,
  Store,
  UserRound,
  UsersRound,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import Config from "../envVars";
import { useGetProfile } from "../hooks/useProfile";

function Navbar({ isCloseSidebar, setIsCloseSidebar }) {
  const { user } = useAuthStore();
  const { profile } = useGetProfile(user?._id);
  const location = useLocation();
  const pathname = location.pathname;
  const avatarUrl = user?.avatar
    ? `${Config.BACKEND_URL}${user.avatar}`
    : "/user.png";
  const fullName = user?.fullName || "User";

  const navbarData = [
    { tab: "home", src: House, text: "Trang chủ", link: "/" },
    {
      tab: "profile",
      src: UserRound,
      text: "Cá nhân",
      link: `/profile/${user._id}`,
    },
    { tab: "quiz", src: Gamepad2, text: "Quiz", link: "/quiz" },
    { tab: "news", src: Newspaper, text: "Tin tức", link: "/news" },
    { tab: "friends", src: Handshake, text: "Bạn bè", link: "/friends" },
    { tab: "movie", src: Film, text: "Phim", link: "/movie" },
    { tab: "shop", src: Store, text: "Shop", link: "/shop" },
    { tab: "groups", src: UsersRound, text: "Nhóm", link: "#" },
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 flex flex-col h-screen pt-[64px] z-50
        transition-all duration-300 ease-in-out border-r
        bg-white dark:bg-gradient-to-b dark:from-[#1b1f2b] dark:to-[#0f121a]
        border-gray-300 dark:border-gray-800
        ${
          isCloseSidebar
            ? "lg:w-20 lg:translate-x-0 -translate-x-full"
            : "lg:w-60 w-[50%] translate-x-0"
        }`}
    >
      {/* Header */}
      <div
        className={`flex items-center ${
          isCloseSidebar ? "justify-center" : "justify-between"
        } h-[64px] p-2`}
      >
        {!isCloseSidebar && (
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 rounded-xl"
          >
            <img
              src="/images/ico/logo_bingbong1.ico"
              className="w-12 h-12 object-cover"
            />
          </Link>
        )}
        <button
          className={`ml-auto cursor-pointer hover:text-white hover:bg-blue-800 text-gray-700 dark:text-gray-100 
            py-3 px-5 rounded-xl transition-all`}
          onClick={() => setIsCloseSidebar(!isCloseSidebar)}
        >
          <PanelLeft />
        </button>
      </div>

      <div className="border-t border-gray-300 dark:border-gray-800 w-full"></div>

      {/* Menu */}
      <div
        className={`flex-1 w-full py-4 px-2 space-y-2 overflow-y-auto border-b border-gray-300 dark:border-gray-800 custom-scroll ${
          isCloseSidebar ? "flex flex-col items-center" : ""
        }`}
      >
        {navbarData.map((item, index) => {
          const isActive = pathname === item.link;
          return (
            <Link
              title={item.text}
              to={item.link}
              key={index}
              className={`relative flex items-center gap-3 py-3 px-4 rounded-xl group transition-all
                ${
                  isActive
                    ? "bg-blue-800 text-white shadow-md shadow-blue-500/30"
                    : "hover:bg-blue-500/10 dark:hover:bg-blue-600/20"
                } ${isCloseSidebar ? "justify-center" : ""}`}
            >
              <item.src
                className={`size-5 ${
                  isActive
                    ? "text-white"
                    : "text-gray-700 dark:text-gray-300 group-hover:text-blue-400"
                }`}
              />
              {!isCloseSidebar && (
                <span
                  className={`font-medium transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-gray-700 dark:text-gray-300 group-hover:text-blue-400"
                  }`}
                >
                  {item.text}
                </span>
              )}
              {item.tab === "friends" && profile?.friendRequests.length > 0 && (
                <div
                  className={`absolute ${
                    isCloseSidebar
                      ? "-top-1.5 -right-0.5"
                      : "top-1/2 -translate-y-1/2 right-2"
                  } bg-red-500 size-6 flex items-center justify-center rounded-full`}
                >
                  <span className="text-white text-xs font-semibold">
                    {profile?.friendRequests.length}
                  </span>
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Profile */}
      <div className="p-2">
        <Link
          to={`/profile/${user._id}`}
          className={`flex items-center gap-3 py-2 rounded-xl cursor-pointer transition-all
            hover:bg-blue-500/10 dark:hover:bg-blue-600/20 ${
              isCloseSidebar ? "justify-center px-2" : "px-4"
            }`}
        >
          <img
            src={avatarUrl}
            className="w-10 h-10 object-cover rounded-full border border-gray-300 dark:border-gray-700"
          />
          {!isCloseSidebar && (
            <span className="font-medium text-gray-700 dark:text-gray-200">
              {fullName}
            </span>
          )}
        </Link>
      </div>

      {/* Toggle (mobile) */}
      <button
        type="button"
        className={`block lg:hidden rounded-r-md absolute top-1/2 right-0 translate-x-8
          text-white px-1 py-2 bg-blue-800 transition-all`}
        onClick={() => setIsCloseSidebar(!isCloseSidebar)}
        aria-label="Toggle sidebar"
        title="Toggle sidebar"
      >
        <ChevronLeft
          className={`size-6 transition-transform ${
            isCloseSidebar ? "rotate-180" : ""
          }`}
        />
      </button>
    </nav>
  );
}

export default Navbar;
