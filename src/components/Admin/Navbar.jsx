import { useState } from "react";
import useAuthStore from "../../store/authStore";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { getBackendImgURL } from "../../utils/helper";

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
      [tabName]: !prev[tabName],
    }));
  };

  return (
    <nav
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col transition-all duration-300 ease-in-out ${
        isOpenNavbar
          ? "lg:w-[15%] w-[50%] translate-x-0"
          : "lg:w-[7%] lg:translate-x-0 -translate-x-full"
      } bg-white shadow-lg`} // Màu trắng
    >
      {/* Header user */}
      <div
        className={`relative h-28 flex items-center justify-center gap-3 p-4 border-b border-gray-200 ${
          !isOpenNavbar && "flex-col"
        }`}
        style={{ backgroundColor: "#f8f9fa" }} // Màu xám nhạt
      >
        <img
          src={getBackendImgURL(user.avatar)}
          alt="avatar"
          className="size-16 rounded-full object-cover border-2 border-gray-300"
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
            <h2 className="text-gray-800 text-center font-semibold">
              {user.fullName}
            </h2>
            <div className="flex items-center gap-1 justify-center">
              <div className="rounded-full size-3 bg-green-500" />
              <span className="text-green-600 text-xs font-medium">Online</span>
            </div>
          </div>
        )}
      </div>

      {/* Tiêu đề nhóm */}
      <h1
        className={`${
          isOpenNavbar ? "pl-4" : "text-center"
        } px-2 py-4 text-xl border-b border-gray-200 text-gray-700 font-semibold`}
      >
        General
      </h1>

      {/* KHU VỰC CUỘN */}
      <div
        className={`flex flex-1 min-h-0 flex-col custom-scroll overflow-y-auto p-2 text-gray-600 ${
          !isOpenNavbar && "items-center"
        }`}
      >
        {menuItems.map((item) => {
          const isActive = currentPath === item.link;
          return (
            <div
              key={item.label}
              className={`py-4 px-6 transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-600 rounded-xl shadow-md font-semibold w-full block border border-blue-200"
                  : "text-gray-600 hover:bg-gray-100 rounded-xl"
              }`}
            >
              {item.dropdown ? (
                <>
                  <div
                    className={`flex ${
                      !isOpenNavbar
                        ? "flex-col justify-center"
                        : "justify-between"
                    } items-center gap-2 hover:text-gray-800 cursor-pointer ${
                      isActive ? "text-blue-600" : "text-gray-600"
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
                          className="sm:px-4 py-2 hover:text-gray-800 sm:text-left text-center"
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
                  className={`block w-full h-full ${
                    isActive ? "text-blue-600" : "text-gray-600"
                  }`}
                >
                  <div
                    className={`flex ${
                      !isOpenNavbar && "flex-col justify-center"
                    } items-center gap-2 hover:text-gray-800 transition-colors`}
                  >
                    <img src={item.icon} alt="" className="size-6" />
                    <h1>{item.label}</h1>
                  </div>
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Toggle trên mobile */}
      <button
        type="button"
        className="block lg:hidden rounded-r-md absolute top-1/2 right-0 translate-x-10 text-gray-700 px-1 py-4 bg-white hover:bg-gray-100 transition-colors shadow-lg border border-gray-200"
        onClick={() => setIsOpenNavbar(!isOpenNavbar)}
        aria-label="Toggle sidebar"
        title="Toggle sidebar"
      >
        <ChevronLeft className="size-8" />
      </button>
    </nav>
  );
}