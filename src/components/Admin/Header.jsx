import { useState } from "react";
import useAuthStore from "../../store/authStore";
import { Bell, ChevronDown, CircleHelp, LogOut, Mail, Menu } from "lucide-react";

export default function Header({ isOpenNavbar, setIsOpenNavbar }) {
  const { user } = useAuthStore();
  const [isOpenAdminDropdown, setIsOpenAdminDropdown] = useState(false);

  return (
    <header
      className={`fixed w-full min-h-12 transition-all duration-300 ease-in-out right-0 flex text-white z-10 ${
        isOpenNavbar ? "lg:w-[85%]" : "lg:w-[93%]"
      }`}
      style={{ backgroundColor: "rgb(21, 40, 60)" }}
    >
      <div
        className="bg-orange-600 cursor-pointer flex items-center justify-center min-w-14"
        onClick={() => setIsOpenNavbar(!isOpenNavbar)}
      >
        <Menu className="size-8" />
      </div>
      <div className="flex gap-2 items-center justify-between w-[83%] py-2 px-4">
        <h1 className="text-xl sm:text-3xl">NguynKng</h1>
        <div className="flex items-center">
          <div className="relative px-2 cursor-pointer">
            <Bell className="size-5" />
            <div className="absolute top-0 right-0 -translate-y-3 -translate-x-1 flex items-center justify-center p-2 bg-orange-500 size-4 rounded-full text-xs">
              1
            </div>
          </div>
          <div className="relative px-2 cursor-pointer">
            <CircleHelp className="size-5 fill-white text-black" />
          </div>
          <div className="relative px-2 cursor-pointer">
            <Mail className="size-5" />
            <div className="absolute top-0 right-0 -translate-y-3 -translate-x-1 flex items-center justify-center p-2 bg-orange-500 size-4 rounded-full text-xs">
              1
            </div>
          </div>
        </div>
      </div>
      <div
        className="relative cursor-pointer bg-orange-600 min-w-[15%] hidden md:flex items-center justify-center gap-2 p-2"
        onClick={() => setIsOpenAdminDropdown(!isOpenAdminDropdown)}
      >
        <img src="/images/avatar-3.jpg" className="size-8 rounded-full" />
        <h1 className="text-white text-sm">{user.fullName}</h1>
        <ChevronDown className="size-5" />
        {isOpenAdminDropdown && (
          <div className="absolute border-2 p-2 border-top-none bg-white text-black z-50 w-full transform translate-y-[3.25rem] top-0">
            <ul>
              <li className="flex items-center gap-2 p-2 text-center hover:bg-slate-900 hover:text-white transform transition-all duration-500 ease-in-out">
                <Link
                  to="/admin/profile"
                  className="flex items-center gap-2 w-full h-full"
                >
                  <UserRoundPen className="size-5" />
                  My Profile
                </Link>
              </li>
              <li className="flex items-center gap-2 p-2 text-center hover:bg-slate-900 hover:text-white transform transition-all duration-500 ease-in-out">
                <Link
                  to="/admin/profile"
                  className="flex items-center gap-2 w-full h-full"
                >
                  <Settings className="size-5" />
                  Settings
                </Link>
              </li>
              <li className="flex items-center gap-2 p-2 text-center hover:bg-slate-900 hover:text-white transform transition-all duration-500 ease-in-out">
                <Link
                  to="/admin/profile"
                  className="flex items-center gap-2 w-full h-full"
                >
                  <CircleHelp className="size-5" />
                  Help
                </Link>
              </li>
              <li className="flex items-center gap-2 p-2 text-center text-red-500 hover:bg-slate-900 hover:text-white transform transition-all duration-500 ease-in-out">
                <LogOut className="size-5 text-red-500" />
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
