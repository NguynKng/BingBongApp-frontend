import { useState } from "react";
import useAuthStore from "../../store/authStore";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Config from "../../envVars";

export default function Navbar({ isOpenNavbar, setIsOpenNavbar }) {
  const { user } = useAuthStore();
  const [tab, setTab] = useState("Dashboard");
  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (tabName) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [tabName]: !prev[tabName], // Toggle only the clicked dropdown
    }));
  };

  const toggleTab = (tabName) => {
    setTab(tabName);
  };
  return (
    <nav
      className={`fixed left-0 transition-all duration-300 ease-in-out min-h-screen z-50 ${
        isOpenNavbar ? "lg:w-[15%] w-[50%] translate-x-0" : "lg:w-[7%] lg:translate-x-0 -translate-x-full"
      }`}
      style={{ backgroundColor: "rgb(21, 40, 60)" }}
    >
      <div
        className={`relative h-28 flex items-center justify-center gap-3 p-4 ${
          !isOpenNavbar && "flex-col"
        }`}
        style={{ backgroundColor: "rgb(33, 65, 98)" }}
      >
        <img
          src={
            user?.avatar ? `${Config.BACKEND_URL}${user.avatar}` : "/user.png"
          }
          className="size-16 rounded-full"
        />
        {isOpenNavbar && (
          <div
            className={`
                    whitespace-nowrap overflow-hidden text-sm
                    transition-all duration-300 ease-in-out
                    ${
                      isOpenNavbar
                        ? "w-auto opacity-100 translate-x-0"
                        : "w-0 opacity-0 translate-x-[-8px]"
                    }
                `}
          >
            <h2 className="text-white text-center">{user.fullName}</h2>
            <div className="flex items-center gap-1">
              <div className="rounded-full size-3 bg-green-500"></div>
              <span className="text-green-500">Online</span>
            </div>
          </div>
        )}
      </div>
      <h1
        className={`${
          isOpenNavbar ? "pl-4" : "text-center"
        } px-2 py-4 text-xl border-b-2 text-white border-orange-500`}
      >
        General
      </h1>
      <div
        className={`flex flex-col h-[75vh] custom-scroll overflow-y-auto text-gray-400 py-4 ${
          !isOpenNavbar && "items-center"
        }`}
      >
        <Link
          to="/admin"
          className={`py-4 px-6 rounded-md ${
            tab === "Dashboard" ? "text-white" : "text-gray-400"
          }`}
          onClick={() => toggleTab("Dashboard")}
        >
          <div
            className={`flex ${
              !isOpenNavbar && "justify-center flex-col"
            } items-center gap-2 hover:text-white`}
          >
            <img src="/images/layout.png" className="size-6" />
            <h1>Dashboard</h1>
          </div>
        </Link>
        <Link
          to="/admin/customers"
          className={`py-4 px-6 rounded-md ${
            tab === "Customers" ? "text-white" : "text-gray-400"
          }`}
        >
          <div
            className={`flex ${
              !isOpenNavbar && "justify-center flex-col"
            } items-center gap-2 hover:text-white`}
            onClick={() => toggleTab("Customers")}
          >
            <img src="/images/man.png" className="size-6" />
            <h1>Customers</h1>
          </div>
        </Link>
        <div className={`py-4 px-6 rounded-md`}>
          <div
            className={`flex ${
              !isOpenNavbar ? "flex-col justify-center" : "justify-between"
            } items-center gap-2 hover:text-white cursor-pointer ${
              tab === "Catalogue" ? "text-white" : "text-gray-400"
            }`}
            onClick={() => toggleDropdown("Catalogue")}
          >
            <div
              className={`flex ${
                !isOpenNavbar && "flex-col justify-center"
              } items-center gap-2`}
            >
              <img src="/images/catalogue.png" className="size-6" />
              <h1>Catalogue</h1>
            </div>
            <ChevronLeft
              className={`transition-transform duration-300 ${
                openDropdowns["Catalogue"] && "-rotate-90"
              } size-5`}
            />
          </div>
          <div
            className={`flex flex-col sm:items-start items-center mt-2 sm:text-base text-xs sm:ml-4 transition-all duration-300 ease-in-out origin-top ${
              openDropdowns["Catalogue"]
                ? "opacity-100 scale-y-100 h-auto"
                : "opacity-0 scale-y-0 h-0"
            } overflow-hidden`}
          >
            <Link
              to="/admin/product"
              className="sm:px-4 py-2 hover:text-white sm:text-left text-center"
              onClick={() => toggleTab("Catalogue")}
            >
              Product
            </Link>
            <Link
              to="/admin/product-category"
              className="sm:px-4 py-2 hover:text-white sm:text-left text-center"
              onClick={() => toggleTab("Catalogue")}
            >
              Category
            </Link>
            <Link
              to="/admin/brand"
              className="sm:px-4 py-2 hover:text-white sm:text-left text-center"
              onClick={() => toggleTab("Catalogue")}
            >
              Brand
            </Link>
            <Link
              to="/admin/coupon"
              className="sm:px-4 py-2 hover:text-white sm:text-left text-center"
              onClick={() => toggleTab("Catalogue")}
            >
              Coupon
            </Link>
          </div>
        </div>
        <Link
          to="/admin/orders"
          className={`cursor-pointer py-4 px-6 rounded-md ${
            tab === "Orders" ? "text-white" : "text-gray-400"
          }`}
        >
          <div
            className={`flex ${
              !isOpenNavbar ? "flex-col justify-center" : "justify-between"
            } hover:text-white items-center gap-2`}
          >
            <div
              className={`flex ${
                !isOpenNavbar && "flex-col justify-center"
              } items-center gap-2`}
              onClick={() => toggleTab("Orders")}
            >
              <img src="/images/carts.png" className="size-6" />
              <h1>Orders</h1>
            </div>
          </div>
        </Link>
        <div
          className={`cursor-pointer py-4 px-6 rounded-md ${
            tab === "Marketing" ? "text-white" : "text-gray-400"
          }`}
          onClick={() => toggleTab("Marketing")}
        >
          <div
            className={`flex ${
              !isOpenNavbar ? "flex-col justify-center" : "justify-between"
            } hover:text-white items-center gap-2`}
          >
            <div
              className={`flex ${
                !isOpenNavbar && "flex-col justify-center"
              } items-center gap-2`}
            >
              <img src="/images/market-analysis.png" className="size-6" />
              <h1>Marketing</h1>
            </div>
          </div>
        </div>
        <div className={`py-4 px-6 rounded-md`}>
          <div
            className={`flex ${
              !isOpenNavbar ? "flex-col justify-center" : "justify-between"
            } hover:text-white cursor-pointer  items-center gap-2 ${
              tab === "Blogs" ? "text-white" : "text-gray-400"
            }`}
            onClick={() => toggleDropdown("Blogs")}
          >
            <div
              className={`flex ${
                !isOpenNavbar && "flex-col justify-center"
              } items-center gap-2`}
            >
              <img src="/images/blogger.png" className="size-6" />
              <h1>Blogs</h1>
            </div>
            <ChevronLeft
              className={`transition-transform duration-300 ${
                openDropdowns["Blogs"] && "-rotate-90"
              } size-5`}
            />
          </div>
          <div
            className={`flex flex-col sm:items-start items-center mt-2 sm:text-base text-xs sm:ml-4 transition-all duration-300 ease-in-out origin-top ${
              openDropdowns["Blogs"]
                ? "opacity-100 scale-y-100 h-auto"
                : "opacity-0 scale-y-0 h-0"
            } overflow-hidden`}
          >
            <Link
              to="/admin/blogs"
              className="sm:px-4 py-2 hover:text-white sm:text-left text-center"
              onClick={() => toggleTab("Blogs")}
            >
              Blogs
            </Link>
            <Link
              to="/admin/blogs-category"
              className="sm:px-4 py-2 hover:text-white sm:text-left text-center"
              onClick={() => toggleTab("Blogs")}
            >
              Category
            </Link>
          </div>
        </div>
        <Link
          className={`py-4 px-6 rounded-md ${
            tab === "Chat" ? "text-white" : "text-gray-400"
          }`}
          onClick={() => toggleTab("Chat")}
        >
          <div
            className={`flex ${
              !isOpenNavbar && "flex-col justify-center"
            } items-center gap-2 hover:text-white`}
          >
            <img src="/images/chat.png" className="size-6" />
            <h1>Chat</h1>
          </div>
        </Link>
        <Link
          className={`py-4 px-6 rounded-md ${
            tab === "Enquiries" ? "text-white" : "text-gray-400"
          }`}
          onClick={() => toggleTab("Enquiries")}
        >
          <div
            className={`flex ${
              !isOpenNavbar && "flex-col justify-center"
            } items-center gap-2 hover:text-white`}
          >
            <img src="/images/questions.png" className="size-6" />
            <h1>Enquiries</h1>
          </div>
        </Link>
        <Link
          to="/admin/calendar"
          className={`py-4 px-6 rounded-md ${
            tab === "Calendar" ? "text-white" : "text-gray-400"
          }`}
          onClick={() => toggleTab("Calendar")}
        >
          <div
            className={`flex ${
              !isOpenNavbar && "flex-col justify-center"
            } items-center gap-2 hover:text-white`}
          >
            <img src="/images/calendar.png" className="size-6" />
            <h1>Calendar</h1>
          </div>
        </Link>
        <div
          className={`cursor-pointer py-4 px-6 rounded-md ${
            tab === "Analytics" ? "text-white" : "text-gray-400"
          }`}
        >
          <div
            className={`flex ${
              !isOpenNavbar ? "flex-col justify-center" : "justify-between"
            } items-center gap-2 hover:text-white`}
            onClick={() => toggleDropdown("Analytics")}
          >
            <div
              className={`flex ${
                !isOpenNavbar && "flex-col justify-center"
              } items-center gap-2`}
              onClick={() => toggleTab("Analytics")}
            >
              <img src="/images/bar-graph.png" className="size-6" />
              <h1>Analytics</h1>
            </div>
            <ChevronLeft
              className={`transition-transform duration-300 ${
                openDropdowns["Analytics"] && "-rotate-90"
              } size-5`}
            />
          </div>
        </div>
        <div
          className={`cursor-pointer py-4 px-6 rounded-md ${
            tab === "Settings" ? "text-white" : "text-gray-400"
          }`}
        >
          <div
            className={`flex ${
              !isOpenNavbar ? "flex-col justify-center" : "justify-between"
            } items-center gap-2 hover:text-white`}
            onClick={() => toggleDropdown("Settings")}
          >
            <div
              className={`flex ${
                !isOpenNavbar && "flex-col justify-center"
              } items-center gap-2`}
              onClick={() => toggleTab("Settings")}
            >
              <img src="/images/cogwheel.png" className="size-6" />
              <h1>Settings</h1>
            </div>
            <ChevronLeft
              className={`transition ease-in-out duration-500 ${
                openDropdowns["Settings"] && "-rotate-90"
              } size-5`}
            />
          </div>
        </div>
      </div>
      <div
        className={`block lg:hidden rounded-r-md absolute top-1/2 right-0 translate-x-10 text-white px-1 py-4 cursor-pointer`}
        style={{ backgroundColor: "rgb(21, 40, 60)" }}
        onClick={() => setIsOpenNavbar(!isOpenNavbar)}
      >
        <ChevronLeft className="size-8" />
      </div>
    </nav>
  );
}
