import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Gamepad2,
  House,
  Newspaper,
  UserRound,
  UsersRound,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import Config from "../envVars";

function Navbar() {
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
      className={`fixed top-[64px] left-0 h-[92vh] lg:w-[20rem] p-4 overflow-y-auto custom-scroll z-40 hidden lg:block transition-colors duration-300
      bg-white`}
    >
      <div className="relative flex flex-col items-center justify-center gap-2 pt-8 pb-4">
        <img
          src={avatarUrl}
          className="w-18 h-18 p-1 z-11 bg-white object-cover rounded-lg"
        />
        <span className="font-semibold text-lg">{fullName}</span>
        <img
          className="absolute top-0 w-full h-14 z-10 object-cover rounded-lg"
          src={`${Config.BACKEND_URL}${user.coverPhoto}`}
        />
      </div>
      <div className="w-full px-2 py-2 rounded-2xl space-y-2 overflow-hidden">
        {navbarData.map((item, index) => {
          return (
            <Link
              to={item.link}
              key={index}
              className={`flex items-center gap-3 py-3 px-4 hover:bg-black hover:text-white rounded-xl transition-all group ${
                pathname === item.link
                  ? "bg-black text-white"
                  : "bg-transparent"
              }
                `}
            >
              <item.src />
              <span className={`font-medium transition-colors`}>
                {item.text}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default Navbar;
