import useAuthStore from "../../store/authStore";
import {
  Bell,
  ChevronDown,
  CircleHelp,
  LogOut,
  Mail,
  Menu,
  Settings,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getBackendImgURL } from "../../utils/helper";

export default function Header({ isOpenNavbar, setIsOpenNavbar }) {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header
      className={`fixed w-full min-h-12 transition-all duration-300 ease-in-out right-0 flex bg-white text-gray-700 z-10 border-b border-gray-200 shadow-sm ${
        isOpenNavbar ? "lg:w-[85%]" : "lg:w-[93%]"
      }`}
    >
      <div
        className="bg-gray-50 cursor-pointer flex items-center justify-center min-w-14 hover:bg-gray-100 transition-colors border-r border-gray-200"
        onClick={() => setIsOpenNavbar(!isOpenNavbar)}
      >
        <Menu className="size-8 text-gray-700" />
      </div>
      <div className="flex gap-2 items-center justify-between w-[83%] py-2 px-4">
        <h1 className="text-xl sm:text-3xl text-gray-800 font-semibold">
          BingBong
        </h1>
        <div className="flex items-center">
          <div className="relative px-2 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors p-2">
            <Bell className="size-5 text-gray-600" />
            <div className="absolute top-1 right-1 flex items-center justify-center bg-red-500 size-4 rounded-full text-[10px] font-bold text-white">
              1
            </div>
          </div>
          <div className="relative px-2 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors p-2">
            <CircleHelp className="size-5 text-gray-600" />
          </div>
          <div className="relative px-2 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors p-2">
            <Mail className="size-5 text-gray-600" />
            <div className="absolute top-1 right-1 flex items-center justify-center bg-red-500 size-4 rounded-full text-[10px] font-bold text-white">
              1
            </div>
          </div>
        </div>
      </div>
      <div className="relative cursor-pointer bg-gray-50 min-w-[15%] hidden md:flex items-center justify-center gap-2 p-2 group hover:bg-gray-100 transition-colors border-l border-gray-200">
        <img
          src={getBackendImgURL(user.avatar)}
          className="size-8 rounded-full border-2 border-gray-300"
          alt="User avatar"
        />
        <h1 className="text-gray-800 text-sm font-medium">{user.fullName}</h1>
        <ChevronDown className="size-5 text-gray-600" />

        {/* Dropdown menu */}
        <div className="absolute left-0 top-full opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 border border-gray-200 rounded-b-md p-2 bg-white text-gray-700 z-50 w-full pointer-events-none group-hover:pointer-events-auto shadow-xl">
          <ul className="space-y-1">
            <li className="flex items-center rounded-md gap-2 p-2 text-center hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200">
              <Link
                to="/admin/profile"
                className="flex items-center gap-2 w-full h-full"
              >
                <UserRound className="size-5" />
                My Profile
              </Link>
            </li>
            <li className="flex items-center rounded-md gap-2 p-2 text-center hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200">
              <Link
                to="/admin/settings"
                className="flex items-center gap-2 w-full h-full"
              >
                <Settings className="size-5" />
                Settings
              </Link>
            </li>
            <li className="flex items-center rounded-md gap-2 p-2 text-center hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200">
              <Link
                to="/admin/help"
                className="flex items-center gap-2 w-full h-full"
              >
                <CircleHelp className="size-5" />
                Help
              </Link>
            </li>
            <li
              className="flex items-center rounded-md gap-2 p-2 text-center text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 cursor-pointer border-t border-gray-200 mt-1 pt-2"
              onClick={handleLogout}
            >
              <LogOut className="size-5" />
              Logout
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}