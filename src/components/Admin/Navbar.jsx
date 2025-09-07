import { useState } from "react";
import useAuthStore from "../../store/authStore";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Config from "../../envVars";

export default function Navbar({ isOpenNavbar, setIsOpenNavbar }) {
  const { user } = useAuthStore();
  const currentPath = window.location.pathname;
  const [openDropdowns, setOpenDropdowns] = useState({});

  const menuItems = [
    { label: "Dashboard", icon: "/layout.png", link: "/admin" },
    { label: "Users", icon: "/user-admin.png", link: "/admin/users" },
    { label: "Marketing", icon: "/market-analysis.png", link: "#" },
    { label: "Chat", icon: "/chat.png", link: "#" },
    { label: "Enquiries", icon: "/questions.png", link: "#" },
    {
      label: "Calendar",
      icon: "/calendar.png",
      link: "#",
    },
    { label: "Analytics", icon: "/bar-graph.png", link: "#", dropdown: true },
    { label: "Settings", icon: "/cogwheel.png", link: "#", dropdown: true },
  ];

  const toggleDropdown = (tabName) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [tabName]: !prev[tabName], // Toggle only the clicked dropdown
    }));
  };

  return (
    <nav
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col transition-all duration-300 ease-in-out ${
        isOpenNavbar
          ? "lg:w-[15%] w-[50%] translate-x-0"
          : "lg:w-[7%] lg:translate-x-0 -translate-x-full"
      }`}
      style={{ backgroundColor: "rgb(21, 40, 60)" }}
    >
      {/* Header user */}
      <div
        className={`relative h-28 flex items-center justify-center gap-3 p-4 ${
          !isOpenNavbar && "flex-col"
        }`}
        style={{ backgroundColor: "rgb(33, 65, 98)" }}
      >
        <img
          src={`${Config.BACKEND_URL}${user.avatar}`}
          alt="avatar"
          className="size-16 rounded-full object-cover"
        />
        {isOpenNavbar && (
          <div
            className={`
          whitespace-nowrap overflow-hidden text-sm
          transition-all duration-300 ease-in-out
          ${
            isOpenNavbar
              ? "w-auto opacity-100 translate-x-0"
              : "w-0 opacity-0 -translate-x-2"
          }
        `}
          >
            <h2 className="text-white text-center">{user.fullName}</h2>
            <div className="flex items-center gap-1">
              <div className="rounded-full size-3 bg-green-500" />
              <span className="text-green-500">Online</span>
            </div>
          </div>
        )}
      </div>

      {/* Tiêu đề nhóm */}
      <h1
        className={`${
          isOpenNavbar ? "pl-4" : "text-center"
        } px-2 py-4 text-xl border-b-2 text-white border-orange-500`}
      >
        General
      </h1>

      {/* KHU VỰC CUỘN: dùng flex-1 + min-h-0 (QUAN TRỌNG) */}
      <div
        className={`flex flex-1 min-h-0 flex-col custom-scroll overflow-y-auto py-2 text-gray-400 ${
          !isOpenNavbar && "items-center"
        }`}
      >
        {menuItems.map((item) => (
          <div key={item.label} className="py-4 px-6 rounded-md">
            {item.dropdown ? (
              <>
                <div
                  className={`flex ${
                    !isOpenNavbar
                      ? "flex-col justify-center"
                      : "justify-between"
                  } items-center gap-2 hover:text-white cursor-pointer ${
                    currentPath === item.link ? "text-white" : "text-gray-400"
                  }`}
                  onClick={() => toggleDropdown(item.label)}
                >
                  <div
                    className={`flex ${
                      !isOpenNavbar && "flex-col justify-center"
                    } items-center gap-2`}
                  >
                    <img src={item.icon} alt="" className="size-6" />
                    <h1>{item.label}</h1>
                  </div>
                  <ChevronLeft
                    className={`transition-transform duration-300 ${
                      openDropdowns[item.label] && "-rotate-90"
                    } size-5`}
                  />
                </div>

                {item.children && (
                  <div
                    className={`flex flex-col sm:items-start items-center sm:text-base text-xs sm:ml-4 transition-all duration-300 ease-in-out origin-top ${
                      openDropdowns[item.label]
                        ? "opacity-100 scale-y-100 h-auto"
                        : "opacity-0 scale-y-0 h-0"
                    } overflow-hidden`}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        to={child.link}
                        className="sm:px-4 py-2 hover:text-white sm:text-left text-center"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={item.link || "#"}
                className={`${
                  currentPath === item.link ? "text-white" : "text-gray-400"
                }`}
              >
                <div
                  className={`flex ${
                    !isOpenNavbar && "flex-col justify-center"
                  } items-center gap-2 hover:text-white`}
                >
                  <img src={item.icon} alt="" className="size-6" />
                  <h1>{item.label}</h1>
                </div>
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Toggle trên mobile */}
      <button
        type="button"
        className="block lg:hidden rounded-r-md absolute top-1/2 right-0 translate-x-10 text-white px-1 py-4"
        style={{ backgroundColor: "rgb(21, 40, 60)" }}
        onClick={() => setIsOpenNavbar(!isOpenNavbar)}
        aria-label="Toggle sidebar"
        title="Toggle sidebar"
      >
        <ChevronLeft className="size-8" />
      </button>
    </nav>
  );
}
