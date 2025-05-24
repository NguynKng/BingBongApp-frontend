import Config from "../envVars";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";

function DropdownUser() {
  const { logout, user, theme, toggleTheme } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };
  const footerLinks = [
    "Privacy",
    "Terms",
    "Advertising",
    "Ad choices",
    "Cookies",
    "More",
    "Meta © 2025",
  ];
  return (
    <div className="absolute top-[110%] right-0 min-w-92 rounded-lg shadow-lg dark:bg-[rgb(35,35,35)] bg-white p-3">
      {/* User */}
      <div className="shadow-lg p-1 w-full rounded-lg border-2 border-gray-200 dark:border-gray-800">
        <Link
          to={`/profile/${user._id}`}
          className="p-2 hover:bg-gray-100 w-full flex items-center gap-2 rounded-lg cursor-pointer dark:hover:bg-[rgb(56,56,56)]"
        >
          <img
            src={
              user?.avatar ? `${Config.BACKEND_URL}${user.avatar}` : "/user.png"
            }
            className="size-9 object-cover rounded-full"
          />
          <span className="text-[17px] dark:text-white">{`${user.fullName}`}</span>
        </Link>
        <div className="w-full py-1 px-2">
          <div className="w-full border-1 border-gray-300 dark:border-gray-500"></div>
        </div>
        <div className="w-full p-2">
          <button className="rounded-md bg-gray-200 dark:bg-[rgb(52,52,52)] hover:bg-gray-300 flex items-center justify-center gap-2 w-full cursor-pointer py-2 px-4 dark:hover:bg-[rgb(56,56,56)]">
            <img src="/change-account.png" className="size-5 object-cover" />
            <span className="font-medium dark:text-white">Xem tất cả trang cá nhân</span>
          </button>
        </div>
      </div>
      {/* Setting */}
      <div className="mt-4">
        {/* Setting and privacy */}
        <div className="rounded-md hover:bg-gray-100 flex items-center gap-2 p-2 cursor-pointer dark:hover:bg-[rgb(56,56,56)]">
          <div className="p-2 rounded-full bg-gray-300 dark:bg-white">
            <img src="/settings.png" className="size-5 object-cover" />
          </div>
          <span className="font-medium dark:text-white">Cài đặt và quyền riêng tư</span>
        </div>
        {/* Help and support */}
        <div className="rounded-md hover:bg-gray-100 flex items-center gap-2 p-2 cursor-pointer dark:hover:bg-[rgb(56,56,56)]">
          <div className="p-2 rounded-full bg-gray-300 dark:bg-white">
            <img src="/help-web-button.png" className="size-5 object-cover" />
          </div>
          <span className="font-medium dark:text-white">Trợ giúp và hỗ trợ</span>
        </div>
        {/* Display and accessibility */}
        <div className="rounded-md hover:bg-gray-100 flex items-center justify-between p-2 cursor-pointer dark:hover:bg-[rgb(56,56,56)]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-gray-300 dark:bg-white">
              <img src="/moon.png" className="size-5 object-cover" />
            </div>
            <span className="font-semibold dark:text-white">Chế độ tối</span>
          </div>
          {/* Toggle Switch */}
          <button onClick={toggleTheme}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer duration-300 ${
              theme === "dark" ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                theme === "dark" ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
        {/* Give feedback */}
        <div className="rounded-md hover:bg-gray-100 flex items-center gap-2 p-2 cursor-pointer dark:hover:bg-[rgb(56,56,56)]">
          <div className="p-2 rounded-full bg-gray-300 dark:bg-white">
            <img src="/feedback.png" className="size-5 object-cover" />
          </div>
          <span className="font-medium dark:text-white">Đóng góp ý kiến</span>
        </div>
        {/* Logout */}
        <div
          className="rounded-md hover:bg-gray-100 flex items-center gap-2 p-2 cursor-pointer dark:hover:bg-[rgb(56,56,56)]"
          onClick={handleLogout}
        >
          <div className="p-2 rounded-full bg-gray-300 dark:bg-white">
            <img src="/logout.png" className="size-5 object-cover" />
          </div>
          <span className="font-medium dark:text-white">Đăng xuất</span>
        </div>
      </div>
      {/* Privacy Term */}
      <div className="mt-4 flex flex-wrap items-center gap-1 text-gray-500 text-[13px] leading-4">
        {footerLinks.map((label, index) => (
          <div key={label} className="flex items-center">
            <Link to="#" className="hover:underline dark:text-gray-400">
              {label}
            </Link>
            {index < footerLinks.length - 1 && (
              <span className="mx-1 text-gray-400">•</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DropdownUser;
