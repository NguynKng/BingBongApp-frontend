import { useState } from "react";
import {
  Bell,
  CircleUserRound,
  House,
  Search,
  ChevronDown,
  UsersRound,
  Gamepad2,
  X,
  Newspaper,
  SunMedium,
  ShoppingCart,
  Moon,
  Mail,
  Menu,
} from "lucide-react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import DropdownUser from "./DropdownUser";
import DropdownChat from "./DropdownChat";
import DropdownNotification from "./DropdownNotification";
import { useGetProfileByName } from "../hooks/useProfile";
import debounce from "lodash.debounce";
import SpinnerLoading from "./SpinnerLoading";
import DropdownMenu from "./DropdownMenu";
import { useGetNotifications } from "../hooks/useNotifications";
import DropdownCart from "./DropdownCart";
import { useGetCart } from "../hooks/useGetCart";
import { getBackendImgURL } from "../utils/helper";

function Header({ onToggleChat }) {
  const { notifications, unreadCount } = useGetNotifications();
  const { cart } = useGetCart();
  const [query, setQuery] = useState("");
  const isSearchingUser = query.length > 0;
  const { listUser, loading } = useGetProfileByName(query, {
    enabled: isSearchingUser,
  });
  const [dropdown, setDropdown] = useState({
    user: false,
    chat: false,
    notification: false,
    menu: false,
    cart: false,
  });
  const [showSearch, setShowSearch] = useState(false);
  const { user, theme, toggleTheme } = useAuthStore();

  const debouncedSearch = debounce((query) => {
    setQuery(query);
  }, 500);

  const toggleDropdown = (type) => {
    setDropdown((prev) => ({
      user: type === "user" ? !prev.user : false,
      chat: type === "chat" ? !prev.chat : false,
      notification: type === "notification" ? !prev.notification : false,
      menu: type === "menu" ? !prev.menu : false,
      cart: type === "cart" ? !prev.cart : false,
    }));
  };

  return (
    <header className="fixed top-0 left-0 w-full h-16 z-50 bg-white dark:bg-[#1b1f2b] border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-[1920px] mx-auto h-full flex items-center justify-between px-4 gap-4">
        {/* LEFT: Logo + Brand */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            to="/"
            className="size-10 sm:size-12 hover:scale-110 transition-transform duration-300"
          >
            <img
              src="/images/ico/logo_bingbong1.ico"
              alt="BingBong Logo"
              className="size-full object-cover rounded-xl"
            />
          </Link>
          <Link
            to="/"
            className="hidden sm:block text-xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent"
          >
            BingBong
          </Link>
        </div>

        {/* CENTER: Search Bar (Desktop) */}
        <div className="hidden md:block flex-1 max-w-2xl mx-4">
          <div className="relative">
            <Search className="absolute size-5 top-2.5 left-3 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search on BingBong..."
              className="w-full py-2.5 pl-10 pr-4 bg-gray-100 dark:bg-[#2a3142] border border-gray-200 dark:border-gray-700 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-400 focus:border-transparent transition-all"
              onChange={(e) => debouncedSearch(e.target.value)}
            />
            {query.length > 0 && (
              <div className="absolute top-full mt-2 left-0 right-0 max-h-96 overflow-y-auto shadow-xl bg-white dark:bg-[#1b1f2b] border border-gray-200 dark:border-gray-700 rounded-lg z-50 p-2 custom-scroll">
                {loading ? (
                  <div className="flex justify-center py-4">
                    <SpinnerLoading />
                  </div>
                ) : listUser.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No users found
                  </div>
                ) : (
                  listUser.map((searchUser) => (
                    <Link
                      to={`/profile/${searchUser.slug}`}
                      key={searchUser._id}
                      onClick={() => setQuery("")}
                      className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-[#2a3142] rounded-lg transition-colors"
                    >
                      <img
                        src={getBackendImgURL(searchUser.avatar)}
                        alt={searchUser.fullName}
                        className="size-10 object-cover rounded-full"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {searchUser.fullName}
                      </span>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Action Icons */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Button */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-[#2a3142] rounded-full transition-colors"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="size-5 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Theme Toggle */}
          <div
            className="relative p-2 hover:bg-gray-100 dark:hover:bg-[#2a3142] rounded-full transition-colors cursor-pointer group"
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <Moon className="size-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <SunMedium className="size-5 text-gray-600 dark:text-gray-300" />
            )}
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </div>
          </div>

          {/* Messenger */}
          <div
            className="relative p-2 hover:bg-gray-100 dark:hover:bg-[#2a3142] rounded-full transition-colors cursor-pointer group"
            onClick={() => toggleDropdown("chat")}
          >
            <Mail className="size-5 text-gray-600 dark:text-gray-300" />
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Messenger
            </div>
          </div>

          {/* Notifications */}
          <div
            className="relative p-2 hover:bg-gray-100 dark:hover:bg-[#2a3142] rounded-full transition-colors cursor-pointer group"
            onClick={() => toggleDropdown("notification")}
          >
            <Bell className="size-5 text-gray-600 dark:text-gray-300" />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                <span className="text-white text-xs font-semibold">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              </div>
            )}
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Notifications
            </div>
          </div>

          {/* Shopping Cart */}
          <div
            className="relative p-2 hover:bg-gray-100 dark:hover:bg-[#2a3142] rounded-full transition-colors cursor-pointer group"
            onClick={() => toggleDropdown("cart")}
          >
            <ShoppingCart className="size-5 text-gray-600 dark:text-gray-300" />
            {cart?.items?.length > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                <span className="text-white text-xs font-semibold">
                  {cart.items.length > 99 ? "99+" : cart.items.length}
                </span>
              </div>
            )}
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Cart
            </div>
          </div>

          {/* User Avatar */}
          <div className="relative">
            <div
              className="size-10 rounded-full cursor-pointer hover:ring-2 ring-blue-500 dark:ring-purple-400 transition-all group"
              onClick={() => toggleDropdown("user")}
            >
              <img
                src={getBackendImgURL(user?.avatar) || "/user.png"}
                alt={user?.fullName}
                className="size-full object-cover rounded-full"
              />
              <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#1b1f2b] size-5 rounded-full flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
                <ChevronDown className="size-3 text-gray-600 dark:text-gray-300" />
              </div>
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Account
              </div>
            </div>

            {/* Dropdowns */}
            {dropdown.user && (
              <DropdownUser onClose={() => toggleDropdown("user")} />
            )}
            {dropdown.chat && (
              <DropdownChat
                onToggleChat={onToggleChat}
                onClose={() => toggleDropdown("chat")}
              />
            )}
            {dropdown.notification && (
              <DropdownNotification
                notifications={notifications}
                onClose={() => toggleDropdown("notification")}
              />
            )}
            {dropdown.cart && (
              <DropdownCart onClose={() => toggleDropdown("cart")} />
            )}
            {dropdown.menu && <DropdownMenu />}
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {showSearch && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-[#1b1f2b] border-b border-gray-200 dark:border-gray-700 p-4 shadow-lg">
          <div className="relative">
            <Search className="absolute size-5 top-2.5 left-3 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search on BingBong..."
              className="w-full py-2.5 pl-10 pr-10 bg-gray-100 dark:bg-[#2a3142] border border-gray-200 dark:border-gray-700 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-400"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              autoFocus
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              onClick={() => {
                setShowSearch(false);
                setQuery("");
              }}
            >
              <X className="size-5" />
            </button>
          </div>
          {query.length > 0 && (
            <div className="mt-2 max-h-60 overflow-y-auto bg-white dark:bg-[#1b1f2b] rounded-lg p-2">
              {loading ? (
                <div className="flex justify-center py-4">
                  <SpinnerLoading />
                </div>
              ) : listUser.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No users found
                </div>
              ) : (
                listUser.map((searchUser) => (
                  <Link
                    to={`/profile/${searchUser.slug}`}
                    key={searchUser._id}
                    onClick={() => {
                      setQuery("");
                      setShowSearch(false);
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-[#2a3142] rounded-lg transition-colors"
                  >
                    <img
                      src={getBackendImgURL(searchUser.avatar)}
                      alt={searchUser.fullName}
                      className="size-10 object-cover rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {searchUser.fullName}
                    </span>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
